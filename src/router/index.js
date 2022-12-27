import { Router } from "express";
import { getAllDevices } from "../controller/devices/index.js";

const router = Router()












// users

//devices
router.get('/all-devices', getAllDevices)

export default router