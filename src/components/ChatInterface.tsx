import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Send, Bot, User } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatInterfaceProps {
  onLandingPageUpdate: (data: any) => void;
}

export function ChatInterface({ onLandingPageUpdate }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Bonjour ! Je suis votre assistant IA pour créer une landing page parfaite pour votre startup. Parlez-moi de votre projet : quel problème résolvez-vous et pour qui ?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const callAIAPI = async (userMessage: string): Promise<{ message: string; landingPageData?: any }> => {
    try {
      const conversationHistory = messages
        .filter(m => m.sender === 'user' || m.sender === 'ai')
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        }));

      conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ messages: conversationHistory })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        message: data.message,
        landingPageData: data.landingPageData
      };
    } catch (error) {
      console.error('Error calling AI API:', error);
      toast.error('Erreur de connexion à l\'IA');
      return {
        message: "Désolé, je rencontre un problème technique. Pouvez-vous réessayer ?"
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userInput = input; // Store the input before clearing it
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userInput,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const { message, landingPageData } = await callAIAPI(userInput);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: message,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      if (landingPageData) {
        onLandingPageUpdate(landingPageData);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setIsTyping(false);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          Assistant IA Landing Page
        </h3>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
              {message.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                <p className="text-sm">{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {message.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Décrivez votre startup, votre marché, vos utilisateurs..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button type="submit" size="icon" disabled={isTyping || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
}