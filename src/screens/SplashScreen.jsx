import React from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, styles as s } from '../theme';
import { Illustration } from '../components/UI';
export default function SplashScreen() {
  return <View style={[s.page, {
    justifyContent: 'center',
    padding: 32,
    gap: 24
  }]}><View style={{
      width: '100%',
      maxWidth: 440,
      alignSelf: 'center',
      gap: 24
    }}><Illustration category="Lunch" large /><View style={{
        alignSelf: 'center',
        backgroundColor: colors.light,
        padding: 14,
        borderRadius: 22
      }}><Ionicons name="restaurant" size={30} color={colors.primary} /></View><Text style={[s.title, {
        textAlign: 'center',
        fontSize: 38,
        lineHeight: 44
      }]}>What's in{'\n'}my Kitchen<Text style={{
          color: colors.primary
        }}>?</Text></Text><Text style={[s.subtitle, {
        textAlign: 'center'
      }]}>A little inspiration. A lot of delicious possibilities.</Text><ActivityIndicator color={colors.primary} /><Text style={[s.eyebrow, {
        textAlign: 'center'
      }]}>LESS WASTE. MORE TASTE.</Text></View></View>;
}
