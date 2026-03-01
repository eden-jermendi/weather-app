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
  const data = await getCurrentWeather(city.trim());
  res.json(data);
}
