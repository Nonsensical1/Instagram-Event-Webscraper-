
import { GoogleGenAI, Type } from "@google/genai";
import { InstagramPage, EventInfo } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function findInstagramPages(topic: string): Promise<Omit<InstagramPage, 'status' | 'event'>[]> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: `You are an AI assistant specialized in social media intelligence. Find the top 3-5 most likely official Instagram accounts for clubs or organizations related to "${topic}". For each, provide the Instagram handle, a direct URL, a short description of the club, and a confidence score (0-100) of it being official.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            handle: { type: Type.STRING, description: "The Instagram handle, without the '@'." },
                            url: { type: Type.STRING, description: "The full URL to the Instagram profile." },
                            description: { type: Type.STRING, description: "A brief description of the organization or club." },
                            confidence: { type: Type.INTEGER, description: "A score from 0 to 100 indicating the likelihood of it being the official page." },
                        },
                        required: ["handle", "url", "description", "confidence"],
                    },
                },
            },
        });
        
        const jsonText = response.text;
        const pages = JSON.parse(jsonText);
        return pages as Omit<InstagramPage, 'status' | 'event'>[];

    } catch (error) {
        console.error("Error finding Instagram pages:", error);
        throw new Error("Failed to fetch Instagram pages from AI. The prompt may have been blocked or the response was not valid JSON.");
    }
}

export async function analyzePageForEvents(handle: string): Promise<EventInfo | null> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are an expert at analyzing social media posts for event information. Based on public knowledge of recent posts from the Instagram account "@${handle}", identify the single most recent and upcoming event announcement. Extract the event title, a start date and time in ISO 8601 format (YYYY-MM-DDTHH:mm:ss), a location, and a brief description. If no upcoming event is found, return an empty object. Assume today's date is ${new Date().toISOString()} for relative date calculations like 'tomorrow' or 'next week'.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "The title of the event." },
                        dtstart: { type: Type.STRING, description: "The start date and time of the event in ISO 8601 format (YYYY-MM-DDTHH:mm:ss)." },
                        location: { type: Type.STRING, description: "The location of the event." },
                        description: { type: Type.STRING, description: "A brief description of the event." },
                    },
                },
            },
        });

        const jsonText = response.text;
        const eventData = JSON.parse(jsonText);

        // Check if the object is empty or lacks a title, indicating no event was found
        if (!eventData || !eventData.title) {
            return null;
        }

        return eventData as EventInfo;

    } catch (error) {
        console.error(`Error analyzing page @${handle}:`, error);
        return null;
    }
}
