import * as ImagePicker from "expo-image-picker";
import { toJpeg } from "@/utils/image";

export function useImagePicker() {
  const pickImage = async (setter: (uri: string) => void) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      console.log("CHAKANA ZOONA");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]) {
      setter(await toJpeg(result.assets[0].uri));
    }
  };

  return {
    pickImage,
  };
}
