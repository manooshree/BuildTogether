## Objective 
Educators (and students) around the world are concerned of the effect Artificial Intelligence (AI) is having on students. Students note that they feel they are "getting dumber". This signals a needed improvement in human-machine collaboration in which the machine should meet the human where they are. I offer a solution through a novel human-machine interaction paradigm in which humans and language models effectively **build together**. 
I develop a feature for the popular LLM use case of asking for refinements, edits, or fixes to textual user input (i.e. research paper writing, code).  
This feature has two key components: 
1. The LLM (Claude) makes the minimal necessary edits to the user's work. 
2. The chat interface displays the introduced edits very clearly in comparison with the user's original work.

Through this design, I aim to retain user agency and control over their work, while not actually interfering with their productivity. Additionally, the user can easily discern Claude's edits through clear highlighting and the ability to toggle between their input and Claude's edited output. This creates an easy learning opportunity as users can clearly understand the small edits that were needed to improve their input. 

A video demo can be found at https://www.youtube.com/watch?v=GzyrazMdqY&ab_channel=ManooshreePatel

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


This project builds off of the Claude-Langchain interface developed here: https://github.com/developersdigest/anthropic-claude-clone-v1
