import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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
import RNPickerSelect from "react-native-picker-select";
import { useValidation } from "react-simple-form-validator";
import * as ImagePicker from "expo-image-picker";
import RBSheet from "react-native-raw-bottom-sheet";
import { useNavigation } from "@react-navigation/native";  

export default function EditComic() {
  const [judul_komik, setJudul] = useState("");
  const [deskripsi_komik, setDeskripsi] = useState("");
  const [tanggal_rilis, setTanggalRilis] = useState("");
  const [nama_pengarang, setPengarang] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [kategori, setKategori] = useState(null);
  const [komikId, setKomikId] = useState("");
  const [halaman, setHalaman] = useState(null);
  const [komikDetails, setKomikDetails] = useState({
    judul_komik: "",
    deskripsi_komik: "",
    tanggal_rilis: "",
    nama_pengarang: "",
    thumbnail: "",
    kategori: null,
    halaman: null,
  });
  const params = useLocalSearchParams();
  const [pilihanKategori, setPilihanKategori] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState("");
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [imageUri, setImageUri] = useState("");
  const refRBSheet = useRef();
  const router = useRouter();
  const navigation = useNavigation();  


  useEffect(() => {
    if (params.comicid) {
      setKomikId(params.comicid.toString());
    }
  }, [params.comicid]);

  useEffect(() => {
    const fetchKomikDetails = async () => {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "id=" + komikId + "&" + "id_komik=" + komikId,
      };
      try {
        const response = await fetch(
          "https://ubaya.xyz/react/160421129/UAS/detailkomik.php",
          options
        );
        const resjson = await response.json();
        setKomikDetails(resjson.data);
        const response2 = await fetch(
          "https://ubaya.xyz/react/160421129/listkategori.php",
          options
        );
        const resjson2 = await response2.json();
        setPilihanKategori(resjson2.data);
      } catch (error) {
        console.error("Failed to fetch comic details:", error);
      }
    };

    if (komikId) {
      fetchKomikDetails();
    }
  }, [komikId, triggerRefresh]);

  useEffect(() => {
    if (komikDetails) {
      setJudul(komikDetails.judul_komik || "");
      setDeskripsi(komikDetails.deskripsi_komik || "");
      setTanggalRilis(komikDetails.tanggal_rilis || "");
      setPengarang(komikDetails.nama_pengarang || "");
      setThumbnail(komikDetails.thumbnail || "");
      setKategori(komikDetails.kategori);
      setHalaman(komikDetails.halaman);
    }
  }, [komikDetails]);

  useEffect(() => {
    const addKomikKategori = async () => {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "id_komik=" + komikId + "&" + "id_kategori=" + selectedKategori,
      };
      try {
        const response = await fetch(
          "https://ubaya.xyz/react/160421129/addkategorikomik.php",
          options
        );
        response.json().then(async (resjson) => {
          console.log(resjson);
          if (resjson.result === "success") alert("sukses");
          setTriggerRefresh((prev) => !prev);
        });
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      }
    };

    if (selectedKategori) {
      addKomikKategori();
    }
  }, [selectedKategori]);

  useEffect(() => {}, [imageUri]);

  const deleteKategori = async () => {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `id_komik=${komikId}&id_kategori=${kategori}`,
    };
    try {
      const response = await fetch(
        "https://ubaya.xyz/react/160421129/UAS/deletekategorikomik.php",
        options
      );
      const resjson = await response.json();
      console.log(resjson);
      if (resjson.result === "success") {
        alert("Kategori berhasil dihapus!");
        setTriggerRefresh((prev) => !prev);
      } else {
        alert("Gagal menghapus kategori!");
      }
    } catch (error) {
      console.error("Gagal menghapus kategori:", error);
    }
  };

  const { isFieldInError, getErrorsInField, isFormValid } = useValidation({
    fieldsRules: {
      judul_komik: { required: true },
      deskripsi_komik: { required: true, minlength: 10 },
      tanggal_rilis: { required: true, date: true },
      nama_pengarang: { website: true },
      thumbnail: { website: true },
    },
    state: {
      judul_komik,
      deskripsi_komik,
      tanggal_rilis,
      nama_pengarang,
      thumbnail,
    },
  });

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
    if (thumbnail != "" && !isFieldInError("thumbnail")) {
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

  const renderComboBox = () => {
    return (
      <RNPickerSelect
        onValueChange={(value) => setSelectedKategori(value)}
        items={pilihanKategori}
        placeholder={{ label: "Tambahkan Kategori Baru", value: null }}
      />
    );
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

  const submitData = () => {
    const options = {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
      body:
        "judul_komik=" +
        judul_komik +
        "&" +
        "deskripsi_komik=" +
        deskripsi_komik +
        "&" +
        "nama_pengarang=" +
        nama_pengarang +
        "&" +
        "tanggal_rilis=" +
        tanggal_rilis +
        "&" +
        "thumbnail=" +
        thumbnail +
        "&" +
        "komik_id=" +
        komikId,
    };
    try {
      fetch("https://ubaya.xyz/react/160421129/UAS/updatekomik.php", options)
        .then((response) => response.json())
        .then((resjson) => {
          console.log(resjson);
          if (resjson.result === "success") alert("sukses");
          navigation.navigate("detailcomic");  
        });
    } catch (error) {
      console.log(error);
    }
  };

  const uploadScene = async () => {
    const data = new FormData();
    data.append("id_komik", komikId);

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
          if (resjson.result === "success") {
            alert("sukses");
            router.push({
              pathname: "/detailcomic",
              params: { idKomik: komikId },
            });
          }
          setTriggerRefresh((prev) => !prev);
          setImageUri("");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteScene = async (imageUri) => {    
    const options = {    
        method: "POST",    
        headers: { "Content-Type": "application/x-www-form-urlencoded" },    
        body: `uri=${encodeURIComponent(imageUri)}`, // Kirim URI gambar    
    };    
    try {    
        const response = await fetch("https://ubaya.xyz/react/160421129/UAS/deletescene.php", options);    
        const resjson = await response.json();    
        console.log("Response from server:", resjson); // Log respons dari server    
        if (resjson.result === "success") {    
            alert("Gambar berhasil dihapus!");    
            setTriggerRefresh((prev) => !prev);    
        } else {    
            alert("Gagal menghapus gambar: " + resjson.message); // Tampilkan pesan dari server    
        }    
    } catch (error) {    
        console.error("Gagal menghapus gambar:", error);    
    }    
};    


  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Judul Komik"
        onChangeText={setJudul}
        value={judul_komik}
      />
      {renderJudulErrors()}

      <TextInput
        style={styles.input}
        placeholder="Deskripsi"
        onChangeText={setDeskripsi}
        value={deskripsi_komik}
      />
      {renderDeskripsiErrors()}

      <TextInput
        style={styles.input}
        placeholder="Tanggal Rilis"
        onChangeText={setTanggalRilis}
        value={tanggal_rilis}
      />
      {renderTanggalRilisErrors()}

      <TextInput
        style={styles.input}
        placeholder="Pengarang"
        onChangeText={setPengarang}
        value={nama_pengarang}
      />
      {renderPengarangErrors()}
      {renderPoster()}

      <TextInput
        style={styles.input}
        placeholder="Thumbnail"
        onChangeText={setThumbnail}
        value={thumbnail}
      />
      {renderThumbnailErrors()}

      {renderButtonSubmit()}

      <Text>Kategori: </Text>
      <FlatList
        data={kategori}
        keyExtractor={(item) => item.nama_kategori}
        renderItem={({ item }) => (
          <View>
            <Text>{item.nama_kategori}</Text>
            <Button title="X" color="red" onPress={() => deleteKategori()} />
          </View>
        )}
      />
      {renderComboBox()}

      <Text>Halaman: </Text>  
      <FlatList  
        data={halaman}  
        keyExtractor={(item) => item}  
        renderItem={({ item }) => (  
            <View>  
                <Image  
                    style={{ width: 300, height: 200 }}  
                    resizeMode="contain"  
                    source={{ uri: "https://ubaya.xyz/react/160421129/UAS/" + item }}  
                />  
               <Button title="Delete" color="red" onPress={() => deleteScene(item)} />  

            </View>  
        )}  
      />    
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
