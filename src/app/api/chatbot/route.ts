import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ErrorWithMessage {
  message: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}
  
function getErrorMessage(error: unknown): string {
  if (isErrorWithMessage(error)) return error.message;
  return 'Unknown error occurred';
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    const apiKey = process.env.GEM_KEY || '';
    
    if (!apiKey) {
      return NextResponse.json({ 
        response: { 
          content: "Gemini API key is not configured.",
          role: "assistant"
        } 
      }, { status: 200 });
    }
    
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const systemPrompt = `You are PENTO Assistant for "The Smart Households Food Management System" mobile app.
Answer briefly, clearly, and helpfully in the user's language.
Only answer questions related to: food inventory, barcode scanning, food recognition, expiry tracking, AI recipe suggestions, grocery planning, food sharing/giveaway, notifications, and app usage/onboarding. If a question is unrelated, politely say: "Sorry, this is outside the app's scope. Please ask about food management features, recipes, expiry tracking, or app usage."
When helpful, suggest in-app flows (e.g., open Scanner, add item, set expiry, view alerts).`;

      const fullMessage = `${systemPrompt}\n\nNgười dùng hỏi: ${message}`;
      
      const result = await model.generateContent(fullMessage);
      const response = await result.response;
      const text = response.text();
      
      return NextResponse.json({ 
        response: { 
          content: text,
          role: "assistant"
        } 
      });
    } catch (error: unknown) {
      console.error('Gemini API error:', error);
      
      return NextResponse.json({ 
        response: { 
          content: `Error with Gemini AI service: ${getErrorMessage(error)}`,
          role: "assistant"
        } 
      }, { status: 200 });
    }
    
  } catch (error: unknown) {
    return NextResponse.json(
      { error: `Failed to process request: ${getErrorMessage(error)}` },
      { status: 500 }
    );
  }
}