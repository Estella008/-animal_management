import { Pressable, Text, StyleSheet } from 'react-native';
import { Colors, colors, fonts, size } from '@/constants/theme';

type ButtonProps = {
  title: string;
  onPress: () => void;
};

export function Button({ title, onPress }: ButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: size.buttonHeight,
    backgroundColor: colors.primary,
    borderRadius: size.radiusSm,
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    color: colors.white,
    fontFamily: fonts.bold,
  },
});