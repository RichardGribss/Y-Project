// LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { auth, firestore } from '../firebase/config'; // Importando a configuração do Firebase
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const LoginScreen = () => {
  const [isActive, setIsActive] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigation = useNavigation();

  const handleLogin = async () => {
    setError(''); // Limpa mensagens de erro anteriores
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Perfil'); 
    } catch (err) {
      setError('E-mail ou senha inválidos');
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Verificar se o usuário já existe no Firestore
      const userDoc = doc(firestore, 'users', user.uid);
      const userSnapshot = await getDoc(userDoc);

      if (!userSnapshot.exists()) {
        // Se não existir, registre o usuário no Firestore
        await setDoc(userDoc, {
          uid: user.uid,
          nome: user.displayName,
          username: user.email.split('@')[0], // Usa a parte do e-mail como nome de usuário
          email: user.email,
        });
      }

      navigation.navigate('Perfil');
    } catch (error) {
      setError('Erro ao entrar com o Google. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 55, marginBottom: 40 }}>𝕐</Text>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Entrar</Text>
      
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholderTextColor={isActive ? '#aaa' : '#ccc'}
        onFocus={() => setIsActive(true)}
        onBlur={() => {
          if (email === '') {
            setIsActive(false);
          }
        }}
        autoCapitalize="none"
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
          if (password === '') {
            setIsActive(false);
          }
        }}
        autoCapitalize="none"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={{ color: '#FFF', fontSize: 18 }}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={{ borderWidth: 1, borderRadius: 24, marginTop: 10, padding: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} 
        onPress={handleGoogleLogin}
      >
        <Image source={require('../assets/google.png')} style={{ width: 16, height: 16, margin: 5 }} />
        <Text style={{ fontSize: 16, fontWeight: '400' }}>Entrar com Google</Text>
      </TouchableOpacity>

      <Text style={{ marginTop: 10 }}>Não possui uma conta?</Text>
      <TouchableOpacity onPress={handleRegister}>
        <Text style={{ textDecorationLine: 'underline', color: 'blue' }}>Cadastre-se</Text>
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
    height: 45,
    backgroundColor: '#1DA1F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 20,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default LoginScreen;
