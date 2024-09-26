// RegisterScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../firebase/config'; // Certifique-se de que o caminho está correto
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const navigation = useNavigation();
  
  const [nome, setNome] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    setErrorMessage('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Usuário registrado com sucesso!');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  function handleLogin () {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={{fontSize:55, marginBottom:40}}>𝕐</Text>
      <Text style={{fontSize:20,marginBottom:20}}>Cadastre-se</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Nome de Usuário"
        value={username}
        onChangeText={setUsername}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

<TouchableOpacity   style={styles.button} onPress={handleRegister}>
  <Text style={{color:'#FFF', fontSize:19}}>cadastrar</Text>
</TouchableOpacity>

<Text style={styles.registerPrompt}>Já possui uma conta?</Text>
      <TouchableOpacity onPress={handleLogin}>
        <Text style={{textDecorationLine:'underline', color:'blue'}}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
},
title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#14171A',
},
input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingLeft: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#F5F8FA',
},
button: {
    width: '40%',
    height: 40,
    backgroundColor: '#1DA1F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 20,

},
buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
},
error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
}
});

export default RegisterScreen;
