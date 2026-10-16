import { CardButtonRow } from "@/components/cardButtonRow";
import { CustomHeader } from "@/components/customHeader";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { ComponentProps } from "react";
import { FlatList, Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

type IconName = ComponentProps<typeof MaterialIcons>["name"];

type Stat = { id: string; label: string; value: string; icon?: IconName };

type Feedback = {
  id: string;
  name: string;
  when: string;
  type: "purchase" | "sale";
  msg: string;
};

// ---------- mock data (replace with real queries) ----------

const overviewStats: Stat[] = [
  { id: "inquiries", label: "Listing inquiries", value: "5", icon: "message" },
  { id: "listings", label: "Active listings", value: "12", icon: "list" },
];

const performanceStats: Stat[] = [
  { id: "rating", label: "Rating", value: "4.8", icon: "star" },
  { id: "views", label: "Views", value: "1,430", icon: "visibility" },
  { id: "earnings", label: "Earnings", value: "K3,589.45", icon: "attach-money" },
  // { id: "sales", label: "Sales", value: "130", icon: "check-circle" },
  // { id: "response", label: "Response time", value: "~2h", icon: "schedule" },
];

const feedback: Feedback[] = [
  { id: "1", name: "Sarah Chen", when: "3d", type: "sale", msg: "Super smooth transaction, paid instantly and picked up right on time. Would sell to again!" },
  { id: "2", name: "Marcus Webb", when: "1w", type: "purchase", msg: "Item was exactly as described, great communication throughout. Highly recommend." },
  { id: "3", name: "Jenna Ortiz", when: "2w", type: "sale", msg: "Buyer was a bit slow to respond but everything worked out fine in the end." },
  { id: "4", name: "Deshawn Miller", when: "1mo", type: "purchase", msg: "Packaging could've been better but the product itself was in great shape." },
  { id: "5", name: "Emily Novak", when: "8mo", type: "sale", msg: "Showed up late and tried to renegotiate price at the last second." },
];

// ---------- components ----------

const StatItem = ({ label, value, icon }: Omit<Stat, "id">) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.stat, { backgroundColor: colors.surface }]}>
      <View>
        <View style={styles.statLabelRow}>
          <ThemedText type="defaultFaded" numberOfLines={1} style={{ flexShrink: 1 }}>
            {label}
          </ThemedText>
        </View>
        <ThemedText type="defaultBold">{value}</ThemedText>
      </View>
      {icon && <MaterialIcons name={icon} size={30} color={colors.accent + '40'} />}
    </View>
  );
};

const FeedbackCard = ({ name, when, type, msg }: Omit<Feedback, "id">) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.feedbackCard, { backgroundColor: colors.surface }]}>
      <View style={styles.feedbackHeader}>
        <View style={styles.feedbackWho}>
          <Image
            source={require("@/assets/images/dino.jpg")}
            style={styles.feedbackAvatar}
          />
          <ThemedText type="smallFaded" numberOfLines={1} style={{ flexShrink: 1 }}>
            {name} · {when}
          </ThemedText>
        </View>
        <ThemedText type="smallFaded">{type}</ThemedText>
      </View>
      <ThemedText numberOfLines={4}>{msg}</ThemedText>
    </View>
  );
};

const Section = ({
  title,
  action,
  children,
}: {
  title: string;
  action?: { label: string; onPress: () => void };
  children: React.ReactNode;
}) => (
  <View style={{ gap: 8 }}>
    <View style={styles.sectionHeader}>
      <ThemedText type="defaultBold">{title}</ThemedText>
      {action && (
        <TouchableOpacity onPress={action.onPress}>
          <ThemedText type="smallFaded">{action.label}</ThemedText>
        </TouchableOpacity>
      )}
    </View>
    {children}
  </View>
);

// ---------- screen ----------

export default function SellingScreen() {
  return (
    <ThemedView isTabVisible>
      <CustomHeader title="Selling" />

      <ScrollView
        contentContainerStyle={styles.page}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: 4 }}>
          <CardButtonRow icon="add" label="Add listing" onPress={() => router.push("/addListings")} />
          <CardButtonRow icon="dashboard" label="View listings" onPress={() => router.push("/viewListings")} />
        </View>

        <Section title="Overview" >
          <View style={styles.grid}>
            {overviewStats.map(({ id, ...stat }) => (
              <StatItem key={id} {...stat} />
            ))}
          </View>
        </Section>

        <Section title="Performance" action={{ label: "View all", onPress: () => router.push("/viewListings") }} >
          <View style={styles.grid}>
            {performanceStats.map(({ id, ...stat }) => (
              <StatItem key={id} {...stat} />
            ))}
          </View>
        </Section>

        <Section title="Feedback">
          <FlatList
            data={feedback}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={FEEDBACK_CARD_WIDTH + FEEDBACK_GAP}
            decelerationRate="fast"
            contentContainerStyle={{ gap: FEEDBACK_GAP }}
            keyExtractor={(item) => item.id}
            renderItem={({ item: { id, ...card } }) => <FeedbackCard {...card} />}
          />
        </Section>
      </ScrollView>
    </ThemedView>
  );
}

const FEEDBACK_CARD_WIDTH = 270;
const FEEDBACK_GAP = 10;

const styles = StyleSheet.create({
  page: {
    gap: 20,
    paddingBottom: 100,
    paddingHorizontal: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  // two per row; an odd last item (e.g. 3 stats) stays half width
  grid: {
    flexDirection: "column",
    gap: 8,
  },
  stat: {
    flexBasis: "48%",
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 2,
  },
  statLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  feedbackCard: {
    width: FEEDBACK_CARD_WIDTH,
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  feedbackHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  feedbackWho: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  feedbackAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
