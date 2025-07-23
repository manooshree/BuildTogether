## Objective 

_**How can we foster agentic users? Not just agentic AI.**_

Too many articles have been published recently lamenting how "AI is making us dumb". Such an empowering technology should not disempower its users. This rhetoric should challenge for engineers and designers to design better interfaces that leave users feeling in control and agentic.

I set out to reimagine a novel human-machine interaction paradigm in which users' productivity could benefit from AI tools, without compromising users' agency. I additionally wanted to create affordances for learning opportunities. I want to demonstrate how humans and language models effectively **build together**. 

For this prototype, I limited my design to LLM chat interfaces and focused on the task of editing/refining/improving textual information (i.e. asking an LLM to debug your code or refine your written paragraph). 
My feature has two key components: 
1. The LLM (Claude) makes the minimal necessary edits to the user's work. 
2. The chat interface displays the introduced edits very clearly in comparison with the user's original work.

These components make it such that the LLM is actually building on the user, creating opportunities for the user to learn how their own work could be improved. And with edits being so clearly highlighted, users easily maintain control over what to accept from the LLM. 

A video demo can be found at [https://www.youtube.com/watch?v=GzyrazMdqY&ab_channel=ManooshreePatel](https://www.youtube.com/watch?v=GzyrazM_dqY&ab_channel=ManooshreePatel)

Design mockups can be found at https://www.figma.com/design/kl4QgBAdZfGY57OtUbahT4/Anthropic-TakeHome?node-id=0-1&t=qDHOTpvI4uJHYB2e-1

A detailed design document, explaining the learner-oriented motivations behind the design, is included in the repo in _BuildTogether.pdf_. 


**Instructions to launch the application are below.**


![EB805AA7-20A0-4D36-86C7-7526624072B0](https://github.com/user-attachments/assets/c555b57c-42a8-43ac-bf0e-744fb2c4e63c)


## Prerequisites
- Node.js 18+ installed
- pnpm package manager 
- Anthropic API key

## Setup Instructions

### 1. Clone the repository
`git clone https://github.com/manooshree/BuildTogether.git`
#### 2. Install dependencies 
`pnpm install`
### 3. Set up environment variables
Add Anthropic API Key to a `.env.local` file 

`ANTHROPIC_API_KEY=your_anthropic_api_key_here`
### 4. Run the server
`pnpm dev`
### 5. Open Application
Navigate to http://localhost:3000 in your browser.

## Usage 

1. Enter your query in the input area at the bottom. Ask for revisions on some text-based input (i.e., code snippet, a paragraph) (Note: The current backend only supports revision queries. It does not function as a general-purpose chatbot)
2. View the original input and the Claude-edited input by toggling the switch in the top right coner. 


#### Credits 
This project builds off of the Claude-Langchain interface developed by Developer's Digest: https://github.com/developersdigest/anthropic-claude-clone-v1
