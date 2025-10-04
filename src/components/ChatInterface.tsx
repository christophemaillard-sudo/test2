import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Send, Bot, User } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

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

  const generateAIResponse = (userMessage: string): { response: string; landingPageData?: any } => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('fintech') || message.includes('finance') || message.includes('paiement')) {
      const landingPageData = {
        companyName: 'FinTechPro',
        tagline: 'Révolutionnez vos paiements',
        description: 'La solution de paiement nouvelle génération pour les entreprises modernes',
        heroTitle: 'Simplifiez vos transactions financières',
        heroSubtitle: 'FinTechPro offre une plateforme sécurisée et intuitive pour gérer tous vos paiements en ligne',
        features: [
          { title: 'Sécurité maximale', description: 'Chiffrement de niveau bancaire pour toutes vos transactions' },
          { title: 'API simple', description: 'Intégration en quelques lignes de code' },
          { title: 'Analytics avancés', description: 'Tableaux de bord détaillés pour suivre vos performances' }
        ],
        cta: 'Commencer gratuitement',
        theme: 'fintech'
      };
      return {
        response: "Excellent ! Une fintech qui révolutionne les paiements. J'ai généré une première version de votre landing page avec un focus sur la sécurité et la simplicité d'intégration. Voulez-vous que je modifie certains éléments ?",
        landingPageData
      };
    } else if (message.includes('saas') || message.includes('logiciel') || message.includes('productivité')) {
      const landingPageData = {
        companyName: 'ProductiFlow',
        tagline: 'Boostez votre productivité',
        description: 'L\'outil SaaS qui transforme votre façon de travailler',
        heroTitle: 'Optimisez votre workflow',
        heroSubtitle: 'ProductiFlow centralise tous vos outils de productivité dans une interface simple et puissante',
        features: [
          { title: 'Centralisation', description: 'Tous vos outils dans un seul endroit' },
          { title: 'Automatisation', description: 'Automatisez vos tâches répétitives' },
          { title: 'Collaboration', description: 'Travaillez en équipe en temps réel' }
        ],
        cta: 'Essayer gratuitement',
        theme: 'saas'
      };
      return {
        response: "Parfait ! Un SaaS de productivité, c'est un marché très porteur. J'ai créé une landing page qui met l'accent sur l'efficacité et la collaboration. Que pensez-vous du positionnement ?",
        landingPageData
      };
    } else if (message.includes('e-commerce') || message.includes('boutique') || message.includes('vente')) {
      const landingPageData = {
        companyName: 'ShopFlow',
        tagline: 'Votre boutique, partout',
        description: 'Créez et gérez votre e-commerce en quelques clics',
        heroTitle: 'Lancez votre boutique en ligne',
        heroSubtitle: 'ShopFlow vous donne tous les outils pour créer, gérer et développer votre e-commerce',
        features: [
          { title: 'Templates personnalisables', description: 'Designs professionnels adaptés à votre marque' },
          { title: 'Gestion des stocks', description: 'Suivez vos inventaires en temps réel' },
          { title: 'Paiements sécurisés', description: 'Acceptez tous les moyens de paiement' }
        ],
        cta: 'Créer ma boutique',
        theme: 'ecommerce'
      };
      return {
        response: "Super ! Une plateforme e-commerce, le timing est parfait. J'ai conçu une landing page qui met en avant la facilité de création et la gestion complète. Souhaitez-vous ajuster le message principal ?",
        landingPageData
      };
    }
    
    return {
      response: "Merci pour ces informations ! Pouvez-vous me donner plus de détails sur votre secteur d'activité, votre proposition de valeur unique et vos utilisateurs cibles ? Plus vous me donnez d'informations, plus je peux personnaliser votre landing page."
    };
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

    // Simulate AI thinking time
    setTimeout(() => {
      const { response, landingPageData } = generateAIResponse(userInput);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      if (landingPageData) {
        onLandingPageUpdate(landingPageData);
      }
    }, 1500);
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