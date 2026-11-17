import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { colors, MaxContentWidth, size } from '@/constants/theme';
import { api, ApiError } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

type LoginResponse = {
  access: string;
  refresh: string;
};
export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [carregando, setCarregando] = useState(false);
    const router = useRouter();
    const { entrar } = useAuth();

    
   type LoginResponse = {
    access: string;
    refresh: string;
};;

    
const handleLogin = async () => {
    if (!email.trim() || !senha) {
        Alert.alert('Atenção', 'Preencha todos os campos.');
        return;
    }

    const postData = {
        email: email.trim().toLowerCase(),
        password: senha,
    };

    try {
        setCarregando(true);

        const response = await api.post<LoginResponse>(
            '/usuarios/login/',
            postData
        );

        await entrar(response.access);
        

    } catch (erro) {
        console.error('Erro ao fazer login:', erro);
        if (erro instanceof ApiError && (erro.status === 400 || erro.status === 401)) {
            Alert.alert('Erro', 'E-mail ou senha incorretos ou conta inativa.');
        } else {
            Alert.alert('Erro', 'Não foi possível conectar. Verifique sua internet.');
        }
    } finally {
        setCarregando(false);
    }
};

    const handleForgotPassword = () => {
        Alert.alert('Esqueci minha senha', 'Funcionalidade ainda não implementada.');
    }
    const handleRegister = () => {
        router.push('/usuario/cadastro-usuario');
    }
    

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
                                HELPET · SUA CONTA
                            </ThemedText>

                            <ThemedText type="title" style={styles.title}>
                                Login
                            </ThemedText>

                            <ThemedText type="default" style={styles.description}>
                                Entre na sua conta para cuidar de quem torna
                                sua vida mais especial.
                            </ThemedText>
                        </View>

                        <View style={styles.form}>
                            <ThemedText type="default" style={styles.sectionTitle}>
                                Seus dados
                            </ThemedText>

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
                                    placeholder="Digite sua senha"
                                    onChangeText={setSenha}
                                    secureTextEntry
                                />
                            </View>
                            <Pressable onPress={handleForgotPassword} hitSlop={8}>
                                <ThemedText type="default" style={styles.link}>
                                    Esqueci minha senha
                                </ThemedText>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <PrimaryButton
        title={carregando ? 'Entrando...' : 'Entrar'}
        onPress={handleLogin}
        disabled={carregando}
    />

    <View style={styles.registerRow}>
        <ThemedText type="default" style={styles.registerText}>
            Ainda não tem conta?
        </ThemedText>
        <Pressable onPress={handleRegister} hitSlop={8}>
            <ThemedText type="default" style={[styles.registerText, styles.link]}>
                Cadastrar-se
            </ThemedText>
        </Pressable>
    </View>

    <ThemedText type="default" style={styles.footerNote}>
        Seus dados são enviados com segurança para o Helpet.
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
    link: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary, // troque pela cor de destaque do seu theme
    },
    registerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: size.xs, // se não existir no seu theme, use 4
        marginTop: size.lg,
    },
    registerText: {
        fontSize: 14,
    },
}); 