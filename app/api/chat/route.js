import { NextResponse } from 'next/server';
import { AzureOpenAI } from 'openai';
import { DefaultAzureCredential, getBearerTokenProvider } from '@azure/identity';

export async function POST(req) {
  try {
    // Extract the user's message from the request body
    const { userMessage } = await req.json();

    // Set up Azure OpenAI with Bearer Token Provider
    const endpoint = 'https://ai-supportbot.openai.azure.com/';
    const deployment = 'ai-customer-support'
    const apiVersion ='2024-05-01-preview';

    const tokenProvider = getBearerTokenProvider(
      new DefaultAzureCredential(),
      'https://cognitiveservices.azure.com/.default'
    );

    const client = new AzureOpenAI({
      azureEndpoint: endpoint,
      azureAdTokenProvider: tokenProvider,
      apiVersion: apiVersion,
    });

    // Create completion request
    const completion = await client.chat.completions.create({
      model: deployment,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
      max_tokens: 800,
      temperature: 0.7,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // Return the response message as a JSON response
    const responseMessage = completion.choices[0].message.content;
    return NextResponse.json({ message: responseMessage });
  } catch (err) {
    console.error('The API route encountered an error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
