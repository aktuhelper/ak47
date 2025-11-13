import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'API key is not configured' },
                { status: 500 }
            );
        }

        const { message, conversationHistory } = await req.json();

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Build conversation context
        let fullMessage = message;

        if (conversationHistory && conversationHistory.length > 0) {
            fullMessage = "Previous conversation:\n";
            conversationHistory.slice(-4).forEach(msg => {
                fullMessage += `${msg.sender === 'user' ? 'Student' : 'Assistant'}: ${msg.text}\n`;
            });
            fullMessage += `\nCurrent question: ${message}`;
        }

        // System instruction
        const systemInstruction = `You are an AI assistant for Aktuheper, an educational website that helps students with their academic needs.

AKTUHEPER FEATURES:
- Free study materials and notes for B.Tech, MBA, and other courses
- Previous year question papers and solutions
- Online practice tests and quizzes
- Video lectures and tutorials
- Exam preparation resources
- Career guidance and tips

Your Role:
- Help students find study materials and resources
- Guide them to specific sections of the website
- Answer educational questions
- Be friendly, encouraging, and concise (2-4 sentences)
- Focus on helping students succeed

Available Courses: B.Tech/BE (CSE, ECE, ME, CE, EE), MBA/BBA, and more.`;

        // Direct API call using Gemini 2.5 Flash (fastest and latest)
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [
                                {
                                    text: `${systemInstruction}\n\n${fullMessage}`
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('API Error:', data);
            return NextResponse.json(
                { error: `API Error: ${data.error?.message || 'Unknown error'}` },
                { status: response.status }
            );
        }

        // Extract the response text
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, no response generated.';

        return NextResponse.json({ response: text, success: true });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Failed to connect to AI service. Please try again.' },
            { status: 500 }
        );
    }
}