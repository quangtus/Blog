
const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
    return (
        <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
            <option value="">All Categories</option>
            {categories.map((category) => (
                <option key={category._id} value={category._id}>
                    {category.name}
                </option>
            ))}
        </select>
    );
};

export default CategoryFilter;

