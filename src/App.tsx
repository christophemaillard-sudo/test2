import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { LandingPagePreview } from './components/LandingPagePreview';

interface LandingPageData {
  companyName: string;
  tagline: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  features: Array<{
    title: string;
    description: string;
  }>;
  cta: string;
  theme: 'fintech' | 'saas' | 'ecommerce' | 'default';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'preview'>('chat');
  const [landingPageData, setLandingPageData] = useState<LandingPageData | null>(null);

  const handleLandingPageUpdate = (data: LandingPageData) => {
    setLandingPageData(data);
    setActiveTab('preview');
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          landingPageData={landingPageData}
          onLandingPageUpdate={setLandingPageData}
        />
        <main className="flex-1 flex">
          {activeTab === 'chat' ? (
            <ChatInterface onLandingPageUpdate={handleLandingPageUpdate} />
          ) : (
            <LandingPagePreview data={landingPageData} />
          )}
        </main>
      </div>
    </div>
  );
}