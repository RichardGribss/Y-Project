import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../firebase/config'; // Asegúrate de que o caminho está correto
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { firestore } from '../firebase/config'; // Importa Firestore
import { doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [isActive, setIsActive] = useState(false);
  const [nome, setNome] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Novo estado para confirmar senha
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    setErrorMessage('');

    if (nome === "Alexandre de Moraes") {
     navigation.navigate('Ban')
      return;
    }
    // Verifica se as senhas são iguais
    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    try {
      // Verificar se o email já está registrado
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        setErrorMessage('Este e-mail já está registrado.');
        return;
      }

      // Verificar se o username já está registrado
      const q = query(collection(firestore, 'users'), where('username', '==', username));

      // Executa a consulta
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Enviar informações ao Firestore, incluindo o uid
        await setDoc(doc(firestore, 'users', user.uid), {
          uid: user.uid,  // Guardar o ID do usuário
          nome,
          username,
          email,
        });

        navigation.navigate('Perfil');
      } else {
        setErrorMessage('Este nome de usuário já está em uso.');
      }

    } catch (error) {
      setErrorMessage('Erro ao criar conta. Tente novamente.');
    }
  };

  const checkEmailExists = async (email) => {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      return signInMethods.length > 0; // Retorna true se o e-mail já tiver métodos de login associados
    } catch (error) {
      setErrorMessage('Erro ao verificar o e-mail.');
      return false;
    }
  };

  function handleLogin() {
    navigation.navigate('Login');
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 55, marginBottom: 40 }}>𝕐</Text>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Cadastre-se</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        keyboardType="default"
        autoCapitalize="words"
        placeholderTextColor={isActive ? '#aaa' : '#ccc'}
        onFocus={() => setIsActive(true)}
        onBlur={() => {
          if (nome === '') {
            setIsActive(false);
          }
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Nome de Usuário"
        value={username.toLowerCase()}
        onChangeText={setUsername}
        keyboardType="default"
        autoCapitalize="none"
        placeholderTextColor={isActive ? '#aaa' : '#ccc'}
        onFocus={() => setIsActive(true)}
        onBlur={() => {
          if (username === '') {
            setIsActive(false);
          }
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={isActive ? '#aaa' : '#ccc'}
        onFocus={() => setIsActive(true)}
        onBlur={() => {
          if (email === '') {
            setIsActive(false);
          }
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={isActive ? '#aaa' : '#ccc'}
        onFocus={() => setIsActive(true)}
        onBlur={() => {
          if (password === '') {
            setIsActive(false);
          }
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"  // Campo de confirmação de senha
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholderTextColor={isActive ? '#aaa' : '#ccc'}
        onFocus={() => setIsActive(true)}
        onBlur={() => {
          if (confirmPassword === '') {
            setIsActive(false);
          }
        }}
      />

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={{ color: '#FFF', fontSize: 19 }}>Cadastrar</Text>
      </TouchableOpacity>

      <Text style={styles.registerPrompt}>Já possui uma conta?</Text>
      <TouchableOpacity onPress={handleLogin}>
        <Text style={{ textDecorationLine: 'underline', color: 'blue' }}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '##f2f2f2',
    padding: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingLeft: 15,
    paddingVertical:8,
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
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  registerPrompt: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default RegisterScreen;
