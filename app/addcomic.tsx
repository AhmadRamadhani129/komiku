import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";

const AddComic = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [categories, setCategories] = useState("");
  const [poster, setPoster] = useState("");

  const handleAddComic = async () => {
    if (!title || !description || !author || !categories || !poster) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      const response = await fetch("https://ubaya.xyz/react/160421129/addcomic.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          author,
          categories: categories.split(","), // Ubah string kategori menjadi array
          poster,
        }),
      });

      const result = await response.json();
      if (result.success) {
        Alert.alert("Success", "Comic added successfully");
        setTitle("");
        setDescription("");
        setAuthor("");
        setCategories("");
        setPoster("");
      } else {
        Alert.alert("Error", result.message || "Failed to add comic");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while adding the comic");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Comic</Text>
      <TextInput
        placeholder="Title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Description"
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        placeholder="Author"
        style={styles.input}
        value={author}
        onChangeText={setAuthor}
      />
      <TextInput
        placeholder="Categories (comma-separated)"
        style={styles.input}
        value={categories}
        onChangeText={setCategories}
      />
      <TextInput
        placeholder="Poster URL"
        style={styles.input}
        value={poster}
        onChangeText={setPoster}
      />
      <Button title="Add" onPress={handleAddComic} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
});

export default AddComic;
