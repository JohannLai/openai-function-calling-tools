// clock.ts
import { Tool, ToolInterface } from './tool';
import { z } from 'zod';

function createShowPoisOnMap({
  mapboxAccessToken,
}: {
  mapboxAccessToken: string;
}) {
  if (!mapboxAccessToken) {
    throw new Error('Please set the Mapbox Access Token in the plugin settings.');
  }

  const paramsSchema = z.object({
    pois: z.array(z.object({
      latitude: z.number(),
      longitude: z.number(),
    })),
    zoom: z.number().optional(),
  })

  const name = 'showPoisOnMap';
  const description = `
  Displays specific Points of Interest (POIs) on a map using the Mapbox Static API. Returns a URL to the map image.
  pois: An array of POIs to be displayed on the map.
  zoom: The zoom level for the map depends from the place size. For larger places use min value and for smaller use max. For countries use zoom '1.0'-'3.0'; for national parks, states use '4.0'-'6.0'; landmarks, places or cities use '7.0'-'9.0'. For streets use '15'.  If multiple places are provided, this will automatically set to 'auto'.
`

  const execute = async ({ pois, zoom }: z.infer<typeof paramsSchema>) => {
    const accessToken = mapboxAccessToken;

    if (!accessToken) {
      throw new Error('Please set the Mapbox Access Token in the plugin settings.');
    }

    let markers;
    let padding = "";
    let formatZoom = zoom?.toString() || (pois.length == 1 ? '9' : 'auto'); // Use provided zoom level or default
    if (pois.length > 1) {
      markers = pois.map((poi, index) => `pin-s-${index + 1}+FF2F48(${poi.longitude},${poi.latitude})`).join(',');
      padding = "&padding=50,50,50,50";
      formatZoom = formatZoom === 'auto' ? 'auto' : `${formatZoom},0`;
    } else {
      markers = `pin-s+FF2F48(${pois[0].longitude},${pois[0].latitude})`;
      formatZoom = `${formatZoom},0`;
    }
    let coordinates = pois.length == 1 ? `${pois[0].longitude},${pois[0].latitude},${formatZoom}` : 'auto';
    let url = `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/${markers}/${coordinates}/600x400@2x?access_token=${accessToken}${padding}`;

    return { imageURL: url };
  };

  return new Tool(paramsSchema, name, description, execute).tool;
}

export { createShowPoisOnMap };
