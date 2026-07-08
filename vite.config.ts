import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import https from 'https'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'google-reviews-dev-middleware',
        configureServer(server) {
          server.middlewares.use('/api/reviews', (_req, res) => {
            const apiKey = env.GOOGLE_PLACES_API_KEY
            const placeId = env.GOOGLE_PLACE_ID || 'YOUR_GOOGLE_PLACE_ID'

            if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'GOOGLE_PLACES_API_KEY is not defined' }))
              return
            }

            const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`

            https.get(url, (apiRes) => {
              let data = ''
              apiRes.on('data', (chunk) => {
                data += chunk
              })
              apiRes.on('end', () => {
                try {
                  const json = JSON.parse(data)
                  res.statusCode = json.status === 'OK' ? 200 : 500
                  res.setHeader('Content-Type', 'application/json')
                  if (json.status === 'OK') {
                    res.end(JSON.stringify(json.result))
                  } else {
                    res.end(JSON.stringify({ error: json.error_message || json.status }))
                  }
                } catch (error) {
                  res.statusCode = 500
                  res.end(JSON.stringify({ error: 'JSON parse error' }))
                }
              })
            }).on('error', (err) => {
              res.statusCode = 500
              res.end(JSON.stringify({ error: err.message }))
            })
          })
        }
      }
    ],
  }
})
