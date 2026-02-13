import express from "express";
import type { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { specRouter } from "./routes/spec.routes";

export const app: Express = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api", specRouter);
