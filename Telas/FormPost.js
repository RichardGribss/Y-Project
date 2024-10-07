import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { setDoc, doc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { firestore, auth, storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const CreatePost = () => {
  const [texto, setTexto] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
          setUserLoggedIn(true);
        } else {
          navigation.navigate('Person');
        }
        setLoadingAuth(false);
      });

      return () => unsubscribe();
    }
  }, [isFocused, navigation]);

  const pickImage = async () => {
    const options = ['Tirar Foto', 'Escolher da Galeria', 'Cancelar'];
    Alert.alert('Selecione uma opção', '', [
      {
        text: options[0],
        onPress: () => launchCamera(),
      },
      {
        text: options[1],
        onPress: () => launchGallery(),
      },
      { text: options[2], style: 'cancel' },
    ]);
  };

  const launchGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    } else {
      console.log("Imagem não selecionada ou operação cancelada.");
    }
  };

  const launchCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    } else {
      console.log("Foto não tirada ou operação cancelada.");
    }
  };

  const uploadImage = async () => {
    if (!imageUri) return null;

    const response = await fetch(imageUri);
    const blob = await response.blob();

    const storageRef = ref(storage, `images/${generateUniqueId()}`);

    await uploadBytes(storageRef, blob);

    const downloadUrl = await getDownloadURL(storageRef);

    return downloadUrl;
  };

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
  };

  const createPost = async () => {
    if (texto.trim() === '') {
      alert('Por favor, insira algum texto para o post.');
      return;
    }

    try {
      setUploading(true);

      const postId = generateUniqueId();
      const imageUrl = await uploadImage();

      const newPost = {
        id: postId,
        texto: texto,
        img: imageUrl,
        autor: auth.currentUser.uid,
        data: new Date(),
      };

      await setDoc(doc(firestore, 'posts', postId), newPost);

      setTexto('');
      setImageUri(null);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      console.error('Erro ao criar post: ', error);
      alert('Erro ao criar post.');
    } finally {
      setUploading(false);
    }
  };

  if (loadingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b5998" />
      </View>
    );
  }

  if (!userLoggedIn) {
    return null;
  }

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Criar Novo Post</Text>

      <TextInput
        value={texto}
        onChangeText={(text) => setTexto(text)}
        placeholder="Escreva algo..."
        style={{
          height: 100,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 10,
          padding: 10,
          textAlignVertical: 'top',
          marginBottom: 15,
        }}
        multiline={true}
        keyboardType="default"
      />

      <TouchableOpacity onPress={pickImage} style={{ marginBottom: 15 }}>
        <Text style={{ color: '#3b5998' }}>Escolher Imagem</Text>
      </TouchableOpacity>

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 10,
            marginBottom: 15,
            alignSelf: 'center',
          }}
        />
      )}

      {uploading && <ActivityIndicator size="large" color="#3b5998" />}

      <TouchableOpacity
        onPress={createPost}
        style={{
          backgroundColor: '#3b5998',
          padding: 15,
          borderRadius: 10,
          alignItems: 'center',
        }}
        disabled={uploading}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
          {uploading ? 'Criando Post...' : 'Criar Post'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreatePost;
