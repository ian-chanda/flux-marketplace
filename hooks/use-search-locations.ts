import { useQuery } from "@tanstack/react-query";

// const ACCESS_TOKEN = process.env.ACCESS_TOKEN as string;
const ACCESS_TOKEN = "pk.17798218521051136177b0e00ad04098";

// {
//   "place_id": "323583691687",
//   "osm_id": "13368230185",
//   "osm_type": "node",
//   "licence": "https://locationiq.com/attribution",
//   "lat": "-15.367269",
//   "lon": "28.3859943",
//   "boundingbox": [
//     "-15.367319",
//     "-15.367219",
//     "28.3859443",
//     "28.3860443"
//   ],
//   "class": "highway",
//   "type": "bus_stop",
//   "display_name": "Chelstone, Palm Drive, Chelston, Lusaka District, Lusaka Province, Zambia",
//   "display_place": "Chelstone",
//   "display_address": "Palm Drive, Chelston, Lusaka District, Lusaka Province, Zambia",
//   "address": {
//     "name": "Chelstone",
//     "road": "Palm Drive",
//     "suburb": "Chelston",
//     "county": "Lusaka District",
//     "state": "Lusaka Province",
//     "country": "Zambia",
//     "country_code": "zm",
//     "town": "Chelston"
//   }
// },

export function useSearchLocation(query: string) {
  const { data, isLoading, isRefetching, error } = useQuery({
    queryKey: ["locationsAutocomplete", query],
    queryFn: async () => {
      const url = `https://api.locationiq.com/v1/autocomplete?key=${ACCESS_TOKEN}&q=${query}`;
      const response = await fetch(url);
      const data = await response.json();
      return data;
    },
  });

  return {
    data,
    loading: isLoading,
    refetch: isRefetching,
    error,
  };
}
