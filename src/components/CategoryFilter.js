import { jsx as _jsx } from "react/jsx-runtime";
const LABELS = {
    all: 'すべて',
    habit: '習慣',
    meal: '食事',
    'ad-hoc': '突発'
};
const OPTIONS = ['all', 'habit', 'meal', 'ad-hoc'];
export const CategoryFilter = ({ value, onChange }) => {
    return (_jsx("div", { className: "category-filter", children: OPTIONS.map((option) => {
            const isActive = value === option;
            return (_jsx("button", { type: "button", className: `filter-chip${isActive ? ' filter-chip--active' : ''}`, onClick: () => onChange(option), children: LABELS[option] }, option));
        }) }));
};
