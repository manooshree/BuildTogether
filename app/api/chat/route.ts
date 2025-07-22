import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import * as Diff from 'diff';


const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// 1. Create diff between original user input and generated LLM output with edits
function createDiff(original: string, edited: string) {
    const diff = Diff.diffWordsWithSpace(original, edited);
    
    return diff.map(part => ({
      type: part.added ? 'added' : part.removed ? 'removed' : 'unchanged',
      content: part.value,
      count: part.count
    }));
  }

  // 2. Extract just the input, without instructions, from original user input
async function extractInput(input: string) {
    const prompt = `The user has included an instruction and their input. Can you only return the input and not the instruction? Do not include any additional text. The user text is below:\n`
    const message = await anthropic.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt + input}],
      });
    
    const response = message.content[0].text.trim()
    return response;
  }

// 3. Edit the user's input and strip out the original and edited versions and LLM commentary re the changes
export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const userMessage = body.messages.at(-1)?.content ?? "Hello";
      const userInputText = await extractInput(userMessage)
      const instructions = `\n Accomplish the user's ask while maintaining their original input as much as possible. If possible, do not make major edits to the user's original work.
  Use proper markdown formatting, such as \n, in your response. Please provide your response in this exact format:
  <revised_text>
  [Your revised version of the text here]
  </revised_text>
  
  <commentary>
  [Any explanations, suggestions, or commentary about the changes]
  </commentary>`;
  
      const message = await anthropic.messages.create({
          model: "claude-3-5-haiku-20241022",
          max_tokens: 2048,
          messages: [{ role: "user", content: userMessage + instructions}],
      });
          
      const fullResponse = message.content[0].text;
      // console.log(fullResponse)
      
      // Extract revision + commentary components of LLM output 
      const revisedTextMatch = fullResponse.match(/<revised_text>([\s\S]*?)<\/revised_text>/);
      const commentaryMatch = fullResponse.match(/<commentary>([\s\S]*?)<\/commentary>/);
      
      const revisedText = revisedTextMatch ? revisedTextMatch[1].trim() : fullResponse;
      const commentary = commentaryMatch ? commentaryMatch[1].trim() : "";
      const editDiff = createDiff(userInputText, revisedText);
          
      const response = {
        original: userInputText,
        edited: revisedText,
        commentary: commentary,
        diff: editDiff
      };
      
      return NextResponse.json(response);
      
    } catch (error) {
      console.error('API Error:', error);
      return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
  }


