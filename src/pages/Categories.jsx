import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import { useStore } from '../store/useStore';

const categories = [
  { label: 'Action', bg: '#ff5b0b', image: 'https://images.unsplash.com/photo-1489599735734-79b4169c4225?auto=format&fit=crop&w=900&q=80' },
  { label: 'Drama', bg: '#b893e8', image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80' },
  { label: 'Romance', bg: '#1ea312', image: 'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=900&q=80' },
  { label: 'Thriller', bg: '#7db9ee', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=900&q=80' },
  { label: 'Western', bg: '#9e2f05', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80' },
  { label: 'Horror', bg: '#6f58ee', image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=900&q=80' },
  { label: 'Fantasy', bg: '#f145da', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80' },
  { label: 'Music', bg: '#f31735', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80' },
  { label: 'Fiction', bg: '#75d363', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=900&q=80' },
];

export default function Categories() {
  const navigate = useNavigate();
  const selectedCategories = useStore((state) => state.categories);
  const setCategories = useStore((state) => state.setCategories);

  const selectedLabels = useMemo(() => new Set(selectedCategories), [selectedCategories]);

  const toggleCategory = (category) => {
    const nextSelection = selectedLabels.has(category.label)
      ? selectedCategories.filter((item) => item !== category.label)
      : [...selectedCategories, category.label];

    setCategories(nextSelection);
  };

  const canContinue = selectedCategories.length >= 3;

  return (
    <main className="page-shell category-shell">
      <section className="sidebar-copy">
        <div className="category-brand">Super app</div>
        <h1>Choose your entertainment category</h1>
        <div className="chip-row">
          {selectedCategories.map((item) => <span key={item} className="chip">{item} <span className="chip-remove">x</span></span>)}
        </div>
        {!canContinue ? <p className="inline-warning">Minimum 3 category required</p> : null}
      </section>

      <section className="category-grid-shell">
        <section className="category-grid">
          {categories.map((category) => (
            <CategoryCard
              key={category.label}
              category={category}
              active={selectedLabels.has(category.label)}
              onToggle={toggleCategory}
            />
          ))}
        </section>
        <div className="category-grid-footer">
          <button type="button" className="secondary-button" disabled={!canContinue} onClick={() => navigate('/dashboard')}>
            Next Page
          </button>
        </div>
      </section>
    </main>
  );
}