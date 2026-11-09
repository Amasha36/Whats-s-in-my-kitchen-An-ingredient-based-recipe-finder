export function matchRecipe(recipe, kitchen) {
  const selected = new Set(kitchen);
  const available = recipe.ingredients.filter(i => selected.has(i.ingredientId));
  const missing = recipe.ingredients.filter(i => !selected.has(i.ingredientId));
  const total = recipe.ingredients.length;
  const percentage = total ? available.length / total * 100 : 0;
  const label = percentage === 100 ? 'Ready to Cook' : percentage >= 70 ? 'Almost Ready' : percentage >= 40 ? 'Some Ingredients Missing' : 'Low Match';
  return {
    available,
    missing,
    total,
    percentage,
    label
  };
}
export const defaultFilters = {
  query: '',
  category: 'All',
  foodType: 'All',
  maxTime: 0,
  difficulty: 'All',
  minMatch: 0,
  sort: 'Best match'
};
export function discover(recipes, kitchen, filters) {
  return recipes.filter(r => r.name.toLowerCase().includes(filters.query.trim().toLowerCase()) && (filters.category === 'All' || r.category === filters.category) && (filters.foodType === 'All' || r.foodType === filters.foodType) && (!filters.maxTime || r.cookingTime <= filters.maxTime) && (filters.difficulty === 'All' || r.difficulty === filters.difficulty) && matchRecipe(r, kitchen).percentage >= filters.minMatch).sort((a, b) => (filters.sort === 'Alphabetical' ? a.name.localeCompare(b.name) : filters.sort === 'Shortest cooking time' ? a.cookingTime - b.cookingTime : matchRecipe(b, kitchen).percentage - matchRecipe(a, kitchen).percentage) || a.name.localeCompare(b.name));
}
