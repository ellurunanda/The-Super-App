export default function CategoryCard({ category, active, onToggle }) {
  return (
    <button
      type="button"
      className={`category-card ${active ? 'category-card-active' : ''}`}
      style={{ '--category-bg': category.bg }}
      onClick={() => onToggle(category)}
      aria-label={category.label}
    >
      <span className="category-card-label">{category.label}</span>
      <img
        src={category.image}
        alt=""
        aria-hidden="true"
        className="category-card-image"
        loading="lazy"
        onError={(event) => {
          event.currentTarget.style.display = 'none';
        }}
      />
    </button>
  );
}