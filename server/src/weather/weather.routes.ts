import { Router } from "express";
import { getCurrentWeatherHandler } from "./weather.controller.js";

const router = Router();

router.get("/current", getCurrentWeatherHandler);

export default router;
