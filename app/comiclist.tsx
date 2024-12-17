import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const ComicList = ({ route, navigation }: any) => {
  const { category } = route.params; // Mendapatkan kategori dari parameter route
  const [comicList, setComicList] = useState<any[]>([]);

  useEffect(() => {
    // Ambil data komik berdasarkan kategori dari API
    fetchComicByCategory(category);
  }, [category]);

  const fetchComicByCategory = async (category: string) => {
    try {
      const response = await fetch(
        `https://ubaya.xyz/react/160421129/comiccategory.php=${category}`
      );
      const data = await response.json();
      setComicList(data);
    } catch (error) {
      console.error(error);
    }
  };

  const renderComic = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("DetailKomik", { komikId: item.id })}
    >
      <Text style={styles.judul}>{item.judul}</Text>
      <Text>{item.kategori}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daftar Komik - {category}</Text>
      <FlatList
        data={comicList}
        renderItem={renderComic}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    elevation: 2, // Memberikan shadow pada card (untuk Android)
  },
  judul: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ComicList;
