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
      const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

      if (!OPENAI_API_KEY || OPENAI_API_KEY === 'YOUR_OPENAI_KEY_HERE') {
        toast.error('Veuillez configurer votre clé OpenAI dans le fichier .env');
        return {
          message: "Erreur : Clé OpenAI non configurée. Ajoutez votre clé dans le fichier .env (VITE_OPENAI_API_KEY)."
        };
      }

      const SYSTEM_PROMPT = `Tu es un expert en création de landing pages pour startups SaaS. Ton rôle est d'aider les utilisateurs à créer des landing pages performantes en leur posant des questions pertinentes sur leur entreprise, leur marché, et leur proposition de valeur.

Quand tu as suffisamment d'informations, tu dois générer une landing page complète au format JSON avec la structure suivante:

{
  "companyName": "Nom de l'entreprise",
  "tagline": "Slogan accrocheur",
  "description": "Description courte",
  "heroTitle": "Titre principal impactant",
  "heroSubtitle": "Sous-titre explicatif",
  "features": [
    { "title": "Fonctionnalité 1", "description": "Description" },
    { "title": "Fonctionnalité 2", "description": "Description" },
    { "title": "Fonctionnalité 3", "description": "Description" }
  ],
  "cta": "Texte du bouton d'action",
  "theme": "fintech" | "saas" | "ecommerce" | "default"
}

Pose des questions sur:
- Le problème que résout leur produit
- Leur marché cible
- Leurs utilisateurs idéaux
- Leur proposition de valeur unique
- Leurs principales fonctionnalités
- Le secteur d'activité (fintech, saas, ecommerce, etc.)

Sois conversationnel, amical et professionnel. Aide-les à affiner leur message pour qu'il soit clair et convaincant.

Quand tu génères une landing page, commence ta réponse par "LANDING_PAGE_DATA:" suivi du JSON, puis ajoute un message d'explication.`;

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

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...conversationHistory
          ],
          max_tokens: 2048,
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API error:', errorData);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      let landingPageData = null;
      let message = aiResponse;

      if (aiResponse.includes('LANDING_PAGE_DATA:')) {
        const parts = aiResponse.split('LANDING_PAGE_DATA:');
        const jsonPart = parts[1].split('\n\n')[0].trim();

        try {
          const jsonMatch = jsonPart.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            landingPageData = JSON.parse(jsonMatch[0]);
            message = parts[1].substring(jsonPart.length).trim();
          }
        } catch (e) {
          console.error('Failed to parse landing page data:', e);
        }
      }

      return {
        message,
        landingPageData
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