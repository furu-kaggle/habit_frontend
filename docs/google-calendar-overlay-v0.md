# Googleカレンダー連携アプリ v0 設計書（LLM分類版・非破壊オーバーレイ）

最終更新: 2025-09-29 / タイムゾーン: Asia/Tokyo

---

## 0. 本ドキュメントの目的

本設計書は、Googleカレンダーを読み込み、**LLM（プロンプトベース）で「習慣 / 突発 / 食事」を分類**し、ユーザーがオン/オフ可能な**セカンダリ（オーバーレイ）カレンダー**「My Plan」に必要分だけ“出し入れ”する **v0（MVP）** の実装仕様を定義する。非破壊（元カレンダーは編集しない）・冪等・短納期を最優先とする。

---

## 1. プロダクト概要

* **コア価値**: 既存のGoogleカレンダーを**壊さず**に「整う」体験を提供。分類→配置→表示を最小操作で実現。
* **コンセプト**: 「今日の予定、**ワンクリックで整える**」。
* **MVPスコープ**: 読み取り + LLM分類 + オーバーレイ書き込み + シンプル自動配置（貪欲法） + 食事クイック入力。

---

## 2. ユースケース

1. 予定を読み込む → **LLMで分類** → 習慣/食事を「My Plan」にコピー。
2. **今日を整える**: 今日の空き枠に、習慣テンプレを自動配置。
3. **食事クイック入力**: 自然言語（例:「🍱 昼 12:30 700kcal」）→ 「My Plan」に30分ブロック追加。
4. 出し入れトグル: イベントごとに**My Planへ入れる/外す**を切替。

---

## 3. スコープ（v0）

* 対象カレンダー: ユーザー選択の1〜複数（読み取り）。
* **オーバーレイ**: 1つ（名称: `My Plan`）。なければ初回起動時に自動作成。
* **編集対象**: `My Plan` のみ。元イベントは編集/削除しない。
* 同期: 初回フルフェッチ → `syncToken`で差分。ポーリング間隔 5〜10分。
* ストレージ: v0は**DBなし**。必要情報は `extendedProperties.private` に付与。

---

## 4. アーキテクチャ

```
[React + Vite (Netlify)] --OAuth(PKCE)--> [Google Calendar API]
        |                                   ^
        v                                   |
[Netlify Functions (Node/TS)] --------------/
        |
        +---> [OpenAI API (Node.js SDK 'openai')]
```

* **フロント**: React + Vite（Netlify ビルド）。
* **認証**: Google OAuth 2.0 (PKCE)。スコープ `calendar.readonly`（読み取り）+ `calendar.events`（My Plan書込）。OAuthリダイレクトは **Netlify Functions** で終端。
* **バックエンド**: Netlify Functions（Node/TypeScript 固定）。
* **LLM**: **OpenAI API**（Node.js SDK `openai`）を Netlify Functions から呼び出し（フロント直呼び禁止）。
* **データ**: v0はDB不要。将来的にSupabase/Firestore導入（v0.5）。

---

## 5. データフロー

1. OAuth同意→対象カレンダー選択。
2. `listEvents(range)` でイベント取得。
3. 取得イベントを**LLM分類**（バッチ）。
4. UIに **分類表示**（習慣/突発/食事のトグル）。
5. ユーザー操作: 出し入れ（コピー/削除）・Auto-plan・食事クイック入力。
6. `My Plan` に書込み（`extendedProperties.private` へ付帯情報）。
7. 差分同期（`syncToken`）で更新反映。

---

## 6. 主要機能仕様

### 6.1 認証/権限

* スコープ: `https://www.googleapis.com/auth/calendar.readonly`, `https://www.googleapis.com/auth/calendar.events`。
* リフレッシュトークンはサーバ側のセキュアストア（環境変数/秘密管理）で扱う。

### 6.2 カレンダー同期

* 初回: `events.list`（過去7日〜未来21日）。
* 以降: `syncToken` を保持し、差分取得。エラー時は再フルフェッチ。
* タイムゾーン: 固定 `Asia/Tokyo`。

### 6.3 **LLMベース分類（プロンプト仕様）**

* 分類カテゴリ: `habit` | `meal` | `ad-hoc`（その他）。
* 入力: イベントの `title`, `description`（最大512文字）, `start/end`, `recurrence` 有無, `creator`, `location`（任意）。
* 出力: **JSONのみ**（説明文なし）。

#### 6.3.1 出力スキーマ

```json
{
  "category": "habit" | "meal" | "ad-hoc",
  "confidence": 0.0-1.0,
  "meal": {
    "kcal": number | null,
    "macros": { "protein_g": number | null, "fat_g": number | null, "carb_g": number | null } | null,
    "meal_label": "breakfast" | "lunch" | "dinner" | "snack" | null
  },
  "habit": {
    "is_recurring_like": boolean,
    "suggested_block_min": 10 | 20 | 30 | 45 | 60
  }
}
```

#### 6.3.2 システムプロンプト（例）

```
あなたはカレンダーイベント分類器です。出力は必ず有効なJSON一個のみ。考え方の説明は不要。未知語は文脈で推定し、
カテゴリは {habit, meal, ad-hoc} から厳密に選ぶこと。
```

#### 6.3.3 ユーザープロンプト・テンプレート（例）

```
# 指示
以下のイベントを {habit, meal, ad-hoc} に分類し、JSONのみ返すこと。
出力はスキーマに厳密一致。数値は整数または小数。日本語/英語混在に対応。

# スキーマ
{...6.3.1 のJSONを貼付...}

# 入力
- title: "{{title}}"
- description: "{{description_trunc512}}"
- start: "{{start_iso}}" (tz=Asia/Tokyo)
- end: "{{end_iso}}"
- recurrence: {{has_recurrence}}  // true/false
- location: "{{location}}"

# 例（望ましい出力）
{"category":"habit","confidence":0.86,"meal":null,"habit":{"is_recurring_like":true,"suggested_block_min":30}}
```

#### 6.3.4 Few-shot例

* `"朝ラン 6km"` → habit（confidence高）、suggested_block_min=45。
* `"🍱 ランチ 12:30 700kcal"` → meal（kcal=700, meal_label=lunch）。
* `"臨時MTG(顧客A)"` → ad-hoc。

#### 6.3.5 実行方式

* バッチ推論（1回のAPI呼び出しで最大N件）。
* **失敗時フォールバック**: JSON検証NG → リトライ（温和な再プロンプト）。再失敗時は `ad-hoc` & `confidence=0.0`。
* **コスト対策**: タイトル・descriptionを512字に短縮、既判定ハッシュで**キャッシュ**。

### 6.4 出し入れ（オーバーレイ: My Plan）

* **入れる**: 元イベントを `events.insert(calendarId=MyPlan)` で**コピー**。
* **外す**: My Plan上の対応イベントを**削除**。
* **冪等**: `hashKey = sha1(sourceEventId + start + end + sourceCalendarId)`。
* **拡張プロパティ** (`extendedProperties.private`):

  * `sourceEventId`
  * `sourceCalendarId`
  * `category`
  * `hashKey`
  * `classificationConfidence`
  * `meal.kcal/macros/label` など

### 6.5 Auto-plan（貪欲配置）

* 入力設定（ユーザー）:

  * NG時間帯（例: 9:00-18:00 会議優先）
  * 習慣テンプレ（例: 運動30m, 日記10m, 読書20m）
  * 昼食ウィンドウ（例: 11:30-13:30）
* アルゴリズム: 当日フリースロット抽出→優先度順に**前詰め**。
* 衝突時: 次スロットへ。配置不可はToDo表示のみ。

### 6.6 食事クイック入力

* 例: `"🍱 昼 12:30 700kcal P30 F20 C95"`。
* パーサ: 正規表現で時間/kcal/三大栄養素を抽出（なければnull）。
* 書込み: My Planに30分イベント。extendedPropertiesに栄養情報。

### 6.7 UI（最小）

* 週ビュー（7日）。トグル: `習慣 / 突発 / 食事 / すべて`。
* イベント行: 出し入れトグル（My Planへコピー/削除）。
* ボタン: **今日を整える** / **食事クイック追加**。

### 6.8 設定

* 対象カレンダー選択（複数可）。
* 習慣テンプレ・優先度・標準ブロック時間。
* NG時間帯・昼食ウィンドウ。

---

## 7. API設計（Netlify Functions エンドポイント）

* `GET /.netlify/functions/events?range=today|7d` → Googleから取得 + LLM分類結果を付与。
* `POST /.netlify/functions/overlay-put` → `{ sourceEventId }` をMy Planへコピー。
* `POST /.netlify/functions/overlay-remove` → `{ sourceEventId }` に紐づくMy Planイベント削除。
* `POST /.netlify/functions/auto-plan-today` → 習慣テンプレを空き枠に配置。
* `POST /.netlify/functions/meal-quick-add` → 自然言語文字列を解析→My Planに追加。

**共通レスポンス**: `requestId`, `ok`, `error`。

---

## 8. エラーハンドリング / リトライ

* Google API 429/5xx: エクスポネンシャルバックオフ。
* LLM JSON不正: 1回まで自動リトライ→失敗時は `ad-hoc`。
* 同期破損: `syncToken`無効時はフルリセット。

---

## 9. 非機能要件

* **セキュリティ**: フロントからLLM直叩き禁止。PIIは最小化（タイトル・時間のみ送信を基本）。
* **パフォーマンス**: 初回ロード<2.5s（キャッシュ/スケルトンUI）。
* **可用性**: Netlify Functions（デフォルトリージョン）でOK。レイテンシは日本からの利用で許容想定。エラー時でも閲覧は可能。
* **監視**: 主要APIの成功率・p95・LLM失敗率。

---

## 10. KPI（MVP）

* **Auto-plan実行率/日**
* **出し入れ回数/週**
* **習慣定着連続日数**（habit配置成功日数）
* **食事入力継続日数**

---

## 11. テスト計画（抜粋）

* 単体: パーサ（食事）、ハッシュ、JSONバリデーション。
* 結合: フェッチ→LLM分類→表示→出し入れ→再フェッチの一連。
* 手動: iOS/Android/デスク表示確認、タイムゾーン境界、重複防止。

---

## 12. リリース計画

* **デプロイ先**: Netlify（フロント: React+Vite / バックエンド: Netlify Functions）。
* **環境変数（Netlify / Site settings → Environment variables）**

  * `OPENAI_API_KEY`（OpenAIのAPIキー）
  * `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
  * `GOOGLE_REDIRECT_URI`（例: `https://<your-site>/.netlify/functions/oauth/callback`）
* **ビルド設定**: `npm run build`（Vite）。Functionsは `netlify/functions/*` に配置。必要に応じ `netlify.toml` で `functions` ディレクトリとリダイレクト(OAuthコールバック)を設定。
* **OAuth設定**: Google Cloud ConsoleでOAuth同意画面＋認証情報（Webアプリ）。承認済みリダイレクトURIに上記 `.../oauth/callback` を登録。
* **検証**: ステージングでOAuth → カレンダー読み取り → LLM分類 → 出し入れ一連の動作確認。

---

## 13. 将来拡張（v0.5+）

* DB導入（Supabase/Firestore）: ユーザー設定/履歴/レポート保存。
* Google Push通知（Webhook）: 即時反映。
* ICS書出し: My Plan共有。
* 高度スケジューリング: 締切・優先度考慮、自動再配置。

---

## 14. リスクと対策

* **LLMレイテンシ/コスト**: バッチ化・キャッシュ・要約入力。
* **誤分類**: 低信頼度のときはUIで未確定扱い、ユーザー修正→学習に反映（v0.5）。
* **Googleクォータ**: 同期間隔・差分取得・必要時のみ書込み。

---

## 15. 作業タスクリスト（v0）

1. Google OAuth（PKCE）・対象カレンダー選択UI。
2. Eventsフェッチ（7d過去〜21d未来）& `syncToken`保持。
3. **LLM分類API**（バッチ・JSONスキーマ検証・キャッシュ）。
4. My Plan 自動作成・出し入れAPI（冪等ハッシュ）。
5. 週ビューUI・トグル表示・出し入れトグル。
6. Auto-plan（貪欲法）初版。
7. 食事クイック入力パーサ→書込み。
8. 計測（簡易）・ログ・エラーハンドリング。

---

## 付録A: JSONバリデーション（Zod例・擬似）

```ts
const ClassifySchema = z.object({
  category: z.enum(["habit","meal","ad-hoc"]),
  confidence: z.number().min(0).max(1),
  meal: z.object({
    kcal: z.number().nullable(),
    macros: z.object({ protein_g: z.number().nullable(), fat_g: z.number().nullable(), carb_g: z.number().nullable() }).nullable(),
    meal_label: z.enum(["breakfast","lunch","dinner","snack"]).nullable()
  }).nullable(),
  habit: z.object({
    is_recurring_like: z.boolean(),
    suggested_block_min: z.enum(["10","20","30","45","60"]).transform(Number)
  }).nullable()
});
```

## 付録B: Idempotencyハッシュ（擬似）

```ts
sha1(`${sourceEventId}|${startIso}|${endIso}|${sourceCalendarId}`)
```

## 付録C: Auto-plan スロット抽出（擬似）

* `busy = union(allOriginalEvents, myPlanEvents)`
* `free = complement(dayRange, busy)`
* テンプレを free に先頭から詰める（昼食はウィンドウ内に配置）。

## 付録D: LLMプロンプト（再掲/サンプル）

* システム: *「カレンダー分類器。出力はJSONのみ。」*
* ユーザー: イベント属性 + スキーマ + 例を提示。

---

以上。
