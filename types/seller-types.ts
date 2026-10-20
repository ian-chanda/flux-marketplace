
export type ListingView = {
	created_at: string;
};

export type ChartData = {
	label_start: string;
	label_end: string;
	value: number;
};

export type SellerDataType = {
	id: string;
	user_id: string;
	price: number;
	title: string;
	is_sold: boolean;
	sold_at: string | null;
	is_available: boolean;
	channels: {
		id: string;
		last_msg_id: string | null;
		created_at: string;
	}[];
	listing_views: {
		created_at: string
	}[];
	views: number;
	inquiries: number;
	is_sold_within_timeframe?: boolean
};
