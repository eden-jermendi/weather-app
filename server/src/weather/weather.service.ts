import type { WeatherCurrentResponse } from "../types/weather.js";
import { fetchJsonWithTimeout } from "../lib/fetchJsonWithTimeout.js";

export class LocationNotFoundError extends Error {
  constructor(message: string = "Location not found") {
    super(message);
    this.name = "LocationNotFoundError";
  }
}

interface OpenWeatherGeocodeResult {
  lat: number;
  lon: number;
  name: string;
  country: string;
}

interface OpenWeatherCurrentWeather {
  dt: number;
  timezone?: number;
  name: string;
  sys?: {
    country?: string;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  weather: Array<{
    description: string;
  }>;
}

function degreesToCompass(deg: number): string {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const index = Math.round(((deg % 360) / 22.5)) % directions.length;
  return directions[index];
}

export async function getCurrentWeather(
  q: string,
  units: "metric" | "imperial"
): Promise<WeatherCurrentResponse> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENWEATHER_API_KEY environment variable");
  }

  const geocodeUrl = new URL(
    "https://api.openweathermap.org/geo/1.0/direct"
  );
  geocodeUrl.searchParams.set("q", q);
  geocodeUrl.searchParams.set("limit", "1");
  geocodeUrl.searchParams.set("appid", apiKey);

  const geocodeResults = await fetchJsonWithTimeout<OpenWeatherGeocodeResult[]>(
    geocodeUrl.toString(),
    { timeoutMs: 5000 }
  );

  if (!Array.isArray(geocodeResults) || geocodeResults.length === 0) {
    throw new LocationNotFoundError("Location not found");
  }

  const { lat, lon, name, country } = geocodeResults[0];

  const weatherUrl = new URL(
    "https://api.openweathermap.org/data/2.5/weather"
  );
  weatherUrl.searchParams.set("lat", String(lat));
  weatherUrl.searchParams.set("lon", String(lon));
  weatherUrl.searchParams.set("units", units);
  weatherUrl.searchParams.set("appid", apiKey);

  const current = await fetchJsonWithTimeout<OpenWeatherCurrentWeather>(
    weatherUrl.toString(),
    { timeoutMs: 5000 }
  );

  const dt = current.dt;
  const timezoneOffset = typeof current.timezone === "number" ? current.timezone : 0;
  const timeUtc = new Date((dt + timezoneOffset) * 1000).toISOString();

  const temp = current.main.temp;
  const feelsLike = current.main.feels_like;
  const humidity = current.main.humidity;
  const windSpeed = current.wind.speed;
  const windDeg = current.wind.deg;
  const description =
    current.weather && current.weather.length > 0
      ? current.weather[0].description
      : "";

  return {
    tempC: temp,
    feelsLikeC: feelsLike,
    humidityPct: humidity,
    windSpeed,
    windDeg,
    summary: `${description} (${degreesToCompass(windDeg)})`,
    timeUtc,
    locationName: current.name || name,
    country: (current.sys && current.sys.country) || country,
  };
}
