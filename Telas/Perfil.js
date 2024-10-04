import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { firestore, storage } from '../firebase/config';
import { collection, getDocs, query, where, doc, updateDoc, addDoc, orderBy, getDoc  } from 'firebase/firestore';
import { auth } from '../firebase/config'; 
import { signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import PostItem from './PostItem';

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [posts, setPosts] = useState([]); // Estado para os posts
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState(''); 
  const [userId, setUserId] = useState(null);
  const currentUser = auth.currentUser; 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserId(user.uid); // Armazena o ID do usuário logado
      } else {
        setUserId(null); // Limpa o ID se o usuário não estiver logado
      }
    });
    
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          // Busca os dados do usuário logado
          const userQuery = query(
            collection(firestore, 'users'),
            where('uid', '==', currentUser.uid) // Filtra pelo ID do usuário logado
          );
          const userSnapshot = await getDocs(userQuery);
    
          userSnapshot.forEach((doc) => {
            setUserData({ id: doc.id, ...doc.data() }); // Armazena os dados do usuário
          });
    
          // Busca os posts do usuário logado
          const postsQuery = query(
            collection(firestore, 'posts'),
            where('autor', '==', currentUser.uid) // Filtra os posts pelo ID do usuário logado
          );
          const postSnapshot = await getDocs(postsQuery);
    
          // Para cada post, buscar as informações do autor (nome, perfil, etc.)
          const userPosts = await Promise.all(
            postSnapshot.docs.map(async (postDoc) => {
              const postData = { id: postDoc.id, ...postDoc.data() };
    
              // Verifica se o post tem um autor válido
              if (postData.autor) {
                // Busca os dados do autor (nome, perfil, etc.) da coleção 'users'
                const userDocRef = doc(firestore, 'users', postData.autor);
                const userDoc = await getDoc(userDocRef);
    
                if (userDoc.exists()) {
                  postData.autor = { id: userDoc.id, ...userDoc.data() }; // Armazena as informações do autor
                } else {
                  postData.autor = null; // Se o autor não existir
                }
              }
    
              return postData;
            })
          );
    
          setPosts(userPosts); // Armazena os posts com informações do autor
    
        } catch (error) {
          console.error("Error fetching user data: ", error);
        } finally {
          setLoading(false); // Certifica que o loading será desativado
        }
      } else {
        setLoading(false); // Desativa o loading se não houver usuário logado
      }
    };
    

    fetchUserData();
    return () => unsubscribe();
  }, [currentUser]);


  const handleLogout = async () => {
    try {
      setUserData(null)
      await signOut(auth);
    } catch (error) {
      alert('Erro', error.message);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);  // Use result.assets[0].uri for the selected image
    }
  };

  const uploadImage = async (uri) => {
    setUploading(true);
    const response = await fetch(uri);
    const blob = await response.blob();
    const imageRef = ref(storage, `profilePictures/${currentUser.uid}/profile.jpg`); // Use a file name for better management
    
    try {
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);
      
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      await updateDoc(userDocRef, { perfil: downloadURL });

      setUserData((prevData) => ({
        ...prevData,
        perfil: downloadURL,
      }));
  
      alert('Foto de perfil atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      alert('Erro ao enviar imagem.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

 


  return (
    <View style={{  justifyContent:'center', alignItems:'center' }}>
      {userData ? (
        <>
        
          <Image
            source={userData.perfil ? { uri: userData.perfil } : require('../assets/profile.jpg')}
            style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 10 }}
          />
          <Text style={{fontSize:20, fontWeight:'bold'}}>{userData.nome}</Text>
          
          <TouchableOpacity onPress={pickImage}>
            <Text style={{ margin: 10, backgroundColor:'#DDA910', color:"#FFF", padding:5, borderRadius:15 }}>Alterar foto de perfil</Text>
          </TouchableOpacity>

          {uploading ? <ActivityIndicator size="large" color="#0000ff" /> : null}

          <TouchableOpacity style={{ margin: 10, backgroundColor:'#2499c7', padding:1, paddingHorizontal:10, borderRadius:15 }}>
            <Text style={{color:'#FFF', fontSize:18}}>Editar Perfil</Text>
          </TouchableOpacity>

       
          <View style={{ marginTop: 20, width: '100%' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign:'center' }}>Posts</Text>
            <ScrollView style={{height:400}}>
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
             </ScrollView>
          </View>
 
        </>
      ) : (
        <Text>Erro no cadastro, exclua esta conta.</Text>
      )}
      <TouchableOpacity style={{ margin: 10, backgroundColor:'#ef381e', padding:1, paddingHorizontal:10, borderRadius:15 }} onPress={handleLogout}>
        <Text style={{color:'#FFF', fontSize:17}}>Sair</Text>
      </TouchableOpacity>
    
    </View>
  );
};

export default ProfileScreen;
