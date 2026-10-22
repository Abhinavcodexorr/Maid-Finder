// Shared fetch for the free, no-key India states/districts dataset
// (india-states-districts on npm, served via unpkg — no API key, no
// account, just a static 11KB JSON file) used by the geo proxy routes.
// Cached by Next's fetch cache since this reference data never changes.

export interface IndiaStateEntry {
  name: string;
  districts: string[];
}

interface IndiaGeoData {
  states: IndiaStateEntry[];
  union_territories: IndiaStateEntry[];
}

export async function fetchIndiaGeoData(): Promise<IndiaStateEntry[]> {
  const response = await fetch(
    "https://unpkg.com/india-states-districts@1.8.0/state_discripts.json",
    { next: { revalidate: 60 * 60 * 24 } }
  );
  if (!response.ok) throw new Error("Could not load the states dataset.");
  const data: IndiaGeoData = await response.json();
  return [...data.states, ...data.union_territories];
}
