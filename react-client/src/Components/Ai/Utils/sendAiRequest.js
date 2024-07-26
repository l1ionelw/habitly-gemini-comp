import { GoogleGenerativeAI } from "@google/generative-ai";
import DOMPurify from "dompurify";
import { marked } from 'marked';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default async function sendAiRequest(prompt) {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    console.log(text);
    text = DOMPurify.sanitize(text);
    return marked.parse(text);
}