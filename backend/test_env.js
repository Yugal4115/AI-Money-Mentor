const dotenv = require('dotenv');
const result = dotenv.config();
console.log('Dotenv config result:', result);
console.log('OPENAI_API_KEY present:', !!process.env.OPENAI_API_KEY);
console.log('Value length:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0);
