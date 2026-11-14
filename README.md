# What's in my Kitchen?

An ingredient-based smart recipe finder for a React Native university ICA 03 project. Discover meals from the ingredients already in your kitchen, save favourites, and build a shopping list — using local data.

## Problem and objectives

Students and home cooks often struggle to decide what to cook and waste ingredients. This app helps them compare their kitchen with recipes, understand what is missing, and plan purchases. The implementation uses understandable JavaScript and JSX, reusable components and a transparent matching algorithm.

## Technology

Expo SDK 55, React Native, React 19, JavaScript and JSX, React Navigation native stack and bottom tabs, Expo Vector Icons, AsyncStorage, and React Native StyleSheet. Native versions follow [Expo's SDK 55 package matrix](https://raw.githubusercontent.com/expo/expo/sdk-55/packages/expo/bundledNativeModules.json). No recipe APIs, remote image URLs, authentication or database servers.

## Getting started on Windows

Install Node.js 22 LTS or newer and an Expo Go version compatible with SDK 55, or use an Android emulator. From this project directory:

```powershell
npm.cmd install
npx.cmd expo install --fix
npm.cmd test
npx.cmd expo-doctor
npm.cmd start
```

Scan the QR code using compatible Expo Go, or press `a` with an Android emulator running. Alternatively run `npm.cmd run android`. iOS simulator development needs macOS. On macOS/Linux, use `npm` and `npx` without `.cmd`.

The `.cmd` suffix avoids PowerShell's restriction on executing npm.ps1. Initial dependency installation requires internet access. Commit the generated package-lock.json after successful installation and version alignment; subsequent installations can use `npm.cmd ci`.

## Features and screens

1. Splash: local illustration and short automatic transition after storage loading.
2. Home: name search, kitchen summary, categories, featured recommendations and recent history.
3. My Kitchen: grouped ingredient search, removable chips, custom ingredients and automatic saving.
4. Discover: match-ranked recipes, category, food type, cooking time, difficulty and minimum-match filters; alphabetical and cooking-time sorting.
5. Details: quantities, available/missing status, preparation/cooking/total times, servings, numbered steps, favourites, shopping action and native sharing.
6. Favorites: saved recipe cards and removal controls.
7. Shopping: quantities, custom items, purchased checkboxes, removal and confirmed clearing.
8. Settings: dataset counts, version, about information and confirmed data-clearing actions.

## Local dataset

`src/data/recipes.json` contains 52 original recipes spanning Breakfast, Lunch, Dinner, Snacks, Desserts and Drinks. `ingredients.json` contains 70 ingredients in ten groups; `categories.json` supplies category labels, icon names and colours. Sri Lankan dishes and international meals include vegetarian and non-vegetarian choices. Vegetarian here permits egg and dairy. Water is assumed available unless explicitly listed.

Recipe outlines were authored for this project, not downloaded from a recipe service. `scripts/create-dataset.cjs` is the editable source used to generate the JSON. Run `node scripts/create-dataset.cjs` only when intentionally rebuilding the dataset. Recipe cards and detail pages use 52 distinct AI-generated serving illustrations mapped by recipe ID and name. Seven local image sheets keep these available offline. Generic category artwork is used only for decorative home, splash and settings imagery. See assets/README.md for asset provenance and generation prompts.

Matching uses exact ingredient IDs. Percentage = available required ingredients / total required ingredients × 100. All explicitly listed ingredients count, including seasonings. Status thresholds use the unrounded value: 100% Ready to Cook, at least 70% Almost Ready, at least 40% Some Ingredients Missing, otherwise Low Match. Display rounds to one decimal place. Custom ingredient names reuse a matching known ingredient when possible; new ingredients do not magically match unrelated recipe IDs.

The shopping list stores separate quantities per recipe instead of incorrectly adding unlike units. Adding the same recipe's missing ingredient twice does not duplicate it. Removing it allows it to be added again.

## Project structure

```text
App.jsx                        Providers, splash timing and storage status
index.js                       Expo registration
src/components/UI.jsx          Shared controls, cards and illustrations
src/data/                      Recipe datasets and artwork mapping
src/navigation/                Stack and tab routes
src/screens/Screens.jsx         Seven application screens
src/screens/SplashScreen.jsx    Intro screen
src/services/                  Matching/filtering and AsyncStorage
src/state/KitchenContext.jsx   Shared kitchen state and queued writes
src/theme/                     Palette and shared StyleSheet
scripts/create-dataset.cjs     Original dataset authoring source
tests/matching.test.js         Offline data and algorithm checks
docs/TESTING.md                Device acceptance checklist
```

## Storage and offline operation

AsyncStorage key `@kitchen/v1` stores kitchen IDs, custom ingredients, favourites, recent views and shopping items. Hydration completes before the main UI appears; writes are queued. Storage failures show a retry banner instead of silently reporting success. Clearing data requires confirmation. Removing a favourite or deselecting one ingredient is immediately reversible.

The application code makes no network requests. All recipes and category illustrations ship with the app. A **standalone native release** is needed to demonstrate cold-start offline operation reliably: Expo Go development uses Metro to load JavaScript. On a machine with Android Studio/JDK configured, `npx.cmd expo run:android --variant release` creates and installs a release build locally. Build tools may need downloads the first time. Then stop Metro, enable airplane mode, force-close and reopen the installed app.

## Verification status

Passed in this workspace: 52/70 dataset counts, unique IDs/names, ingredient references, recipe structure, full/zero match, duplicate selection handling, the 66.7% example, sorting, search, combined filters and empty results. Run `npm.cmd test` with Node 22 or newer.

After converting the project to JavaScript and JSX, JavaScript syntax checks, recipe tests, artwork checks and Android production bundling passed. Emulator launch, native storage persistence, native sharing and airplane-mode device tests remain **unverified**. See `docs/TESTING.md`.

## Suggested Git commits

1. Initial Expo setup with JavaScript and JSX
2. Add original recipe and ingredient datasets
3. Implement matching service and regression checks
4. Add reusable kitchen design components
5. Connect navigation and recipe screens
6. Implement persisted kitchen, favourites and shopping list
7. Document setup and device acceptance testing

node_modules, native generated folders, local caches and secrets are ignored. The pre-existing PDF and local Git workflow notes (`test cases.txt`) are kept outside the project commits.

## Visual refresh

Warm cream and coral styling, bundled category food photography, horizontal recipe shelves, animated press feedback, live pantry/favourites/shopping counters, and interactive cooking checklists. Cooking step completion resets when leaving a recipe. Reduced-motion preferences disable button scaling. Shopping progress reflects the saved purchased state. The supplied Pinterest image could not be accessed; the visual direction is provisional until the reference is uploaded.
