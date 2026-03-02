import { Request, Response } from 'express'
import { getCurrentWeather, LocationNotFoundError } from './weather.service.js'

type Units = 'metric' | 'imperial'

export async function getCurrentWeatherHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const cityRaw = req.query.city ?? req.query.q

  if (typeof cityRaw !== 'string' || !cityRaw.trim()) {
    res.status(400).json({ error: 'Missing or invalid query: city' })
    return
  }

  const city = cityRaw.trim()

  const unitsRaw = req.query.units
  let units: Units = 'metric'

  if (unitsRaw != null) {
    if (typeof unitsRaw !== 'string') {
      res.status(400).json({ error: 'Missing or invalid query: units' })
      return
    }

    if (unitsRaw === 'metric' || unitsRaw === 'imperial') {
      units = unitsRaw
    } else {
      res.status(400).json({ error: 'Missing or invalid query: units' })
      return
    }
  }

  try {
    const data = await getCurrentWeather(city, units)
    res.json(data)
  } catch (error) {
    if (error instanceof LocationNotFoundError) {
      res.status(404).json({ error: error.message })
    } else {
      // For now, return a generic error response; logging can be added later.
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
