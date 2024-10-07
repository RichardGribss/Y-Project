import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { firestore, storage } from '../firebase/config';
import { collection, getDocs, query, where, doc, updateDoc, addDoc, orderBy, getDoc } from 'firebase/firestore';
import { auth } from '../firebase/config'; 
import { signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import PostItem from './PostItem';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBio, setNewBio] = useState('');
  const currentUser = auth.currentUser;
  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        navigation.navigate('Login');
      }
    });

    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userQuery = query(
            collection(firestore, 'users'),
            where('uid', '==', currentUser.uid)
          );
          const userSnapshot = await getDocs(userQuery);

          userSnapshot.forEach((doc) => {
            setUserData({ id: doc.id, ...doc.data() });
            setNewName(doc.data().nome); // Preenche o novo nome com o nome atual
            setNewBio(doc.data().bio || ''); // Preenche o novo bio, caso exista
          });

          const postsQuery = query(
            collection(firestore, 'posts'),
            where('autor', '==', currentUser.uid)
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
        } catch (error) {
          console.error("Error fetching user data: ", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
    return () => unsubscribe();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      setUserData(null);
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
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    setUploading(true);
    const response = await fetch(uri);
    const blob = await response.blob();
    const imageRef = ref(storage, `profilePictures/${currentUser.uid}/profile.jpg`);

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

  const handleEditProfile = async () => {
    try {
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      await updateDoc(userDocRef, { nome: newName, bio: newBio });
      setUserData((prevData) => ({
        ...prevData,
        nome: newName,
        bio: newBio,
      }));
      setModalVisible(false);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      {userData ? (
        <>
          <Image
            source={userData.perfil ? { uri: userData.perfil } : require('../assets/profile.jpg')}
            style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 10 }}
          />
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{userData.nome}</Text>
          <Text style={{ fontSize: 15, marginBottom: 10 }}>{userData.bio || ''}</Text>
          
          <TouchableOpacity onPress={pickImage}>
            <Text style={{ margin: 10, backgroundColor: '#DDA910', color: "#FFF", padding: 5, borderRadius: 15 }}>Alterar foto de perfil</Text>
          </TouchableOpacity>

          {uploading ? <ActivityIndicator size="large" color="#0000ff" /> : null}

          <TouchableOpacity style={{ margin: 10, backgroundColor: '#2499c7', padding: 1, paddingHorizontal: 10, borderRadius: 15 }} onPress={() => setModalVisible(true)}>
            <Text style={{ color: '#FFF', fontSize: 18 }}>Editar Perfil</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 15, width: '100%' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>Posts</Text>
            <ScrollView style={{ height: 250 }}>
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
          dell={true}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  ) : (
    <Text style={{ textAlign: 'center', marginTop: 20 }}>O Usuário ainda não postou nada.</Text>
  )}
            </ScrollView>
          </View>
        </>
      ) : (
        <Text>Erro no cadastro, exclua esta conta.</Text>
      )}
      <TouchableOpacity style={{ margin: 10, backgroundColor: '#ef381e', padding: 1, paddingHorizontal: 10, borderRadius: 15 }} onPress={handleLogout}>
        <Text style={{ color: '#FFF', fontSize: 17 }}>Sair</Text>
      </TouchableOpacity>

      {/* Modal para editar perfil */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.1)' }}>
          <View style={{ width: '100%', backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Editar Perfil</Text>
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
              placeholder="Nome"
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              style={{ height: 80, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
              placeholder="Bio"
              value={newBio}
              onChangeText={setNewBio}
              multiline
            />
            <TouchableOpacity style={{ backgroundColor: '#2499c7', padding: 10, borderRadius: 5 }} onPress={handleEditProfile}>
              <Text style={{ color: '#FFF', textAlign: 'center' }}>Salvar</Text>
            </TouchableOpacity>
        
            <TouchableOpacity style={{ marginTop: 10 }} onPress={() => setModalVisible(false)}>
            <Text style={{ color: '#ef381e', textAlign: 'center' }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  </View>
);
};

export default ProfileScreen;
