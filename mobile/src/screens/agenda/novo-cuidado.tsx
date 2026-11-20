import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Chip } from '@/components/ui/chip';
import { FormField } from '@/components/ui/form-field';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { TextField } from '@/components/ui/text-field';
import { TipoCuidadoPicker } from '@/components/ui/tipo-cuidado-picker';
import { colors, MaxContentWidth, size } from '@/constants/theme';
import type { TipoCuidado } from '@/constants/tipos-cuidado';
import { cadastrarEvento, type NovoEvento } from '@/services/agenda';
import { listarAnimais, type Animal } from '@/services/animais';
import { ApiError } from '@/services/api';
import { dataBRparaISO, hojeISO, horaValida } from '@/utils/agenda';
import { maskDate, maskTime } from '@/utils/masks';

// Opções do "Avisar": o valor é o lembrete_dias_antes do backend
const OPCOES_LEMBRETE = [
  { label: 'No dia', dias: 0 },
  { label: '1 dia antes', dias: 1 },
  { label: '3 dias', dias: 3 },
  { label: '1 semana', dias: 7 },
];

// Exemplo de título diferente para cada tipo, para ajudar a tutora
const EXEMPLO_TITULO: Record<TipoCuidado, string> = {
  vacina: '',
  consulta: 'Ex.: Retorno da displasia',
  exame: 'Ex.: Hemograma',
  banho_tosa: 'Ex.: Banho mensal',
  outro: 'Ex.: Trocar a caminha',
};

/** Pega a primeira mensagem de erro que o Django REST devolve. */
function mensagemDaApi(dados: unknown): string {
  if (typeof dados === 'string') return dados;
  if (dados && typeof dados === 'object') {
    const primeiro = Object.values(dados)[0];
    if (Array.isArray(primeiro) && primeiro.length) return String(primeiro[0]);
    if (typeof primeiro === 'string') return primeiro;
  }
  return 'Confira os dados e tente de novo.';
}

export default function NovoCuidadoScreen() {
  // Se a Agenda estava filtrando um pet, ele já vem escolhido
  const { animalId } = useLocalSearchParams<{ animalId?: string }>();

  const [animais, setAnimais] = useState<Animal[]>([]);
  const [salvando, setSalvando] = useState(false);

  // ----- Campos do formulário -----
  const [tipo, setTipo] = useState<TipoCuidado | null>(null);
  const [pet, setPet] = useState<number | null>(animalId ? Number(animalId) : null);
  const [titulo, setTitulo] = useState('');
  const [data, setData] = useState(''); // 'dd/mm/aaaa'
  const [hora, setHora] = useState(''); // 'hh:mm'
  const [profissional, setProfissional] = useState('');
  const [local, setLocal] = useState('');
  const [lembrete, setLembrete] = useState(1);
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    let ativo = true; // evita atualizar a tela se ela já foi fechada
    listarAnimais()
      .then((lista) => {
        if (!ativo) return;
        setAnimais(lista);
        // Só um pet? Já deixa ele escolhido
        if (lista.length === 1) setPet(lista[0].id);
      })
      .catch((erro) => {
        console.log('Erro ao carregar pets:', erro);
        Alert.alert('Erro', 'Não foi possível carregar seus pets.');
      });
    return () => {
      ativo = false;
    };
  }, []);

  const ehVacina = tipo === 'vacina';

  // Vacina tem doses e reforço, então usa a tela própria de vacina
  function continuarParaVacina() {
    if (!pet) {
      Alert.alert('Escolha o pet', 'Para qual pet é a vacina?');
      return;
    }
    router.push({ pathname: '/cadastro-vacina', params: { animalId: String(pet) } });
  }

  async function salvar() {
    // ----- 1. Conferir os campos -----
    if (!tipo) {
      Alert.alert('Escolha o tipo', 'Que tipo de cuidado você quer agendar?');
      return;
    }
    // Vacina não salva por aqui (ver continuarParaVacina). Esta linha também
    // faz o TypeScript entender que, daqui pra baixo, tipo nunca é 'vacina'.
    if (tipo === 'vacina') return;
    if (!pet) {
      Alert.alert('Escolha o pet', 'Para qual pet é esse cuidado?');
      return;
    }
    if (!titulo.trim()) {
      Alert.alert('Falta o título', 'Dê um nome para o cuidado. Ex.: "Retorno da displasia".');
      return;
    }
    const dataISO = dataBRparaISO(data);
    if (!dataISO) {
      Alert.alert('Data inválida', 'Informe uma data que existe, no formato dd/mm/aaaa.');
      return;
    }
    if (hora && !horaValida(hora)) {
      Alert.alert('Hora inválida', 'Use o formato hh:mm, ex.: 14:30. Ou deixe em branco.');
      return;
    }

    const evento: NovoEvento = {
      animal: pet,
      tipo,
      titulo: titulo.trim(),
      data: dataISO,
      hora: hora || null,
      profissional: profissional.trim(),
      local: local.trim(),
      observacoes: observacoes.trim(),
      lembrete_dias_antes: lembrete,
    };

    // ----- 2. Data no passado? Pergunta se já aconteceu -----
    // Sem isso, um cuidado antigo entraria na agenda como "atrasado".
    if (dataISO < hojeISO()) {
      Alert.alert('Essa data já passou', 'Esse cuidado já aconteceu?', [
        { text: 'Corrigir a data', style: 'cancel' },
        { text: 'Sim, já aconteceu', onPress: () => enviar({ ...evento, status: 'realizado' }) },
      ]);
      return;
    }

    await enviar(evento);
  }

  // ----- 3. Mandar para a API -----
  async function enviar(evento: NovoEvento) {
    try {
      setSalvando(true);
      await cadastrarEvento(evento);
      // Volta para a Agenda; ela recarrega sozinha (useFocusEffect)
      router.back();
    } catch (erro) {
      console.log('Erro ao cadastrar cuidado:', erro);
      if (erro instanceof ApiError) {
        Alert.alert('Não foi possível salvar', mensagemDaApi(erro.data));
      } else {
        Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
      }
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <ScreenHeader titulo="Novo cuidado" onVoltar={() => router.back()} />
          </View>

          <TipoCuidadoPicker valor={tipo} onChange={setTipo} />

          <FormField label="Para qual pet?">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              {animais.map((animal) => (
                <Chip
                  key={animal.id}
                  label={animal.nome}
                  variante="suave"
                  selecionado={pet === animal.id}
                  onPress={() => setPet(animal.id)}
                />
              ))}
            </ScrollView>
          </FormField>

          {ehVacina ? (
            // ----- Vacina: só avisa e leva para a tela de vacina -----
            <>
              <View style={styles.aviso}>
                <Ionicons name="information-circle-outline" size={20} color={colors.primaryDark} />
                <ThemedText type="small" style={styles.avisoTexto}>
                  Vacinas têm doses e reforço, então são cadastradas na tela de vacina.
                </ThemedText>
              </View>
              <PrimaryButton title="Continuar para a vacina" onPress={continuarParaVacina} />
            </>
          ) : (
            // ----- Consulta, exame, banho e tosa, outro -----
            <>
              <TextField
                label="Título"
                value={titulo}
                onChangeText={setTitulo}
                placeholder={tipo ? EXEMPLO_TITULO[tipo] : 'Ex.: Retorno da displasia'}
                maxLength={100}
              />

              <View style={styles.linha}>
                <TextField
                  label="Data"
                  value={data}
                  onChangeText={(texto) => setData(maskDate(texto))}
                  placeholder="dd/mm/aaaa"
                  keyboardType="number-pad"
                  maxLength={10}
                  flex
                />
                <TextField
                  label="Hora"
                  optional
                  value={hora}
                  onChangeText={(texto) => setHora(maskTime(texto))}
                  placeholder="hh:mm"
                  keyboardType="number-pad"
                  maxLength={5}
                  flex
                />
              </View>

              <TextField
                label="Profissional"
                optional
                value={profissional}
                onChangeText={setProfissional}
                placeholder="Ex.: Dra. Ana"
                maxLength={100}
              />
              <TextField
                label="Local"
                optional
                value={local}
                onChangeText={setLocal}
                placeholder="Ex.: clínica, pet shop"
                maxLength={150}
              />

              <FormField label="Avisar">
                <View style={styles.chipsQuebra}>
                  {OPCOES_LEMBRETE.map((opcao) => (
                    <Chip
                      key={opcao.dias}
                      label={opcao.label}
                      variante="suave"
                      selecionado={lembrete === opcao.dias}
                      onPress={() => setLembrete(opcao.dias)}
                    />
                  ))}
                </View>
              </FormField>

              <TextField
                label="Observações"
                optional
                value={observacoes}
                onChangeText={setObservacoes}
                placeholder="Ex.: levar os exames anteriores"
                multiline
              />

              <PrimaryButton
                title={salvando ? 'Salvando...' : 'Salvar cuidado'}
                onPress={salvar}
                disabled={salvando}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    padding: size.xl,
    paddingBottom: size.xxxl,
  },
  header: { marginBottom: size.xl, marginLeft: -size.md },
  chips: { gap: size.sm },
  chipsQuebra: { flexDirection: 'row', flexWrap: 'wrap', gap: size.sm },
  linha: { flexDirection: 'row', gap: size.md },
  aviso: {
    flexDirection: 'row',
    gap: size.sm,
    padding: size.md,
    marginBottom: size.xl,
    borderRadius: size.radiusMd,
    backgroundColor: colors.backgroundSelected,
  },
  avisoTexto: { flex: 1, color: colors.primaryDark },
});