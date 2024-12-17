import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';  // untuk memilih gambar

const UpdateComic = ({ navigation, route }: any) => {
  const { komikId } = route.params;  // mengambil ID komik dari parameter route
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [tanggalRilis, setTanggalRilis] = useState('');
  const [pengarang, setPengarang] = useState('');
  const [kategori, setKategori] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    // Ambil data komik berdasarkan komikId dan set state-nya
    // Misalnya menggunakan fetch atau axios untuk mengambil data dari API
    fetchKomikData(komikId);
  }, [komikId]);

  const fetchKomikData = async (id : any) => {
    // Ambil data komik dengan API
    try {
      const response = await fetch(`https://ubaya.xyz/react/160421129/updatecomic.php${id}`);
      const data = await response.json();
      setJudul(data.judul);
      setDeskripsi(data.deskripsi);
      setTanggalRilis(data.tanggalRilis);
      setPengarang(data.pengarang);
      setKategori(data.kategori);
      setImageUri(data.imageUri); // Jika ada gambar
    } catch (error) {
      console.error(error);
    }
  };

  const updateKomik = async () => {
    // Kirim data yang telah diperbarui ke server/API
    try {
      const formData = new FormData();
      formData.append('judul', judul);
      formData.append('deskripsi', deskripsi);
      formData.append('tanggalRilis', tanggalRilis);
      formData.append('pengarang', pengarang);
      formData.append('kategori', kategori);
    //   if (imageUri) {
    //     const localUri = imageUri;
    //     const filename = localUri.split('/').pop();
    //     const fileType = filename.split('.').pop();
    //     const file = {
    //       uri: localUri,
    //       name: filename,
    //       type: `image/${fileType}`,
    //     };
    //     formData.append('gambar', file);
    //   }

      const response = await fetch(`https://ubaya.xyz/react/160421129/updatecomic.php${komikId}`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        navigation.goBack(); // Kembali ke halaman sebelumnya setelah berhasil
      } else {
        alert('Gagal memperbarui komik');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const pickImage = async () => {
    // Fungsi untuk memilih gambar
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Komik</Text>

      <TextInput
        style={styles.input}
        placeholder="Judul Komik"
        value={judul}
        onChangeText={setJudul}
      />

      <TextInput
        style={styles.input}
        placeholder="Deskripsi Komik"
        value={deskripsi}
        onChangeText={setDeskripsi}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Tanggal Rilis"
        value={tanggalRilis}
        onChangeText={setTanggalRilis}
      />

      <TextInput
        style={styles.input}
        placeholder="Nama Pengarang"
        value={pengarang}
        onChangeText={setPengarang}
      />

      <TextInput
        style={styles.input}
        placeholder="Kategori Komik"
        value={kategori}
        onChangeText={setKategori}
      />

      <TouchableOpacity onPress={pickImage}>
        <Text style={styles.button}>Pilih Gambar</Text>
      </TouchableOpacity>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <Button title="Update Komik" onPress={updateKomik} />
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
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  button: {
    color: 'blue',
    textAlign: 'center',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
});

export default UpdateComic;
