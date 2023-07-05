import { createShowPoisOnMap } from './showPoisOnMap'; // 根据文件路径更改
import { expect, it } from 'vitest';

const [showPoisOnMap] = createShowPoisOnMap({
  mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN,
});

it('should successfully get a map', async () => {
  const result = await showPoisOnMap({
    pois: [
      {
        latitude: 40.7128,
        longitude: -74.006,
      }
    ],
    mapStyle: 'streets-v12',
  });

  expect(result).toMatchObject({
    imageURL: expect.stringContaining('https://api.mapbox.com/styles/v1'),
  });
});

