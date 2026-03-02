import { Request, Response } from "express";
import { getCurrentWeather } from "./weather.service.js";

export async function getCurrentWeatherHandler(
  req: Request,
  res: Response
): Promise<void> {
  const city = req.query.city;
  if (typeof city !== "string" || !city.trim()) {
    res.status(400).json({ error: "Missing or invalid query: city" });
    return;
  }

  try {
    const data = await getCurrentWeather(city.trim());
    res.json(data);
  } catch (error) {
    // For now, return a generic error response; logging can be added later.
    res.status(500).json({ error: "Internal server error" });
  }
}
