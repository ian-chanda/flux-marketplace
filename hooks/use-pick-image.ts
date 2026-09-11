import * as ImagePicker from "expo-image-picker";

export function useImagePicker() {
  const pickImage = async (setter: (uri: string) => void) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      console.log("CHAKANA ZOONA");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]) {
      setter(result.assets[0].uri);
    }
  };

  return {
    pickImage,
  };
}
