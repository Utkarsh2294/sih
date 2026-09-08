const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/reverse';

export const reverseGeocodeIndia = async ({ latitude, longitude }) => {
  const params = new URLSearchParams({ format: 'jsonv2', lat: String(latitude), lon: String(longitude), zoom: '10', addressdetails: '1' });
  const response = await fetch(`${NOMINATIM_ENDPOINT}?${params}`, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error('We could not identify your district from this location.');
  const result = await response.json();
  const address = result.address || {};
  if (address.country_code !== 'in') throw new Error('This locator currently supports locations inside India only.');
  return {
    state: address.state || address['ISO3166-2-lvl4'] || '',
    district: address.state_district || address.county || address.city_district || address.district || '',
  };
};
