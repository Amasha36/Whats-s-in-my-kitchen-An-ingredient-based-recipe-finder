import assert from 'node:assert/strict';
import fs from 'node:fs';
import { discover, defaultFilters, matchRecipe } from '../src/services/recipeMatchingService.js';
const recipes = JSON.parse(fs.readFileSync('src/data/recipes.json', 'utf8'));
const ingredients = JSON.parse(fs.readFileSync('src/data/ingredients.json', 'utf8'));
assert.ok(recipes.length >= 50);
assert.ok(ingredients.length >= 50);
assert.equal(new Set(recipes.map(r => r.id)).size, recipes.length);
assert.equal(new Set(recipes.map(r => r.name)).size, recipes.length);
assert.equal(new Set(ingredients.map(i => i.id)).size, ingredients.length);
for (const r of recipes) {
  assert.ok(r.instructions.length >= 3);
  assert.ok(r.ingredients.length > 0);
  assert.ok(r.servings > 0);
  assert.ok(r.preparationTime >= 0 && r.cookingTime >= 0);
  assert.equal(new Set(r.ingredients.map(i => i.ingredientId)).size, r.ingredients.length);
  for (const i of r.ingredients) {
    assert.ok(ingredients.some(x => x.id === i.ingredientId), i.ingredientId);
    assert.ok(i.quantity);
  }
  assert.equal(matchRecipe(r, r.ingredients.map(i => i.ingredientId)).percentage, 100);
  assert.equal(matchRecipe(r, []).percentage, 0);
}
const example = {
  ...recipes[0],
  ingredients: ['rice', 'carrot', 'onion', 'egg', 'garlic', 'soy_sauce'].map(ingredientId => ({
    ingredientId,
    quantity: '1'
  }))
};
const result = matchRecipe(example, ['rice', 'carrot', 'onion', 'egg', 'potato', 'rice']);
assert.equal(result.percentage.toFixed(1), '66.7');
assert.equal(result.available.length, 4);
assert.deepEqual(result.missing.map(i => i.ingredientId), ['garlic', 'soy_sauce']);
assert.equal(result.label, 'Some Ingredients Missing');
assert.equal(matchRecipe({
  ...example,
  ingredients: []
}, []).percentage, 0);
const kitchen = ['rice', 'carrot', 'onion', 'egg'];
const ranked = discover(recipes, kitchen, defaultFilters);
for (let i = 1; i < ranked.length; i++) assert.ok(matchRecipe(ranked[i - 1], kitchen).percentage >= matchRecipe(ranked[i], kitchen).percentage);
const filtered = discover(recipes, kitchen, {
  ...defaultFilters,
  category: 'Lunch',
  foodType: 'Vegetarian',
  maxTime: 25,
  minMatch: 40,
  difficulty: 'Easy'
});
assert.ok(filtered.length > 0);
for (const r of filtered) {
  assert.equal(r.category, 'Lunch');
  assert.equal(r.foodType, 'Vegetarian');
  assert.ok(r.cookingTime <= 25);
  assert.ok(matchRecipe(r, kitchen).percentage >= 40);
  assert.equal(r.difficulty, 'Easy');
}
assert.equal(discover(recipes, [], {
  ...defaultFilters,
  query: '  BANANA SMOOTHIE '
})[0].name, 'Banana Smoothie');
assert.equal(discover(recipes, [], {
  ...defaultFilters,
  minMatch: 100
}).length, 0);
for (const sort of ['Alphabetical', 'Shortest cooking time']) {
  const list = discover(recipes, [], {
    ...defaultFilters,
    sort
  });
  for (let i = 1; i < list.length; i++) assert.ok(sort === 'Alphabetical' ? list[i - 1].name.localeCompare(list[i].name) <= 0 : list[i - 1].cookingTime <= list[i].cookingTime);
}
console.log(`Passed: ${recipes.length} recipes, ${ingredients.length} ingredients, reference integrity, matching, search, combined filters, sorting and empty results.`);
