import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Palette, 
  Type, 
  Image, 
  Layout,
  Check,
  Upload
} from 'lucide-react';

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

interface CustomizationPanelsProps {
  data: LandingPageData | null;
  onUpdate: (data: LandingPageData) => void;
}

export function CustomizationPanels({ data, onUpdate }: CustomizationPanelsProps) {

  const handleThemeChange = (newTheme: 'fintech' | 'saas' | 'ecommerce' | 'default') => {
    if (!data) return;
    onUpdate({ ...data, theme: newTheme });
  };

  const handleContentChange = (field: keyof LandingPageData, value: any) => {
    if (!data) return;
    onUpdate({ ...data, [field]: value });
  };

  const handleFeatureChange = (index: number, field: 'title' | 'description', value: string) => {
    if (!data) return;
    const newFeatures = [...data.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    onUpdate({ ...data, features: newFeatures });
  };

  const ThemePanel = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="justify-start" disabled={!data}>
          <Palette className="w-4 h-4 mr-2" />
          Thème
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Personnaliser le thème</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <Label className="text-sm">Thème de couleur</Label>
            <RadioGroup 
              value={data?.theme || 'default'} 
              onValueChange={(value) => handleThemeChange(value as any)}
              className="mt-3"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="fintech" id="fintech" />
                    <div>
                      <Label htmlFor="fintech">FinTech</Label>
                      <p className="text-xs text-muted-foreground">Bleu professionnel</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded bg-blue-600"></div>
                    <div className="w-4 h-4 rounded bg-blue-100"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="saas" id="saas" />
                    <div>
                      <Label htmlFor="saas">SaaS</Label>
                      <p className="text-xs text-muted-foreground">Violet moderne</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded bg-purple-600"></div>
                    <div className="w-4 h-4 rounded bg-purple-100"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="ecommerce" id="ecommerce" />
                    <div>
                      <Label htmlFor="ecommerce">E-commerce</Label>
                      <p className="text-xs text-muted-foreground">Vert croissance</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded bg-green-600"></div>
                    <div className="w-4 h-4 rounded bg-green-100"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="default" id="default" />
                    <div>
                      <Label htmlFor="default">Défaut</Label>
                      <p className="text-xs text-muted-foreground">Neutre et élégant</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded bg-gray-900"></div>
                    <div className="w-4 h-4 rounded bg-gray-100"></div>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const ContentPanel = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="justify-start" disabled={!data}>
          <Type className="w-4 h-4 mr-2" />
          Contenu
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le contenu</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Nom de l'entreprise</Label>
              <Input
                id="companyName"
                value={data?.companyName || ''}
                onChange={(e) => handleContentChange('companyName', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={data?.tagline || ''}
                onChange={(e) => handleContentChange('tagline', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="heroTitle">Titre principal</Label>
            <Input
              id="heroTitle"
              value={data?.heroTitle || ''}
              onChange={(e) => handleContentChange('heroTitle', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="heroSubtitle">Sous-titre</Label>
            <Textarea
              id="heroSubtitle"
              value={data?.heroSubtitle || ''}
              onChange={(e) => handleContentChange('heroSubtitle', e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={data?.description || ''}
              onChange={(e) => handleContentChange('description', e.target.value)}
              className="mt-1"
              rows={2}
            />
          </div>
          
          <div>
            <Label htmlFor="cta">Bouton principal</Label>
            <Input
              id="cta"
              value={data?.cta || ''}
              onChange={(e) => handleContentChange('cta', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <Separator />
          
          <div>
            <Label>Fonctionnalités</Label>
            <div className="space-y-4 mt-3">
              {(data?.features || []).map((feature, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-3">
                    <Input
                      placeholder="Titre de la fonctionnalité"
                      value={feature.title}
                      onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                    />
                    <Textarea
                      placeholder="Description de la fonctionnalité"
                      value={feature.description}
                      onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                      rows={2}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const ImagesPanel = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="justify-start" disabled={!data}>
          <Image className="w-4 h-4 mr-2" />
          Images
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gérer les images</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <Label>Image principale (Hero)</Label>
            <div className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Glissez une image ou cliquez pour sélectionner
              </p>
              <Button variant="outline" size="sm">
                Choisir un fichier
              </Button>
            </div>
          </div>
          
          <div>
            <Label>Icônes des fonctionnalités</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {(data?.features || []).map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Check className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {feature.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <Label>Galerie de stock</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {['business', 'technology', 'team', 'analytics', 'security', 'mobile', 'dashboard', 'growth'].map((keyword) => (
                <div key={keyword} className="aspect-square bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/80">
                  <span className="text-xs text-muted-foreground capitalize">{keyword}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const LayoutPanel = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="justify-start" disabled={!data}>
          <Layout className="w-4 h-4 mr-2" />
          Layout
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Personnaliser la mise en page</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <Label>Disposition des fonctionnalités</Label>
            <RadioGroup defaultValue="grid" className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="grid" id="grid" />
                <Label htmlFor="grid">Grille (3 colonnes)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="list" id="list" />
                <Label htmlFor="list">Liste verticale</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cards" id="cards" />
                <Label htmlFor="cards">Cartes alignées</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label>Espacement des sections</Label>
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Compact</span>
                <span className="text-sm">Spacieux</span>
              </div>
              <Slider defaultValue={[3]} max={5} min={1} step={1} />
            </div>
          </div>
          
          <div>
            <Label>Largeur du contenu</Label>
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Étroit</span>
                <span className="text-sm">Large</span>
              </div>
              <Slider defaultValue={[3]} max={5} min={1} step={1} />
            </div>
          </div>
          
          <div>
            <Label>Éléments à afficher</Label>
            <div className="space-y-2 mt-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="showHeader">En-tête de navigation</Label>
                <input type="checkbox" id="showHeader" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="showFooter">Pied de page</Label>
                <input type="checkbox" id="showFooter" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="showTestimonials">Témoignages</Label>
                <input type="checkbox" id="showTestimonials" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="showPricing">Section tarifs</Label>
                <input type="checkbox" id="showPricing" className="rounded" />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-3">
      {!data && (
        <p className="text-xs text-muted-foreground text-center py-2">
          Générez d'abord une landing page avec l'IA pour personnaliser
        </p>
      )}
      <div className="grid grid-cols-2 gap-2">
        <ThemePanel />
        <ContentPanel />
        <ImagesPanel />
        <LayoutPanel />
      </div>
    </div>
  );
}