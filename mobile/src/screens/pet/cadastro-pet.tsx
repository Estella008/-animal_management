import { useCallback, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import { ThemedText } from '@/components/themed-text';
import { ChoiceGroup } from '@/components/ui/choice-group';
import { PhotoPicker } from '@/components/ui/photo-picker';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SelectOpcao } from '@/components/ui/select-opcao';
import { TextField } from '@/components/ui/text-field';
import { colors, MaxContentWidth, size } from '@/constants/theme';
import { maskDate, maskWeight } from '@/utils/masks';
import { api, ApiError } from '@/services/api';
import { File } from 'expo-file-system';
import { buscarAnimal, atualizarAnimal } from '@/services/animais';

type Especie = 'cachorro' | 'gato';
type Sexo = 'macho' | 'femea';
type Sim = 'sim' | 'nao';
type Porte = 'pequeno' | 'medio' | 'grande';

export default function CadastroPetScreen() {
  const { editarId } = useLocalSearchParams<{ editarId?: string }>();
  const idEdicao = editarId ? Number(editarId) : null;
  const [nome, setNome] = useState('');
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [fotoSelecionada, setFotoSelecionada] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [especie, setEspecie] = useState<Especie>('cachorro');
  const [raca, setRaca] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [sexo, setSexo] = useState<Sexo | null>(null);
  const [castrado, setCastrado] = useState<Sim | null>(null);
  const [porte, setPorte] = useState<Porte | null>(null);
  const [peso, setPeso] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Guarda o id do pet depois de salvo. Só com ele dá para cadastrar vacinas,
  // porque cada vacina no banco "aponta" para um pet (chave estrangeira).
  const [petId, setPetId] = useState<number | null>(null);


  useFocusEffect(
    useCallback(() => {
      // Na edição, não limpar os campos
      if (idEdicao !== null) return;

      // No cadastro de um novo pet, começar com tudo limpo
      setNome('');
      setFotoUri(null);
      setFotoSelecionada(null);
      setEspecie('cachorro');
      setRaca('');
      setNascimento('');
      setSexo(null);
      setCastrado(null);
      setPorte(null);
      setPeso('');
      setObservacoes('');
      setPetId(null);
      setSalvando(false);
    }, [idEdicao])
  );



  useFocusEffect(
    useCallback(() => {
      if (idEdicao === null) return;

      let ativo = true;

      buscarAnimal(idEdicao)
        .then((animal) => {
          if (!ativo) return;

          setNome(animal.nome);
          setFotoUri(animal.foto);
          setFotoSelecionada(null);
          setEspecie(animal.especie);
          setRaca(animal.raca ?? '');
          setNascimento(
            animal.data_nascimento
              ? animal.data_nascimento.split('-').reverse().join('/')
              : ''
          );
          setSexo(animal.sexo);
          setCastrado(animal.castrado ? 'sim' : 'nao');
          setPorte(animal.porte);
          setPeso(
            animal.peso != null
              ? String(animal.peso).replace('.', ',')
              : ''
          );
          setObservacoes(animal.observacoes ?? '');
          setPetId(null);
        })
        .catch((erro) => {
          if (ativo) {
            console.log('Erro ao buscar pet:', erro);
            Alert.alert('Erro', 'Não foi possível carregar os dados do pet.');
          }
        });

      return () => {
        ativo = false;
      };
    }, [idEdicao])
  );

  function trocarEspecie(e: Especie) {
    setEspecie(e);
    setRaca(''); // a raça de um cachorro não serve para um gato
  }

  async function escolherFoto() {
    try {
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!resultado.canceled && resultado.assets.length > 0) {
        const imagem = resultado.assets[0];
        setFotoUri(imagem.uri);
        setFotoSelecionada(imagem);
      }
    } catch (erro) {
      console.log('Erro ao selecionar foto:', erro);
      Alert.alert('Erro', 'Não foi possível selecionar a foto.');
    }
  }

  function anexarFoto(formData: FormData): boolean {
    if (!fotoSelecionada) return true;

    if (Platform.OS === 'web') {
      // No navegador, o ImagePicker já entrega um arquivo "de verdade".
      if (!fotoSelecionada.file) {
        Alert.alert('Erro', 'Não foi possível preparar a foto.');
        return false;
      }
      formData.append('foto', fotoSelecionada.file);
      return true;
    }

    // No celular (Android/iOS), o FormData do React Native espera um objeto

    const tipo = fotoSelecionada.mimeType ?? 'image/jpeg';
    const extensao = tipo.split('/')[1] ?? 'jpg';
    const nomeArquivo = fotoSelecionada.fileName ?? `pet-${Date.now()}.${extensao}`;

    const arquivo = new File(fotoSelecionada.uri);
    formData.append('foto', arquivo, nomeArquivo);
    return true;
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

    let dataNascimento: string | null = null;
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
      raca: raca.trim(),
      data_nascimento: dataNascimento,
      sexo,
      castrado: castrado === 'sim',
      porte,
      peso: peso ? Number(peso.replace(',', '.')) : null,
      observacoes,
    };

    const formData = new FormData();
    Object.entries(pet).forEach(([campo, valor]) => {
      if (valor !== null && valor !== undefined && valor !== '') {
        formData.append(campo, String(valor));
      }
    });

    if (!anexarFoto(formData)) return;

    try {
      setSalvando(true);
      if (idEdicao !== null) {
        // Edição: atualiza o pet existente
        await atualizarAnimal(idEdicao, formData);

        Alert.alert('Sucesso!', 'Dados do pet atualizados!');

        router.replace({
          pathname: '/pet/[id]',
          params: { id: String(idEdicao) },
        });
      } else {
        // Cadastro: cria um novo pet
        const criado: any = await api.postForm('/animais/cadastrar/', formData);
        setPetId(criado?.id ?? null);

        Alert.alert(
          'Sucesso!',
          `${pet.nome} foi cadastrado. Agora você pode cadastrar as vacinas.`
        );
      }

    } catch (erro) {
      console.log('Erro ao cadastrar animal:', erro);
      if (erro instanceof ApiError) {
        console.log('Detalhes da API:', erro.data);
        Alert.alert(
          'Erro ao cadastrar',
          typeof erro.data === 'string' ? erro.data : JSON.stringify(erro.data)
        );
      } else {
        Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
      }
    } finally {
      setSalvando(false);
    }
  }


  function irParaVacinas() {
    if (!petId) {
      Alert.alert(
        'Salve o pet primeiro',
        'É necessário cadastrar o animal antes de registrar suas vacinas.'
      );
      return;
    }

    router.push({
      pathname: '/cadastro-vacina',
      params: { animalId: String(petId) },
    });
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

          <PhotoPicker uri={fotoUri} onPress={escolherFoto} />

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

          <SelectOpcao
            label="Raça"
            optional
            tipo="raca"
            especie={especie}
            placeholder="Selecione a raça"
            value={raca}
            onChange={setRaca}
          />

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

          <TextField
            label="Observações"
            multiline
            placeholder="Alergias, medicamentos, comportamento..."
            value={observacoes}
            onChangeText={setObservacoes}
          />

          {idEdicao !== null || petId === null ? (
            <PrimaryButton
              title={
                salvando
                  ? 'Salvando...'
                  : idEdicao !== null
                    ? 'Salvar alterações'
                    : 'Salvar pet'
              }
              onPress={salvar}
            />
          ) : (
            <PrimaryButton title="Cadastrar vacinas" onPress={irParaVacinas} />
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
    padding: size.xxl,
    paddingBottom: size.xxxl * 2,
  },
  stage: { marginTop: size.marginTopView },
  title: { marginBottom: size.xl },
  row: { flexDirection: 'row', gap: size.md },
});