import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import baseIngredients from '../data/ingredients.json';
import { emptyData, loadData, saveData } from '../services/storageService';
const Context = createContext(null);
export function KitchenProvider({
  children
}) {
  const [data, setData] = useState(emptyData);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const queue = useRef(Promise.resolve());
  const readFailed = useRef(false);
  useEffect(() => {
    loadData().then(setData).catch(() => {
      readFailed.current = true;
      setError('Could not read saved data. Retry will attempt to load it again; existing saved data has not been overwritten.');
    }).finally(() => setReady(true));
  }, []);
  const blocked = useRef(false);
  useEffect(() => {
    blocked.current = !!error;
  }, [error]);
  const persist = next => {
    queue.current = queue.current.then(() => saveData(next)).then(() => setError('')).catch(() => setError('Could not save your changes. Keep the app open and tap Retry.'));
  };
  const update = fn => setData(previous => fn(previous));
  const initial = useRef(true);
  useEffect(() => {
    if (!ready) return;
    if (initial.current) {
      initial.current = false;
      return;
    }
    if (!blocked.current) persist(data);
  }, [data, ready]);
  const toggle = (items, id) => items.includes(id) ? items.filter(x => x !== id) : [...items, id];
  const ingredients = [...baseIngredients, ...data.custom];
  const value = {
    data,
    ready,
    error,
    ingredients,
    update,
    retry: () => {
      if (readFailed.current) {
        loadData().then(saved => {
          readFailed.current = false;
          blocked.current = false;
          setError('');
          setData(saved);
        }).catch(() => Alert.alert('Storage unavailable', 'Saved data could not be loaded. Please restart the app or check device storage.'));
      } else {
        blocked.current = false;
        persist(data);
      }
    },
    toggleFavorite: id => update(d => ({
      ...d,
      favorites: toggle(d.favorites, id)
    })),
    toggleIngredient: id => update(d => ({
      ...d,
      kitchen: toggle(d.kitchen, id)
    })),
    view: id => update(d => ({
      ...d,
      recent: [id, ...d.recent.filter(x => x !== id)].slice(0, 8)
    })),
    addMissing: r => {
      const missing = r.ingredients.filter(i => !data.kitchen.includes(i.ingredientId));
      update(d => ({
        ...d,
        shopping: [...d.shopping, ...missing.filter(i => !d.shopping.some(s => s.id === `${r.id}:${i.ingredientId}`)).map(i => ({
          id: `${r.id}:${i.ingredientId}`,
          name: ingredients.find(x => x.id === i.ingredientId)?.name || i.ingredientId,
          quantity: `${i.quantity} · ${r.name}`,
          purchased: false
        }))]
      }));
      Alert.alert('Shopping list updated', missing.length ? 'Missing ingredients are in your shopping list. Repeated additions from the same recipe are kept once.' : 'You already have every ingredient.');
    }
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useKitchen() {
  const value = useContext(Context);
  if (!value) throw new Error('KitchenProvider is required');
  return value;
}
