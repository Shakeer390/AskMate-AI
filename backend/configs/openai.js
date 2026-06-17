import OpenAI from "openai";

console.log("API KEY EXISTS:", !!process.env.GEMINI_API_KEY);
const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  
});

export default openai;