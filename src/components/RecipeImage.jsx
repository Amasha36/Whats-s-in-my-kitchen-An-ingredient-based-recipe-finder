import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import artwork from '../data/recipeArtwork.json';
import { colors } from '../theme';

// Metro needs literal require paths so every recipe image is bundled offline.
const sheets = {
  1: {
    source: require('../../assets/recipes-01.png'),
    columns: 4
  },
  2: {
    source: require('../../assets/recipes-02.png'),
    columns: 4
  },
  3: {
    source: require('../../assets/recipes-03.png'),
    columns: 4
  },
  4: {
    source: require('../../assets/recipes-04.png'),
    columns: 4
  },
  5: {
    source: require('../../assets/recipes-05.png'),
    columns: 4
  },
  6: {
    source: require('../../assets/recipes-06.png'),
    columns: 4
  },
  7: {
    source: require('../../assets/recipes-07.png'),
    columns: 2
  }
};
const recipeArtwork = artwork;
export default function RecipeImage({
  recipe,
  large = false
}) {
  const [width, setWidth] = useState(0);
  const [failed, setFailed] = useState(false);
  const entry = recipeArtwork[recipe.id];
  const sheet = entry && entry.name === recipe.name ? sheets[entry.sheet] : undefined;
  const height = large ? 270 : 165;
  const tileSize = Math.max(width, height);
  return <View accessibilityRole="image" accessibilityLabel={`${recipe.name}, serving illustration`} onLayout={event => setWidth(event.nativeEvent.layout.width)} style={{
    height,
    backgroundColor: '#FBE8DD',
    borderRadius: 22,
    overflow: 'hidden'
  }}>
    {sheet && !failed ? width > 0 && <Image source={sheet.source} accessible={false} onError={() => setFailed(true)} resizeMode="stretch" style={{
      position: 'absolute',
      width: tileSize * sheet.columns,
      height: tileSize * 2,
      left: -(entry.tile % sheet.columns) * tileSize + (width - tileSize) / 2,
      top: -Math.floor(entry.tile / sheet.columns) * tileSize + (height - tileSize) / 2
    }} /> : <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      padding: 24
    }}>
        <Ionicons name="restaurant-outline" size={34} color={colors.primary} />
        <Text style={{
        color: colors.text,
        fontWeight: '700',
        textAlign: 'center'
      }}>{recipe.name}</Text>
      </View>}
  </View>;
}
