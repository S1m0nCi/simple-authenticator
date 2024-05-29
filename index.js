import express, { Router } from "express";
import bodyParser from "body-parser";

import { authenticationRouter } from "./routes/authentication";

const app = express();
const router = Router();
const port = 3000;





