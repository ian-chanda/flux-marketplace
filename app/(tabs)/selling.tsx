//
//
// src/app/(tabs)/selling.tsx
import ActionButton from '@/components/actionButton';
import { CardButtonRow } from '@/components/cardButtonRow';
import DashPad from '@/components/DashPad';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/useTheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const feedbackMessages = [
  {
    name: "Admin Admin",
    when: "2y",
    feedbackType: "purchase",
    msg: "omg this guy funcking SUCKS! he tried to low ball me so much. he even ran off at some point and we had to chase him down"
  },
  {
    name: "Sarah Chen",
    when: "3d",
    feedbackType: "sale",
    msg: "Super smooth transaction, paid instantly and picked up right on time. Would sell to again!"
  },
  {
    name: "Marcus Webb",
    when: "1w",
    feedbackType: "purchase",
    msg: "Item was exactly as described, great communication throughout. Highly recommend."
  },
  {
    name: "Jenna Ortiz",
    when: "2w",
    feedbackType: "sale",
    msg: "Buyer was a bit slow to respond but everything worked out fine in the end."
  },
  {
    name: "Deshawn Miller",
    when: "1mo",
    feedbackType: "purchase",
    msg: "Packaging could've been better but the product itself was in great shape."
  },
  {
    name: "Olivia Park",
    when: "3mo",
    feedbackType: "sale",
    msg: "Quick payment, no hassle. One of the easier deals I've had on here."
  },
  {
    name: "Tariq Hassan",
    when: "5mo",
    feedbackType: "purchase",
    msg: "Took a while to arrange pickup but seller was patient and friendly about it."
  },
  {
    name: "Emily Novak",
    when: "8mo",
    feedbackType: "sale",
    msg: "Avoid this man at all costs. showed up late and tried to renegotiate price at the last second."
  },
  {
    name: "Ryan Kessler",
    when: "1y",
    feedbackType: "purchase",
    msg: "Great experience, item was even better than the photos showed."
  }
]

const FeedbackMessage = ({ img, name, when, msg, feedbackType }:
	{ img?: string, name: string, when: string, msg: string, feedbackType: string }) => {
	return (
		<View>
			<View style={{ gap: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
						<Image
							source={require('@/assets/images/dino.jpg')}
							style={{
								width: 20,
								height: 20,
								objectFit: 'cover',
								borderRadius: 100
							}}
						/>
						<ThemedText type="smallFaded">{name}</ThemedText>
					</View>
					<ThemedText type="smallFaded">-</ThemedText>
					<ThemedText type="smallFaded">{when}</ThemedText>
				</View>
				<ThemedText type="smallFaded">{feedbackType}</ThemedText>
			</View>
			<ThemedText>{msg}</ThemedText>
		</View>
	)
}

export default function SellingScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.background,
        flex: 1,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 100,
          gap: 10,
        }}
        showsVerticalScrollIndicator={false}
      >

        {/* Seller Header */}
        <TouchableOpacity
          onPress={() => router.push("/me/profile")}
        >
          <View
            style={[
              styles.container,
              styles.shadow,
              {
                backgroundColor: colors.background,
                flexDirection: "row",
                alignItems: "center",
              },
            ]}
          >
            <Image
              source={require("../../assets/images/dino.jpg")}
              style={styles.profileImage}
            />

            <View style={styles.profileInfo}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <ThemedText type="defaultBold">
                  John Doe
                </ThemedText>

                <MaterialIcons
                  name="verified"
                  size={15}
                  color={colors.accent}
                />
              </View>

              <ThemedText type="defaultSmall">
                @johndoe12
              </ThemedText>

              <ThemedText type="small_price_font">
                Verified seller
              </ThemedText>
            </View>
          </View>
        </TouchableOpacity>


        {/* Actions */}
        <View
          style={[
            styles.infoContainer,
            { flexDirection: 'column', paddingHorizontal: 10, gap: 4 },
          ]}
        >

          <CardButtonRow icon={"add"} label='Add Listing' onPress={() => router.push("/addListings")} />
          <CardButtonRow icon={"dashboard"} label='View listings' onPress={() => router.push("/viewListings")} />

          {/* <ActionButton */}
          {/*   title="Add Listing" */}
          {/*   Icon="add" */}
          {/*   onPress={() => router.push("/addListings")} */}
          {/* /> */}
          {/**/}
          {/* <ActionButton */}
          {/*   title="View Listings" */}
          {/*   Icon="dashboard" */}
          {/*   onPress={() => router.push("/viewListings")} */}
          {/* /> */}
        </View>


        {/* Seller Performance */}
        <View
          style={[
            styles.container,
            styles.shadow,
            { backgroundColor: colors.background },
          ]}
        >
          <ThemedText type="subtitle">
            Seller Performance
          </ThemedText>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 15,
            }}
          >
            <View>
              <ThemedText type="medium">
                Rating
              </ThemedText>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <MaterialIcons
                  name="star"
                  size={16}
                  color="gold"
                />

                <ThemedText type="defaultBold">
                  4.8
                </ThemedText>
              </View>
            </View>

            <View>
              <ThemedText type="medium">
                Successful Sales
              </ThemedText>

              <ThemedText type="defaultBold">
                130
              </ThemedText>
            </View>

            <View>
              <ThemedText type="medium">
                Response Time
              </ThemedText>

              <ThemedText type="defaultBold">
                ~2h
              </ThemedText>
            </View>
          </View>
        </View>


        {/* Listings Overview */}
        <View
          style={[
            styles.container,
            styles.shadow,
            { backgroundColor: colors.background },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ThemedText type="subtitle">
              Your Listings
            </ThemedText>

            <TouchableOpacity
              onPress={() => router.push("/viewListings")}
            >
              <ThemedText type="smallFaded">
                View all
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 15,
            }}
          >
            <DashPad
              title="Active Listings"
              value="12"
              subIconColor="green"
              mainIcon="list"
              subTitle="this month"
              subIcon="trending-up"
            />

            <DashPad
              title="Total Views"
              value="1,430"
              subIconColor="green"
              mainIcon="visibility"
              subTitle="this month"
              subIcon="trending-up"
            />
          </View>
        </View>


        {/* This Month */}
        <View
          style={[
            styles.container,
            styles.shadow,
            { backgroundColor: colors.background },
          ]}
        >
          <ThemedText type="subtitle">
            This Month
          </ThemedText>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 15,
            }}
          >
            <DashPad
              title="Messages"
              value="44"
              subIconColor="red"
              mainIcon="mail"
              subTitle="this month"
              subIcon="trending-down"
              showBorder={false}
            />

            <DashPad
              title="Total Earnings"
              value="K3,589.45"
              subIconColor="green"
              mainIcon="attach-money"
              subTitle="this month"
              subIcon="trending-up"
              showBorder={false}
            />
          </View>
        </View>

        <View style={{ gap: 5 }}>
          <ThemedText type="subtitle">Ratings</ThemedText>
          <View style={{ marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'column', }}>
              <ThemedText>Positive</ThemedText>
              <ThemedText type="defaultBold">0</ThemedText>
            </View>
            <View style={{ flexDirection: 'column', }}>
              <ThemedText>Neutral</ThemedText>
              <ThemedText type="defaultBold">0</ThemedText>
            </View>
            <View style={{ flexDirection: 'column', }}>
              <ThemedText>Negative</ThemedText>
              <ThemedText type="defaultBold">20</ThemedText>
            </View>
          </View>
          <ThemedText type="subtitle">All Feedback</ThemedText>

          {feedbackMessages.map((item, index) => (
            <View key={index}
              style={{
                paddingVertical: 10,
                borderBottomColor: colors.disabled,
                borderBottomWidth: 1
              }}>

              <FeedbackMessage
                name={item.name}
                when={item.when}
                feedbackType={item.feedbackType}
                msg={item.msg}
              />

            </View>

          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 12,
    padding: 12,
  },

  shadow: {
    // Keep this subtle; your theme can control the actual
    // background/shadow colors where needed.
    elevation: 2,

    shadowOffset: {
      width: 0,
      height: 1,
    },

    shadowOpacity: 0.08,
    shadowRadius: 3,
  },

  profileImage: {
    width: 75,
    height: 75,
    borderRadius: 100,
    objectFit: "cover",
  },

  profileInfo: {
    flex: 1,
    marginLeft: 12,
    gap: 3,
  },

  verifyContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
    marginTop: 2,
  },

  verifyIcon: {
    marginRight: 1,
  },

  buttonGrid: {
    width: "100%",
  },

  infoContainer: {
    flexDirection: "row",
    justifyContent: 'space-evenly',
  },

  statsContainer: {
    width: "100%",
    borderRadius: 12,
    padding: 12,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
  },

  statsItem: {
    flex: 1,
    alignItems: "center",
  },

  statsValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    marginBottom: 4,
  },

  sectionContent: {
    marginTop: 12,
  },

  performanceRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
  },

  performanceItem: {
    flex: 1,
    alignItems: "center",
  },

  listingStatsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
  },

  monthlyStatsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
  },
});
