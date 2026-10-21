import { useTheme } from "@/hooks/useTheme";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "./themed-text";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { IconButton } from "./iconButton";
import { CustomModal } from "./customModal";
import { CustomSearchBar } from "./customSearchBar";
import { useSearchLocation } from "@/hooks/use-search-locations";
import { LocationIQAddress, SelectedAddress, toSelectedAddress } from "@/types/locations";
import { LoadingScreen } from "@/app/(tabs)/(search)/results";

type CustomUserLocationProps =
  {
    visible: boolean,
    location: string,
    locate: () => void,
    locating: boolean,
    onClose: () => void,
    setLocation: (location: SelectedAddress) => void
  }

const MOCK_LOCATIONS = [
  { id: "1", location: "Lusaka, Zambia" },
  { id: "2", location: "Lusaka, Zambia" },
  { id: "3", location: "Lusaka, Zambia" },
  { id: "4", location: "Lusaka, Zambia" },
  { id: "5", location: "Lusaka, Zambia" },
]

const SearchLocationView = ({ setLocation, setMode }: { setLocation: (location: SelectedAddress) => void, setMode: (mode: "main" | "search") => void }) => {

  const { colors } = useTheme();
  const [value, setValue] = useState("")


  const { data, loading } = useSearchLocation(value)

  return (
    <View style={{ flex: 1, gap: 12, paddingVertical: 10 }}>
      <CustomSearchBar
        onSearch={() => { }}
        showSearch={false}
        searchValue={value}
        setSearchValue={setValue}
        width={'100%'}
      />
      {loading ? <LoadingScreen /> :
        <FlatList
          data={data}
          contentContainerStyle={{ gap: 16, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              hitSlop={10}
              onPress={() => {
                setLocation(toSelectedAddress(item))
                setMode("main")
              }}
              style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}
            >
              <MaterialIcons name="location-pin" size={15} color={colors.accent} />
              <ThemedText>{item.display_name} </ThemedText>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => `${item.place_id}-${item.display_name}`}
        />
      }

      {/* <View style={{ position: 'absolute', bottom: 20, left: 0, right: 0 }}> */}
      {/*   <FlatButton label="Apply" onPress={() => { }} /> */}
      {/* </View> */}
    </View>
  )
}
const LocationView = ({ location, locate, locating, onEdit, onSearch }: { location: string, locate: () => void, locating: boolean, onEdit: () => void, onSearch: () => void }) => {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 15, paddingBottom: 50 }}>
      <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
        <Ionicons name="location-outline" size={15} color={colors.accent} />
        <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
          <ThemedText type="defaultFaded">current location: </ThemedText>
          <ThemedText type="defaultBold">{location}</ThemedText>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 5 }}>

        {/* uses expo geolocation thing */}
        <FlatButton label="locate me" onPress={() => locate()} loading={locating} />

        {/* opens a search modal where you can search for you location */}
        <FlatButton
          label="edit"
          onPress={() => onEdit()}
        />

      </View>
    </View>

  )
}

const FlatButton = ({ label, loading=false, onPress }: { label: string, loading?: boolean, onPress: () => void }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      disabled={loading}
      style={[styles.button, { maxHeight: 50, backgroundColor: colors.accent}]}
      onPress={() => onPress()}
    >
      {loading ?
        <ActivityIndicator size={"small"} color={colors.background} />
        :
        <ThemedText style={{color: colors.background}}>{label}</ThemedText>
      }
    </TouchableOpacity>


  )
}

export function UserLocationModal({
  visible,
  onClose,
  locate,
  locating,
  location,
  setLocation,
}: CustomUserLocationProps) {

  const { colors } = useTheme();
  const [mode, setMode] = useState<"main" | "search">("main")

  return (
    <CustomModal
      visible={visible}
      fullscreen={mode === "search"}
      onClose={() => {
        onClose()
        setMode("main")
      }}
      title={mode === "main" ? "Location" : "Find location"}
      right={mode === "main" && (
        <View>
          <IconButton icon={"search"} badgeValue="" onPress={() => setMode("search")} />
        </View>
      )}>
      {mode === "main" ?
        <LocationView location={location} locate={locate} locating={locating} onEdit={() => { setMode("search") }} onSearch={() => { }} />
        :
        <SearchLocationView setLocation={setLocation} setMode={setMode} />
      }

    </CustomModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D3D3D3",
    marginBottom: 10,
  },
  button: {
    flexBasis: '48%',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  inputBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 8,
  },
  input: {
    padding: 10,
    fontSize: 14,
  },
});
