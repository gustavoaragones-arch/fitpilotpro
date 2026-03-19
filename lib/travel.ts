// Haversine formula — straight-line distance in km between two coordinates
function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Estimate drive time in minutes from straight-line distance
// Urban driving: assume ~25 km/h average including stops/traffic
function estimateMinutes(km: number): number {
  return Math.round((km / 25) * 60);
}

export interface TravelEstimate {
  fromName: string;
  toName: string;
  distanceKm: number;
  durationMinutes: number;
  label: string;
}

async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey || !address) return null;

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );
    const data = await res.json();
    if (data.status === "OK" && data.results?.[0]) {
      return data.results[0].geometry.location;
    }
  } catch {
    // ignore
  }
  return null;
}

export interface SessionNeighbor {
  id: string;
  clientName: string;
  scheduledAt: string;
  address: string | null;
  locationType: string | null;
}

export interface TravelIntelligence {
  before: SessionNeighbor | null;
  after: SessionNeighbor | null;
  travelToNew: TravelEstimate | null;
  travelFromNew: TravelEstimate | null;
  totalAddedMinutes: number;
  quality: "great" | "ok" | "long";
  openInMapsUrl: string | null;
}

export function buildMapsUrl(
  stops: Array<{ address: string; label: string }>
): string {
  if (stops.length < 2) return "";
  const origin = encodeURIComponent(stops[0].address);
  const destination = encodeURIComponent(stops[stops.length - 1].address);
  const waypoints = stops
    .slice(1, -1)
    .map((s) => encodeURIComponent(s.address))
    .join("|");
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ""}&travelmode=driving`;
}

export async function calculateTravelIntelligence(
  proposedTime: Date,
  newClientAddress: string | null,
  newClientName: string,
  existingSessions: SessionNeighbor[]
): Promise<TravelIntelligence> {
  const sorted = [...existingSessions].sort(
    (a, b) =>
      new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  );

  const before =
    sorted.filter((s) => new Date(s.scheduledAt) < proposedTime).pop() ?? null;
  const after =
    sorted.find((s) => new Date(s.scheduledAt) > proposedTime) ?? null;

  if (!newClientAddress) {
    return {
      before,
      after,
      travelToNew: null,
      travelFromNew: null,
      totalAddedMinutes: 0,
      quality: "ok",
      openInMapsUrl: null,
    };
  }

  const [newCoords, beforeCoords, afterCoords] = await Promise.all([
    geocodeAddress(newClientAddress),
    before?.address ? geocodeAddress(before.address) : Promise.resolve(null),
    after?.address ? geocodeAddress(after.address) : Promise.resolve(null),
  ]);

  let travelToNew: TravelEstimate | null = null;
  let travelFromNew: TravelEstimate | null = null;
  let totalAddedMinutes = 0;

  if (newCoords && beforeCoords && before) {
    const km = haversineKm(
      beforeCoords.lat,
      beforeCoords.lng,
      newCoords.lat,
      newCoords.lng
    );
    const mins = estimateMinutes(km);
    travelToNew = {
      fromName: before.clientName,
      toName: newClientName,
      distanceKm: Math.round(km * 10) / 10,
      durationMinutes: mins,
      label: `~${mins} min`,
    };
    totalAddedMinutes += mins;
  }

  if (newCoords && afterCoords && after) {
    const km = haversineKm(
      newCoords.lat,
      newCoords.lng,
      afterCoords.lat,
      afterCoords.lng
    );
    const mins = estimateMinutes(km);
    travelFromNew = {
      fromName: newClientName,
      toName: after.clientName,
      distanceKm: Math.round(km * 10) / 10,
      durationMinutes: mins,
      label: `~${mins} min`,
    };
    totalAddedMinutes += mins;
  }

  const quality: TravelIntelligence["quality"] =
    totalAddedMinutes < 20 ? "great" : totalAddedMinutes < 40 ? "ok" : "long";

  const allStops = [
    ...(before && before.address
      ? [{ address: before.address, label: before.clientName }]
      : []),
    { address: newClientAddress, label: newClientName },
    ...(after && after.address
      ? [{ address: after.address, label: after.clientName }]
      : []),
  ].filter((s) => s.address);

  const openInMapsUrl =
    allStops.length >= 2 ? buildMapsUrl(allStops) : null;

  return {
    before,
    after,
    travelToNew,
    travelFromNew,
    totalAddedMinutes,
    quality,
    openInMapsUrl,
  };
}
