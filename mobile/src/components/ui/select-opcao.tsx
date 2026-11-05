import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { TextField } from '@/components/ui/text-field';
import { colors, size } from '@/constants/theme';
import { adicionarOpcao, listarOpcoes, Opcao, TipoOpcao } from '@/services/opcoes';

type Props = {
  label: string;
  tipo: TipoOpcao;      // 'raca', 'vacina'...
  especie?: string;     // filtra a lista pela espécie do pet
  value: string;
  onChange: (nome: string) => void;
  placeholder?: string;
  optional?: boolean;
};

// Tira acentos e deixa minúsculo, para "siames" achar "Siamês"
function normalizar(texto: string) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

export function SelectOpcao({ label, tipo, especie, value, onChange, placeholder, optional }: Props) {
  const [aberto, setAberto] = useState(false);
  const [opcoes, setOpcoes] = useState<Opcao[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Recarrega a lista sempre que a espécie muda (cachorro -> gato)
  useEffect(() => {
    setCarregando(true);
    listarOpcoes(tipo, especie)
      .then(setOpcoes)
      .catch((erro) => console.log('Erro ao carregar opções:', erro))
      .finally(() => setCarregando(false));
  }, [tipo, especie]);

  // Lista filtrada pelo que a pessoa digitou
  const filtradas = useMemo(() => {
    const termo = normalizar(busca);
    if (!termo) return opcoes;
    return opcoes.filter((o) => normalizar(o.nome).includes(termo));
  }, [opcoes, busca]);

  // Só mostra "Adicionar" se o texto digitado não for exatamente um item da lista
  const podeAdicionar =
    busca.trim().length > 0 && !opcoes.some((o) => normalizar(o.nome) === normalizar(busca));

  function escolher(nome: string) {
    onChange(nome);
    setBusca('');
    setAberto(false);
  }

  async function adicionar() {
    const nome = busca.trim();
    try {
      setSalvando(true);
      const nova = await adicionarOpcao(tipo, nome, especie);
      // Coloca o item novo na lista local, para não precisar buscar tudo de novo
      setOpcoes((atual) =>
        atual.some((o) => o.id === nova.id)
          ? atual
          : [...atual, nova].sort((a, b) => a.nome.localeCompare(b.nome))
      );
      escolher(nova.nome);
    } catch (erro) {
      console.log('Erro ao adicionar opção:', erro);
      Alert.alert('Erro', 'Não foi possível salvar o novo item.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={styles.wrapper}>
      <ThemedText style={styles.label}>
        {label}
        {optional ? ' (opcional)' : ''}
      </ThemedText>

      <Pressable style={styles.campo} onPress={() => setAberto(true)}>
        <ThemedText style={value ? undefined : styles.placeholder}>
          {value || placeholder || 'Selecione'}
        </ThemedText>
        <ThemedText style={styles.seta}>▾</ThemedText>
      </Pressable>

      <Modal visible={aberto} animationType="slide" onRequestClose={() => setAberto(false)}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.topo}>
            <ThemedText type="title">{label}</ThemedText>
            <Pressable onPress={() => setAberto(false)} hitSlop={12}>
              <ThemedText type="linkPrimary">Fechar</ThemedText>
            </Pressable>
          </View>

          <TextField
            label="Buscar"
            placeholder="Digite para filtrar ou adicionar"
            autoFocus
            value={busca}
            onChangeText={setBusca}
          />

          {podeAdicionar && (
            <Pressable style={styles.adicionar} onPress={adicionar} disabled={salvando}>
              <ThemedText type="linkPrimary">
                {salvando ? 'Salvando...' : `+ Adicionar "${busca.trim()}"`}
              </ThemedText>
            </Pressable>
          )}

          {carregando ? (
            <ActivityIndicator style={{ marginTop: size.xl }} />
          ) : (
            <FlatList
              data={filtradas}
              keyExtractor={(item) => String(item.id)}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable style={styles.item} onPress={() => escolher(item.nome)}>
                  <ThemedText style={item.nome === value ? styles.selecionado : undefined}>
                    {item.nome}
                  </ThemedText>
                  {item.personalizada && <ThemedText style={styles.tag}>adicionada por você</ThemedText>}
                </Pressable>
              )}
              ListEmptyComponent={
                !podeAdicionar ? (
                  <ThemedText style={styles.placeholder}>
                    Nenhum item encontrado.
                  </ThemedText>
                ) : undefined
              }
            />
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
}

// Cores neutras provisórias: troquem pelas cores do theme de vocês
const styles = StyleSheet.create({
  wrapper: { marginBottom: size.xl },
  label: { marginBottom: size.sm, fontWeight: '600' },
  campo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 12,
    paddingHorizontal: size.md,
    paddingVertical: size.md,
  },
  placeholder: { opacity: 0.5 },
  seta: { opacity: 0.6 },
  modal: { flex: 1, backgroundColor: colors.background, padding: size.xxl },
  topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: size.xl },
  adicionar: { paddingVertical: size.md },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: size.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#D0D0D0',
  },
  selecionado: { fontWeight: '700' },
  tag: { fontSize: 12, opacity: 0.6 },
});