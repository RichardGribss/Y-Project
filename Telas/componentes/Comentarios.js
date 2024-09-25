import React, { useState } from 'react';
import { View, Text, Button, Modal, StyleSheet, TouchableOpacity } from 'react-native';

const Comentarios = (show) => {
  const [modalVisible, setModalVisible] = useState(false);

  if (show == true) {
    setModalVisible(true);
  } else if (show == false) {
    setModalVisible(false);
  }



  return (
    <View >


      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{ backgroundColor: '#333', height: 400, width: '100%', position: 'absolute', bottom: 0 }}>
          <View>
            <Text style={{}}>Comentariouuuuu</Text>
          </View>

          <TouchableOpacity style={{}}>
            <Text style={{}}>Fechar</Text>
          </TouchableOpacity>

        </View>
      </Modal>
    </View>
  );
};



export default Comentarios;
