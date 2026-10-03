import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import {colors, fonts, size}from "../constants/theme";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";


export default function AnimalRegister() {
  const router = useRouter();

  return (
    <ThemedView >
      <ThemedText type="linkPrimary" onPress={() => router.back()} style={{ marginBottom: 20 }}>
        Voltar
      </ThemedText>
      <ThemedText type="stage" style={{ marginBottom: 20 }}>
        PASSO 2 DE 2
      </ThemedText>
      

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});