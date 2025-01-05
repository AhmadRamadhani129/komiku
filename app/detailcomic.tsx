import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    FlatList,
    Button,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { Link, useLocalSearchParams, useRouter } from "expo-router";
  import { Card, Image } from "@rneui/base";
  
  const DetailComic = () => {
    const [comicId, setComicId] = useState("");
  
    const [comicDetails, setComicDetails] = useState({
      id_komik: "",
      judul_komik: "",
      deskripsi_komik: "",
      tanggal_rilis: "",
      nama_pengarang: "",
      thumbnail: "",
      kategoris: null,
      scenes: null,
    });
  
    // const [castDetails, setCastDetails] = useState<CastDetail[]>([]);
    const params = useLocalSearchParams();
    const router = useRouter();
  
    useEffect(() => {
      if (params.idKomik) {
        setComicId(params.idKomik.toString());
      }
    }, [params.comicid]);
  
    useEffect(() => {
      const fetchComicDetails = async () => {
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
  
          if (resjson.result === "success") {
            setComicDetails(resjson.data); // Set movie data
          } else {
            console.error("Error fetching comic details:", resjson.message);
          }
        } catch (error) {
          console.error("Failed to fetch comic details:", error);
        }
      };
  
      if (comicId) {
        fetchComicDetails(); // Call fetchMovieDetails
      }
    }, [comicId]);
  
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
        {comicDetails ? (
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
                <Text>{comicDetails.deskripsi_komik}</Text>
                <Text>Kategori:</Text>
                <FlatList
                  data={comicDetails.kategoris}
                  keyExtractor={(item) => item.nama_kategori}
                  renderItem={({ item }) => (
                    <View>
                      <Text>{item.nama_kategori}</Text>
                    </View>
                  )}
                />
                <Text>Nama Pengarang: {comicDetails.nama_pengarang}</Text>
              </View>
              <Link
                push
                href={{
                  pathname: "/editcomic",
                  params: { comicid: comicDetails.id_komik },
                }}
              >
                Edit
              </Link>
              <Button title="Hapus Komik" onPress={deleteData} />
            </Card>
            <Text>Scenes:</Text>
            <FlatList
              data={comicDetails.scenes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <View>
                  <Image
                    style={{ width: 300, height: 200 }}
                    resizeMode="contain"
                    source={{ uri: `https://ubaya.xyz/react/160421129/UAS/${item}` }}
                  />
                </View>
              )}
            />
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </ScrollView>
    );
  };
  
  export default DetailComic;
  