import express from "express";
import cors from "cors";
import "dotenv/config";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import quizRoutes from "./quiz";
import userRoutes from "./user";

const port = process.env.PORT || 3000;

const app = express();

app.use(cors(
    {
        origin: process.env.ALLOWED_ORIGIN ? process.env.ALLOWED_ORIGIN : "http://localhost:3000",
        credentials: true
    }
));

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use(express.json());


app.use("/api/quiz", quizRoutes);
app.use("/api/user", userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});