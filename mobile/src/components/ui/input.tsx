import { Pressable, Text, StyleSheet } from 'react-native';
import { Colors, colors, fonts, size } from '@/constants/theme';

type InputProps = {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
};

export function Input({ placeholder, value, onChangeText }: InputProps) {
    return (
        <Pressable style={styles.inputContainer}>
            <Text style={styles.placeholder}>{placeholder}</Text>
            <Text style={styles.value}>{value}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        height: size.inputHeight,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: size.radiusSm,
        paddingHorizontal: size.inputPaddingHorizontal,
        paddingVertical: size.inputPaddingVertical,
        justifyContent: 'center',
    },
    placeholder: {
        color: colors.placeholder,
        fontFamily: fonts.regular,
    },
    value: {
        color: colors.text,
        fontFamily: fonts.regular,
    },
});