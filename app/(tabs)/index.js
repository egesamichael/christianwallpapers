import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions, Text, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
import { db, storage } from '../../Firebase'; // Import Firebase configuration
import { collection, query, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { activateKeepAwakeAsync, deactivateKeepAwakeAsync } from 'expo-keep-awake';

const numColumns = 2; // Define number of columns
const pageSize = 10; // Number of items to load per page

const HomeScreen = () => {
  const [wallpapers, setWallpapers] = useState([]);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedWallpaper, setSelectedWallpaper] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchWallpapers();
    const activateKeepAwake = async () => {
      if (__DEV__) {
        await activateKeepAwakeAsync();
      }
    };
    activateKeepAwake();
    return () => {
      const deactivateKeepAwake = async () => {
        if (__DEV__) {
          await deactivateKeepAwakeAsync();
        }
      };
      deactivateKeepAwake();
    };
  }, []);

  const fetchWallpapers = async () => {
    setLoading(true);
    try {
      const wallpapersCollection = collection(db, 'wallpapers');
      const q = query(wallpapersCollection, orderBy('createdAt'), limit(pageSize));
      const querySnapshot = await getDocs(q);
      const newWallpapers = [];

      const promises = querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const url = await getDownloadURL(ref(storage, data.path));
        console.log('Fetched URL:', url);
        return { id: doc.id, src: { uri: url } };
      });

      const resolvedWallpapers = await Promise.all(promises);
      setWallpapers(resolvedWallpapers); // Set new wallpapers without appending to the existing state
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (error) {
      console.error('Error fetching wallpapers:', error);
    }
    setLoading(false);
  };

  const fetchMoreWallpapers = async () => {
    if (loading || !lastVisible) return;
    setLoading(true);
    try {
      const wallpapersCollection = collection(db, 'wallpapers');
      const q = query(
        wallpapersCollection,
        orderBy('createdAt'),
        startAfter(lastVisible),
        limit(pageSize)
      );
      const querySnapshot = await getDocs(q);
      const newWallpapers = [];

      const promises = querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const url = await getDownloadURL(ref(storage, data.path));
        console.log('Fetched URL:', url);
        return { id: doc.id, src: { uri: url } };
      });

      const resolvedWallpapers = await Promise.all(promises);
      setWallpapers((prevWallpapers) => [...prevWallpapers, ...resolvedWallpapers]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (error) {
      console.error('Error fetching more wallpapers:', error);
    }
    setLoading(false);
  };

  const handleSelectWallpaper = (wallpaper, event) => {
    setSelectedWallpaper(wallpaper);
    setContextMenuPosition({ x: event.nativeEvent.pageX, y: event.nativeEvent.pageY });
    setContextMenuVisible(true);
  };

  const handleContextMenuAction = async (action) => {
    if (action === 'download') {
      await handleDownloadImage();
    } else if (action === 'share') {
      await handleShareImage();
    }
    setContextMenuVisible(false);
  };

  const handleDownloadImage = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Permission to access gallery is required!');
        return;
      }
      const fileUri = FileSystem.documentDirectory + selectedWallpaper.id + '.jpg';
      const { uri } = await FileSystem.downloadAsync(selectedWallpaper.src.uri, fileUri);
      await MediaLibrary.createAssetAsync(uri);
      Alert.alert('Success', 'Image downloaded successfully');
    } catch (error) {
      console.error('Error downloading image:', error);
      Alert.alert('Error', 'Failed to download image');
    }
  };

  const handleShareImage = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + selectedWallpaper.id + '.jpg';
      await FileSystem.downloadAsync(selectedWallpaper.src.uri, fileUri);
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error('Error sharing image:', error);
      Alert.alert('Error', 'Failed to share image');
    }
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
        onEndReached={fetchMoreWallpapers}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <Text>Loading...</Text> : null}
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
    paddingTop: 60,
    paddingHorizontal: 10,
  },
  imageContainer: {
    flex: 1,
    margin: 5,
  },
  image: {
    width: (Dimensions.get('window').width / numColumns) - 20, // Calculate width based on numColumns
    height: 300, // Fixed height for the images
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
