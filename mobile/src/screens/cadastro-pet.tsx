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
import { api, ApiError } from '@/services/api';
 
type Especie = 'cachorro' | 'gato';
type Sexo = 'macho' | 'femea';
type Sim = 'sim' | 'nao';
type Porte = 'pequeno' | 'medio' | 'grande';
 
// Lista de vacinas muda conforme a espécie
const VACINAS: Record<Especie, string[]> = {
  cachorro: ['V10 / V8', 'Antirrábica', 'Gripe canina'],
  gato: ['V3 / V4 / V5', 'Antirrábica', 'Leucemia felina (FeLV)'],
};
 
export default function CadastroPetScreen() {
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState<Especie>('cachorro');
  const [nascimento, setNascimento] = useState('');
  const [sexo, setSexo] = useState<Sexo | null>(null);
  const [castrado, setCastrado] = useState<Sim | null>(null);
  const [porte, setPorte] = useState<Porte | null>(null);
  const [peso, setPeso] = useState('');
  const [vacinas, setVacinas] = useState<string[]>([]);
  const [extras, setExtras] = useState<string[]>([]);
  const [novaVacina, setNovaVacina] = useState<string | null>(null); // null = campo fechado
  const [observacoes, setObservacoes] = useState('');
 
  function trocarEspecie(e: Especie) {
    setEspecie(e);
    setVacinas([]); // as vacinas de um cachorro não servem para um gato
    setExtras([]);
  }
 
  function alternarVacina(v: string) {
    setVacinas((atual) => (atual.includes(v) ? atual.filter((x) => x !== v) : [...atual, v]));
  }
 
  function adicionarVacina() {
    const v = (novaVacina ?? '').trim();
    if (v && ![...VACINAS[especie], ...extras].includes(v)) {
      setExtras((atual) => [...atual, v]);
      setVacinas((atual) => [...atual, v]);
    }
    setNovaVacina(null);
  }
 
  
async function salvar() {
  if (!nome.trim()) {
    Alert.alert('Falta o nome', 'Informe o nome do animal.');
    return;
  }

  if (!sexo || !porte || castrado === null) {
    Alert.alert('Campos obrigatórios', 'Preencha sexo, porte e castrado.');
    return;
  }

  let dataNascimento = null;

  if (nascimento) {
    const partes = nascimento.split('/');

    if (partes.length !== 3) {
      Alert.alert('Data inválida', 'Informe a data no formato dd/mm/aaaa.');
      return;
    }

    const [dia, mes, ano] = partes;
    dataNascimento = `${ano}-${mes}-${dia}`;
  }

  const pet = {
    nome: nome.trim(),
    especie,
    data_nascimento: dataNascimento,
    sexo,
    castrado: castrado === 'sim',
    porte,
    peso: peso ? Number(peso.replace(',', '.')) : null,
    observacoes,
  };

  
  try {
    await api.post('/animais/cadastrar/', pet);

    Alert.alert(
      'Sucesso!',
      `${pet.nome} foi cadastrado no banco de dados!`
    );
  } catch (erro) {
    console.log('Erro ao cadastrar animal:', erro);

    if (erro instanceof ApiError) {
      console.log('Detalhes da API:', erro.data);

      Alert.alert(
        'Erro ao cadastrar',
        typeof erro.data === 'string'
          ? erro.data
          : JSON.stringify(erro.data)
      );
    } else {
      Alert.alert(
        'Erro',
        'Não foi possível conectar ao servidor.'
      );
    }
  }


 
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ThemedText type="stage" style={styles.stage}>
            PASSO 2 DE 2
          </ThemedText>
          <ThemedText type="title" style={styles.title}>
            Cadastro do pet
          </ThemedText>
 
          <PhotoPicker onPress={() => Alert.alert('Em breve', 'Seleção de foto será a próxima etapa.')} />
 
          <TextField label="Nome do animal" placeholder="Ex.: Thor" value={nome} onChangeText={setNome} />
 
          <View style={styles.row}>
            <ChoiceGroup
              flex
              label="Espécie"
              value={especie}
              onChange={trocarEspecie}
              options={[
                { label: 'Cachorro', value: 'cachorro' },
                { label: 'Gato', value: 'gato' },
              ]}
            />
          </View>
 
          <TextField
            label="Nascimento"
            placeholder="dd/mm/aaaa"
            keyboardType="number-pad"
            value={nascimento}
            onChangeText={(t) => setNascimento(maskDate(t))}
          />
 
          <View style={styles.row}>
            <ChoiceGroup
              flex
              label="Sexo"
              value={sexo}
              onChange={setSexo}
              options={[
                { label: 'Macho', value: 'macho' },
                { label: 'Fêmea', value: 'femea' },
              ]}
            />
            <ChoiceGroup
              flex
              label="Castrado?"
              value={castrado}
              onChange={setCastrado}
              options={[
                { label: 'Sim', value: 'sim' },
                { label: 'Não', value: 'nao' },
              ]}
            />
          </View>
 
          <ChoiceGroup
            label="Porte"
            value={porte}
            onChange={setPorte}
            options={[
              { label: 'Pequeno', value: 'pequeno' },
              { label: 'Médio', value: 'medio' },
              { label: 'Grande', value: 'grande' },
            ]}
          />
 
          <TextField
            label="Peso"
            optional
            suffix="kg"
            placeholder="0,0"
            keyboardType="decimal-pad"
            value={peso}
            onChangeText={(t) => setPeso(maskWeight(t))}
          />
 
          <CheckboxList
            label="Vacinas"
            items={[...VACINAS[especie], ...extras]}
            selected={vacinas}
            onToggle={alternarVacina}
          />
 
          {novaVacina === null ? (
            <Pressable onPress={() => setNovaVacina('')} style={styles.addLink}>
              <ThemedText type="linkPrimary">+ Adicionar outra vacina</ThemedText>
            </Pressable>
          ) : (
            <TextField
              label="Nome da vacina"
              placeholder="Ex.: Giárdia"
              autoFocus
              value={novaVacina}
              onChangeText={setNovaVacina}
              onSubmitEditing={adicionarVacina}
              onBlur={adicionarVacina}
              returnKeyType="done"
            />
          )}
 
          <TextField
            label="Observações"
            multiline
            placeholder="Alergias, medicamentos, comportamento..."
            value={observacoes}
            onChangeText={setObservacoes}
          />
 
          <PrimaryButton title="Salvar pet" onPress={salvar} />
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
    padding: size.xxl,
    paddingBottom: size.xxxl * 2,
  },
  stage: { marginTop: size.marginTopView },
  title: { marginBottom: size.xl },
  row: { flexDirection: 'row', gap: size.md },
  addLink: { marginTop: -size.sm, marginBottom: size.xl },
});
}