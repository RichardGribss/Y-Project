import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import { firestore, auth } from '../firebase/config';
import PostItem from './PostItem';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    const fetchPosts = async () => {
      try {
        const postsQuery = query(collection(firestore, 'posts'), orderBy('data', 'desc'));
        const postSnapshot = await getDocs(postsQuery);

        const postList = await Promise.all(
          postSnapshot.docs.map(async (postDoc) => {
            const postData = { id: postDoc.id, ...postDoc.data() };

            if (postData.autor) {
              const userDocRef = doc(firestore, 'users', postData.autor);
              const userDoc = await getDoc(userDocRef);
              postData.autor = userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
            } else {
              postData.autor = null;
            }
            return postData;
          })
        );

        setPosts(postList);
    
      } catch (error) {
        console.error("Erro ao buscar posts: ", error);
      }
    };

    fetchPosts();
    return () => unsubscribe();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <PostItem
            texto={item.texto}
            img={item.img}
            autor={item.autor}
            id={item.id}
            userId={userId}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Feed;
