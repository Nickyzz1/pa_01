import { Text, StyleSheet, Platform, View, Image, FlatList, TextInput, Button, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react'
import axios from 'axios'

interface ICharacter {
  id : number,
  name : string,
  image : string,
  status : string
}

// quando é type:
// type ICharacter = {
//   id : number,
//   name : string,
//   image : string,
//   status : string
// }[] // declarar o array aqui

export default function HomeScreen() {
  // se usar iinterface precisa declarar aqui que a interface é um array, na linha <ICharacter[]>. No usestate ele já incia como um array

  const [charc, setCharc] = useState<ICharacter[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [page, setPage] = useState<string>('1')

  const fetcharc = async (pageNumber : string) => {
    try {
      // usando template string ``pois me permite colocar o pageNumber
      const response = await axios.get(`https://rickandmortyapi.com/api/character/?page=${pageNumber}`)
      setCharc(response.data.results)
    } catch(error) {
      console.error('Erro ao buscar personagens', error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetcharc(page)
  }, [])

  const renderCharc = ({item} : {item : ICharacter}) => (
    <View style={styles.card} >
        <Image source={{uri : item.image}} style={styles.img}></Image>
        <View style={styles.info}>
          <Text>{item.name}</Text>
          <Text>{item.status}</Text>
        </View>
    </View>
  )

  if (loading) {

    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#450887E6">

        </ActivityIndicator>
      </View>
    );
  }

  return(
    <>
    {/* flex 1 ocupa 100% da tela, flex 2 ocupa 50% */}
    <View style={{flex:1}}> 

      <View style={styles.inputContainer}>
        <Text>1/42 - </Text>
        <TextInput value={page} onChangeText={(text) => setPage(text)} keyboardType='numeric' placeholder='Digite o número da página'/>
        <Button title='Buscar' onPress={() => fetcharc(page)} ></Button>
      </View>

      <FlatList data={charc} keyExtractor={(item) => 
        item.id.toString()
      } renderItem={renderCharc} contentContainerStyle={styles.list} />

    </View>
    </>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: "#f9f9f9",
    alignItems: 'center',
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2, // sombra para android
    shadowColor : '#000000', // sombra para ios
    shadowOpacity: 0.1,
    shadowOffset: { width : 0, height: 2 },
    shadowRadius: 0.1
  },
  info : {
    flex : 1,
    padding : 12,
    justifyContent: 'center'
  },
  img : {
    height: 100,
    width: 100
  },
  name : {
    fontSize: 16,
    fontWeight: 'bold'
  },
  status: {
    fontSize: 16,
    color: "#c6c6c6"
  },
  loader : {
    flex : 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0'
  },
  list: {
    padding: 16
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#cccccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 8
  }

});
