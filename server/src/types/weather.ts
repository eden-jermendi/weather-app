export interface WeatherCurrentResponse {
  tempC: number;
  feelsLikeC: number;
  humidityPct: number;
  windSpeed: number;
  windDeg: number;
  summary: string;
  timeUtc: string;
  locationName: string;
  country: string;
}

export interface ApiErrorResponse {
  error: string;
}