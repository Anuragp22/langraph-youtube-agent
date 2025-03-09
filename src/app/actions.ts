'use server';

import { ChatOllama } from '@langchain/ollama';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
// import { tool } from '@langchain/core/tools';
// import { z } from 'zod';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
// import playwright from 'playwright';
import wxflows from '@wxflows/sdk/langchain';

export async function transcribe(videoUrl: string) {
  if (!process.env.WXFLOWS_ENDPOINT || !process.env.WXFLOWS_APIKEY) {
    console.log('Something went wrong');
    return null;
  }

  const toolClient = new wxflows({
    endpoint: process.env.WXFLOWS_ENDPOINT,
    apikey: process.env.WXFLOWS_APIKEY,
  });

  const wxflowsTools = await toolClient.lcTools;
  // const getYouTubeDetails = tool(
  //   async (input) => {
  //     if (input?.videoId) {
  //       const browser = await playwright.chromium.launch();
  //       const context = await browser.newContext();
  //       const page = await context.newPage();
  //       await page.goto(`https://www.youtube.com/watch?v=${input.videoId}`);

  //       const title = await page.locator('h1.ytd-watch-metadata').innerText();
  //       const description = await page
  //         .locator('div#description-inner')
  //         .innerText();

  //       await browser.close();

  //       return {
  //         title,
  //         description,
  //       };
  //     } else {
  //       return 'Not found';
  //     }
  //   },
  //   {
  //     name: 'getYouTubeDetails',
  //     description: 'Call to get the title and description of a YouTube video',
  //     schema: z.object({
  //       videoId: z.string().describe('The YouTube video id'),
  //     }),
  //   }
  // );

  const agent = createReactAgent({
    llm: new ChatOllama({ model: 'llama3.2', temperature: 0, format: 'json' }),
    tools: wxflowsTools,
  });

  const response = await agent.invoke({
    messages: [
      new SystemMessage(`
        You're a YouTube transcription agent.
    
        You should retrieve the video id for a given YouTube url and return the title and description of the video. 
        Also retrieve the transcript for the youtube video using the transcript tool.
        Use all tools at your disposal.

        you have the following tools:
        1. youtube_transcript:
        - Query: { transcript(videoUrl: $videoUrl, langCode: $langCode) { title captions { text start dur } } }
        - Variables: { "videoUrl": "https://www.youtube.com/watch?v=VIDEO_ID", "langCode": "en" }

        Generate the description by summarizing the transcript.

        Return output in the following structure:

        {
            "videoId": "ID of the video",
            "title": "video title",
            "description": "video description",
            "transcript": "transcript of the video"
        }

        Do not return the data without populating all fields with data.
      `),
      new HumanMessage(`Here is the YouTube URL: ${videoUrl}.`),
    ],
  });

  console.log('Agent response', response);

  return response.messages[response.messages.length - 1].content;
}
