'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Generate a unique ID for messages
  const generateId = () => Math.random().toString(36).substring(2, 10);

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Format code blocks in messages
  const formatMessage = (content: string) => {
    return content.replace(
      /```sql\s+([\s\S]*?)\s+```/g, 
      '<pre class="bg-gray-100 p-2 rounded overflow-x-auto text-sm my-2"><code>$1</code></pre>'
    ).replace(/\n/g, '<br />');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Call the LangGraph-powered agent endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from agent');
      }
      
      const data = await response.json();
      
      // Add agent response
      setMessages(prev => [
        ...prev,
        {
          id: generateId(),
          role: 'assistant',
          content: data.response
        }
      ]);
      
    } catch (error) {
      console.error('Error processing query:', error);
      setMessages(prev => [
        ...prev,
        {
          id: generateId(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-80 sm:w-96 shadow-lg bg-white">
          <div className="bg-primary p-3 text-white flex justify-between items-center rounded-t-lg">
            <h3 className="font-medium flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              DB Assistant
            </h3>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-white hover:bg-primary/80"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <CardContent className="p-0">
            <div 
              ref={chatContainerRef}
              className="h-80 overflow-y-auto p-3 flex flex-col space-y-3"
            >
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-4">
                  <p>Ask me anything about your data!</p>
                  <p className="text-xs mt-1">Example: "Show me monthly sales trends"</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] px-3 py-2 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: formatMessage(message.content) 
                        }} 
                      />
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-500 px-3 py-2 rounded-lg flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Processing your request...
                  </div>
                </div>
              )}
            </div>
            
            <form 
              onSubmit={handleSubmit} 
              className="border-t p-3 flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your data..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Button 
          onClick={() => setIsOpen(true)} 
          size="lg" 
          className="rounded-full h-14 w-14 shadow-lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}