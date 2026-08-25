import { CustomHeader } from "@/components/customHeader";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { View } from "react-native";

export default function UserDesc() {
    return (
        <ThemedView
        style={{
            paddingHorizontal: 10
        }}
        >
            <CustomHeader title="User Description"/>
            <View
            style={{
                padding: 15,

            }}>
                <ThemedText
                type="defaultBold">
                    Brand new iPhone 23 Pro Max, sealed in original box. Featuring the latest A17 Pro processor, stunning 6.7" Super Retina XDR display, and advanced triple camera system with 48MP main sensor. 256GB storage, 8GB RAM, space black color. Includes charger, cables, and 1-year Apple warranty. Perfect condition, never used. Comes with original packaging and all accessories.
                </ThemedText>
            </View>
        </ThemedView>
    )
}