import { useEffect, useState } from 'react'

type Weather = {
  tempC: number
  feelsLikeC: number
  humidityPct: number
  windSpeed: number
  windDeg: number
  summary: string
}

function degToCompass(deg: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return directions[Math.round(deg / 45) % 8]
}

function emojiFor(summary: string): string {
  const s = summary.toLowerCase()
  if (s.includes('cloud')) return '☁️'
  if (s.includes('rain')) return '🌧️'
  if (s.includes('clear')) return '☀️'
  return '🌡️'
}

export default function App() {
  const [weather, setWeather] = useState<Weather | null>(null)

  useEffect(() => {
    fetch('/v1/weather/current?city=Wellington&units=metric')
      .then((res) => res.json())
      .then((data) => setWeather(data))
  }, [])

  if (!weather) return <div>Loading...</div>

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>
        {emojiFor(weather.summary)} {weather.summary}
      </h1>
      <p>Temp: {weather.tempC}°C</p>
      <p>Feels like: {weather.feelsLikeC}°C</p>
      <p>Humidity: {weather.humidityPct}%</p>
      <p>
        Wind: {weather.windSpeed} km/h ({degToCompass(weather.windDeg)})
      </p>
    </div>
  )
}
