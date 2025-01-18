import React, { useEffect, useState } from "react";  
import {  
  StyleSheet,  
  View,  
  Text,  
  FlatList,  
  TextInput,  
  Button,  
} from "react-native";  
import { ScrollView } from "react-native-gesture-handler";  
import { Card, Image } from "@rneui/base";  
import { useNavigation } from "@react-navigation/native";  
import { useLocalSearchParams } from "expo-router";  
  
const ListComic = () => {  
  const [katId, setKatId] = useState("");  
  const [data, setData] = useState(null);  
  const [cari, setCari] = useState("");  
  const navigation = useNavigation();  
  const params = useLocalSearchParams();  
  
  const fetchData = async () => {  
    const options = {    
        method: "POST",    
        headers: { "Content-Type": "application/x-www-form-urlencoded" },    
        body: "cat_id=" + katId,    
    };    
    try {  
        const response = await fetch(  
            "https://ubaya.xyz/react/160421129/UAS/getkategorikomik.php", options  
        );  
        const resjson = await response.json();  
        console.log("API Response:", resjson); 
        setData(resjson.data);  
    } catch (error) {  
        console.log(error);  
    }  
  };    
  
  useEffect(() => {  
    if (params.idKategori) {  
      setKatId(params.idKategori.toString());  
    }  
  }, [params.idKategori]);  
  
  useEffect(() => {  
    if (katId) {  
      fetchData();  
    }  
  }, [katId]);  
  
  const showData = (data) => {  
    return (  
      <View style={styles.container}>  
        <FlatList  
          data={data}  
          keyExtractor={(item) => item.id_komik.toString()}  
          renderItem={({ item }) => (  
            <Card>  
              <Card.Title>{item.judul_komik}</Card.Title>  
              <Card.Divider />  
              <View style={{ position: "relative", alignItems: "center" }}>  
                <Image  
                  style={{ width: 300, height: 500 }}  
                  resizeMode="contain"  
                  source={{ uri: item.thumbnail }}  
                />  
                <Text numberOfLines={3} ellipsizeMode="tail">  
                  {item.deskripsi_komik}  
                </Text>  
                <Text>Nama Pembuat: {item.nama_pengarang}</Text>  
                <Text>Rating: {item.avg_rating}</Text> {/* Menampilkan rata-rata rating */}  
                <Button  
                  title="Lihat Detail"  
                  onPress={() =>  
                    navigation.navigate("detailcomic", {  
                      idKomik: item.id_komik,  
                    })  
                  }  
                />  
              </View>  
            </Card>  
          )}  
        />  
      </View>  
    );  
  };  
    
  
  useEffect(() => {  
    fetchData();  
  }, []);  
  
  return (  
    <ScrollView>  
      <Card>  
        <View style={styles.viewRow}>  
          <Text>Cari </Text>  
          <TextInput  
            style={styles.input}  
            onChangeText={setCari}  
            onSubmitEditing={fetchData}  
          />  
        </View>  
      </Card>  
      {data && showData(data)}  
    </ScrollView>  
  );  
};  
  
export default ListComic;  
  
const styles = StyleSheet.create({  
  page: {  
    flex: 1,  
    backgroundColor: "#f8f9fa",  
    padding: 10,  
  },  
  container: {  
    padding: 10,  
    backgroundColor: "#fff",  
    borderRadius: 8,  
    elevation: 2,  
  },  
  header: {  
    fontSize: 18,  
    fontWeight: "bold",  
    marginBottom: 10,  
    textAlign: "center",  
  },  
  list: {  
    paddingBottom: 10,  
  },  
  card: {  
    backgroundColor: "#e9ecef",  
    borderRadius: 8,  
    padding: 15,  
    marginVertical: 8,  
    marginHorizontal: 10,  
    elevation: 1,  
  },  
  title: {  
    fontSize: 16,  
    fontWeight: "600",  
    color: "#495057",  
  },  
  input: {  
    height: 40,  
    width: 200,  
    borderWidth: 1,  
    padding: 10,  
  },  
  viewRow: {  
    flexDirection: "row",  
    justifyContent: "flex-end",  
    alignItems: "center",  
    paddingRight: 50,  
    margin: 3,  
  },  
});  
