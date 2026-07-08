import https from 'https';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID || 'YOUR_GOOGLE_PLACE_ID';

  if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
    return res.status(500).json({ error: 'GOOGLE_PLACES_API_KEY environment variable is not configured' });
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`;

  https.get(url, (apiRes) => {
    let data = '';
    apiRes.on('data', (chunk) => {
      data += chunk;
    });
    apiRes.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json.status === 'OK') {
          return res.status(200).json(json.result);
        }
        return res.status(500).json({ error: json.error_message || json.status });
      } catch (error) {
        return res.status(500).json({ error: 'Failed to parse API response' });
      }
    });
  }).on('error', (err) => {
    return res.status(500).json({ error: err.message });
  });
}
