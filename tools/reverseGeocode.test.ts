import { createReverseGeocode } from './reverseGeocode'; 
import { expect, it } from 'vitest';


it('should successfully return an address from coordinates', async () => {
  const reverseGeocode = createReverseGeocode({
    mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN || 'YOUR_FALLBACK_MAPBOX_ACCESS_TOKEN',
  });

  const result = await reverseGeocode.execute({
    latitude: 40.7128,
    longitude: -74.006,
  });

  expect(result).toMatchObject({
    address: expect.stringContaining(','),
  });
});

// throw error if not mapbox access token
it ('should throw an error if no mapbox access token', async () => {
    // createReverseGeocode will throw an error if no mapbox access token
    expect(() => createReverseGeocode({mapboxAccessToken: ''})).toThrow();
});

