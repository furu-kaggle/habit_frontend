export declare const generateCodeVerifier: (length?: number) => Promise<string>;
export declare const generateCodeChallenge: (verifier: string) => Promise<string>;
