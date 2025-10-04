import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { LandingPagePreview } from './components/LandingPagePreview';
import { saveLandingPage, updateLandingPage, getLandingPages, LandingPageData } from './lib/supabase';
import { toast } from 'sonner';

interface AppLandingPageData {
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
  const [landingPageData, setLandingPageData] = useState<AppLandingPageData | null>(null);
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [savedPages, setSavedPages] = useState<LandingPageData[]>([]);

  useEffect(() => {
    loadSavedPages();
  }, []);

  const loadSavedPages = async () => {
    try {
      const pages = await getLandingPages();
      setSavedPages(pages);
    } catch (error) {
      console.error('Error loading pages:', error);
    }
  };

  const handleLandingPageUpdate = async (data: AppLandingPageData) => {
    setLandingPageData(data);
    setActiveTab('preview');

    try {
      const dbData = {
        company_name: data.companyName,
        tagline: data.tagline,
        description: data.description,
        hero_title: data.heroTitle,
        hero_subtitle: data.heroSubtitle,
        features: data.features,
        cta: data.cta,
        theme: data.theme
      };

      if (currentPageId) {
        await updateLandingPage(currentPageId, dbData);
        toast.success('Landing page mise à jour');
      } else {
        const savedPage = await saveLandingPage(dbData);
        setCurrentPageId(savedPage.id!);
        toast.success('Landing page sauvegardée');
      }

      await loadSavedPages();
    } catch (error) {
      console.error('Error saving landing page:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handlePageSelect = (page: LandingPageData) => {
    setCurrentPageId(page.id!);
    setLandingPageData({
      companyName: page.company_name,
      tagline: page.tagline,
      description: page.description,
      heroTitle: page.hero_title,
      heroSubtitle: page.hero_subtitle,
      features: page.features,
      cta: page.cta,
      theme: page.theme
    });
    setActiveTab('preview');
  };

  const handleNewPage = () => {
    setCurrentPageId(null);
    setLandingPageData(null);
    setActiveTab('chat');
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
          savedPages={savedPages}
          onPageSelect={handlePageSelect}
          onNewPage={handleNewPage}
          onPageDeleted={loadSavedPages}
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