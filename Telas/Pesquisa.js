import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase/config';
import { useNavigation } from '@react-navigation/native'; // Importe para navegação

const SearchUsers = () => {
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation(); // Para navegação

  useEffect(() => {
    const handleSearch = async () => {
      if (searchText.trim() === '') {
        setUsers([]);
        return;
      }

      setLoading(true);

      try {
        const userQuery = query(
          collection(firestore, 'users'),
          where('nome', '>=', searchText),
          where('nome', '<=', searchText + '\uf8ff')
        );

        const usernameQuery = query(
          collection(firestore, 'users'),
          where('username', '>=', searchText),
          where('username', '<=', searchText + '\uf8ff')
        );

        const [nameSnapshot, usernameSnapshot] = await Promise.all([
          getDocs(userQuery),
          getDocs(usernameQuery),
        ]);

        const allResults = [...nameSnapshot.docs, ...usernameSnapshot.docs];
        const uniqueUsers = Array.from(
          new Set(allResults.map((doc) => doc.id))
        ).map((id) => {
          return allResults.find((doc) => doc.id === id).data();
        });

        setUsers(uniqueUsers);
      } catch (error) {
        console.error('Erro ao buscar usuários: ', error);
        alert('Erro ao buscar usuários.');
      } finally {
        setLoading(false);
      }
    };

    handleSearch();
  }, [searchText]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Usuários</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o nome do usuario"
        value={searchText}
        onChangeText={setSearchText}
        placeholderTextColor="#999"
      />

      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Usuario', { userId: item.uid })} // Navegação com parâmetros
              style={styles.userItem}
            >
              <Image
                source={{ uri: item.perfil ? item.perfil : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkMMAxb6dOJG5OxyqQi0Oas3lh4RTgDhq8pg&s' }}
                style={{ width: 40, height: 40, borderRadius: 25, marginRight: 10, margin: 5 }}
              />
              <View>
                <Text style={styles.userName}>{item.nome}</Text>
                <Text style={styles.userUsername}>@{item.username}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  userItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
  },
  userUsername: {
    fontSize: 16,
    color: '#555',
  },
});

export default SearchUsers;
