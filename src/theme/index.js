import { StyleSheet } from 'react-native';
export const colors = {
  primary: '#C94B32',
  light: '#FBE8DD',
  background: '#FFFAF4',
  text: '#302821',
  muted: '#786B60',
  accent: '#F4BB51',
  error: '#B23C38',
  white: '#FFFFFF',
  green: '#33755B',
  mint: '#E0F0DE',
  border: '#F0E6DC'
};
export const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    padding: 22,
    paddingBottom: 38,
    gap: 18,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -1.1,
    lineHeight: 39
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 23
  },
  heading: {
    fontSize: 21,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 15,
    fontSize: 16,
    color: colors.text
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text
  },
  small: {
    fontSize: 12,
    color: colors.muted,
    lineHeight: 18
  },
  hero: {
    backgroundColor: colors.light,
    borderRadius: 28,
    padding: 24,
    gap: 14
  },
  divider: {
    height: 1,
    backgroundColor: colors.border
  },
  eyebrow: {
    color: colors.primary,
    fontWeight: '800',
    letterSpacing: 2,
    fontSize: 10
  }
});
