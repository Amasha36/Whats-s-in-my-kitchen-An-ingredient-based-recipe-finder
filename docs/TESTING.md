# Acceptance testing

## Automated checks completed

Run `npm.cmd test`. Tests validate recipe/ingredient counts and references, uniqueness, nonempty steps and quantities, 0/100% matches, zero-ingredient safety, duplicate kitchen IDs, the specified 66.7% example, descending match ranking, combined filters, case-insensitive search, empty results and both alternative sorts.

## Pending environment checks

The app uses JavaScript and JSX. To check the installed dependencies and Android bundle, run:

```powershell
npx.cmd expo install --fix
npm.cmd test
npx.cmd expo-doctor
npx.cmd expo export --platform android
```

Resolve any reported issues before submission. Recipe tests, artwork checks and Android bundling are checked separately from the device acceptance steps below.

## Pending device checklist

- [ ] Launch: splash transitions to Home and local recipe cards appear.
- [ ] Select Rice, Carrot, Onion and Egg. Remove and reselect an ingredient.
- [ ] Find Recipes: verify descending percentages; Egg Fried Rice has 4/6 = 66.7%.
- [ ] Open details: the same four ingredients are available; Oil and Soy sauce are missing.
- [ ] Favourite the recipe, force-close and reopen; confirm persistence.
- [ ] Add missing ingredients twice; verify two shopping entries, not four.
- [ ] Check purchased, restart and verify; remove an item and clear with confirmation.
- [ ] Add a custom ingredient and shopping item, including a quantity; restart and check.
- [ ] Search by recipe name, try an absent name, and clear the search.
- [ ] Combine category, vegetarian, time, difficulty and match filters; check empty state and reset.
- [ ] Check shortest cooking time and alphabetical order.
- [ ] Tap Home categories; verify Discover category changes.
- [ ] Open several recipes and verify recently viewed order.
- [ ] Share a recipe using the native chooser; cancel and return safely.
- [ ] Cancel every clear-data dialog and verify data remains. Confirm each and verify removal.
- [ ] Install a release build; stop Metro, enable airplane mode, force-close and reopen.
- [ ] Repeat ingredient selection, favourites, shopping, search and filtering offline.
- [ ] Test a small Android display and larger screen with increased font size.

Record device/OS, date and results for your ICA demonstration. Native persistence and offline launch cannot be established by the pure matching tests alone.
