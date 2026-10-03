import { Button, View } from 'react-native';
import {colors, fonts, size}from "../constants/theme";
import {ThemedView} from '../components/themed-view';
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <ThemedView >
      <Button title="Cadastrar animal" color="red" onPress={() => router.push("/animal-register")} />
    </ThemedView>
  );
}