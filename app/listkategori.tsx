import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Button,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { useRouter } from "expo-router";
  
  const ListKategori = () => {
    const [kategori, setKategori] = useState([]);
    const router = useRouter();
  
    useEffect(() => {
      const fetchListKategori = async () => {
        try {
          const response = await fetch(
            "https://ubaya.xyz/react/160421129/UAS/kategori.php"
          );
          const resjson = await response.json();
          setKategori(resjson.data); // Sesuaikan dengan struktur data API Anda
        } catch (error) {
          console.error("Failed to fetch categories:", error);
        }
      };
  
      fetchListKategori();
    }, []);
  
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Pilih Kategori</Text>
        {kategori.map((item) => (
          <View key={item.id_kategori} style={styles.buttonContainer}>
            <Button
              title={item.nama_kategori} // Sesuaikan dengan nama field di API Anda
              onPress={() =>
                router.push(`/home?kategori=${item.id_kategori}`) // Kirim ID kategori sebagai parameter
              }
            />
          </View>
        ))}
      </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
    },
    buttonContainer: {
      marginBottom: 10,
    },
  });
  
  export default ListKategori;
  