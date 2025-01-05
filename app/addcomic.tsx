import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useValidation } from "react-simple-form-validator";

const AddComic = () => {
  const [judul_komik, setJudul] = useState("");
  const [deskripsi_komik, setDeskripsi] = useState("");
  const [tanggal_rilis, setTanggalRilis] = useState("");
  const [nama_pengarang, setPengarang] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const { isFieldInError, getErrorsInField, isFormValid } = useValidation({
    fieldsRules: {
      judul_komik: { required: true },
      deskripsi_komik: { required: true, minlength: 50 },
      tanggal_rilis: { required: true, date: true },
      nama_pengarang: { required: true },
      thumbnail: { website: true },
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

  const renderButtonSubmit = () => {
    if (isFormValid) {
      return <Button title="Submit" onPress={submitData} />;
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
        "tanggal_rilis=" +
        tanggal_rilis +
        "&" +
        "nama_pengarang=" +
        nama_pengarang +
        "&" +
        "thumbnail=" +
        thumbnail,
    };
    try {
      fetch("https://ubaya.xyz/react/160421129/UAS/addkomik.php", options)
        .then((response) => response.json())
        .then((resjson) => {
          console.log(resjson);
          if (resjson.result === "success") alert("sukses");
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        onChangeText={setJudul}
        value={judul_komik}
      />
      {renderJudulErrors()}

      <Text>Deskripsi</Text>
      <TextInput
        multiline
        numberOfLines={4}
        style={styles.input2}
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
      <TextInput style={styles.input} onChangeText={setPengarang} value={nama_pengarang} />
      {renderPengarangErrors()}

      <Text>Thumbnail</Text>
      <TextInput style={styles.input} onChangeText={setThumbnail} value={thumbnail} />
      {renderThumbnailErrors()}

      {renderButtonSubmit()}
    </ScrollView>
  );
};

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
});
export default AddComic;
