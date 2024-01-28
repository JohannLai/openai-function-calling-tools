import { createReverseGeocode } from './reverseGeocode'; 
import { expect, it } from 'vitest';

const reverseGeocode = createReverseGeocode({
  mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN || 'YOUR_FALLBACK_MAPBOX_ACCESS_TOKEN',
});

it('should successfully return an address from coordinates', async () => {
  const result = await reverseGeocode.execute({
    latitude: 40.7128,
    longitude: -74.006,
  });

  console.log(result)

  expect(result).toMatchObject({
    address: expect.stringContaining(','),
  });
});
