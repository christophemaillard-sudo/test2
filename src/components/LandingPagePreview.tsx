import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Check, Star, ArrowRight, Download, Eye } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
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

interface LandingPagePreviewProps {
  data: LandingPageData | null;
}

export function LandingPagePreview({ data }: LandingPagePreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!data) {
    return (
      <Card className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <Eye className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3>Aperçu de votre landing page</h3>
          <p className="text-muted-foreground">
            Discutez avec l'IA pour générer votre landing page personnalisée
          </p>
        </div>
      </Card>
    );
  }

  const getThemeColors = (theme: string) => {
    switch (theme) {
      case 'fintech':
        return {
          primary: 'bg-blue-600 hover:bg-blue-700',
          secondary: 'bg-blue-50 text-blue-700',
          accent: 'border-blue-200'
        };
      case 'saas':
        return {
          primary: 'bg-purple-600 hover:bg-purple-700',
          secondary: 'bg-purple-50 text-purple-700',
          accent: 'border-purple-200'
        };
      case 'ecommerce':
        return {
          primary: 'bg-green-600 hover:bg-green-700',
          secondary: 'bg-green-50 text-green-700',
          accent: 'border-green-200'
        };
      default:
        return {
          primary: 'bg-primary hover:bg-primary/90',
          secondary: 'bg-secondary text-secondary-foreground',
          accent: 'border-border'
        };
    }
  };

  const colors = getThemeColors(data.theme);

  const PreviewContent = () => (
    <div className="min-h-full bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded ${colors.primary}`}></div>
            <span className="text-lg">{data.companyName}</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Fonctionnalités</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Tarifs</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</a>
            <Button size="sm">Se connecter</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Badge className={`${colors.secondary} mb-6`}>
            {data.tagline}
          </Badge>
          <h1 className="text-4xl md:text-6xl max-w-4xl mx-auto mb-6">
            {data.heroTitle}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {data.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className={colors.primary}>
              {data.cta}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg">
              Voir la démo
            </Button>
          </div>
          <div className="mt-12">
            <div className={`w-full h-64 rounded-lg border-2 ${colors.accent} bg-muted/50 flex items-center justify-center`}>
              <span className="text-muted-foreground">Capture d'écran du produit</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4">
              Pourquoi choisir {data.companyName} ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {data.description}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {data.features.map((feature, index) => (
              <Card key={index} className="p-6 text-center">
                <div className={`w-12 h-12 rounded-lg ${colors.primary} flex items-center justify-center mx-auto mb-4`}>
                  <Check className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Rejoignez des milliers d'entreprises qui nous font confiance
          </p>
          <Button size="lg" className={colors.primary}>
            {data.cta}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <div className="flex items-center justify-center gap-1 mt-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              4.9/5 basé sur 1000+ avis
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-6 h-6 rounded ${colors.primary}`}></div>
                <span>{data.companyName}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {data.description}
              </p>
            </div>
            <div>
              <h4 className="mb-4">Produit</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-foreground">Tarifs</a></li>
                <li><a href="#" className="hover:text-foreground">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">À propos</a></li>
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                <li><a href="#" className="hover:text-foreground">Carrières</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
                <li><a href="#" className="hover:text-foreground">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 mt-8 text-center text-sm text-muted-foreground">
            © 2024 {data.companyName}. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-background z-50 overflow-auto">
        <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between">
          <h3>Aperçu plein écran - {data.companyName}</h3>
          <div className="flex gap-2">
            <ExportModal 
              data={data}
              trigger={
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
              }
            />
            <Button variant="outline" size="sm" onClick={() => setIsFullscreen(false)}>
              Fermer
            </Button>
          </div>
        </div>
        <PreviewContent />
      </div>
    );
  }

  return (
    <Card className="flex-1 flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h3>Aperçu - {data.companyName}</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsFullscreen(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Plein écran
          </Button>
          <ExportModal 
            data={data}
            trigger={
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            }
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="scale-50 origin-top-left w-[200%] h-[200%]">
          <PreviewContent />
        </div>
      </div>
    </Card>
  );
}