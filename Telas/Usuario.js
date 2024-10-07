import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, FlatList } from 'react-native';
import { doc, getDoc, getDocs, query, collection, where } from 'firebase/firestore';
import { firestore } from '../firebase/config';
import PostItem from './PostItem';

const UserProfile = ({ route }) => {
  const { userId } = route.params;
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDoc = await getDoc(doc(firestore, 'users', userId));
        if (userDoc.exists()) {
          setUser(userDoc.data());
          
          const postsQuery = query(
            collection(firestore, 'posts'),
            where('autor', '==', userId)
          );
          const postSnapshot = await getDocs(postsQuery);
          const userPosts = await Promise.all(
            postSnapshot.docs.map(async (postDoc) => {
              const postData = { id: postDoc.id, ...postDoc.data() };
              if (postData.autor) {
                const userDocRef = doc(firestore, 'users', postData.autor);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                  postData.autor = { id: userDoc.id, ...userDoc.data() };
                } else {
                  postData.autor = null;
                }
              }
              return postData;
            })
          );
           setPosts(userPosts);
        }
      } catch (error) {
        console.error("Erro ao buscar usuário: ", error);
      }
        
    };

    fetchUser();
 
    
  }, [userId]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {user ? (
        <>
          <Image
            source={user.perfil ? { uri: user.perfil } : require('../assets/profile.jpg')}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <Text style={{ fontSize: 24 }}>{user.nome}</Text>
          <Text>{user.email}</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>Posts</Text>
          <ScrollView style={{ height: 150, width:'100%' }}>
            {posts.length > 0 ? (
              <FlatList
                data={posts}
                renderItem={({ item }) => (
                  <PostItem
                    texto={item.texto}
                    img={item.img}
                    autor={item.autor}
                    id={item.id}
                    userId={userId}
                    dell={false}
                  />
                )}
                keyExtractor={(item) => item.id}
              />
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>O Usuário ainda não postou nada.</Text>
            )}
          </ScrollView>
        </>
      ) : (
        <Text>Carregando...</Text>
      )}

    </View>
  );
};

export default UserProfile;
