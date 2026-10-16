import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
 
import { ThemedText } from '@/components/themed-text';
import { CheckboxList } from '@/components/ui/checkbox-list';
import { ChoiceGroup } from '@/components/ui/choice-group';
import { PhotoPicker } from '@/components/ui/photo-picker';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { colors, MaxContentWidth, size } from '@/constants/theme';
import { maskDate, maskWeight } from '@/utils/masks';

export default function CadastroUsuarioScreen() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [qtdPets, setQtdPets] = useState('');

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                        <ThemedText type="stage" style={styles.stage}>
                                    PASSO 1 DE 2
                                  </ThemedText>
                        <ThemedText type="title" style={styles.title}>
                            Cadastro do tutor
                        </ThemedText>
                        <ThemedText type="subtitle" style={styles.subtitle}>
                            Conte um pouco sobre você.
                        </ThemedText>
                        <TextField
                            label="Nome completo"
                            value={nome}
                            placeholder="Digite seu nome completo"
                            onChangeText={setNome}
                        />
                    </ScrollView>
                    <PrimaryButton title="Próximo" onPress={() => Alert.alert('Próximo', 'Ir para o próximo passo')} />

            </KeyboardAvoidingView>
        </SafeAreaView>
            )


}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    padding: size.xxl,
    paddingBottom: size.xxxl * 2,
  },
  stage: { marginTop: size.marginTopView },
  title: { marginBottom: size.xl },
  row: { flexDirection: 'row', gap: size.md },
  addLink: { marginTop: -size.sm, marginBottom: size.xl },
});