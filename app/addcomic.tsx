import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Button,
  FlatList,
} from "react-native";
import { useValidation } from "react-simple-form-validator";
import * as ImagePicker from "expo-image-picker";
import RBSheet from "react-native-raw-bottom-sheet";
import { Picker } from "@react-native-picker/picker";

export default function NewComic() {
  const [judul_komik, setJudulKomik] = useState("");
  const [deskripsi_komik, setDeskripsiKomik] = useState("");
  const [tanggal_rilis, setTanggalRilis] = useState("");
  const [nama_pengarang, setNamaPengarang] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [kategori, setKategori] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");
  const [kategoriData, setKategoriData] = useState([]);
  const [halamans, setHalamans] = useState(null);
  const [imageUri, setImageUri] = useState("");
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const refRBSheet = useRef();

  const { isFieldInError, getErrorsInField, isFormValid } = useValidation({
    fieldsRules: {
      judul_komik: { required: true },
      deskripsi_komik: { required: true, minlength: 30 },
      tanggal_rilis: { required: true, date: true },
      nama_pengarang: { required: true },
      thumbnail: { website: true },
      kategori: { required: true },
    },
    state: {
      judul_komik,
      deskripsi_komik,
      tanggal_rilis,
      nama_pengarang,
      thumbnail,
    },
  });

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const response = await fetch(
          "https://ubaya.xyz/react/160421129/UAS/kategori.php"
        );
        const resjson = await response.json();
        setKategoriData(resjson.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchKategori();
  }, []);

  const renderJudulErrors = () => {
    if (isFieldInError("judul_komik")) {
      return getErrorsInField("judul_komik").map((errorMessage, index) => (
        <Text key={index} style={styles.errorText}>
          {errorMessage}
        </Text>
      ));
    }
    return null;
  };

  const renderDeskripsiErrors = () => {
    if (isFieldInError("deskripsi_komik")) {
      return getErrorsInField("deskripsi_komik").map((errorMessage, index) => (
        <Text key={index} style={styles.errorText}>
          {errorMessage}
        </Text>
      ));
    }
    return null;
  };

  const renderTanggalRilisErrors = () => {
    if (isFieldInError("tanggal_rilis")) {
      return getErrorsInField("tanggal_rilis").map((errorMessage, index) => (
        <Text key={index} style={styles.errorText}>
          {errorMessage}
        </Text>
      ));
    }
    return null;
  };

  const renderPengarangErrors = () => {
    if (isFieldInError("nama_pengarang")) {
      return getErrorsInField("nama_pengarang").map((errorMessage, index) => (
        <Text key={index} style={styles.errorText}>
          {errorMessage}
        </Text>
      ));
    }
    return null;
  };

  const renderThumbnailErrors = () => {
    if (isFieldInError("thumbnail")) {
      return getErrorsInField("thumbnail").map((errorMessage, index) => (
        <Text key={index} style={styles.errorText}>
          {errorMessage}
        </Text>
      ));
    }
    return null;
  };

  const renderPoster = () => {
    if (thumbnail !== "" && !isFieldInError("thumbnail")) {
      return (
        <Image
          style={{ width: 300, height: 400 }}
          resizeMode="contain"
          source={{ uri: thumbnail }}
        />
      );
    }
    return null;
  };

  const renderButtonSubmit = () => {
    if (isFormValid) {
      return <Button title="Submit" onPress={submitData} />;
    }
    return null;
  };

  const imgGaleri = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const renderImageUri = () => {
    if (imageUri != "") {
      return (
        <View>
          <Image
            style={{ width: 300, height: 200 }}
            resizeMode="contain"
            source={{ uri: imageUri }}
          />
          <Button title="Upload" onPress={uploadScene} />
        </View>
      );
    }
    return null;
  };

  const uploadScene = async () => {
    const data = new FormData();

    const response = await fetch(imageUri);
    const blob = await response.blob();
    data.append("image", blob, "scene.png");

    const options = {
      method: "POST",
      body: data,
      headers: {},
    };

    try {
      fetch("https://ubaya.xyz/react/160421129/UAS/uploadhalaman.php", options)
        .then((response) => response.json())
        .then((resjson) => {
          console.log(resjson);
          if (resjson.result === "success") alert("sukses");
          setTriggerRefresh((prev) => !prev);
          setImageUri("");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const submitData = () => {
    const options = {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
      body:
        "judul=" +
        judul_komik +
        "&" +
        "deskripsi=" +
        deskripsi_komik +
        "&" +
        "tanggal_rilis=" +
        tanggal_rilis +
        "&" +
        "pengarang=" +
        nama_pengarang +
        "&" +
        "thumbnail=" +
        thumbnail +
        "&" +
        "kategori=" +
        kategori,
    };
    fetch("https://ubaya.xyz/react/160421129/UAS/addkomik.php", options)
      .then((response) => {
        return response.text(); // Ubah dari `response.json()` ke `response.text()`
      })
      .then((text) => {
        try {
          const resjson = JSON.parse(text); // Parsing JSON secara manual
          console.log(resjson);
          if (resjson.result === "success") {
            alert("Komik berhasil ditambahkan!");
          } else {
            alert("Terjadi kesalahan: " + resjson.message);
          }
        } catch (error) {
          console.error("Error parsing JSON:", error, "Response text:", text);
          alert("Terjadi kesalahan pada server.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Gagal mengirim data: " + error.message);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Judul Komik"
        onChangeText={setJudulKomik}
        value={judul_komik}
      />
      {renderJudulErrors()}

      <Text>Deskripsi Komik</Text>
      <TextInput
        multiline
        numberOfLines={4}
        style={styles.input2}
        placeholder="Deskripsi Komik"
        onChangeText={setDeskripsiKomik}
        value={deskripsi_komik}
      />
      {renderDeskripsiErrors()}

      <Text>Tanggal Rilis</Text>
      <TextInput
        style={styles.input}
        placeholder="Tanggal Rilis"
        onChangeText={setTanggalRilis}
        value={tanggal_rilis}
      />
      {renderTanggalRilisErrors()}

      <Text>Nama Pengarang</Text>
      <TextInput
        style={styles.input}
        placeholder="Nama Pengarang"
        onChangeText={setNamaPengarang}
        value={nama_pengarang}
      />
      {renderPengarangErrors()}

      <Text>Thumbnail URL</Text>
      <TextInput
        style={styles.input}
        placeholder="URL Thumbnail"
        onChangeText={setThumbnail}
        value={thumbnail}
      />
      {renderThumbnailErrors()}
      {renderPoster()}

      <Text>Kategori</Text>
      <Picker
        selectedValue={selectedKategori}
        onValueChange={(itemValue) => setSelectedKategori(itemValue)}
      >
        <Picker.Item label="Pilih Kategori" value="" />
        {kategoriData.length > 0 ? (
          kategoriData.map((item) => (
            <Picker.Item
              key={item.id_kategori}
              label={item.nama_kategori}
              value={item.nama_kategori}
            />
          ))
        ) : (
          /* Display message if no categories found */
          <Text>No categories available.</Text>
        )}
      </Picker>

      {renderButtonSubmit()}

      <Text>Halaman: </Text>
      <FlatList
        data={halamans}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View>
            <Image
              style={{ width: 300, height: 200 }}
              resizeMode="contain"
              source={{ uri: "https://ubaya.xyz/react/160421129/UAS/" + item }}
            ></Image>
          </View>
        )}
      ></FlatList>

      <Button
        title="Pick Halaman"
        onPress={() => refRBSheet.current.open()}
      ></Button>
      {renderImageUri()}

      <RBSheet
        ref={refRBSheet}
        height={100}
        openDuration={250}
        customStyles={{
          container: {
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <View style={styles.viewRow}>
          <Button title="Gallery" onPress={imgGaleri} />
        </View>
      </RBSheet>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  input2: {
    height: 120,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  viewRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: 50,
    margin: 3,
  },
});
