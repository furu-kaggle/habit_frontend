import type { ClassificationCategory } from '../../shared/types/calendar.ts';

const LABELS: Record<'all' | ClassificationCategory, string> = {
  all: 'すべて',
  habit: '習慣',
  meal: '食事',
  'ad-hoc': '突発'
};

const OPTIONS: Array<'all' | ClassificationCategory> = ['all', 'habit', 'meal', 'ad-hoc'];

interface CategoryFilterProps {
  value: 'all' | ClassificationCategory;
  onChange: (value: 'all' | ClassificationCategory) => void;
}

export const CategoryFilter = ({ value, onChange }: CategoryFilterProps) => {
  return (
    <div className="category-filter">
      {OPTIONS.map((option) => {
        const isActive = value === option;
        return (
          <button
            key={option}
            type="button"
            className={`filter-chip${isActive ? ' filter-chip--active' : ''}`}
            onClick={() => onChange(option)}
          >
            {LABELS[option]}
          </button>
        );
      })}
    </div>
  );
};
