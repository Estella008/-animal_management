import { Button, View } from 'react-native';
import {colors, fonts, size}from "../constants/theme";

export default function Index() {
  return (
    <View style={{ backgroundColor: colors.background }}>
      <Button title="Cadastrar animal" color="yellow" onPress={() => alert('Funcionou!')} />
    </View>
  );
}