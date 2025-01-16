import { StyleSheet, View, Text, FlatList, TextInput } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Card, Image } from "@rneui/base";
import { Link } from "expo-router";

class ListComic extends React.Component {
  state = {
    data: null,
    cari: "",
  };

  fetchData = async () => {
    const options = {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
      body: "cari=" + this.state.cari,
    };
    try {
      fetch("https://ubaya.xyz/react/160421129/UAS/komik.php")
        .then((response) => response.json())
        .then((resjson) => {
          this.setState({
            data: resjson.data,
            // tes: resjson.data[0].title,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  showData(data: any) {  
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
                <Link  
                  push  
                  href={{  
                    pathname: "/detailcomic",  
                    params: { idKomik: item.id_komik },  
                  }}  
                >  
                  Lihat Detail  
                </Link>  
              </View>  
            </Card>  
          )}  
        />  
      </View>  
    );  
  }    

  componentDidMount() {
    this.fetchData();
  }

  render() {
    return (
      <ScrollView>
        <Card>
          <View style={styles.viewRow}>
            <Text>Cari </Text>
            <TextInput
              style={styles.input}
              onChangeText={(cari) => this.setState({ cari })}
              onSubmitEditing={() => this.fetchData()}
            />
          </View>
        </Card>
        {this.showData(this.state.data)}
      </ScrollView>
    );
  }
}

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
