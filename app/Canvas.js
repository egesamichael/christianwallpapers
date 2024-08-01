import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as ImagePicker from 'react-native-image-picker';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

const loadFonts = () => {
  return Font.loadAsync({
    'OpenSans-Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
    'OpenSans-Bold': require('../assets/fonts/OpenSans-Bold.ttf'),
    'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
};

const Canvas = () => {
  const [backgroundType, setBackgroundType] = useState('solid');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [gradientColors, setGradientColors] = useState(['#4c669f', '#3b5998', '#192f6a']);
  const [imageUri, setImageUri] = useState(null);
  const [text, setText] = useState('');
  const [font, setFont] = useState('OpenSans-Regular');
  const [fontSize, setFontSize] = useState(20);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  if (!fontsLoaded) {
    return (
      <AppLoading
        startAsync={loadFonts}
        onFinish={() => setFontsLoaded(true)}
        onError={console.warn}
      />
    );
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <Button title="Solid Color" onPress={() => setBackgroundType('solid')} />
        <Button title="Gradient" onPress={() => setBackgroundType('gradient')} />
        <Button title="Image" onPress={pickImage} />
        <TextInput
          placeholder="Enter text"
          style={styles.input}
          value={text}
          onChangeText={setText}
        />
        <Button title="Bold" onPress={() => setFont('OpenSans-Bold')} />
        <Button title="Regular" onPress={() => setFont('OpenSans-Regular')} />
        <TextInput
          placeholder="Font Size"
          style={styles.input}
          keyboardType="number-pad"
          value={String(fontSize)}
          onChangeText={(value) => setFontSize(Number(value))}
        />
      </View>
      <View style={styles.canvas}>
        {backgroundType === 'solid' && <View style={{ ...styles.background, backgroundColor }} />}
        {backgroundType === 'gradient' && (
          <LinearGradient colors={gradientColors} style={styles.background} />
        )}
        {backgroundType === 'image' && imageUri && (
          <Image source={{ uri: imageUri }} style={styles.background} />
        )}
        <Text style={{ ...styles.text, fontFamily: font, fontSize }}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controls: {
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  canvas: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  text: {
    color: '#000',
  },
});

export default Canvas;
