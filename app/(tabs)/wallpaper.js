import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions, Modal, Button, Text, TextInput, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { FAB } from 'react-native-paper';
export default function MyWallpapers() {
  
  const defaultWallpapers = [
    { id: '1', src: require('../../assets/images/1.jpg') },
    { id: '2', src: require('../../assets/images/1.jpg') },
    // Uncomment and add more wallpapers if needed
    // { id: '3', src: require('../../assets/images/3.jpg') },
  ];
  const [wallpapers, setWallpapers] = useState([]);
  const [selectedWallpaper, setSelectedWallpaper] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fabVisible, setFabVisible] = useState(false);
  const [book, setBook] = useState('');
  const [chapter, setChapter] = useState('');
  const [verse, setVerse] = useState('');
  const [scripture, setScripture] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setWallpapers(defaultWallpapers);
  }, []);

  const handleSelectWallpaper = (wallpaper) => {
    setSelectedWallpaper(wallpaper);
    setModalVisible(true);
  };

  const handleDownloadImage = async () => {
    const uri = FileSystem.documentDirectory + selectedWallpaper.id + '.jpg';
    await FileSystem.copyAsync({
      from: selectedWallpaper.src,
      to: uri
    });
    setModalVisible(false);
    alert('Image downloaded successfully');
  };

  const handleShareImage = async () => {
    const uri = FileSystem.documentDirectory + selectedWallpaper.id + '.jpg';
    await FileSystem.copyAsync({
      from: selectedWallpaper.src,
      to: uri
    });
    await Sharing.shareAsync(uri);
    setModalVisible(false);
  };

  const handleFetchScripture = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://bible-api.com/${book}${chapter}:${verse}`, {
      
      });
      setScripture(response.data.text);
     // alert(response.data.text);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch scripture');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
     <Text>My Wallpapers coming soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent : 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  imageContainer: {
    flex: 1,
    margin: 5,
  },
  image: {
    width: (Dimensions.get('window').width / 2) - 20,
    height: (Dimensions.get('window').width / 2) - 20,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  scriptureText: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: 'italic',
  },
});

;
