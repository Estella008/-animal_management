
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ChoiceGroup } from '@/components/ui/choice-group';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SelectOpcao } from '@/components/ui/select-opcao';
import { TextField } from '@/components/ui/text-field';
import { colors, MaxContentWidth, size } from '@/constants/theme';
import { buscarAnimal, type Animal } from '@/services/animais';
import { ApiError } from '@/services/api';
import {
  cadastrarVacina,
  type FrequenciaVacina,
} from '@/services/vacinas';
import { maskDate } from '@/utils/masks';

export default function CadastroVacinaScreen() {
  const { animalId } = useLocalSearchParams<{
    animalId?: string;
  }>();

  const [especie, setEspecie] = useState<
    Animal['especie'] | null
  >(null);
  const [carregandoPet, setCarregandoPet] = useState(true);

  const [nome, setNome] = useState('');
  const [laboratorio, setLaboratorio] = useState('');
  const [dataAplicacao, setDataAplicacao] = useState('');
  const [frequencia, setFrequencia] =
    useState<FrequenciaVacina>('unica');

  const [numeroDose, setNumeroDose] = useState('1');
  const [totalDoses, setTotalDoses] = useState('');
  const [intervaloDoses, setIntervaloDoses] = useState('');
  const [intervaloReforco, setIntervaloReforco] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [salvando, setSalvando] = useState(false);

  const temVariasDoses =
    frequencia === 'serie_unica' ||
    frequencia === 'serie_anual' ||
    frequencia === 'personalizada';

  const personalizada = frequencia === 'personalizada';

  // Busca a espécie do pet para filtrar as vacinas.
  useEffect(() => {
    let ativo = true;
    const id = Number(animalId);

    setCarregandoPet(true);
    setEspecie(null);

    if (!Number.isInteger(id) || id <= 0) {
      setCarregandoPet(false);
      return;
    }

    buscarAnimal(id)
      .then((animal) => {
        if (ativo) setEspecie(animal.especie);
      })
      .catch((erro) => {
        console.log('Erro ao buscar pet:', erro);
      })
      .finally(() => {
        if (ativo) setCarregandoPet(false);
      });

    return () => {
      ativo = false;
    };
  }, [animalId]);

  function limparFormulario() {
    setNome('');
    setLaboratorio('');
    setDataAplicacao('');
    setFrequencia('unica');
    setNumeroDose('1');
    setTotalDoses('');
    setIntervaloDoses('');
    setIntervaloReforco('');
    setObservacoes('');
  }

  async function salvar() {
    if (salvando) return;

    const id = Number(animalId);

    if (!Number.isInteger(id) || id <= 0 || !especie) {
      Alert.alert('Erro', 'Não foi possível identificar o pet.');
      return;
    }

    if (!nome.trim()) {
      Alert.alert('Campo obrigatório', 'Selecione a vacina.');
      return;
    }

    // Valida a data informada.
    const partes = dataAplicacao.match(
      /^(\d{2})\/(\d{2})\/(\d{4})$/
    );

    if (!partes) {
      Alert.alert(
        'Data inválida',
        'Informe a data no formato dd/mm/aaaa.'
      );
      return;
    }

    const dia = Number(partes[1]);
    const mes = Number(partes[2]);
    const ano = Number(partes[3]);

    const data = new Date(Date.UTC(ano, mes - 1, dia));

    if (
      data.getUTCFullYear() !== ano ||
      data.getUTCMonth() !== mes - 1 ||
      data.getUTCDate() !== dia
    ) {
      Alert.alert('Data inválida', 'Confira a data de aplicação.');
      return;
    }

    const dataISO =
      `${partes[3]}-${partes[2]}-${partes[1]}`;

    const dose = temVariasDoses ? Number(numeroDose) : 1;
    const total = totalDoses ? Number(totalDoses) : null;
    const intervalo = intervaloDoses
      ? Number(intervaloDoses)
      : null;

    const reforco =
      frequencia === 'anual' ||
      frequencia === 'serie_anual'
        ? 12
        : personalizada && intervaloReforco
          ? Number(intervaloReforco)
          : null;

    if (temVariasDoses) {
      if (!Number.isInteger(dose) || dose < 1) {
        Alert.alert('Dose inválida', 'Informe o número da dose.');
        return;
      }

      if (total !== null && (total < 1 || dose > total)) {
        Alert.alert(
          'Doses inválidas',
          'Confira o número e o total de doses.'
        );
        return;
      }

      if (
        intervalo !== null &&
        (!Number.isInteger(intervalo) || intervalo < 1)
      ) {
        Alert.alert(
          'Intervalo inválido',
          'Informe um intervalo de dias válido.'
        );
        return;
      }

      if (frequencia !== 'personalizada') {
        if (total === null || intervalo === null) {
          Alert.alert(
            'Campos obrigatórios',
            'Informe o total de doses e o intervalo entre elas.'
          );
          return;
        }
      }
    }

    if (personalizada && intervalo === null && reforco === null) {
      Alert.alert(
        'Frequência personalizada',
        'Informe um intervalo entre doses ou um intervalo de reforço.'
      );
      return;
    }

    try {
      setSalvando(true);

      await cadastrarVacina({
        animal: id,
        nome: nome.trim(),
        laboratorio: laboratorio.trim(),
        data_aplicacao: dataISO,
        frequencia,
        numero_dose: dose,
        total_doses: temVariasDoses ? total : null,
        intervalo_doses_dias: temVariasDoses ? intervalo : null,
        intervalo_reforco_meses: reforco,
        proxima_dose: null,
        observacoes: observacoes.trim(),
      });

      Alert.alert(
        'Sucesso!',
        'Vacina cadastrada com sucesso.',
        [
          {
            text: 'Cadastrar outra',
            onPress: limparFormulario,
          },
          {
            text: 'Concluir',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (erro) {
      console.log('Erro ao cadastrar vacina:', erro);

      if (erro instanceof ApiError) {
        console.log('Detalhes da API:', erro.data);
      }

      Alert.alert(
        'Erro',
        'Não foi possível cadastrar a vacina.'
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title">
          Cadastro de vacina
        </ThemedText>

        {carregandoPet ? (
          <ActivityIndicator color={colors.primary} />
        ) : !especie ? (
          <ThemedText>
            Não foi possível identificar o animal.
          </ThemedText>
        ) : (
          <>
            <SelectOpcao
              label="Nome da vacina"
              tipo="vacina"
              especie={especie}
              value={nome}
              onChange={setNome}
              placeholder="Selecione a vacina"
            />

            <SelectOpcao
              label="Laboratório"
              tipo="laboratorio"
              value={laboratorio}
              onChange={setLaboratorio}
              placeholder="Selecione o laboratório"
              optional
            />

            <TextField
              label="Data de aplicação"
              placeholder="dd/mm/aaaa"
              keyboardType="number-pad"
              value={dataAplicacao}
              onChangeText={(texto) =>
                setDataAplicacao(maskDate(texto))
              }
            />

            <ChoiceGroup
              label="Frequência"
              value={frequencia}
              onChange={setFrequencia}
              options={[
                { label: 'Dose única', value: 'unica' },
                { label: 'Anual', value: 'anual' },
                {
                  label: 'Várias doses, sem repetição',
                  value: 'serie_unica',
                },
                {
                  label: 'Várias doses, repetição anual',
                  value: 'serie_anual',
                },
                {
                  label: 'Personalizada',
                  value: 'personalizada',
                },
              ]}
            />

            {temVariasDoses && (
              <>
                <TextField
                  label="Número da dose aplicada"
                  placeholder="Ex.: 1"
                  keyboardType="number-pad"
                  value={numeroDose}
                  onChangeText={(texto) =>
                    setNumeroDose(texto.replace(/\D/g, ''))
                  }
                />

                <TextField
                  label="Total de doses"
                  placeholder="Ex.: 3"
                  keyboardType="number-pad"
                  value={totalDoses}
                  onChangeText={(texto) =>
                    setTotalDoses(texto.replace(/\D/g, ''))
                  }
                  optional={personalizada}
                />

                <TextField
                  label="Intervalo entre doses (dias)"
                  placeholder="Ex.: 30"
                  keyboardType="number-pad"
                  value={intervaloDoses}
                  onChangeText={(texto) =>
                    setIntervaloDoses(texto.replace(/\D/g, ''))
                  }
                  optional={personalizada}
                />
              </>
            )}

            {personalizada && (
              <TextField
                label="Intervalo de reforço (meses)"
                placeholder="Ex.: 6"
                keyboardType="number-pad"
                value={intervaloReforco}
                onChangeText={(texto) =>
                  setIntervaloReforco(texto.replace(/\D/g, ''))
                }
                optional
              />
            )}

            <TextField
              label="Observações"
              placeholder="Informações adicionais..."
              multiline
              value={observacoes}
              onChangeText={setObservacoes}
              optional
            />

            <PrimaryButton
              title={salvando ? 'Salvando...' : 'Salvar vacina'}
              onPress={salvar}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    padding: size.xxl,
    paddingBottom: size.xxxl,
    gap: size.md,
  },
});
