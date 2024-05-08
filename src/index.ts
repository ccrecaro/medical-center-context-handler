import express from "express";
import { connectToDatabase } from "./services/database.service"
import { usersRouter } from "./routes/users.routes";
import cors from "cors";

const app = express();
const port = '3004';

app.use(cors());

connectToDatabase()
    .then(() => {
        app.use("/users", usersRouter);

        app.listen('3004', () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });

