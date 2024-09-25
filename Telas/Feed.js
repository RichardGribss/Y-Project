import React, {useEffect,useState} from 'react';
import { View, Text, Image, FlatList, Modal,TextInput, TouchableOpacity,ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseApp } from '../firebase/config';
// Dados de exemplo para o feed



const Feed = () => {
  
  const [posts, setPosts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const db = getFirestore(firebaseApp);
      const postsCollection = collection(db, 'posts'); // Altere 'posts' para o nome da sua coleção
      const postSnapshot = await getDocs(postsCollection);
      const postList = postSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postList);
    };

    fetchPosts();
  }, []);
  
  const PostItem = ({  texto, img, setModalVisible }) => {
    return (
      <View style={{ borderColor: "#dedede", borderBottomWidth: 1, paddingVertical: 5, backgroundColor: '#FFF' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{ uri: 'https://s1.static.brasilescola.uol.com.br/be/2022/10/meme-mo-paz.jpg' }} style={{ width: 40, height: 40, borderRadius: 25, marginRight: 10, margin: 5 }} />
          <Text style={{ fontWeight: 'bold' }}>Ghost</Text>
        </View>
        <Text style={{ marginTop: 5, margin: 7 }}>{texto}</Text>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>

        {img && img.length > 0 && (
          <Image source={{ uri: img }} style={{ width: '95%', height: 260, borderRadius: 5, marginTop: 5 }} />
        )}

        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 11 }}>
          <TouchableOpacity onPress={() => { setModalVisible(true) }}>
            <Ionicons name="chatbubble-outline" size={22} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={22} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="repeat" size={22} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
   <View style={{flex:1}}>
    <FlatList
      data={posts}
      renderItem={({ item }) => (
        <PostItem
         
        
          texto={item.texto}
          img={item.img}
          setModalVisible={setModalVisible} 
        />
      )}
      keyExtractor={(item) => item.id}
    />
 <Modal
  transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{ backgroundColor:'#FFF',height: 600, width: '100%', position: 'absolute', bottom: 0, borderTopRightRadius:20,borderTopLeftRadius:20,elevation: 2, shadowColor: '#222',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.5,
              shadowRadius: 5 }}>
        

          <TouchableOpacity onPress={()=> {setModalVisible(false)}} >
            <Text style={{textAlign:'center'}}>Fechar</Text>
          </TouchableOpacity>
          <ScrollView style={{ marginHorizontal: 10, marginTop: 15 }}>
       
               
              <Text style={{ color: '#888', textAlign: 'center', marginTop: 20 }}>Nenhum comentário ainda.</Text>
     
          </ScrollView>
          <View style={{
            flexDirection: 'row', alignItems: 'center', borderTopWidth: 1,
            borderTopColor: '#dedede', paddingHorizontal: 10, paddingVertical: 10
          }}>
            <TextInput
              style={{
                flex: 1,
                height: 40,
                backgroundColor: '#f2f2f2',
                borderRadius: 20,
                paddingHorizontal: 15,
                marginRight: 10,
                fontSize: 14,
              }}
              placeholder="Adicione um comentário..."
              
            />
            <TouchableOpacity >
              <Ionicons name="send-outline" size={24} color="#3b5998" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
   
  );
};


export default Feed;
