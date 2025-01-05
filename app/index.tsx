import React, { useEffect, useState } from "react";
import { Button, Text, View, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./authContext";

export default function Index() {
  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const { logout } = useAuth();

  const cekLogin = async () => {
    try {
      const value = await AsyncStorage.getItem("username");
      if (value !== null) {
        setUsername(value);
      } else {
        setUsername("");
        logout();
      }
    } catch (e) {
      console.error("Error reading username from AsyncStorage", e);
      setUsername("");
      logout();
    }
  };

  const doLogout = async () => {
    try {
      await AsyncStorage.removeItem("username");
      alert("logged out");
      logout();
    } catch (e) {}
  };

  useEffect(() => {
    cekLogin();
  }, [username]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Button title="Tambah Komik" onPress={() => router.push("/addcomic")} />
      <Button title="Baca Komik" onPress={() => router.push("/listkategori")} />
      <Button title="Logout" onPress={() => doLogout()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  container: {
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
    width: "80%",
  },
});
