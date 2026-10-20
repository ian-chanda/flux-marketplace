import { Chart } from "@/components/chart";
import { CustomHeader } from "@/components/customHeader";
import { EarningsCard } from "@/components/earningsCard";
import { Section } from "@/components/section";
import { SmallIconButton } from "@/components/small-iconButton";
import { StatsRow } from "@/components/statsRow";
import { ThemedView } from "@/components/themed-view";
import { TopListings } from "@/components/topListings";
import { useFetchSellerData } from "@/hooks/use-fetch-selling-data";
import { useTheme } from "@/hooks/useTheme";
import { buildStatRow, filterData, generateChartData } from "@/utils/seller-utils";
import { useState } from "react";
import { FlatList, ScrollView, } from "react-native";
import { Fragment } from "react/jsx-runtime";

//TODO: send this to be an rpc function cos performance will drop as the values to calculate grows

type TABS = "7d" | "28d" | "90d" | "all time"
type Tab = { id: string, tab: TABS, timeframe: number, step: number, bars: number }
const HorizontalTabs: Tab[] = [
	{ id: "week", tab: "7d", timeframe: 7, step: 1, bars: 7 },
	{ id: "month", tab: "28d", timeframe: 28, step: 7, bars: 4 },
	{ id: "year", tab: "90d", timeframe: 90, step: 15, bars: 6 },
	{ id: "all_time", tab: "all time", timeframe: -1, step: 30, bars: 8 },
]


export default function Overview() {
	const { colors } = useTheme()
	const [currentTab, setCurrentTab] = useState<Tab>(HorizontalTabs[0])
	const { sellerData, loading } = useFetchSellerData()

	const listings = filterData(sellerData, currentTab.timeframe)?.sort((a, b) => (b.views + b.inquiries) - (a.views + a.inquiries))

	const sales = listings?.filter((l) => l.is_sold_within_timeframe === true).length;
	const listing_views = listings?.flatMap((listing) => listing.listing_views);

	const stats = buildStatRow(listings ?? [])
	const chartData = generateChartData(listing_views ?? [], currentTab.timeframe, currentTab.step, currentTab.bars)

	return (
		<ThemedView isTabVisible={false}>
			<CustomHeader showBack title="Overview" />
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{ gap: 10, paddingHorizontal: 10 }}
			>
				<FlatList
					data={HorizontalTabs}
					horizontal
					showsHorizontalScrollIndicator={false}
					decelerationRate="fast"
					style={{ flexGrow: 0 }}
					contentContainerStyle={{ padding: 5, gap: 10 }}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => <SmallIconButton
						title={item.tab}
						isSelected={currentTab.tab === item.tab}
						onPress={() => setCurrentTab(item)}
					/>
					}
				/>

				<Fragment>
					<EarningsCard
						topText={currentTab.tab === "all time" ? "Total Earnings" : `Earnings in the Last ${currentTab.timeframe}days`}
						listings={listings}
					/>
					<StatsRow stats={stats} />
				</Fragment>

				<Section title="Views" >
					<Chart data={chartData} />
				</Section>
				<Section title="Top Listings">
					<TopListings listings={listings ?? []} />
				</Section>
			</ScrollView>
		</ThemedView>
	)
}

