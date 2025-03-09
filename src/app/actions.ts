'use server';

import { ChatOllama } from '@langchain/ollama';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import playwright from 'playwright';

export async function transcribe(videoUrl: string) {
  const getYouTubeDetails = tool(
    async (input) => {
      if (input?.videoId) {
        const browser = await playwright['chromium'].launch();
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(`https://www.youtube.com/watch?v=${input.videoId}`);

        const title = await page.locator('h1.ytd-watch-metadata').innerText();
        const description = await page
          .locator('div#description-inner')
          .innerText();

        await browser.close();

        return {
          title,
          description,
        };
      } else {
        return 'Not found';
      }
    },
    {
      name: 'getYouTubeDetails',
      description: 'Call to get the title and description of a YouTube video',
      schema: z.object({
        videoId: z.string().describe('The YouTube video id'),
      }),
    }
  );

  const agent = createReactAgent({
    llm: new ChatOllama({ model: 'llama3.2', temperature: 0, format: 'json' }),
    tools: [getYouTubeDetails],
  });

  const response = await agent.invoke({
    messages: [
      new SystemMessage(`
              You're a YouTube transcription agent.
          
              You should retrieve the video id for a given YouTube url and return the title and description of the video. 
              Use any tool at your disposal if needed.
  
              Return output in the following structure:
  
              {
                  "videoId": "ID of the video",
                  "title": "video title",
                  "description": "video description"
              }
          `),
      new HumanMessage(`Here is the YouTube URL: ${videoUrl}.`),
    ],
  });

  return response.messages[response.messages.length - 1].content;
}
