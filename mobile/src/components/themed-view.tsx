import { View, type ViewProps } from 'react-native';
 
import { Colors, type ThemeColor } from '@/constants/theme';
 
export type ThemedViewProps = ViewProps & {
  type?: ThemeColor;
};
 
// Corrigido: antes o backgroundColor era uma STRING ("theme[...]") e havia margin: 20 fixa.
export function ThemedView({ style, type = 'background', ...otherProps }: ThemedViewProps) {
  return <View style={[{ backgroundColor: Colors.light[type] }, style]} {...otherProps} />;
}