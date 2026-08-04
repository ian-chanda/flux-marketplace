import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ComponentProps } from "react";
import { View } from "react-native";
import { ThemedText } from "./themed-text";

export type DashPadProps = {
    title: string;
    value?: string;
    subIconColor: string;
    mainIcon: ComponentProps<typeof MaterialIcons>["name"];
    subTitle: string;
    subIcon: ComponentProps<typeof MaterialIcons>["name"];
    showBorder?: boolean;
}

export default function DashPad({ title, value, subIconColor, mainIcon, subTitle, subIcon, showBorder=true }: DashPadProps) {
    const { colors } = useTheme();
    return (
    <View
        style={{
            flexDirection: "column", 
            justifyContent: "space-between", 
            paddingBottom: 10, 
            borderBottomWidth: showBorder? 1: 0, 
            borderColor: "black", 
            borderBottomColor: colors.surface, 
            
            }}>
        <View
        style={{padding: 5, backgroundColor: colors.surface, borderRadius: 50, width: 50, height: 50, justifyContent: "center", alignItems: "center"}}>
            <MaterialIcons name={mainIcon} size={30} color={colors.accent} />
        </View>
        <View
        style={{flex: 1, marginLeft: 10, marginTop: 9}}>
            <ThemedText type="defaultSemiBold" >{title}</ThemedText>
            <View style={{flexDirection: "column", marginTop: 5}}>
            <ThemedText type="subtitle" >{value}</ThemedText>
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <ThemedText type="defaultSmall" style={{marginRight: 5}}>18%</ThemedText>
                <MaterialIcons name={subIcon} size={15} color={subIconColor} />
                <ThemedText type="defaultSmall" style={{marginLeft: 5}}>{subTitle}</ThemedText>
              </View>
              </View>  
            </View>     
    </View>
    )
}