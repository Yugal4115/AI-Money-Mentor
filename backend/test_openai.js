const OpenAI = require('openai');
const dotenv = require('dotenv');
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function test() {
    try {
        console.log("Testing with key:", process.env.OPENAI_API_KEY.substring(0, 15) + "...");
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "hi" }],
            max_tokens: 5
        });
        console.log("Success:", completion.choices[0].message.content);
    } catch (err) {
        console.error("OpenAI Error:", err.message);
        console.error("Status Code:", err.status);
    }
}

test();
