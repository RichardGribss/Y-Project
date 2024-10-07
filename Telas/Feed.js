import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import { firestore, auth } from '../firebase/config';
import PostItem from './PostItem';
import { BlurView } from 'expo-blur';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [visible, setVisible] = useState(null);
  const [loading, setLoading] = useState(false); // Estado para controle de carregamento
  const nav = useNavigation();

  const fetchPosts = async () => {
    setLoading(true); // Define o estado de carregamento como verdadeiro
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
    } finally {
      setLoading(false); // Define o estado de carregamento como falso após a busca
    }
  };

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
          setUserId(user.uid);
          setVisible(false);
        } else {
          setUserId(null);
          const timer = setTimeout(() => {
            setVisible(true);
          }, 5000); // Espera 5 segundos

          // Limpa o timer se o componente for desmontado
          return () => clearTimeout(timer);
        }
      });

      fetchPosts(); // Chama a função para buscar posts na montagem do componente

      return () => unsubscribe();
    }, [])
  );

  function logon() {
    nav.navigate('Person');
  }

  return (
    <View style={{ flex: 1 }}>
      {visible && ( // Renderiza a mensagem de login apenas se 'visible' for true
        <BlurView
          intensity={100}
          style={{
            position: 'absolute',
            width: '100%',
            textAlign: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            height: '100%',
            zIndex: 2,
          }}
        >
          <View
            style={{
              backgroundColor: '#FFF',
              borderColor: '#dedede',
              padding: 20,
              borderWidth: 1,
              borderRadius: 24,
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: '10%',
            }}
          >
            <Text style={{ textAlign: 'center', borderBottomWidth: 1, fontSize: 24, fontWeight: '400' }}>𝕐</Text>
            <Text style={{ textAlign: 'center', marginTop: 5 }}>Entre para continuar</Text>
            <TouchableOpacity onPress={logon}>
              <Text
                style={{
                  textAlign: 'center',
                  backgroundColor: '#00BFFF',
                  padding: 5,
                  borderRadius: 24,
                  fontSize: 18,
                  margin: 10,
                  color: '#FFF',
                }}
              >
                Cadastrar/Entrar
              </Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      )}

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
        refreshControl={
          <RefreshControl
            refreshing={loading} // Exibe o indicador de carregamento
            onRefresh={fetchPosts} // Chama a função fetchPosts ao arrastar para baixo
          />
        }
      />
    </View>
  );
};

export default Feed;
