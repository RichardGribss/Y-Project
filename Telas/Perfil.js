import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { firestore } from '../firebase/config';
import { collection, getDocs } from "firebase/firestore";
import { auth } from '../firebase/config'; 
import { signOut } from 'firebase/auth';


const ProfileScreen = () => {
    
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Logout', 'Você foi desconectado com sucesso.');
    } catch (error) {
     alert('Erro', error.message);
    }
  };

    return (
        <View style={{ padding: 20 }}>
          
                    <Text>Nome: </Text>
                    <Text>Email: </Text>
                    <Button title="Editar Perfil" />
           
                    <View style={{ margin: 20 }}>
      <Button title="Sair" onPress={handleLogout} />

       </View>
            
     </View>
    );
};

export default ProfileScreen;
