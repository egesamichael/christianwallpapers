import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions, Text } from 'react-native';
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
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedWallpaper, setSelectedWallpaper] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setWallpapers(defaultWallpapers);
  }, []);

  // Handle selecting a wallpaper and show context menu
  const handleSelectWallpaper = (wallpaper, event) => {
    setSelectedWallpaper(wallpaper);
    setContextMenuPosition({ x: event.nativeEvent.locationX, y: event.nativeEvent.locationY });
    setContextMenuVisible(true);
  };

  // Handle context menu action
  const handleContextMenuAction = (action) => {
    if (action === 'download') {
      console.log('Download image:', selectedWallpaper);
      // Implement download logic here
    } else if (action === 'share') {
      console.log('Share image:', selectedWallpaper);
      // Implement share logic here
    }
    setContextMenuVisible(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={wallpapers}
        keyExtractor={(item) => item.id}
        numColumns={numColumns} // Set number of columns to 2 for grid layout
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={(event) => handleSelectWallpaper(item, event)}
            style={styles.imageContainer}
          >
            <Image source={item.src} style={styles.image} />
          </TouchableOpacity>
        )}
      />

      {contextMenuVisible && (
        <View style={[styles.contextMenu, { left: contextMenuPosition.x, top: contextMenuPosition.y }]}>
          <TouchableOpacity onPress={() => handleContextMenuAction('download')} style={styles.contextMenuItem}>
            <Text>Download Image</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleContextMenuAction('share')} style={styles.contextMenuItem}>
            <Text>Share Image</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  imageContainer: {
    flex: 1,
    margin: 5,
  },
  image: {
    width: (Dimensions.get('window').width / numColumns) - 20, // Calculate width based on numColumns
    height: 300, // Calculate height to make it square
    borderRadius: 10,
  },
  contextMenu: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    elevation: 5, // Shadow on Android
    shadowColor: '#000', // Shadow on iOS
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  contextMenuItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});

export default HomeScreen;
