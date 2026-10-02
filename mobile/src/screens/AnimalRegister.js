import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import {colors, fonts, size}from "../constants/theme.ts";

export default function AnimalRegister() {
  const router = useRouter();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text>Animal Register Screen</Text>
      <TouchableOpacity onPress={() => router.push("/AnimalList")}>
        <Text>Go to Animal List</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});