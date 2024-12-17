import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const ComicCategory = ({ navigation }: any) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://ubaya.xyz/react/160421129/comiccategory.php');
      const data = await response.json();
      setCategories(data);  // Menyimpan kategori yang diambil dari API
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const navigateToKomik = (kategori: any) => {
    navigation.navigate('DaftarKomik', { kategori });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pilih Kategori Komik</Text>
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigateToKomik(item)}
          >
            <Text style={styles.kategori}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
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
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  kategori: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ComicCategory;
