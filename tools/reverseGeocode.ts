// reverseGeocode.ts
import { Tool, ToolInterface } from './tool';
import { z } from 'zod';

function createReverseGeocode({
  mapboxAccessToken,
}: {
  mapboxAccessToken: string;
}) {
  if (!mapboxAccessToken) {
    throw new Error('Please set the Mapbox Access Token in the plugin settings.');
  }

  const paramsSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
  });

  const name = 'reverseGeocode';
  const description = `
  Converts latitude and longitude coordinates to a human-readable address using the Mapbox Geocoding API. Returns the address as a string.
  latitude: The latitude of the location to be geocoded.
  longitude: The longitude of the location to be geocoded.
`;

  const execute = async ({ latitude, longitude }: z.infer<typeof paramsSchema>) => {
    const accessToken = mapboxAccessToken;

    if (!accessToken) {
      throw new Error('Please set the Mapbox Access Token in the plugin settings.');
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${accessToken}`;

    let response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    if (!data || !data.features || !data.features.length) {
      throw new Error('No address found for the provided coordinates.');
    }

    // Assuming the first feature is the most relevant result
    const place = data.features[0];
    return {
      address: place.place_name,
    };
  };

  return new Tool(paramsSchema, name, description, execute).tool;
}

export { createReverseGeocode };
