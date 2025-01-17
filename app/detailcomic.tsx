import {  
  StyleSheet,  
  View,  
  Text,  
  ScrollView,  
  FlatList,  
  Button,  
  TextInput,  
} from "react-native";  
import React, { useEffect, useState } from "react";  
import { useLocalSearchParams, useRouter } from "expo-router";  
import { Card, Icon, Image } from "@rneui/base";  
import AsyncStorage from "@react-native-async-storage/async-storage";  
  
const DetailComic = () => {  
  const [comicId, setComicId] = useState("");  
  const [comicDetails, setComicDetails] = useState({  
    id_komik: "",  
    judul_komik: "",  
    deskripsi_komik: "",  
    tanggal_rilis: "",  
    nama_pengarang: "",  
    thumbnail: "",  
    kategori: [],  
    halaman: [],  
  });  
  const [ratingsAndComments, setRatingsAndComments] = useState([]);  
  const [newComment, setNewComment] = useState("");  
  const [newRating, setNewRating] = useState(0);  
  const [loading, setLoading] = useState(true);  
  const [commentsLoading, setCommentsLoading] = useState(true);  
  const [username, setUsername] = useState("");  
  
  const router = useRouter();  
  const params = useLocalSearchParams();  
  
  useEffect(() => {  
    if (params.idKomik) {  
      setComicId(params.idKomik.toString());  
    }  
  }, [params.idKomik]);  
  
  const fetchComicDetails = async () => {  
    setLoading(true);  
    const options = {  
      method: "POST",  
      headers: { "Content-Type": "application/x-www-form-urlencoded" },  
      body: "id=" + comicId,  
    };  
    try {  
      const response = await fetch(  
        "https://ubaya.xyz/react/160421129/UAS/detailkomik.php",  
        options  
      );  
      const resjson = await response.json();  
      console.log("API Response:", resjson); // Add this line  
  
      if (resjson.result === "success") {  
        console.log("Comic Pages:", resjson.data.halaman); // Add this line  
        setComicDetails(resjson.data);  
      } else {  
        console.error("Error fetching comic details:", resjson.message);  
      }  
    } catch (error) {  
      console.error("Failed to fetch comic details:", error);  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  useEffect(() => {  
    if (comicId) {  
      fetchComicDetails();  
    }  
  }, [comicId]);  
  
  useEffect(() => {  
    const fetchRatingsAndComments = async () => {  
      setCommentsLoading(true);  
      const options = {  
        method: "POST",  
        headers: { "Content-Type": "application/x-www-form-urlencoded" },  
        body: "id=" + comicId,  
      };  
      try {  
        const response = await fetch(  
          "https://ubaya.xyz/react/160421129/UAS/detailkomik.php",  
          options  
        );  
        const data = await response.json();  
        if (data.result === "success" && data.data.komentar) {  
          setRatingsAndComments(data.data.komentar);  
        } else {  
          console.error("Error fetching comments:", data.message);  
          setRatingsAndComments([]);  
        }  
      } catch (error) {  
        console.error("Error fetching ratings and comments:", error);  
        setRatingsAndComments([]);  
      } finally {  
        setCommentsLoading(false);  
      }  
    };  
  
    if (comicId) {  
      fetchRatingsAndComments();  
    }  
  }, [comicId]);  
  
  useEffect(() => {  
    const getUsername = async () => {  
      try {  
        const id = await AsyncStorage.getItem("username");  
        if (id) {  
          setUsername(id);  
        } else {  
          alert("Please log in to comment or rate");  
        }  
      } catch (error) {  
        console.error("Failed to retrieve user ID:", error);  
      }  
    };  
    getUsername();  
  }, []);  
  
  const submitRatingComment = async () => {  
    if (!newComment.trim() || newRating === 0) {  
      alert("Please enter both a comment and rating");  
      return;  
    }  
  
    if (!username) {  
      alert("You must be logged in to submit a comment or rating");  
      return;  
    }  
  
    const formData = new URLSearchParams({  
      id_komik: comicId.toString(),  
      id_user: username, // Gunakan user_id dari state  
      rating: newRating.toString(),  
      komentar: newComment,  
    }).toString();  
  
    try {  
      const response = await fetch(  
        "https://ubaya.xyz/react/160421129/UAS/addratingkomentar.php",  
        {  
          method: "POST",  
          headers: {  
            "Content-Type": "application/x-www-form-urlencoded",  
          },  
          body: formData,  
        }  
      );  
      const data = await response.json();  
      if (data.result === "success") {  
        alert(data.message);  
        setNewComment("");  
        setNewRating(0);  
        fetchComicDetails(); // Refresh data  
      }  
    } catch (error) {  
      console.error("Error submitting rating and comment:", error);  
      alert("Failed to submit review. Please try again.");  
    }  
  };  
  
  const deleteData = async () => {  
    try {  
      const response = await fetch(  
        "https://ubaya.xyz/react/160421129/UAS/deletecomic.php",  
        {  
          method: "POST",  
          headers: {  
            "Content-Type": "application/x-www-form-urlencoded",  
          },  
          body: `id=${comicId}`,  
        }  
      );  
      const data = await response.json();  
      if (data.result === "success") {  
        console.log("Comic successfully deleted!");  
        router.back();  
      } else {  
        console.error("Error deleting comic:", data.error);  
      }  
    } catch (error) {  
      console.error(error);  
    }  
  };  
  
  return (  
    <ScrollView>  
      {loading ? (  
        <Text>Loading...</Text>  
      ) : comicDetails ? (  
        <View>  
          <Card>  
            <Card.Title>{comicDetails.judul_komik}</Card.Title>  
            <Card.Divider />  
            <View style={{ position: "relative", alignItems: "center" }}>  
              <Image  
                style={{ width: 300, height: 500 }}  
                resizeMode="contain"  
                source={{ uri: comicDetails.thumbnail }}  
              />  
              <Text numberOfLines={10} ellipsizeMode="tail">
                {comicDetails.deskripsi_komik}
              </Text>  
              <Text>Kategori:</Text>  
              {comicDetails.kategori?.length > 0 ? (  
                <FlatList  
                  data={comicDetails.kategori}  
                  keyExtractor={(item, index) => index.toString()}  
                  renderItem={({ item }) => (  
                    <View>  
                      <Text>{item.nama_kategori}</Text>  
                    </View>  
                  )}  
                />  
              ) : (  
                <Text>No categories available</Text>  
              )}  
              <Text>Nama Pengarang: {comicDetails.nama_pengarang}</Text>  
  
              <Text style={{ marginTop: 20, fontSize: 18, fontWeight: "bold" }}>  
                Halaman Komik:  
              </Text>  
              {comicDetails.halaman && comicDetails.halaman.length > 0 ? (  
                <FlatList  
                  data={comicDetails.halaman}  
                  keyExtractor={(item) => item}  
                  renderItem={({ item }) => (  
                    <View>  
                      <Image  
                        style={{ width: 350, height: 600 }}  
                        resizeMode="contain"  
                        source={{  
                          uri: `https://ubaya.xyz/react/160421129/UAS/${item}`,  
                        }}  
                      />  
                    </View>  
                  )}  
                />  
              ) : (  
                <Text>No pages available</Text>  
              )}  
  
              <Text style={{ marginTop: 20, fontSize: 18, fontWeight: "bold" }}>  
                Rating dan Komentar:  
              </Text>  
  
              {commentsLoading ? (  
                <Text>Loading comments...</Text>  
              ) : ratingsAndComments?.length > 0 ? (  
                <FlatList  
                  data={ratingsAndComments}  
                  keyExtractor={(item, index) => index.toString()}  
                  renderItem={({ item }) => (  
                    <Card containerStyle={{ marginBottom: 10 }}>  
                      <View>  
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>  
                          <Icon name="person" size={20} />{" "}  
                          {item.id_user || "Anonim"}  
                        </Text>  
                        <Text>Rating: {item.rating || "Tidak ada rating"}</Text>  
                        <Text>  
                          Komentar: {item.komentar || "Tidak ada komentar"}  
                        </Text>  
                      </View>  
                    </Card>  
                  )}  
                />  
              ) : (  
                <Text style={{ marginTop: 10 }}>Tidak ada komentar.</Text>  
              )}  
              <TextInput  
                value={newRating.toString()}  
                onChangeText={(text) => setNewRating(Number(text))}  
                keyboardType="numeric"  
                placeholder="Rating (1-10)"  
                style={styles.input}  
              />  
              <TextInput  
                value={newComment}  
                onChangeText={setNewComment}  
                placeholder="Your comment"  
                style={styles.input}  
              />  
              <Button  
                title="Submit Rating and Comment"  
                onPress={submitRatingComment}  
              />  
            </View>  
            {/* Ganti Link dengan Button untuk Edit */}  
            <Button  
              title="Edit Komik"  
              onPress={() => {  
                router.push({  
                  pathname: "/editcomic",  
                  params: { comicid: comicDetails.id_komik },  
                });  
              }}  
            />  
            <Button title="Hapus Komik" onPress={deleteData} />  
          </Card>  
        </View>  
      ) : (  
        <Text>Loading...</Text>  
      )}  
    </ScrollView>  
  );  
};  
  
const styles = StyleSheet.create({  
  input: {  
    borderWidth: 1,  
    borderColor: "#ccc",  
    padding: 10,  
    marginVertical: 10,  
    borderRadius: 5,  
  },  
});  
  
export default DetailComic;  
