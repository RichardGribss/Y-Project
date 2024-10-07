import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BanidoScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Você foi banido</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red', // Cor de fundo vermelha
  },
  message: {
    fontSize: 48, // Tamanho grande
    fontWeight: 'bold',
    color: 'white', // Cor do texto branca para contraste
    textAlign: 'center',
  },
});

export default BanidoScreen;
