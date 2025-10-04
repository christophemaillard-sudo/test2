import { useState } from 'react';
import { LandingPageData as DBLandingPageData, deleteLandingPage } from '../lib/supabase';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  MessageSquare, 
  Eye, 
  Download, 
  History,
  Plus,
  Trash2
} from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { CustomizationPanels } from './CustomizationPanels';
import { ExportModal } from './ExportModal';

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

interface SidebarProps {
  activeTab: 'chat' | 'preview';
  onTabChange: (tab: 'chat' | 'preview') => void;
  landingPageData: LandingPageData | null;
  onLandingPageUpdate: (data: LandingPageData) => void;
  savedPages: DBLandingPageData[];
  onPageSelect: (page: DBLandingPageData) => void;
  onNewPage: () => void;
  onPageDeleted: () => void;
}

export function Sidebar({
  activeTab,
  onTabChange,
  landingPageData,
  onLandingPageUpdate,
  savedPages,
  onPageSelect,
  onNewPage,
  onPageDeleted
}: SidebarProps) {
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteLandingPage(id);
      toast.success('Page supprimée');
      onPageDeleted();
    } catch (error) {
      console.error('Error deleting page:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `${diffMins} min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return 'Hier';
    return `${diffDays}j`;
  };

  return (
    <div className="w-64 border-r bg-muted/30 flex flex-col">
      {/* Navigation */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={activeTab === 'chat' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTabChange('chat')}
            className="justify-start"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat IA
          </Button>
          <Button
            variant={activeTab === 'preview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTabChange('preview')}
            className="justify-start"
          >
            <Eye className="w-4 h-4 mr-2" />
            Aperçu
          </Button>
        </div>
      </div>

      <Separator />

      {/* Tools */}
      <div className="p-4">
        <h3 className="text-sm mb-3">Outils de personnalisation</h3>
        <CustomizationPanels 
          data={landingPageData} 
          onUpdate={onLandingPageUpdate}
        />
      </div>

      <Separator />

      {/* Actions */}
      <div className="p-4">
        <h3 className="text-sm mb-3">Actions</h3>
        <div className="space-y-2">
          <ExportModal 
            data={landingPageData}
            trigger={
              <Button variant="outline" size="sm" className="w-full justify-start" disabled={!landingPageData}>
                <Download className="w-4 h-4 mr-2" />
                Exporter le code
              </Button>
            }
          />
        </div>
      </div>

      <Separator />

      {/* Recent Projects */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-4 pb-2 flex items-center justify-between">
          <h3 className="text-sm">Projets récents</h3>
          <Button
            size="icon"
            variant="ghost"
            className="w-6 h-6"
            onClick={onNewPage}
            title="Nouveau projet"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2 pb-4">
            {savedPages.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                Aucun projet enregistré
              </p>
            ) : (
              savedPages.map((page) => (
                <Card
                  key={page.id}
                  className="p-3 cursor-pointer hover:bg-accent"
                  onClick={() => onPageSelect(page)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm truncate">{page.company_name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {page.created_at ? formatDate(page.created_at) : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Badge variant="secondary" className="text-xs">
                        {page.theme}
                      </Badge>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-5 h-5 text-muted-foreground hover:text-destructive"
                        onClick={(e) => handleDelete(page.id!, e)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <History className="w-3 h-3" />
          <span>Auto-sauvegarde activée</span>
        </div>
      </div>
    </div>
  );
}