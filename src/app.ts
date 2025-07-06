import express, { Request, Response, Application } from "express";
import "dotenv/config.js";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import errorHandler from "./helpers/errorHandler.js";
import usersRoute from "./routes/userRoutes.js";
import docRoute from "./routes/docRoutes.js";
import checkOut from "./routes/checkOutRoutes.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

const app: Application = express();

// error handler
errorHandler();

app.use(
  cors({
    origin: process.env.FRONTED_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: "Too many requests, please try again later.",
  },
});
app.use(limiter);
app.use(cookieParser());
app.disable("x-powered-by");
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(express.static("/public"));

// routes
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/doc", docRoute);
app.use("/api/v1/payment",checkOut);

app.post("/", (req: Request, res: Response) => {
  res.send("Server is working");
  console.log("server is working");
});

export default app;
