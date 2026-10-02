import { StyleSheet, Text, type TextProps } from 'react-native';

import { colors, fonts, size } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  type?:
    | 'default'
    | 'title'
    | 'small'
    | 'smallBold'
    | 'subtitle'
    | 'link'
    | 'linkPrimary'
    | 'code';

  themeColor?: keyof typeof colors;
};

export function ThemedText({
  style,
  type = 'default',
  themeColor = 'text',
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      style={[
        {
          color: colors[themeColor],
        },

        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && styles.linkPrimary,
        type === 'code' && styles.code,

        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: {
    fontSize: size.textSm,
    lineHeight: 20,
    fontWeight: fonts.regular,
  },

  smallBold: {
    fontSize: size.textSm,
    lineHeight: 20,
    fontWeight: fonts.bold,
  },

  default: {
    fontSize: size.textMd,
    lineHeight: 24,
    fontWeight: fonts.regular,
  },

  title: {
    fontSize: size.title,
    lineHeight: 32,
    fontWeight: fonts.semibold,
  },

  subtitle: {
    fontSize: size.textLg,
    lineHeight: 26,
    fontWeight: fonts.semibold,
  },

  link: {
    fontSize: size.textSm,
    lineHeight: 20,
    fontWeight: fonts.medium,
  },

  linkPrimary: {
    fontSize: size.textSm,
    lineHeight: 20,
    fontWeight: fonts.medium,
    color: colors.primary,
  },

  code: {
    fontFamily: 'monospace',
    fontSize: size.textXs,
    fontWeight: fonts.bold,
  },
});