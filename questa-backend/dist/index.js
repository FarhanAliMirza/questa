"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const node_1 = require("better-auth/node");
const auth_1 = require("./auth");
const quiz_1 = __importDefault(require("./quiz"));
const user_1 = __importDefault(require("./user"));
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    // origin: "http://localhost:3000",
    origin: "https://questa-blue.vercel.app",
    credentials: true
}));
app.all('/api/auth/{*any}', (0, node_1.toNodeHandler)(auth_1.auth));
app.use(express_1.default.json());
app.use("/api/quiz", quiz_1.default);
app.use("/api/user", user_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
