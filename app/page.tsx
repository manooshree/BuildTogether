"use client";


import { useState, useEffect, useRef } from 'react';
import {
  ArrowUp,
  User,
} from "@phosphor-icons/react";

// Render edits in diff component
interface DiffPart {
    type: 'added' | 'removed' | 'unchanged';
    content: string;
    count: number;
  }
  
  interface DiffResponse {
    original: string;
    edited: string;
    commentary?: string; // Add commentary field
    diff: DiffPart[];
    hasChanges: boolean;
    stats: {
      additions: number;
      deletions: number;
      totalChanges: number;
    };
  }
  
  interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    diffData?: DiffResponse; 
  }
  
  
  function DiffToggleMessage({ diffData }: { diffData: DiffResponse }) {
    const [showEdited, setShowEdited] = useState(true);
  
    const copyToClipboard = async () => {
      const textToCopy = showEdited 
        ? diffData.diff
            .filter(part => part.type !== 'removed')
            .map(part => part.content)
            .join('')
        : diffData.original;
      
      try {
        await navigator.clipboard.writeText(textToCopy);
       
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    };
    
    // original text
    const renderDiff = () => {
        if (!showEdited) {
          return (
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap font-mono text-sm">
              {diffData.original}
            </div>
          );
        }
      
        // edited text
        return (
          <div className="leading-relaxed whitespace-pre-wrap font-mono text-sm">
            {diffData.diff.map((part, index) => {
              switch (part.type) {
                case 'unchanged':
                  return (
                    <span key={index} className="text-gray-800">
                      {part.content}
                    </span>
                  );
                case 'added':
                  
                  const isOnlyWhitespace = /^\s*$/.test(part.content);
                  
                  return (
                    <span 
                      key={index} 
                      className={isOnlyWhitespace 
                        ? "text-gray-800" 
                        : "bg-[#d8d6ca] text-gray-800 px-0.5 rounded-sm"
                      }
                      title={isOnlyWhitespace ? undefined : "Added by Claude"}
                    >
                      {part.content}
                    </span>
                  );
                case 'removed':
                
                  return null;
                default:
                  return null;
              }
            })}
          </div>
        );
      };
  
    return (
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        {/* Header with toggle and copy button on right */}
        <div className="flex items-center justify-end space-x-3 mb-4">
          <button
            onClick={() => setShowEdited(!showEdited)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              showEdited ? 'bg-[#D9D9D9]' : 'bg-gray-300'
            }`}
            title={showEdited ? "Show original" : "Show Claude's edits"}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${
                showEdited ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
          
          <button
            onClick={copyToClipboard}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
            title="Copy text"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
              />
            </svg>
            {/* <span>Copy</span> */}
          </button>
        </div>
  
        {/* Content */}
        <div className="min-h-[60px] cursor-pointer font-mono text-sm" onClick={() => setShowEdited(!showEdited)}>
        {renderDiff()}
        </div>
      </div>
    );
  }


//  WelcomeBack component
function WelcomeBack() {
  return (
    <>
      <h1 className="text-center tracking-tighter mt-8 mb-8 sm:mb-12 text-5xl">
        How can I help you today? <span className="animate-pulse">🤖</span>
      </h1>
    </>
  );
}

// Main App component
export default function App() {
 
    const [showWelcomeBack, setShowWelcomeBack] = useState(true);
    const [isInputFocused, setInputFocused] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Handle input focus
    const handleInputFocus = () => {
        setInputFocused(true);
    };

    // Handle input blur
    const handleInputBlur = () => {
        setInputFocused(false);
    };
  
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        
        // Auto-resize functionality
        const textarea = e.target;
        textarea.style.height = 'auto';
        const newHeight = Math.min(textarea.scrollHeight, 200); // Max height of 200px
        textarea.style.height = `${newHeight}px`;
    };
    
      // Handle form submission
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
    
        const userMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: input.trim()
        };
    
        
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input.trim();
        setInput("");
        
        if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        }
        setIsLoading(true);
            try {
          // Claude API Call
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: [{ content: currentInput }]
            }),
          });
    
          if (!response.ok) {
            throw new Error('Failed to get response');
          }
    
          const diffData: DiffResponse = await response.json();
    
          // LLM message with diff 
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: diffData.edited,
            diffData: diffData
          };
    
          setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
          console.error('Error:', error);
          // Error message
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'Sorry, there was an error processing your request.'
          };
          setMessages(prev => [...prev, errorMessage]);
        } finally {
          setIsLoading(false);
        }
      };

  // Keydown event
  const handleKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "k") {
      setShowWelcomeBack((showWelcomeBack) => !showWelcomeBack);
    }
  };

  // Attach keydown event listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Hide welcome back message if messages are present
  useEffect(() => {
    if (messages.length > 0 && showWelcomeBack) {
      setShowWelcomeBack(false);
    }
  }, [messages]);


  return (
    <>
      
      {/* Main layout container */}
      <div className="flex flex-col h-screen">
        {/* Messages area - scrollable */}
        <div className="flex-1 overflow-y-auto pb-32">
          <div className="max-w-3xl mx-auto px-3">
            {showWelcomeBack && (
              <div className="pt-28">
                <WelcomeBack />
              </div>
            )}
            
            {messages.length > 0 && !showWelcomeBack && (
              <div className="pt-20">
                {messages.map((m, index) => (
                  // Conditional rendering based on user or assistant
                  <div key={m.id} className="mr-3">
                    {m.role === "user" ? (
                      <>
                        {/* User message display */}
                        <div className="flex justify-end">
                          <div className="flex items-end col-start-3 pb-1 mx-2 opacity-100 transform-none">
                            <div className="rounded-xl px-3 py-2 break-words text-stone-900 transition-all bg-white place-self-end">
                              <div className="contents">
                              <p className="whitespace-pre-wrap text-sm">{m.content}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-end col-start-3 pb-1 mx-2 opacity-100 transform-none">
                            {/* User avatar */}
                            <div className="font-lora font-bold rounded-full flex items-center justify-center h-8 w-8 text-[14px] bg-ant-primary text-white bg-[#3d3d3a]">
                              <User size={18} />
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Assistant message display */}
                        <div className="my-2">
                            <div className="max-w-[75ch]">
                                {m.diffData ? (
                                <>
                                    <DiffToggleMessage diffData={m.diffData} />
                                    {/* Render commentary below the diff component */}
                                   

                                    {m.diffData.commentary && (
                                        <div className="mt-4 text-gray-700 leading-relaxed max-w-none">
                
                                            <div className="whitespace-pre-wrap">
                                            {m.diffData.commentary.split('\n').map((line, index) => {
                                                if (line.match(/^\d+\.\s/)) {
                                                return (
                                                    <div key={index} className="flex mb-1">
                                                    <span className="font-medium mr-2 text-blue-600">{line.match(/^\d+\./)[0]}</span>
                                                    <span>{line.replace(/^\d+\.\s/, '')}</span>
                                                    </div>
                                                );
                                                }
                                                return <div key={index}>{line}</div>;
                                            })}
                                            </div>
                                        </div>
                                        )}
                                </>
                                ) : (
                                <div className="rounded-xl px-3 py-2 bg-white shadow-sm">
                                    <p className="whitespace-pre-wrap text-stone-900">{m.content}</p>
                                </div>
                                )}
                            </div>
                            </div>

                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Input area - fixed at bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-md py-2 px-2 m-3">
              <fieldset className="sm:sticky sm:z-10 grid sm:pr-3 sm:grid-flow-col sm:grid-cols-[minmax(0,_1fr)_auto] sm:gap-2 w-full rounded-3xl top-4 backdrop-blur-xl bg-white disabled:bg-white/50">
                <form onSubmit={handleSubmit}>
                  {/* Textarea for user input */}
                  <textarea
                    ref={textareaRef}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="p-1.5 resize-none focus:outline-none w-full min-h-[32px] max-h-[200px] overflow-y-auto"
                    value={input}
                    placeholder="Message..."
                    onChange={handleInputChange}
                    name="message"
                    autoComplete="off"
                    disabled={isLoading}
                    rows={1}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                        }
                    }}
                    />
                </form>
                
                {/* Start new chat button */}
                <div>
                  <button 
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full flex items-center bg-[#c96442] text-white py-2 px-2 rounded-full cursor-pointer shadow transition-all ease-in-out active:scale-[0.98] text-ellipsis whitespace-nowrap overflow-x-hidden text-sm disabled:opacity-50"
                  >
                    
                    <div className="grid place-items-center w-5 h-5">
                      <ArrowUp size={18} />
                    </div>
                  </button>
                </div>
              </fieldset>
              
              
            </div>
            
            <div
              className="flex justify-end text-xs text-stone-400 delay-100 duration-500 transition-opacity mx-4 pb-2"
              style={{ visibility: isInputFocused ? "visible" : "hidden" }}
            >
              {/*  Keyboard shortcuts info */}
              <strong>⏎</strong> to send, <strong>shift + ⏎</strong> to add a new
              line, <strong>⌘K</strong> to create a new chat
            </div>
          </div>
        </div>
      </div>
    </>
  );
 }