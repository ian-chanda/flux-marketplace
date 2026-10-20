import { CardButtonRow } from "@/components/cardButtonRow";
import { CustomHeader } from "@/components/customHeader";
import { EarningsCard } from "@/components/earningsCard";
import { StatsRow } from "@/components/statsRow";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useFetchSellerData } from "@/hooks/use-fetch-selling-data";
import { useTheme } from "@/hooks/useTheme";
import { buildStatRow } from "@/utils/seller-utils";
import { router } from "expo-router";
import { Fragment, ReactNode } from "react";
import { FlatList, Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

type Stat = { id: string; label: string; value: string };

type Feedback = {
  id: string;
  name: string;
  when: string;
  type: "purchase" | "sale";
  msg: string;
};

// ---------- mock data (replace with real queries) ----------


const performanceStats: Stat[] = [
  { id: "rating", label: "Rating", value: "4.8" },
  { id: "sales", label: "Sales", value: "130" },
  { id: "response", label: "Response time", value: "~2h" },
];

const feedback: Feedback[] = [
  { id: "1", name: "Sarah Chen", when: "3d", type: "sale", msg: "Super smooth transaction, paid instantly and picked up right on time. Would sell to again!" },
  { id: "2", name: "Marcus Webb", when: "1w", type: "purchase", msg: "Item was exactly as described, great communication throughout. Highly recommend." },
  { id: "3", name: "Jenna Ortiz", when: "2w", type: "sale", msg: "Buyer was a bit slow to respond but everything worked out fine in the end." },
  { id: "4", name: "Deshawn Miller", when: "1mo", type: "purchase", msg: "Packaging could've been better but the product itself was in great shape." },
  { id: "5", name: "Emily Novak", when: "8mo", type: "sale", msg: "Showed up late and tried to renegotiate price at the last second." },
];

// ---------- components ----------

// several numbers in one card, number first, label underneath
const StatStrip = ({ items }: { items: Stat[] }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.strip, { backgroundColor: colors.surface }]}>
      {items.map((item, index) => (
        <Fragment key={item.id}>
          {index > 0 && <View style={[styles.divider, { backgroundColor: colors.background }]} />}
          <View style={styles.cell}>
            <ThemedText type="defaultBold" style={styles.cellValue}>
              {item.value}
            </ThemedText>
            <ThemedText type="smallFaded" numberOfLines={1}>
              {item.label}
            </ThemedText>
          </View>
        </Fragment>
      ))}
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
  children: ReactNode;
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


  const {sellerData, loading} = useFetchSellerData()

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

        <Section
          title="Overview"
          action={{ label: "expand", onPress: () => router.push("/overview") }}
        >
          <EarningsCard listings={sellerData ?? []} topText="Total Earnings"/>
          <StatsRow stats={buildStatRow(sellerData ?? [])} />
        </Section>

        <Section title="Performance">
          <StatStrip items={performanceStats} />
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
  hero: {
    padding: 16,
    borderRadius: 12,
    gap: 2,
  },
  strip: {
    flexDirection: "row",
    borderRadius: 12,
    overflow: "hidden",
  },
  cell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 6,
    gap: 2,
  },
  cellValue: {
    fontSize: 20,
    lineHeight: 26,
  },
  divider: {
    width: 2,
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
