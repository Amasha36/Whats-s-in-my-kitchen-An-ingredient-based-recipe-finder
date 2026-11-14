import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Share, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RecipeImage from '../components/RecipeImage';
import rawRecipes from '../data/recipes.json';
import categories from '../data/categories.json';
import { useKitchen } from '../state/KitchenContext';
import { defaultFilters, discover, matchRecipe } from '../services/recipeMatchingService';
import { colors, styles as s } from '../theme';
import { BouncePress, CookingSteps, CategoryCard, CustomButton, EmptyState, Illustration, IngredientChip, Page, RecipeCard, SearchBar, SectionHeader } from '../components/UI';
export const recipes = rawRecipes;
const confirm = (title, action) => Alert.alert(title, 'This will remove the saved items from this device.', [{
  text: 'Cancel',
  style: 'cancel'
}, {
  text: 'Clear',
  style: 'destructive',
  onPress: action
}]);
export function HomeScreen({
  navigation
}) {
  const {
    data,
    view
  } = useKitchen();
  const [query, setQuery] = useState('');
  const open = r => {
    view(r.id);
    navigation.navigate('Details', {
      id: r.id
    });
  };
  const browse = () => navigation.navigate('Discover', {
    category: 'All',
    query: ''
  });
  const recommended = discover(recipes, data.kitchen, defaultFilters).slice(0, 5);
  const featured = categories.map(category => recipes.find(recipe => recipe.category === category.name)).filter(recipe => !!recipe);
  const results = recipes.filter(r => r.name.toLowerCase().includes(query.trim().toLowerCase()));
  const shelf = list => <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{
    gap: 14,
    paddingBottom: 7
  }} snapToInterval={264} decelerationRate="fast">{list.map(r => <RecipeCard key={r.id} recipe={r} compact onPress={() => open(r)} />)}</ScrollView>;
  return <Page>
  <View style={[s.row, {
      justifyContent: 'space-between'
    }]}><View style={{
        gap: 5
      }}><Text style={s.eyebrow}>A LITTLE INSPIRATION, EVERY DAY</Text><Text style={[s.heading, {
          fontSize: 17
        }]}>Hello, home chef!</Text></View><BouncePress accessibilityRole="button" accessibilityLabel="Open settings" onPress={() => navigation.navigate('Settings')} style={{
        backgroundColor: colors.light,
        width: 46,
        height: 46,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center'
      }}><Ionicons name="restaurant-outline" size={24} color={colors.primary} /></BouncePress></View>
  <Text style={[s.title, {
      fontSize: 36,
      lineHeight: 43
    }]}>Your kitchen.{'\n'}<Text style={{
        color: colors.primary
      }}>Endless possibilities.</Text></Text>
  <Text style={s.subtitle}>A little of what you have. A lot to fall in love with.</Text>
  <SearchBar value={query} onChangeText={setQuery} />
  {query.trim() ? <><SectionHeader title={results.length + ' delicious discoveries'} />{results.map(r => <RecipeCard key={r.id} recipe={r} onPress={() => open(r)} />)}{!results.length && <EmptyState title="Nothing on the menu yet" message="Try another recipe name, like rice or pancakes." />}</> : <>
   <View style={{
        backgroundColor: '#FBE6C7',
        borderRadius: 28,
        padding: 14,
        gap: 16
      }}><Illustration category="Lunch" /><View style={{
          paddingHorizontal: 8,
          gap: 12,
          paddingBottom: 8
        }}><Text style={s.eyebrow}>LESS WASTE. MORE TASTE.</Text><Text style={[s.heading, {
            fontSize: 25
          }]}>Good food starts right here.</Text><Text style={s.subtitle}>Turn the ingredients on your shelf into your next favourite meal.</Text><CustomButton title="Find my next meal" onPress={browse} /></View></View>
   <View style={[s.row, {
        alignItems: 'stretch'
      }]}>{[{
          value: data.kitchen.length,
          label: 'In my kitchen',
          icon: 'basket-outline',
          color: colors.mint,
          go: () => navigation.navigate('Kitchen')
        }, {
          value: data.favorites.length,
          label: 'Saved recipes',
          icon: 'heart-outline',
          color: '#FCE1DF',
          go: () => navigation.navigate('Favorites')
        }, {
          value: data.shopping.filter(i => !i.purchased).length,
          label: 'To pick up',
          icon: 'bag-handle-outline',
          color: '#EEE5FA',
          go: () => navigation.navigate('Shopping')
        }].map(item => <View key={item.label} style={{
          flex: 1
        }}><BouncePress accessibilityRole="button" accessibilityLabel={item.value + ' ' + item.label} onPress={item.go} style={{
            backgroundColor: item.color,
            paddingVertical: 16,
            paddingHorizontal: 6,
            borderRadius: 20,
            alignItems: 'center',
            gap: 7
          }}><Ionicons name={item.icon} size={22} color={colors.text} /><Text style={[s.heading, {
              fontSize: 23
            }]}>{item.value}</Text><Text style={{
              fontSize: 10,
              fontWeight: '600',
              color: colors.text,
              textAlign: 'center'
            }}>{item.label}</Text></BouncePress></View>)}</View>
   <SectionHeader title="What are you craving?" /><View style={s.wrap}>{categories.map(c => <CategoryCard key={c.id} name={c.name} onPress={() => navigation.navigate('Discover', {
          category: c.name,
          query: ''
        })} />)}</View>
   <SectionHeader title="A little food inspiration" action="See all" onPress={browse} />{shelf(featured)}
   <View style={[s.card, {
        backgroundColor: colors.mint,
        borderWidth: 0
      }]}><View style={s.row}><Ionicons name="leaf" size={28} color={colors.green} /><Text style={[s.heading, {
            flex: 1,
            color: colors.green
          }]}>Your pantry has potential.</Text></View><Text style={s.subtitle}>{data.kitchen.length ? data.kitchen.length + ' ingredients ready for something delicious.' : 'Add a few ingredients and find meals that fit your kitchen.'}</Text><CustomButton secondary title="Explore my kitchen" onPress={() => navigation.navigate('Kitchen')} /></View>
   <SectionHeader title="Picked for your pantry" action="Explore" onPress={browse} />{shelf(recommended)}
   {data.recent.length > 0 && <><SectionHeader title="One more look" />{shelf(data.recent.map(id => recipes.find(r => r.id === id)).filter(r => !!r))}</>}
   <Text style={[s.small, {
        textAlign: 'center',
        marginTop: 8
      }]}>Made with what you have. Shared with love.</Text>
  </>}
 </Page>;
}
export function KitchenScreen({
  navigation
}) {
  const {
    data,
    ingredients,
    toggleIngredient,
    update
  } = useKitchen();
  const [query, setQuery] = useState('');
  const [custom, setCustom] = useState('');
  const add = () => {
    const name = custom.trim();
    if (!name || name.length > 50) {
      Alert.alert('Check ingredient', 'Enter a name between 1 and 50 characters.');
      return;
    }
    const existing = ingredients.find(i => i.name.toLowerCase() === name.toLowerCase() || i.id === name.toLowerCase().replace(/s$/, ''));
    if (existing) {
      if (!data.kitchen.includes(existing.id)) toggleIngredient(existing.id);
    } else {
      const id = `custom_${Date.now()}`;
      update(d => ({
        ...d,
        custom: [...d.custom, {
          id,
          name,
          category: 'Other Ingredients'
        }],
        kitchen: [...d.kitchen, id]
      }));
    }
    setCustom('');
  };
  const filtered = ingredients.filter(i => i.name.toLowerCase().includes(query.trim().toLowerCase()));
  return <Page><Text style={s.title}>My kitchen</Text><Text style={s.subtitle}>Choose what you have. Your kitchen saves automatically on this device.</Text><View style={s.card}><SectionHeader title={`On your shelf · ${data.kitchen.length}`} /><View style={s.wrap}>{data.kitchen.map(id => <IngredientChip key={id} label={`${ingredients.find(i => i.id === id)?.name || id} ×`} selected onPress={() => toggleIngredient(id)} />)}</View>{!data.kitchen.length && <Text style={s.subtitle}>Your shelf is empty. Select ingredients below.</Text>}<CustomButton title="Clear selected ingredients" secondary onPress={() => confirm('Clear your kitchen?', () => update(d => ({
        ...d,
        kitchen: []
      })))} /></View><CustomButton title="Find Recipes With My Ingredients" onPress={() => navigation.navigate('Discover', {
      category: 'All',
      query: ''
    })} /><SearchBar value={query} onChangeText={setQuery} placeholder="Search ingredients…" />{[...new Set(filtered.map(i => i.category))].map(category => <View key={category} style={{
      gap: 12
    }}><SectionHeader title={category} /><View style={s.wrap}>{filtered.filter(i => i.category === category).map(i => <IngredientChip key={i.id} label={`${data.kitchen.includes(i.id) ? '✓ ' : ''}${i.name}`} selected={data.kitchen.includes(i.id)} onPress={() => toggleIngredient(i.id)} />)}</View></View>)}{!filtered.length && <EmptyState title="No ingredients found" message="Add your own ingredient below." />}<SectionHeader title="Something else in your kitchen?" /><TextInput style={s.input} accessibilityLabel="Custom ingredient name" placeholder="Ingredient name" value={custom} onChangeText={setCustom} maxLength={50} /><CustomButton title="Add custom ingredient" onPress={add} /><Text style={s.small}>Custom ingredients are saved to your shelf. Recipes match the ingredient IDs in the local dataset.</Text></Page>;
}
function Options({
  title,
  values,
  value,
  onChange
}) {
  const chips = values.map(v => <IngredientChip key={v} label={v} selected={value === v} onPress={() => onChange(v)} />);
  return <View style={{
    gap: 8
  }}><Text style={s.label}>{title}</Text>{title === 'Category' ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{
      gap: 8,
      paddingBottom: 3
    }}>{chips}</ScrollView> : <View style={s.wrap}>{chips}</View>}</View>;
}
export function DiscoverScreen({
  navigation,
  route
}) {
  const {
    data,
    view
  } = useKitchen();
  const [filters, setFilters] = useState({
    ...defaultFilters
  });
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (route.params) setFilters(f => ({
      ...f,
      category: route.params?.category || 'All',
      query: route.params?.query || ''
    }));
  }, [route.params]);
  const results = discover(recipes, data.kitchen, filters);
  return <Page><Text style={s.title}>Made for your kitchen</Text><Text style={s.subtitle}>{data.kitchen.length} ingredients selected · Find your next favourite meal.</Text>{!data.kitchen.length && <CustomButton secondary title="Select kitchen ingredients" onPress={() => navigation.navigate('Kitchen')} />}<SearchBar value={filters.query} onChangeText={query => setFilters(f => ({
      ...f,
      query
    }))} /><Options title="Category" values={['All', ...categories.map(c => c.name)]} value={filters.category} onChange={category => setFilters(f => ({
      ...f,
      category
    }))} /><CustomButton secondary title={expanded ? 'Hide filters' : 'Refine your results'} onPress={() => setExpanded(!expanded)} />{expanded && <View style={s.card}><Options title="Food preference" values={['All', 'Vegetarian', 'Non-vegetarian']} value={filters.foodType} onChange={foodType => setFilters(f => ({
        ...f,
        foodType
      }))} /><Options title="Maximum cooking time (minutes)" values={['Any', '15', '30', '45']} value={filters.maxTime ? String(filters.maxTime) : 'Any'} onChange={v => setFilters(f => ({
        ...f,
        maxTime: v === 'Any' ? 0 : Number(v)
      }))} /><Options title="Difficulty" values={['All', 'Easy', 'Medium', 'Hard']} value={filters.difficulty} onChange={difficulty => setFilters(f => ({
        ...f,
        difficulty
      }))} /><Options title="Minimum match (%)" values={['0', '40', '70', '100']} value={String(filters.minMatch)} onChange={v => setFilters(f => ({
        ...f,
        minMatch: Number(v)
      }))} /><Options title="Sort by" values={['Best match', 'Shortest cooking time', 'Alphabetical']} value={filters.sort} onChange={sort => setFilters(f => ({
        ...f,
        sort
      }))} /></View>}<CustomButton secondary title="Clear filters and search" onPress={() => setFilters({
      ...defaultFilters
    })} /><SectionHeader title={`${results.length} recipes to explore`} />{results.map(r => <RecipeCard key={r.id} recipe={r} onPress={() => {
      view(r.id);
      navigation.navigate('Details', {
        id: r.id
      });
    }} />)}{!results.length && <EmptyState title="No recipes match" message="Try a lower match percentage or clear your filters." />}</Page>;
}
export function RecipeDetailsScreen({
  route
}) {
  const {
    data,
    ingredients,
    toggleFavorite,
    addMissing
  } = useKitchen();
  const r = recipes.find(x => x.id === route.params.id);
  if (!r) return <Page><EmptyState title="Recipe unavailable" message="Go back and choose another recipe." /></Page>;
  const m = matchRecipe(r, data.kitchen);
  const name = id => ingredients.find(i => i.id === id)?.name || id;
  const share = async () => {
    try {
      await Share.share({
        message: `${r.name}\n${r.description}\n\nIngredients\n${r.ingredients.map(i => `${name(i.ingredientId)} – ${i.quantity}`).join('\n')}\n\n${r.instructions.map((step, i) => `${i + 1}. ${step}`).join('\n')}\n\nWhat's in my Kitchen?`
      });
    } catch {
      Alert.alert('Sharing unavailable', 'Your device could not open the share menu.');
    }
  };
  return <Page><RecipeImage key={r.id} recipe={r} large /><Text style={[s.small, {
      textAlign: "right"
    }]}>Serving illustration</Text><Text style={s.title}>{r.name}</Text><Text style={s.subtitle}>{r.description}</Text><Text style={s.label}>{r.category} · {r.foodType} · {r.difficulty}</Text><View style={s.card}><Text style={s.label}>Prep {r.preparationTime} min · Cook {r.cookingTime} min</Text><Text style={s.subtitle}>Total {r.preparationTime + r.cookingTime} min · Serves {r.servings}</Text><Text style={{
        color: colors.primary,
        fontWeight: '800',
        fontSize: 22
      }}>{m.percentage.toFixed(1)}% match</Text><Text style={s.subtitle}>{m.label} · {m.available.length} available · {m.missing.length} missing</Text></View><CustomButton title={data.favorites.includes(r.id) ? 'Remove from Favorites' : 'Add to Favorites'} onPress={() => toggleFavorite(r.id)} /><SectionHeader title="Ingredients" />{r.ingredients.map(i => {
      const has = data.kitchen.includes(i.ingredientId);
      return <View key={i.ingredientId} style={[s.row, s.card]}><Ionicons name={has ? 'checkmark-circle' : 'close-circle-outline'} size={22} color={has ? colors.primary : colors.error} /><View style={{
          flex: 1
        }}><Text style={s.label}>{name(i.ingredientId)} – {i.quantity}</Text><Text style={s.small}>{has ? 'In your kitchen' : 'Missing'}</Text></View></View>;
    })}<CustomButton title="Add Missing Ingredients to Shopping List" onPress={() => addMissing(r)} /><CookingSteps key={r.id} steps={r.instructions} /><CustomButton secondary title="Share recipe" onPress={share} /></Page>;
}
export function FavoritesScreen({
  navigation
}) {
  const {
    data,
    view
  } = useKitchen();
  const list = recipes.filter(r => data.favorites.includes(r.id));
  return <Page><Text style={s.title}>Your favourites</Text><Text style={s.subtitle}>The meals you'll come back to.</Text>{list.map(r => <RecipeCard key={r.id} recipe={r} onPress={() => {
      view(r.id);
      navigation.navigate('Details', {
        id: r.id
      });
    }} />)}{!list.length && <EmptyState title="A little collection of joy" message="Tap the heart on any recipe to save it here." />}</Page>;
}
export function ShoppingListScreen() {
  const {
    data,
    update
  } = useKitchen();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const add = () => {
    if (!name.trim()) {
      Alert.alert('Item name required', 'Enter an ingredient or shopping item.');
      return;
    }
    update(d => ({
      ...d,
      shopping: [...d.shopping, {
        id: `shopping_${Date.now()}`,
        name: name.trim(),
        quantity: quantity.trim(),
        purchased: false
      }]
    }));
    setName('');
    setQuantity('');
  };
  return <Page><Text style={s.title}>A little shopping</Text><Text style={s.subtitle}>{data.shopping.filter(i => !i.purchased).length} items left to pick up</Text>{data.shopping.length > 0 && <View style={[s.card, {
      backgroundColor: colors.mint,
      borderWidth: 0
    }]}><View style={[s.row, {
        justifyContent: "space-between"
      }]}><Text style={[s.label, {
          color: colors.green
        }]}>Your basket is coming together</Text><Ionicons name="bag-check-outline" size={24} color={colors.green} /></View><Text accessibilityLiveRegion="polite" style={s.small}>{data.shopping.filter(i => i.purchased).length} of {data.shopping.length} picked up</Text><View style={{
        height: 7,
        backgroundColor: "white",
        borderRadius: 5,
        overflow: "hidden"
      }}><View style={{
          height: 7,
          backgroundColor: colors.green,
          width: `${data.shopping.filter(i => i.purchased).length / data.shopping.length * 100}%`
        }} /></View></View>}<View style={s.card}><TextInput style={s.input} accessibilityLabel="Shopping item name" placeholder="Add an item" value={name} onChangeText={setName} maxLength={70} /><TextInput style={s.input} accessibilityLabel="Shopping item quantity" placeholder="Quantity (optional)" value={quantity} onChangeText={setQuantity} maxLength={50} /><CustomButton title="Add to list" onPress={add} /></View>{data.shopping.map(item => <View key={item.id} style={[s.card, s.row]}><Pressable accessibilityRole="checkbox" accessibilityState={{
        checked: item.purchased
      }} accessibilityLabel={`Mark ${item.name} ${item.purchased ? 'not purchased' : 'purchased'}`} onPress={() => update(d => ({
        ...d,
        shopping: d.shopping.map(x => x.id === item.id ? {
          ...x,
          purchased: !x.purchased
        } : x)
      }))} style={[s.row, {
        flex: 1
      }]}><Ionicons name={item.purchased ? 'checkbox' : 'square-outline'} size={26} color={colors.primary} /><View style={{
          flex: 1
        }}><Text style={[s.label, item.purchased && {
            textDecorationLine: 'line-through',
            color: colors.muted
          }]}>{item.name}</Text>{!!item.quantity && <Text style={s.small}>{item.quantity}</Text>}</View></Pressable><Pressable accessibilityLabel={`Remove ${item.name}`} hitSlop={10} onPress={() => Alert.alert('Remove item?', item.name, [{
        text: 'Cancel',
        style: 'cancel'
      }, {
        text: 'Remove',
        style: 'destructive',
        onPress: () => update(d => ({
          ...d,
          shopping: d.shopping.filter(x => x.id !== item.id)
        }))
      }])}><Ionicons name="trash-outline" size={22} color={colors.error} /></Pressable></View>)}{!data.shopping.length ? <EmptyState title="All stocked up" message="Add an item above or bring missing ingredients here from a recipe." /> : <CustomButton secondary title="Clear shopping list" onPress={() => confirm('Clear shopping list?', () => update(d => ({
      ...d,
      shopping: []
    })))} />}</Page>;
}
export function SettingsScreen() {
  const {
    ingredients,
    update
  } = useKitchen();
  return <Page><Illustration category="Lunch" /><Text style={s.title}>What's in my Kitchen?</Text><Text style={s.subtitle}>Discover delicious meals with what you have.</Text><View style={s.card}><SectionHeader title="Small kitchen. Endless possibilities." /><Text style={s.subtitle}>An ingredient-based recipe finder for students and home cooks. Reduce food waste, save favourite meals and shop with purpose.</Text><Text style={s.label}>{recipes.length} original recipes · {ingredients.length} ingredients</Text><Text style={s.small}>Version 1.0.0 · ICA 03 individual project</Text></View><SectionHeader title="Your saved data" /><CustomButton secondary title="Clear saved kitchen ingredients" onPress={() => confirm('Clear kitchen?', () => update(d => ({
      ...d,
      kitchen: [],
      custom: []
    })))} /><CustomButton secondary title="Clear favorites" onPress={() => confirm('Clear favorites?', () => update(d => ({
      ...d,
      favorites: []
    })))} /><CustomButton secondary title="Clear shopping list" onPress={() => confirm('Clear shopping list?', () => update(d => ({
      ...d,
      shopping: []
    })))} /><CustomButton secondary title="Clear recently viewed recipes" onPress={() => confirm('Clear history?', () => update(d => ({
      ...d,
      recent: []
    })))} /><SectionHeader title="About this application" /><Text style={s.subtitle}>All recipes and illustrations are bundled with the app. Your kitchen, favourites, shopping list and history stay on this device. No account or internet connection is needed in the installed app.</Text><Text style={s.small}>Vegetarian recipes may contain eggs or dairy. Recipe quantities are for the listed servings. Water is assumed available unless explicitly listed.</Text></Page>;
}
