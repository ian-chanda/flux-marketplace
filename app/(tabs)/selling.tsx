// src/app/(tabs)/selling.tsx
import ActionButton from '@/components/actionButton';
import DashPad from '@/components/DashPad';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/useTheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function SellingScreen() {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      style={{ backgroundColor: colors.background, flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 100
        }}
      >
        {/*Profile Section*/}
        <View style={[styles.container, styles.shadow, { backgroundColor: colors.background }]}>
          <Image source={require("../../assets/images/dino.jpg")} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <ThemedText type="defaultBold">John Doe</ThemedText>
            <ThemedText type="defaultSmall">@johndoe12</ThemedText>
            <View style={[styles.VerifyContainer, { backgroundColor: colors.shadowColor }]}>
              <MaterialIcons name="verified" size={15} color={colors.accent} style={styles.verifyImage} />
              <ThemedText type='small_price_font'>verified seller</ThemedText>
            </View>

            <View style={styles.VerifyContainer} >
              <MaterialIcons name="star-outline" size={15} color={"gold"} style={styles.verifyImage} />
              <ThemedText type="defaultSmall" >130</ThemedText>
              <ThemedText type="defaultSmall" > Successful Sales</ThemedText>
            </View>
            <View style={[styles.VerifyContainer, { marginTop: 1 }]}>
              <MaterialIcons name="circle" size={15} color={"black"} style={styles.verifyImage} />
              <ThemedText type="defaultSmall" >Member since</ThemedText>
              <ThemedText type="defaultSmall"> 22 jan 2022</ThemedText>
            </View>
          </View>
        </View>
        {/* middle row action buttons*/}
        <View
          style={styles.ButtonGrid}>
          <View style={[styles.InfoCOntainer, { backgroundColor: colors.background }]}>
            {/*row buttons*/}
            <ActionButton
              title="Add Listing"
              Icon="add" />
            <ActionButton
              title="Messages"
              Icon="mail" />
          </View>
          <View
            style={[styles.InfoCOntainer, { backgroundColor: colors.background }]}>
            <ActionButton
              title="View Listings"
              Icon='dashboard' />
            <ActionButton
              title='Notifications'
              Icon='notifications'
            />
          </View>
        </View>
        {/*stats*/}
        <View
          style={[styles.container, styles.shadow, { backgroundColor: colors.background }]}
        >
          <View
            style={{ flexDirection: "column" }}>
            <View
              style={{ flexDirection: "row", justifyContent: "center", gap: 50, paddingBottom: 10, alignItems: "flex-start" }}>
              <DashPad
                title='Active Listings'
                value="12"
                subIconColor='green'
                mainIcon="list"
                subTitle="from this month"
                subIcon="trending-up"
              />
              <DashPad
                title="Total Views"
                value="1,430"
                subIconColor='green'
                mainIcon="visibility"
                subTitle="from this month"
                subIcon="trending-up"
              />
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "center", gap: 50, paddingBottom: 10, alignItems: "flex-start" }}>
              <DashPad
                title='Messages'
                value="44"
                subIconColor='red'
                mainIcon="mail"
                subTitle="from this month"
                subIcon="trending-down"
                showBorder={false}
              />
              <DashPad
                title="Total Earnings"
                value="K3,589.45"
                subIconColor='green'
                mainIcon="attach-money"
                subTitle="from this month"
                subIcon="trending-up"
                showBorder={false}
              />
            </View>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    margin: 15,
    flexDirection: "row",
  },
  InfoCOntainer: {
    borderRadius: 8,
    margin: 1,
    padding: 5,
    flexDirection: "row",
    justifyContent: "center"
  },
  ButtonContainer: {
    justifyContent: "center",
    padding: 20,
    borderRadius: 8,
    margin: 5,
    flexDirection: "row",
    flex: 1,
    height: 65,
    alignItems: "center",
  },
  ButtonGd: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  Innercontainer: {
    padding: 10,
    borderRadius: 8,
    margin: 10,
    flexDirection: "row",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  verifyImage: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  VerifyContainer: {

    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginRight: 100,
    borderRadius: 4,
    padding: 2
  },
  shadow: {

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  }
})
