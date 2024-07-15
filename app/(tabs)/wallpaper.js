import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions, Modal, Button, Text } from 'react-native';
import { useRouter } from 'expo-router';

const numColumns = 2; // Define number of columns
const defaultWallpapers = [
  { id: '1', src: require('../../assets/images/1.jpg') },
  { id: '2', src: require('../../assets/images/1.jpg') },
  // Uncomment and add more wallpapers if needed
  // { id: '3', src: require('../../assets/images/3.jpg') },
];

const HomeScreen = () => {
  const [wallpapers, setWallpapers] = useState([]);
  const [selectedWallpaper, setSelectedWallpaper] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const router = useRouter();

  useEffect(() => {
    setWallpapers(defaultWallpapers);
  }, []);

  // Handle selecting a wallpaper
  const handleSelectWallpaper = (wallpaper) => {
    setSelectedWallpaper(wallpaper);
    setModalVisible(true); // Show modal when an image is tapped
  };

  const handleDownloadImage = () => {
    // Implement download logic here
    setModalVisible(false);
    console.log('Download image:', selectedWallpaper);
  };

  const handleShareImage = () => {
    // Implement share logic here
    setModalVisible(false);
    console.log('Share image:', selectedWallpaper);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={wallpapers}
        keyExtractor={(item) => item.id}
        numColumns={numColumns} // Set number of columns to 2 for grid layout
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectWallpaper(item)} style={styles.imageContainer}>
            <Image source={item.src} style={styles.image} />
          </TouchableOpacity>
        )}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Options</Text>
            <Button title="Download Image" onPress={handleDownloadImage} />
            <Button title="Share Image" onPress={handleShareImage} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  imageContainer: {
    flex: 1,
    margin: 5,
  },
  image: {
    width: (Dimensions.get('window').width / numColumns) - 20, // Calculate width based on numColumns
    height: (Dimensions.get('window').width / numColumns) - 20, // Calculate height to make it square
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
});

export default HomeScreen;
