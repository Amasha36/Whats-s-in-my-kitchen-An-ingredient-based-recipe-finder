import AsyncStorage from '@react-native-async-storage/async-storage';
const KEY = '@kitchen/v1';
export const emptyData = {
  kitchen: [],
  favorites: [],
  recent: [],
  custom: [],
  shopping: []
};
export async function loadData() {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return emptyData;
  const value = JSON.parse(raw);
  if (!value || !['kitchen', 'favorites', 'recent'].every(k => Array.isArray(value[k]) && value[k].every(x => typeof x === 'string')) || !Array.isArray(value.custom) || !value.custom.every(x => x && typeof x.id === 'string' && typeof x.name === 'string' && typeof x.category === 'string') || !Array.isArray(value.shopping) || !value.shopping.every(x => x && typeof x.id === 'string' && typeof x.name === 'string' && typeof x.quantity === 'string' && typeof x.purchased === 'boolean')) throw new Error('Saved data is invalid.');
  return value;
}
export const saveData = data => AsyncStorage.setItem(KEY, JSON.stringify(data));
