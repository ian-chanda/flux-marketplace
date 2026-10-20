import { ChartData, ListingView, SellerDataType } from "@/types/seller-types";


export function filterData(listings: SellerDataType[] | undefined, timeframe: number): SellerDataType[] {
	//filter sold_at should be within timeframe
	//channels[] data should be filtered by created_at
	//listing_views[] data should be filtered by created_at
	//return a new listings thingy

	if (!listings) return [] as SellerDataType[]
	if (timeframe === -1) return listings.map((listing) => ({
		...listing,
		listing_views: listing.listing_views,
		channels: listing.channels,
		inquiries: listing.channels?.filter((c) => c.last_msg_id !== null).length,
		views: listing.listing_views?.length,
		is_sold_within_timeframe: listing.is_sold
	}))

	const now = new Date();

	// start of the week in the 4 week range
	// this week being the last week
	// so go back 3 mondays 
	const startDate = new Date(now)
	startDate.setDate(startDate.getDate() - timeframe)

	const isWithinTimeframe = (dateString: string | null) => {
		if (!dateString) return false;

		const date = new Date(dateString);

		return (
			!Number.isNaN(date.getTime()) &&
			date >= startDate &&
			date <= now
		);
	};

	return listings.map((listing) => {
		const channels = listing.channels?.filter((c) => isWithinTimeframe(c.created_at))
		const listing_views = listing.listing_views?.filter((v) => isWithinTimeframe(v.created_at))

		return {
			...listing,
			listing_views,
			channels,
			inquiries: channels?.filter((c) => c.last_msg_id !== null).length,
			views: listing_views?.length,
			is_sold_within_timeframe: listing.is_sold && isWithinTimeframe(listing?.sold_at ?? "")
		}
	})
}

export const buildStatRow = (item: any[]): { id: string, label: string, value: any }[] => {
	if (!item)
		return [
			{ id: "views", label: "Views", value: "-" },
			{ id: "inquiries", label: "Inquiries", value: "-" },
			{ id: "active listings", label: "Active listings", value: "-" },
		]

	const listings = item?.filter((l) => l.is_available === true).length;
	const views = item.reduce(
		(sum, listing) => sum + (listing.views ?? 0),
		0
	)
	const inquiries = item.reduce(
		(sum, listing) => sum + (listing.inquiries ?? 0),
		0
	)


	return [
		{ id: "views", label: "Views", value: views },
		{ id: "inquiries", label: "Inquiries", value: inquiries },
		{ id: "active listings", label: "Active listings", value: listings },
	]
}

export function generateChartData(listingViews: ListingView[], t: number, s: number, b: number): ChartData[] {

	if (listingViews.length <= 0) return [] as ChartData[]

	const now = new Date();
	const mspd = 24 * 60 * 60 * 1000

	let step = s;
	let timeframe = t;
	let bars = b
	let step_t = 0;

	if (timeframe === -1) {
		const max = now.getTime()
		const min = Math.min(...listingViews.map((d) => new Date(d.created_at).getTime()))

		const timeframe_t = max - min;
		timeframe = Math.ceil(timeframe_t / mspd)

		if (timeframe < 8)
			bars = timeframe
		step_t = timeframe_t / bars
		step = Math.ceil(step_t / mspd)

	}

	const startDate = new Date(now)
	startDate.setDate(startDate.getDate() - timeframe)

	const weeks = Array.from({ length: bars }, (_, i) => {

		let start = new Date()
		let end = new Date()

		if (t === -1) {
			const startMs = startDate.getTime() + i * step_t;
			const endMs = Math.min(startMs + step_t, now.getTime());

			start = new Date(startMs);
			end = new Date(endMs);
		} else {
			start = new Date(startDate);
			start.setDate(start.getDate() + i * step)

			if (start > now) {
				start.setTime(now.getTime())
			}

			end = new Date(start);
			end.setDate(end.getDate() + step)
			if (end > now) {
				end.setTime(now.getTime())
			}
		}

		const date = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
		const endDate = step === 1 ? "" : end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })


		return {
			label_start: date,
			label_end: endDate,
			start,
			end,
			value: 0
		}
	})

	const isWithinTimeframe = (datestring: string | null, start: Date, end: Date) => {
		if (!start || !end || !datestring) return false;

		const date = new Date(datestring);

		return (
			!Number.isNaN(date.getTime()) &&
			date >= start &&
			date < end
		);
	};


	for (const view of listingViews) {
		for (let i = 0; i < weeks.length; i++) {
			if (isWithinTimeframe(view.created_at, weeks[i].start, weeks[i].end)) {
				weeks[i].value++;
			}
		}
	}

	return weeks.map(({ label_start, label_end, value }) => ({
		label_start: label_start,
		label_end: label_end,
		value: value
	}))
}

