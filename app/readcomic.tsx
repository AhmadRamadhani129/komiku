import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, Button, FlatList, StyleSheet } from 'react-native';

const ReadComic = ({ route }: any) => {
  const { comic } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Fetch comments from API
    fetch(`https://ubaya.xyz/react/160421129/getcomment.php=${comic.id}`)
      .then((response) => response.json())
      .then((data) => setComments(data))
      .catch((error) => console.error('Error fetching comments:', error));
  }, [comic]);

//   const handleCommentSubmit = () => {
//     fetch('http://your-server-url/api/add_comment.php', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ comic_id: comic.id, comment: newComment }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.success) {
//           setComments((prev) => [...prev, { user: 'You', comment: newComment }]);
//           setNewComment('');
//         }
//       })
//       .catch((error) => console.error('Error adding comment:', error));
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={comments}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => <Text>{item.user}: {item.comment}</Text>}
//       />
//       <TextInput
//         value={newComment}
//         onChangeText={setNewComment}
//         placeholder="Add a comment"
//       />
//       <Button title="Submit" onPress={handleCommentSubmit} />
//     </View>
//   );
};

export default ReadComic;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: "#fff",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center", // Tambahkan penyesuaian agar lebih rapi
    },
    categoryItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    categoryText: {
      fontSize: 18,
    },
  });
