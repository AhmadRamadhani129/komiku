import { useLocalSearchParams } from "expo-router";
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

export default function EditMovie() {
  const [judul_komik, setJudul] = useState("");
  const [deskripsi_komik, setDeskripsi] = useState("");
  const [tanggal_rilis, setTanggalRilis] = useState("");
  const [nama_pengarang, setPengarang] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [kategoris, setKategoris] = useState(null);
  const [komikId, setKomikId] = useState("");
  const [scenes, setScenes] = useState(null);
  const [komikDetails, setKomikDetails] = useState({
    judul_komik: "",
    deskripsi_komik: "",
    tanggal_rilis: "",
    nama_pengarang: "",
    thumbnail: "",
    kategoris: null,
    scenes: null,
  });
  const params = useLocalSearchParams();
  // const [pilihanGenres, setPilihanGenres] = useState([]);
  // const [selectedGenre, setSelectedGenre] = useState("");
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [imageUri, setImageUri] = useState("");
  const refRBSheet = useRef();

  useEffect(() => {
    console.log(params.comicid);
    if (params.comicid) {
      setKomikId(params.comicid.toString());
    }
  }, [params.comicid]);

  useEffect(() => {
    const fetchKomikDetails = async () => {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "id=" + params.comicid + "&" + "id_komik=" + params.comicid,
      };
      try {
        const response = await fetch(
          "https://ubaya.xyz/react/160421129/UAS/detailkomik.php",
          options
        );
        const resjson = await response.json();
        setKomikDetails(resjson.data);
        const response2 = await fetch(
          "https://ubaya.xyz/react/160421129/genrelist.php",
          options
        );
        const resjson2 = await response2.json();
        // setPilihanGenres(resjson2.data);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      }
    };

    if (komikId) {
      fetchKomikDetails(); // Call fetchMovieDetails
    }
  }, [komikId, triggerRefresh]);

  useEffect(() => {
    if (komikDetails) {
      setJudul(komikDetails.judul_komik || "");
      setDeskripsi(komikDetails.deskripsi_komik || "");
      setTanggalRilis(komikDetails.tanggal_rilis || "");
      setPengarang(komikDetails.nama_pengarang || "");
      setThumbnail(komikDetails.thumbnail || "");
      // setGenres(movieDetails.genres);
      // setScenes(movieDetails.scenes);
    }
  }, [komikDetails]);

  // useEffect(() => {
  //   const addMovieGenre = async () => {
  //     const options = {
  //       method: "POST",
  //       headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //       body: "movie_id=" + komikId + "&" + "genre_id=" + selectedGenre,
  //     };
  //     try {
  //       const response = await fetch(
  //         "https://ubaya.xyz/react/160421129/addmoviegenre.php",
  //         options
  //       );
  //       response.json().then(async (resjson) => {
  //         console.log(resjson);
  //         if (resjson.result === "success") alert("sukses");
  //         setTriggerRefresh((prev) => !prev);
  //       });
  //     } catch (error) {
  //       console.error("Failed to fetch movie details:", error);
  //     }
  //   };

  //   if (selectedGenre) {
  //     addMovieGenre();
  //   }
  // }, [selectedGenre]);

  useEffect(() => {}, [imageUri]);

  // const deleteGenre = async () => {
  //   const options = {
  //     method: "POST",
  //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //     body: `movie_id=${movieId}&genre_id=${genres}`,
  //   };
  //   try {
  //     const response = await fetch(
  //       "https://ubaya.xyz/react/160421129/deletemoviegenre.php",
  //       options
  //     );
  //     const resjson = await response.json();
  //     console.log(resjson);
  //     if (resjson.result === "success") {
  //       alert("Genre successfully deleted!");
  //       setTriggerRefresh((prev) => !prev);
  //     } else {
  //       alert("Failed to delete genre!");
  //     }
  //   } catch (error) {
  //     console.error("Failed to delete genre:", error);
  //   }
  // };

  const { isFieldInError, getErrorsInField, isFormValid } = useValidation({
    fieldsRules: {
      title: { required: true },
      overview: { required: true, minlength: 50 },
      runtime: { required: true, numbers: true },
      releasedate: { required: true, date: true },
      homepage: { website: true },
      url: { website: true },
    },
    state: { judul_komik, deskripsi_komik, tanggal_rilis, nama_pengarang, thumbnail },
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

  // const renderComboBox = () => {
  //   return (
  //     <RNPickerSelect
  //       onValueChange={(value) => setSelectedGenre(value)}
  //       items={pilihanGenres}
  //       placeholder={{ label: "Tambahkan Genre Baru", value: null }}
  //     />
  //   );
  // };

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
        "title=" +
        judul_komik +
        "&" +
        "homepage=" +
        nama_pengarang +
        "&" +
        "overview=" +
        deskripsi_komik +
        "&" +
        "release_date=" +
        tanggal_rilis +
        "&" +
        "url=" +
        thumbnail +
        "&" +
        "id_komik=" +
        komikId,
    };
    try {
      fetch("https://ubaya.xyz/react/160421129/UAS/updatekomik.php", options)
        .then((response) => response.json())
        .then((resjson) => {
          console.log(resjson);
          if (resjson.result === "success") alert("sukses");
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
          if (resjson.result === "success") alert("sukses");
          setTriggerRefresh((prev) => !prev);
          setImageUri("");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteScene = async () => {
    const options = {
      method: "POST",
    };
    try {
      fetch("https://ubaya.xyz/react/160421129/UAS/deletescene.php", options)
        .then((response) => response.json())
        .then((resjson) => {
          console.log(resjson);
          if (resjson.result === "success") alert("sukses");
          setTriggerRefresh((prev) => !prev);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Judul"
        onChangeText={setJudul}
        value={judul_komik}
      />
      {renderJudulErrors()}

      <Text>Deskripsi</Text>
      <TextInput
        multiline
        numberOfLines={4}
        style={styles.input2}
        value={deskripsi_komik}
        onChangeText={setDeskripsi}
      />
      {renderDeskripsiErrors()}

      <Text>Tanggal Rilis</Text>
      <TextInput
        style={styles.input}
        onChangeText={setTanggalRilis}
        value={tanggal_rilis}
      />
      {renderTanggalRilisErrors()}

      <Text>Nama Pengarang</Text>
      <TextInput
        style={styles.input}
        onChangeText={setPengarang}
        value={nama_pengarang}
      />
      {renderPengarangErrors()}

      <Text>Thumbnail</Text>
      <TextInput style={styles.input} onChangeText={setThumbnail} value={thumbnail} />
      {renderThumbnailErrors()}
      {renderPoster()}

      {renderButtonSubmit()}

      {/* <Text>Genre:</Text>
      <FlatList
        data={genres}
        keyExtractor={(item) => item.genre_name}
        renderItem={({ item }) => (
          <View>
            <Text>{item.genre_name}</Text>
            <Button title="X" color="red" onPress={() => deleteGenre()} />
          </View>
        )}
      />
      {renderComboBox()} */}
      <Text>Scenes:</Text>
      <FlatList
        data={scenes}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View>
            <Image
              style={{ width: 300, height: 200 }}
              resizeMode="contain"
              source={{ uri: "https://ubaya.xyz/react/160421129/UAS/" + item }}
            ></Image>
            <Button title="Delete" color="red" onPress={() => deleteScene} />
          </View>
        )}
      ></FlatList>
      <Button
        title="Pilih Halaman"
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
          <Button title="Galeri" onPress={imgGaleri} />
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
