import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { firestore, storage } from '../firebase/config';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { auth } from '../firebase/config'; 
import { signOut } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const currentUser = auth.currentUser; 

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const q = query(
            collection(firestore, 'users'), 
            where('uid', '==', currentUser.uid)
          );
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            setUserData({ id: doc.id, ...doc.data() });
          });
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
  }, [currentUser]);

  const handleLogout = async () => {
    try {
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
    <View style={{ padding: 20 }}>
      {userData ? (
        <>
          <Image
            source={userData.perfil ? { uri: userData.perfil } : require('../assets/profile.jpg')}
            style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 20 }}
          />
          <Text>Nome: {userData.nome}</Text>
          
          <TouchableOpacity onPress={pickImage}>
            <Text style={{ color: 'blue', textDecorationLine: 'underline', marginTop: 10 }}>Alterar foto de perfil</Text>
          </TouchableOpacity>

          {uploading ? <ActivityIndicator size="small" color="#0000ff" /> : null}

          <Button title="Editar Perfil" />
        </>
      ) : (
        <Text>Erro no cadastro, exclua esta conta.</Text>
      )}
      <View style={{ margin: 20 }}>
        <Button title="Sair" onPress={handleLogout} />
      </View>
    </View>
  );
};

export default ProfileScreen;
