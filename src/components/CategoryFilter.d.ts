import type { ClassificationCategory } from '../../shared/types/calendar';
interface CategoryFilterProps {
    value: 'all' | ClassificationCategory;
    onChange: (value: 'all' | ClassificationCategory) => void;
}
export declare const CategoryFilter: ({ value, onChange }: CategoryFilterProps) => import("react/jsx-runtime").JSX.Element;
export {};
