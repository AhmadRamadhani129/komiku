import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
} from "react-native";

const SearchComic = ({ navigation }: any) => {
  const [query, setQuery] = useState("");
  const [komikList, setKomikList] = useState([]);

  // Fungsi untuk menangani pencarian komik
  const cariKomik = async () => {
    try {
      if (query.trim() === "") {
        return; // Jika query kosong, tidak lakukan pencarian
      }

      // Gantilah URL ini dengan API yang sesuai untuk pencarian berdasarkan judul
      const response = await fetch(
        `https://ubaya.xyz/react/160421129/searchcomic.php=${query}`
      );
      const data = await response.json();
      setKomikList(data);
    } catch (error) {
      console.error("Error fetching komik:", error);
    }
  };

  const renderKomik = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.judul}>{item.judul}</Text>
      <Text>{item.kategori}</Text>
      <Button
        title="Lihat Detail"
        onPress={() => navigation.navigate("DetailComic", { komikId: item.id })}
      />
    </View>
  );

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.input}
//         placeholder="Cari komik berdasarkan judul"
//         value={query}
//         onChangeText={setQuery}
//       />
//       <Button title="Cari" onPress={cariKomik} />

//       {komikList.length > 0 ? (
//         <FlatList
//           data={komikList}
//           renderItem={renderKomik}
//           keyExtractor={(item) => item.id.toString()}
//         />
//       ) : (
//         <Text style={styles.noResults}>Tidak ada hasil pencarian</Text>
//       )}
//     </View>
//   );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  card: {
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  judul: {
    fontSize: 18,
    fontWeight: "bold",
  },
  noResults: {
    fontSize: 18,
    textAlign: "center",
    color: "gray",
  },
});

export default SearchComic;
