const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";
const API_KEY = process.env.HUGGING_FACE_API_KEY;

async function test() {
    try {
        console.log("Testing Hugging Face...");
        const response = await axios.post(
            API_URL,
            { inputs: "Suggest one financial tip for an Indian user." },
            { headers: { Authorization: `Bearer ${API_KEY}` } }
        );
        console.log("Success:", JSON.stringify(response.data, null, 2));
    } catch (err) {
        console.error("HF Error:", err.response ? err.response.data : err.message);
    }
}

test();
