import { useQuery } from '@tanstack/react-query';
import { RadioStation, REGIONS, CURATED_STATIONS } from '@/types/radio';

const RADIO_BROWSER_API = 'https://de1.api.radio-browser.info/json';

function transformStation(station: any): RadioStation {
  return {
    ...station,
    id: station.stationuuid || station.id,
    url: station.url_resolved || station.url,
    url_resolved: station.url_resolved || station.url,
  };
}

async function fetchStationsByCountry(countryCode: string, limit = 10): Promise<RadioStation[]> {
  const response = await fetch(
    `${RADIO_BROWSER_API}/stations/bycountrycodeexact/${countryCode}?limit=${limit}&order=votes&reverse=true&hidebroken=true`
  );
  if (!response.ok) throw new Error('Failed to fetch stations');
  const data = await response.json();
  return data.map(transformStation);
}

async function fetchStationsByName(name: string, limit = 5): Promise<RadioStation[]> {
  const response = await fetch(
    `${RADIO_BROWSER_API}/stations/byname/${encodeURIComponent(name)}?limit=${limit}&order=votes&reverse=true&hidebroken=true`
  );
  if (!response.ok) throw new Error('Failed to fetch stations');
  const data = await response.json();
  return data.map(transformStation);
}

async function fetchStationsForRegion(regionId: string): Promise<RadioStation[]> {
  const region = REGIONS.find(r => r.id === regionId);
  if (!region) return [];

  const curatedList = CURATED_STATIONS[regionId] || [];

  const curatedPromises = curatedList.map(async (curated) => {
    const stations = await fetchStationsByName(curated.searchName, 3);
    if (stations.length > 0) return stations[0];
    return null;
  });

  const curatedResults = await Promise.all(curatedPromises);
  const validCurated = curatedResults.filter((s): s is RadioStation => s !== null);

  const countryStations = await Promise.all(
    region.countries.map(country => fetchStationsByCountry(country, 6))
  );

  const countryFlat = countryStations.flat();

  const seenIds = new Set(validCurated.map(s => s.id));
  const combined = [...validCurated];

  for (const station of countryFlat) {
    if (!seenIds.has(station.id) && combined.length < 12) {
      combined.push(station);
      seenIds.add(station.id);
    }
  }

  return combined.slice(0, 12);
}

export function useStations(regionId: string) {
  if (regionId === 'all') {
    return useQuery({
      queryKey: ['stations', 'all'],
      queryFn: async () => {
        const response = await fetch(
          `${RADIO_BROWSER_API}/stations/topvote/50?hidebroken=true`
        );
        if (!response.ok) throw new Error('Failed to fetch popular stations');
        const data = await response.json();
        return data.map(transformStation) as RadioStation[];
      },
      staleTime: 1000 * 60 * 10,
    });
  }

  return useQuery({
    queryKey: ['stations', 'region', regionId],
    queryFn: () => fetchStationsForRegion(regionId),
    staleTime: 1000 * 60 * 10,
  });
}
