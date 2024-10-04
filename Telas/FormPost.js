import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { setDoc, doc } from 'firebase/firestore'; // Usar setDoc e doc para criar um ID
import * as ImagePicker from 'expo-image-picker';
import { firestore, auth, storage } from '../firebase/config'; // Certifique-se de importar o storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Importar funções do Firebase Storage
import { v4 as uuidv4 } from 'uuid'; // Gera um ID único

const CreatePost = ({ navigation }) => {
  const [texto, setTexto] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri); // Acessa a URI correta da imagem selecionada
    } else {
      console.log("Imagem não selecionada ou operação cancelada.");
    }
  };

  // Função para enviar a imagem para o Firebase Storage
  const uploadImage = async () => {
    if (!imageUri) return null; // Se não houver imagem, retornar nulo

    const response = await fetch(imageUri); // Pegar a URI da imagem
    const blob = await response.blob(); // Converter a imagem em blob

    const storageRef = ref(storage, `images/${uuidv4()}`); // Gera um nome único para a imagem no Firebase Storage

    // Enviar a imagem para o Firebase Storage
    await uploadBytes(storageRef, blob);

    // Após o upload, recuperar a URL pública da imagem
    const downloadUrl = await getDownloadURL(storageRef);

    return downloadUrl; // Retorna a URL da imagem
  };

  // Função para criar o post
  const createPost = async () => {
    if (texto.trim() === '') {
      alert('Por favor, insira algum texto para o post.');
      return;
    }

    try {
      setUploading(true);

      // Gera um ID manualmente usando uuid
      const postId = uuidv4();

      // Upload da imagem para o Firebase Storage e pegar o URL
      const imageUrl = await uploadImage(); 

      // Cria um novo post
      const newPost = {
        id: postId, // Adiciona o ID gerado manualmente
        texto: texto,
        img: imageUrl , // Salva a URL da imagem se tiver
        autor: auth.currentUser.uid, // Captura o ID do autor autenticado
        data: new Date(), // Data atual
      };

      // Salva o post no Firestore usando setDoc com um ID manual
      await setDoc(doc(firestore, 'posts', postId), newPost);

      alert('Post criado com sucesso!');
      setTexto('');
      setImageUri(null);

      // Redireciona para o feed ou outra página
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao criar post: ', error);
      alert('Erro ao criar post.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Criar Novo Post</Text>

      {/* Campo de texto para o post */}
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
      />

     
      <TouchableOpacity onPress={pickImage} style={{ marginBottom: 15 }}>
        <Text style={{ color: '#3b5998' }}>Escolher Imagem</Text>
      </TouchableOpacity>

    
      
      {imageUri && (
  <Image
    source={{ uri: imageUri }}
    style={{
      width: 100, // Miniatura
      height: 100, // Miniatura
      borderRadius: 10,
      marginBottom: 15,
      alignSelf: 'center',
    }}
  />
)}
 

   
      {uploading && <ActivityIndicator size="large" color="#3b5998" />}

      {/* Botão para criar post */}
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
