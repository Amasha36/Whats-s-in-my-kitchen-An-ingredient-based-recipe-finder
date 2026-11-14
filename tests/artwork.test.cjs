const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const recipes = require('../src/data/recipes.json');
const artwork = require('../src/data/recipeArtwork.json');
const occupied = new Set();

assert.deepEqual(Object.keys(artwork).sort(), recipes.map(recipe => recipe.id).sort(), 'Every recipe must have its own image mapping');
for (const recipe of recipes) {
  const entry = artwork[recipe.id];
  assert.equal(entry.name, recipe.name, `Wrong dish mapped to ${recipe.id}`);
  assert.ok(Number.isInteger(entry.sheet) && entry.sheet >= 1 && entry.sheet <= 7);
  const columns = entry.sheet === 7 ? 2 : 4;
  assert.ok(Number.isInteger(entry.tile) && entry.tile >= 0 && entry.tile < columns * 2);
  const key = `${entry.sheet}:${entry.tile}`;
  assert.ok(!occupied.has(key), `Unrelated recipes share an image: ${key}`);
  occupied.add(key);
}
for (let sheet = 1; sheet <= 7; sheet++) {
  const file = path.join(root, 'assets', `recipes-${String(sheet).padStart(2, '0')}.png`);
  const bytes = fs.readFileSync(file);
  assert.equal(bytes.subarray(1, 4).toString(), 'PNG', `Invalid image: ${file}`);
  const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
  const columns = sheet === 7 ? 2 : 4;
  assert.ok(width / columns >= 256 && height / 2 >= 256, 'Recipe tiles should have usable resolution');
  assert.ok(Math.abs(width / height - columns / 2) < 0.02, 'Atlas must have square tiles');
}
console.log(`Passed: ${recipes.length} unique recipe images, exact recipe identity, valid atlas positions and 7 bundled PNG assets.`);
