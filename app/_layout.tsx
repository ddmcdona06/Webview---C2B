import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "react-native";

export default function Layout() {
  return (
    <>
      <StatusBar hidden />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
