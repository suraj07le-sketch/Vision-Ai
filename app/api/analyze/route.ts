import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { image, targetLanguage, deepSearch } = await req.json();

        if (!process.env.OPENROUTER_API_KEY) {
            return NextResponse.json({ error: "OpenRouter API Key not configured" }, { status: 500 });
        }

        const MODELS = [
            "google/gemma-3-27b-it:free",
            "google/gemma-3-12b-it:free",
            "google/gemma-3-4b-it:free",
            "nvidia/nemotron-nano-12b-v2-vl:free"
        ];

        let finalData = null;
        let lastError = null;
        let usedModel = "";

        const prompt = deepSearch
            ? `Analyze this image with MAXIMUM PRECISION and SCIENTIFIC DETAIL. 
               Identify the main object or text and provide a comprehensive, high-accuracy breakdown.
               
               CRITICAL INSTRUCTIONS:
               - DO NOT use any markdown formatting (no **, no #, no bullet points).
               - Provide the "translation" field for both "object" and "explanation" strictly in ${targetLanguage}.
               - The response must be a clean, valid JSON object.

               Provide:
               1. "object": Full, formal name of the object or text in English.
               2. "explanation": A highly detailed 4-5 sentence analysis in English.
               3. "translation": Translate both "object" and "explanation" into ${targetLanguage}.
               4. "detected_lang": Precise original language identification for any text.
               5. "deep_info": Extensive scientific background data in English.
               6. "examples": Provide 3 distinct real-world examples in English.
               
               Respond ONLY in JSON format:
               {
                 "object": "...",
                 "explanation": "...",
                 "translation": { "object": "...", "explanation": "..." },
                 "detected_lang": "...",
                 "deep_info": "...",
                 "examples": ["...", "...", "..."]
               }`
            : `Analyze this image. Identify the main object or text. 

               CRITICAL INSTRUCTIONS:
               - DO NOT use any markdown formatting (no **, no #, no bullet points).
               - Ensure the "translation" field is accurately translated into ${targetLanguage}.
               - Respond strictly with a clean JSON object.

               Provide:
               1. "object": Short name of the object or detected text in English.
               2. "explanation": A 1-2 sentence detailed explanation in English.
               3. "translation": Translate both "object" and "explanation" into ${targetLanguage}.
               4. "detected_lang": If the image contain text, what is its original language?
               
               Respond ONLY in JSON format:
               {
                 "object": "...",
                 "explanation": "...",
                 "translation": { "object": "...", "explanation": "..." },
                 "detected_lang": "..."
               }`;

        for (const model of MODELS) {
            try {
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": "https://vision-ai.app",
                        "X-Title": "Vision AI",
                    },
                    body: JSON.stringify({
                        "model": model,
                        "messages": [
                            {
                                "role": "user",
                                "content": [
                                    {
                                        "type": "text",
                                        "text": prompt
                                    },
                                    {
                                        "type": "image_url",
                                        "image_url": {
                                            "url": image
                                        }
                                    }
                                ]
                            }
                        ]
                    })
                });

                const data = await response.json();

                if (data.error) {
                    console.error(`Model ${model} failed:`, data.error);
                    lastError = data.error.message;
                    continue; // Trigger fallback to next model in loop
                }

                // If it succeeds, capture data and break the loop
                finalData = data;
                usedModel = model;
                break;

            } catch (err) {
                console.error(`Request to ${model} failed`, err);
                lastError = "Network or parsing error";
                continue;
            }
        }

        if (!finalData) {
            return NextResponse.json({ error: `All ${MODELS.length} backup models failed. Last error: ${lastError}` }, { status: 500 });
        }

        const aiContent = finalData.choices[0].message.content;

        // Clean potential markdown code blocks from AI response
        const cleanedJson = aiContent.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleanedJson);

        // Attach the specific model that succeeded so the frontend can display it
        parsed.used_model = usedModel;

        return NextResponse.json(parsed);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error("API Error:", error);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
