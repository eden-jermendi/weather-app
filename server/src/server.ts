import 'dotenv/config'
import express from 'express'
import weatherRoutes from './weather/weather.routes.js'

const app = express()
const port = process.env.PORT ?? 3000

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/v1/weather', weatherRoutes)

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
