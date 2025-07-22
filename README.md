## Objective 


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


This project builds off of the Claude-Langchain interface developed here: https://github.com/developersdigest/anthropic-claude-clone-v1
