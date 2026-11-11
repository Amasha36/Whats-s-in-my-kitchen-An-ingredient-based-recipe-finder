import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Image, Pressable, Text, TextInput, View, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, styles as s } from '../theme';
import RecipeImage from './RecipeImage';
import categories from '../data/categories.json';
import { useKitchen } from '../state/KitchenContext';
import { matchRecipe } from '../services/recipeMatchingService';
export function BouncePress({
  children,
  style,
  ...props
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const reduceMotion = useRef(true);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then(value => {
      if (mounted) reduceMotion.current = value;
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', value => {
      reduceMotion.current = value;
    });
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);
  const animate = value => {
    if (!reduceMotion.current) Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 35,
      bounciness: 5
    }).start();
  };
  return <Animated.View style={{
    transform: [{
      scale
    }]
  }}><Pressable {...props} style={style} onPressIn={event => {
      animate(0.96);
      props.onPressIn?.(event);
    }} onPressOut={event => {
      animate(1);
      props.onPressOut?.(event);
    }}>{children}</Pressable></Animated.View>;
}
export function CustomButton({
  title,
  onPress,
  secondary = false
}) {
  return <BouncePress accessibilityRole="button" onPress={onPress} style={({
    pressed
  }) => ({
    backgroundColor: secondary ? colors.light : colors.primary,
    padding: 16,
    borderRadius: 18,
    opacity: pressed ? 0.8 : 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10
  })}><Text style={{
      fontWeight: '800',
      color: secondary ? colors.primary : 'white',
      fontSize: 14,
      flexShrink: 1,
      textAlign: 'center'
    }}>{title}</Text>{!secondary && <Ionicons name="arrow-forward" size={18} color="white" />}</BouncePress>;
}
export function IngredientChip({
  label,
  selected = false,
  onPress
}) {
  return <BouncePress accessibilityRole="button" accessibilityState={{
    selected
  }} onPress={onPress} style={{
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 24,
    backgroundColor: selected ? colors.primary : 'white',
    borderWidth: 1,
    borderColor: selected ? colors.primary : colors.border
  }}><Text style={{
      color: selected ? 'white' : colors.text,
      fontWeight: selected ? '700' : '500',
      fontSize: 13
    }}>{label}</Text></BouncePress>;
}
export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Find something delicious…'
}) {
  return <View style={[s.row, s.input]}><Ionicons name="search-outline" size={22} color={colors.primary} /><TextInput accessibilityLabel={placeholder} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.muted} style={{
      flex: 1,
      fontSize: 15,
      color: colors.text,
      paddingVertical: 2
    }} />{value.length > 0 && <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => onChangeText('')} hitSlop={12}><Ionicons name="close-circle" size={24} color={colors.muted} /></Pressable>}</View>;
}
export function SectionHeader({
  title,
  action,
  onPress
}) {
  return <View style={[s.row, {
    justifyContent: 'space-between',
    marginTop: 5
  }]}><Text style={[s.heading, {
      flex: 1
    }]}>{title}</Text>{action && onPress && <Pressable accessibilityRole="button" onPress={onPress} hitSlop={10}><Text style={{
        fontSize: 13,
        fontWeight: '700',
        color: colors.primary
      }}>{action} →</Text></Pressable>}</View>;
}
export function EmptyState({
  title,
  message
}) {
  return <View style={[s.card, {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#FFF0D3',
    borderWidth: 0
  }]}><View style={{
      padding: 18,
      backgroundColor: 'white',
      borderRadius: 30
    }}><Ionicons name="leaf-outline" size={34} color={colors.green} /></View><Text style={[s.heading, {
      textAlign: 'center'
    }]}>{title}</Text><Text style={[s.subtitle, {
      textAlign: 'center'
    }]}>{message}</Text></View>;
}
export function Page({
  children
}) {
  return <ScrollView style={s.page} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>{children}</ScrollView>;
}
// A bundled six-photo atlas keeps category artwork available offline.
export function Illustration({
  category,
  large = false
}) {
  const index = Math.max(0, categories.findIndex(item => item.name === category));
  const [width, setWidth] = useState(0);
  const height = large ? 270 : 165;
  const tile = Math.max(width, height);
  return <View accessibilityRole="image" accessibilityLabel={`${category} food inspiration`} onLayout={event => setWidth(event.nativeEvent.layout.width)} style={{
    height,
    backgroundColor: categories[index].color,
    borderRadius: 22,
    overflow: 'hidden'
  }}>{width > 0 && <Image source={require('../../assets/food-atlas.png')} accessible={false} resizeMode="stretch" style={{
      position: 'absolute',
      width: tile * 3,
      height: tile * 2,
      left: -(index % 3) * tile + (width - tile) / 2,
      top: -Math.floor(index / 3) * tile + (height - tile) / 2
    }} />}</View>;
}
export function CategoryCard({
  name,
  onPress
}) {
  const c = categories.find(item => item.name === name) || categories[0];
  return <View style={{
    width: '30%',
    flexGrow: 1
  }}><BouncePress onPress={onPress} accessibilityRole="button" accessibilityLabel={`Explore ${name} recipes`} style={{
      padding: 16,
      minHeight: 103,
      backgroundColor: c.color,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10
    }}><Ionicons name={c.icon} size={29} color={colors.text} /><Text style={[s.label, {
        fontSize: 12
      }]}>{name}</Text></BouncePress></View>;
}
export function RecipeCard({
  recipe,
  onPress,
  compact = false
}) {
  const {
    data,
    toggleFavorite
  } = useKitchen();
  const match = matchRecipe(recipe, data.kitchen);
  const saved = data.favorites.includes(recipe.id);
  return <View style={[u.recipe, compact && {
    width: 250
  }]}><BouncePress accessibilityRole="button" accessibilityLabel={`Open ${recipe.name}`} onPress={onPress} style={{
      gap: 13
    }}><RecipeImage key={recipe.id} recipe={recipe} /><View style={{
        paddingHorizontal: 7,
        gap: 9
      }}><Text style={s.eyebrow}>{recipe.category.toUpperCase()} · {recipe.difficulty.toUpperCase()}</Text><Text numberOfLines={compact ? 2 : undefined} style={[s.heading, {
          fontSize: 19,
          minHeight: compact ? 48 : undefined
        }]}>{recipe.name}</Text><View style={s.row}><Ionicons name="time-outline" size={15} color={colors.muted} /><Text style={s.small}>{recipe.preparationTime + recipe.cookingTime} min total</Text><View style={u.dot} /><Text style={s.small}>{recipe.servings} servings</Text></View><View style={{
          height: 5,
          backgroundColor: colors.mint,
          borderRadius: 5,
          overflow: 'hidden'
        }}><View style={{
            height: 5,
            width: `${match.percentage}%`,
            backgroundColor: colors.green
          }} /></View><View style={[s.row, {
          justifyContent: 'space-between'
        }]}><Text style={{
            color: colors.green,
            fontSize: 12,
            fontWeight: '800'
          }}>{match.percentage.toFixed(1)}% pantry match</Text><Text style={s.small}>{match.missing.length === 0 ? 'Ready to cook!' : `${match.missing.length} missing`}</Text></View></View></BouncePress><View style={{
      position: 'absolute',
      right: 20,
      top: 20
    }}><BouncePress accessibilityRole="button" accessibilityState={{
        selected: saved
      }} accessibilityLabel={`${saved ? 'Remove' : 'Save'} ${recipe.name} ${saved ? 'from' : 'to'} favourites`} onPress={() => toggleFavorite(recipe.id)} style={u.heart}><Ionicons name={saved ? 'heart' : 'heart-outline'} color={colors.primary} size={22} /></BouncePress></View></View>;
}
export function CookingSteps({
  steps
}) {
  const [completed, setCompleted] = useState([]);
  return <View style={{
    gap: 12
  }}><View style={[s.row, {
      justifyContent: 'space-between'
    }]}><Text style={s.heading}>Let's get cooking</Text><Text accessibilityLiveRegion="polite" style={s.small}>{completed.length}/{steps.length} done</Text></View><Text style={s.small}>Tap each step as you finish. You've got this!</Text><View style={{
      height: 6,
      borderRadius: 4,
      backgroundColor: colors.light,
      overflow: 'hidden'
    }}><View style={{
        height: 6,
        backgroundColor: colors.green,
        width: `${steps.length ? completed.length / steps.length * 100 : 0}%`
      }} /></View>{steps.map((step, index) => {
      const done = completed.includes(index);
      return <BouncePress key={index} accessibilityRole="checkbox" accessibilityState={{
        checked: done
      }} accessibilityLabel={`Step ${index + 1}: ${step}`} onPress={() => setCompleted(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index])} style={[s.card, s.row, {
        alignItems: 'flex-start',
        backgroundColor: done ? colors.mint : 'white'
      }]}><View style={{
          width: 36,
          height: 36,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: done ? colors.green : colors.light,
          borderRadius: 12
        }}>{done ? <Ionicons name="checkmark" size={22} color="white" /> : <Text style={{
            color: colors.primary,
            fontWeight: '800'
          }}>{String(index + 1).padStart(2, '0')}</Text>}</View><Text style={[s.subtitle, {
          flex: 1,
          color: done ? colors.green : colors.text
        }]}>{step}</Text></BouncePress>;
    })}{completed.length === steps.length && <View style={[s.card, {
      backgroundColor: '#FFF0D3'
    }]}><Text style={s.heading}>Made by you. Enjoy!</Text><CustomButton secondary title="Reset steps" onPress={() => setCompleted([])} /></View>}</View>;
}
const u = StyleSheet.create({
  recipe: {
    backgroundColor: 'white',
    borderRadius: 28,
    padding: 10,
    paddingBottom: 19,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#5C3920',
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2
  },
  heart: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.muted
  }
});
