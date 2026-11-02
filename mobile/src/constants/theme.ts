import '@/global.css';

const lightColors = {
  primary: '#087F70',
  primaryDark: '#06695E',
  background: '#F7F7F3',
  backgroundElement: '#FFFFFF',
  backgroundSelected: '#E7F1EF',
  surface: '#FFFFFF',
  text: '#202A2A',
  textSecondary: '#6E7372',
  placeholder: '#9B9F9E',
  border: '#D8D9D5',
  borderStrong: '#C9CCC8',
  divider: '#E7E7E3',
  white: '#FFFFFF',
  black: '#000000',
  danger: '#C74747',
  dangerBackground: '#FBE6E1',
  dangerBorder: '#F3CDC5',
};

const darkColors = {
  primary: '#50C8B4',
  primaryDark: '#32A995',
  background: '#171C1B',
  backgroundElement: '#222A28',
  backgroundSelected: '#2A3A36',
  surface: '#222A28',
  text: '#F1F5F3',
  textSecondary: '#A8B2AE',
  placeholder: '#899590',
  border: '#3A4541',
  borderStrong: '#4C5954',
  divider: '#303A36',
  white: '#FFFFFF',
  black: '#000000',
  danger: '#F07474',
  dangerBackground: '#3A2422',
  dangerBorder: '#5A3531',
};

export const Colors = {
  light: lightColors,
  dark: darkColors,
};

export const colors = Colors.light;
export type ThemeColor = keyof typeof lightColors;

export const fonts = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
 
} as const;

export const size = {
  textXs: 12,
  textSm: 14,
  textMd: 15,
  textLg: 18,
  title: 26,
  stage: 20,
  

  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,

  inputHeight: 48,
  inputPaddingHorizontal: 16,
  inputPaddingVertical: 12,

  buttonHeight: 48,
  choiceHeight: 40,

  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 14,
  radiusXl: 18,
  radiusPill: 999,

  avatar: 48,
  petThumb: 52,

  marginTopView: 20,
  
};

export const Spacing = {
  half: size.xs / 2,
  one: size.xs,
  two: size.sm,
  three: size.md,
  four: size.lg,
  five: size.xl,
  six: size.xxl,
};

export const MaxContentWidth = 512;
export const BottomTabInset = 49;