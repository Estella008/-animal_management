
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { colors, MaxContentWidth, size } from '@/constants/theme';
import { api, ApiError } from '@/services/api';

export default function CadastroUsuarioScreen() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [carregando, setCarregando] = useState(false);

    const handleCadastro = async () => {
        if (
            !nome.trim() ||
            !email.trim() ||
            !senha ||
            !confirmarSenha
        ) {
            Alert.alert('Atenção', 'Preencha todos os campos.');
            return;
        }

        const emailNormalizado = email.trim().toLowerCase();
        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            emailNormalizado
        );

        if (!emailValido) {
            Alert.alert('E-mail inválido', 'Digite um endereço de e-mail válido.');
            return;
        }

        if (senha !== confirmarSenha) {
            Alert.alert('Senhas diferentes', 'Confira se as duas senhas são iguais.');
            return;
        }

        setCarregando(true);

        try {
            await api.post('/usuarios/cadastro/', {
                nome: nome.trim(),
                email: emailNormalizado,
                senha,
            });

            Alert.alert(
                'Cadastro realizado!',
                'Sua conta foi criada com sucesso.',
                [
                    {
                        text: 'Continuar',
                        onPress: () => {
                            setNome('');
                            setEmail('');
                            setSenha('');
                            setConfirmarSenha('');
                        },
                    },
                ]
            );
        } catch (error) {
            if (error instanceof ApiError) {
                const data = error.data as
                    | Record<string, unknown>
                    | null;

                if (error.status === 400 && data) {
                    if (data.email) {
                        Alert.alert(
                            'E-mail indisponível',
                            'Este e-mail já está cadastrado ou é inválido.'
                        );
                        return;
                    }

                    if (data.senha) {
                        const mensagens = Array.isArray(data.senha)
                            ? data.senha.join('\n')
                            : String(data.senha);

                        Alert.alert('Senha inválida', mensagens);
                        return;
                    }

                    const mensagens = Object.entries(data)
                        .map(([campo, mensagem]) => {
                            const texto = Array.isArray(mensagem)
                                ? mensagem.join(', ')
                                : String(mensagem);

                            return `${campo}: ${texto}`;
                        })
                        .join('\n');

                    Alert.alert(
                        'Não foi possível cadastrar',
                        mensagens || 'Confira os dados informados.'
                    );
                    return;
                }

                Alert.alert(
                    'Erro no cadastro',
                    `O servidor retornou o erro ${error.status}.`
                );
            } else {
                Alert.alert(
                    'Erro de conexão',
                    'Não foi possível acessar o servidor. Verifique sua conexão e tente novamente.'
                );
            }

            console.error('Erro ao cadastrar tutor:', error);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                style={styles.keyboard}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <ThemedText type="default" style={styles.eyebrow}>
                                HELPPET · SUA CONTA
                            </ThemedText>

                            <ThemedText type="title" style={styles.title}>
                                Cadastro do tutor
                            </ThemedText>

                            <ThemedText
                                type="default"
                                style={styles.description}
                            >
                                Crie sua conta para fazer parte da nossa
                                comunidade e cuidar de quem torna sua vida
                                mais especial.
                            </ThemedText>
                        </View>

                        <View style={styles.form}>
                            <ThemedText
                                type="default"
                                style={styles.sectionTitle}
                            >
                                Seus dados
                            </ThemedText>

                            <View style={styles.field}>
                                <TextField
                                    label="Nome completo"
                                    value={nome}
                                    placeholder="Como podemos te chamar?"
                                    onChangeText={setNome}
                                />
                            </View>

                            <View style={styles.field}>
                                <TextField
                                    label="E-mail"
                                    value={email}
                                    placeholder="seuemail@exemplo.com"
                                    onChangeText={setEmail}
                                />
                            </View>

                            <View style={styles.field}>
                            <TextField
                                label="Senha"
                                value={senha}
                                placeholder="Crie uma senha segura"
                                onChangeText={setSenha}
                                secureTextEntry
                            />

                            <View style={styles.passwordRequirements}>
                                <ThemedText type="default" style={styles.requirement}>
                                    {senha.length >= 8 ? '✓' : '•'} Pelo menos 8 caracteres
                                </ThemedText>

                                <ThemedText type="default" style={styles.requirement}>
                                    {/^\d+$/.test(senha) && senha.length > 0 ? '✗' : '•'} Não pode conter apenas números
                                </ThemedText>

                                <ThemedText type="default" style={styles.requirement}>
                                    {senha.length > 0 &&
                                    !['12345678', 'password', 'password123', 'qwerty123', 'senha123', 'abc12345'].includes(senha.toLowerCase())
                                        ? '✓'
                                        : '•'} Evite senhas muito comuns
                                </ThemedText>
                            </View>
                        </View>

                            <View style={styles.field}>
                                <TextField
                                    label="Confirme sua senha"
                                    value={confirmarSenha}
                                    placeholder="Digite a senha novamente"
                                    onChangeText={setConfirmarSenha}
                                    secureTextEntry
                                />
                            </View>

                            <ThemedText
                                type="default"
                                style={styles.helper}
                            >
                                Use uma senha segura e guarde-a em um local
                                protegido.
                            </ThemedText>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <PrimaryButton
                        title={carregando ? 'Cadastrando...' : 'Criar minha conta'}
                        onPress={handleCadastro}
                        disabled={carregando}
                    />

                    <ThemedText
                        type="default"
                        style={styles.footerNote}
                    >
                        Ao criar sua conta, seus dados serão enviados
                        com segurança para o HelpPet.
                    </ThemedText>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: colors.background,
    },
    keyboard: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: size.xl,
    },
    container: {
        width: '100%',
        maxWidth: MaxContentWidth,
        alignSelf: 'center',
        paddingHorizontal: size.xxl,
        paddingTop: size.xxl,
    },
    header: {
        marginBottom: size.xxl,
    },
    eyebrow: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1.2,
        marginBottom: size.md,
    },
    title: {
        fontSize: 28,
        lineHeight: 35,
        marginBottom: size.md,
    },
    description: {
        fontSize: 15,
        lineHeight: 23,
        opacity: 0.8,
    },
    form: {
        marginBottom: size.xl,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: size.lg,
    },
    field: {
        marginBottom: size.lg,
    },
    helper: {
        fontSize: 12,
        lineHeight: 18,
        opacity: 0.7,
        marginTop: size.xs,
    },
    footer: {
        width: '100%',
        maxWidth: MaxContentWidth,
        alignSelf: 'center',
        paddingHorizontal: size.xxl,
        paddingTop: size.md,
        paddingBottom: size.lg,
    },
    footerNote: {
        fontSize: 11,
        lineHeight: 16,
        textAlign: 'center',
        opacity: 0.65,
        marginTop: size.md,
    },
    passwordRequirements: {
    marginTop: size.sm,
    paddingLeft: size.xs,
        gap: size.xs,
    },
    requirement: {
        fontSize: 12,
        lineHeight: 18,
        opacity: 0.75,
    },
});
