const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
app.use(express.json());
app.use(cors());
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

async function run(mess) {
    const chatSession = model.startChat({
        generationConfig,
        history: [
        ],
    });

    const result = await chatSession.sendMessage(mess);
    return result.response.text();
}
app.use(express.static("public"));
app.get("/start-server", (req, res) => {
    res.json({ message: "Server is running" });
});
app.post("/generate", async (req, res) => {
    const { message } = req?.body;
    res.json({ message: await run(message) });
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});