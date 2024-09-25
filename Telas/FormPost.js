import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const FormPost = () => {
  const [texto, setTexto] = useState('');
  const [img, setImg] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (texto) {
      try {
        await addDoc(collection(db, 'posts'), {
          texto: texto,
          img: img,
          data: new Date(),
        });
        setMessage('Post enviado com sucesso!');
        setTexto('');
        setImg('');
      } catch (error) {
        console.error('Erro ao enviar o post: ', error);
        setMessage('Erro ao enviar o post.');
      }
    } else {
      setMessage('Preencha todos os campos.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o texto"
        value={texto}
        onChangeText={setTexto}
      />
      <Text style={styles.label}>Conteúdo</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o link da imagem"
        value={img}
        onChangeText={setImg}
        multiline
      />
      
      <TouchableOpacity onPress={handleSubmit} style={{backgroundColor:'#0480c9', borderRadius:8}}>
      <Text style={{textAlign:'center',color:'#FFF',padding:12}}>Enviar</Text>
      </TouchableOpacity>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  message: {
    marginTop: 10,
    color: 'green',
    fontWeight: 'bold',
  },
});

export default FormPost;
