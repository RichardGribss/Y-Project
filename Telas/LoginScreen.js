// LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../firebase/config'; // Importando a configuração do Firebase
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';


const LoginScreen = () => {
  const [isActive, setIsActive] = useState(false);
  const [text, setText] = useState('');

  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError(''); // Limpa mensagens de erro anteriores
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
     
      navigation.navigate('Home'); // Navega para a tela de perfil
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
       <Text style={{fontSize:55, marginBottom:40}}>𝕐</Text>
       <Text style={{fontSize:20,marginBottom:20}}>Entrar</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholderTextColor={isActive ? '#aaa' : '#ccc'}
        onFocus={() => setIsActive(true)}
        onBlur={() => {
          if (text === '') {
            setIsActive(false);
          }
        }}
      />
      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        placeholderTextColor={isActive ? '#aaa' : '#ccc'}
        onFocus={() => setIsActive(true)}
        onBlur={() => {
          if (text === '') {
            setIsActive(false);
          }
        }}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={{color:'#FFF', fontSize:18}}>Entrar</Text>
      </TouchableOpacity>
    

      <Text style={styles.registerPrompt}>Não possui uma conta?</Text>
      <TouchableOpacity onPress={handleRegister}>
        <Text style={{textDecorationLine:'underline', color:'blue'}}>Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
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
    borderColor: '#E1E8ED',
    borderWidth: 1,
    borderRadius: 25,
    paddingLeft: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#F5F8FA',
},
button: {
    width: '80%',
    height: 50,
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


export default LoginScreen;
