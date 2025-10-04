import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';
import { Copy, Download, ExternalLink, Check } from 'lucide-react';
import { Textarea } from './ui/textarea';

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

interface ExportModalProps {
  data: LandingPageData | null;
  trigger: React.ReactNode;
}

export function ExportModal({ data, trigger }: ExportModalProps) {
  const [copied, setCopied] = useState<string | null>(null);

  if (!data) return null;

  const generateHTML = () => {
    const getThemeColors = (theme: string) => {
      switch (theme) {
        case 'fintech':
          return {
            primary: '#2563eb',
            secondary: '#eff6ff',
            accent: '#bfdbfe'
          };
        case 'saas':
          return {
            primary: '#7c3aed',
            secondary: '#f3e8ff',
            accent: '#c4b5fd'
          };
        case 'ecommerce':
          return {
            primary: '#059669',
            secondary: '#ecfdf5',
            accent: '#a7f3d0'
          };
        default:
          return {
            primary: '#030213',
            secondary: '#f1f5f9',
            accent: '#e2e8f0'
          };
      }
    };

    const colors = getThemeColors(data.theme);

    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.companyName} - ${data.tagline}</title>
    <meta name="description" content="${data.description}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        header { border-bottom: 1px solid #e5e7eb; padding: 1rem 0; }
        .header-content { display: flex; justify-content: space-between; align-items: center; }
        .logo { display: flex; align-items: center; gap: 0.5rem; }
        .logo-icon { width: 32px; height: 32px; background: ${colors.primary}; border-radius: 4px; }
        nav { display: flex; gap: 2rem; align-items: center; }
        nav a { text-decoration: none; color: #6b7280; }
        nav a:hover { color: #111827; }
        .btn { padding: 0.5rem 1rem; border: none; border-radius: 6px; cursor: pointer; text-decoration: none; display: inline-block; }
        .btn-primary { background: ${colors.primary}; color: white; }
        .btn-outline { border: 1px solid #d1d5db; background: white; color: #374151; }
        .hero { text-align: center; padding: 5rem 0; }
        .badge { background: ${colors.secondary}; color: ${colors.primary}; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; }
        .hero h1 { font-size: 3rem; margin: 1.5rem 0; font-weight: 600; }
        .hero p { font-size: 1.25rem; color: #6b7280; margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto; }
        .cta-buttons { display: flex; gap: 1rem; justify-content: center; margin-bottom: 3rem; }
        .hero-image { width: 100%; height: 300px; background: #f3f4f6; border: 2px solid ${colors.accent}; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #6b7280; }
        .features { padding: 5rem 0; background: #f9fafb; }
        .features h2 { text-align: center; font-size: 2.5rem; margin-bottom: 1rem; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 3rem; }
        .feature-card { background: white; padding: 2rem; border-radius: 8px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .feature-icon { width: 48px; height: 48px; background: ${colors.primary}; border-radius: 8px; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; }
        .cta-section { padding: 5rem 0; text-align: center; }
        footer { border-top: 1px solid #e5e7eb; padding: 3rem 0; }
        .footer-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
        .footer-col h4 { margin-bottom: 1rem; }
        .footer-col ul { list-style: none; }
        .footer-col ul li { margin-bottom: 0.5rem; }
        .footer-col ul li a { color: #6b7280; text-decoration: none; }
        .footer-bottom { border-top: 1px solid #e5e7eb; margin-top: 2rem; padding-top: 2rem; text-align: center; color: #6b7280; }
        @media (max-width: 768px) {
            .hero h1 { font-size: 2rem; }
            .cta-buttons { flex-direction: column; align-items: center; }
            .footer-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <div class="logo-icon"></div>
                    <span>${data.companyName}</span>
                </div>
                <nav>
                    <a href="#features">Fonctionnalités</a>
                    <a href="#pricing">Tarifs</a>
                    <a href="#contact">Contact</a>
                    <a href="#" class="btn btn-outline">Se connecter</a>
                </nav>
            </div>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <div class="badge">${data.tagline}</div>
            <h1>${data.heroTitle}</h1>
            <p>${data.heroSubtitle}</p>
            <div class="cta-buttons">
                <a href="#" class="btn btn-primary">${data.cta}</a>
                <a href="#" class="btn btn-outline">Voir la démo</a>
            </div>
            <div class="hero-image">Capture d'écran du produit</div>
        </div>
    </section>

    <section class="features" id="features">
        <div class="container">
            <h2>Pourquoi choisir ${data.companyName} ?</h2>
            <p style="text-align: center; color: #6b7280; font-size: 1.25rem; max-width: 600px; margin: 0 auto;">${data.description}</p>
            <div class="features-grid">
                ${data.features.map(feature => `
                <div class="feature-card">
                    <div class="feature-icon">✓</div>
                    <h3>${feature.title}</h3>
                    <p style="color: #6b7280;">${feature.description}</p>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <section class="cta-section">
        <div class="container">
            <h2>Prêt à commencer ?</h2>
            <p style="color: #6b7280; font-size: 1.25rem; margin-bottom: 2rem;">Rejoignez des milliers d'entreprises qui nous font confiance</p>
            <a href="#" class="btn btn-primary">${data.cta}</a>
        </div>
    </section>

    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <div class="logo">
                        <div class="logo-icon" style="width: 24px; height: 24px;"></div>
                        <span>${data.companyName}</span>
                    </div>
                    <p style="color: #6b7280; margin-top: 1rem;">${data.description}</p>
                </div>
                <div class="footer-col">
                    <h4>Produit</h4>
                    <ul>
                        <li><a href="#">Fonctionnalités</a></li>
                        <li><a href="#">Tarifs</a></li>
                        <li><a href="#">API</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Entreprise</h4>
                    <ul>
                        <li><a href="#">À propos</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Carrières</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Support</h4>
                    <ul>
                        <li><a href="#">Centre d'aide</a></li>
                        <li><a href="#">Contact</a></li>
                        <li><a href="#">Status</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>© 2024 ${data.companyName}. Tous droits réservés.</p>
            </div>
        </div>
    </footer>
</body>
</html>`;
  };

  const generateReact = () => {
    return `import React from 'react';

const LandingPage = () => {
  const data = ${JSON.stringify(data, null, 2)};

  const getThemeColors = (theme) => {
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
          primary: 'bg-gray-900 hover:bg-gray-800',
          secondary: 'bg-gray-50 text-gray-700',
          accent: 'border-gray-200'
        };
    }
  };

  const colors = getThemeColors(data.theme);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={\`w-8 h-8 rounded \${colors.primary}\`}></div>
            <span className="text-lg font-medium">{data.companyName}</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">Fonctionnalités</a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">Tarifs</a>
            <a href="#contact" className="text-sm text-gray-600 hover:text-gray-900">Contact</a>
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              Se connecter
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <span className={\`inline-block px-3 py-1 rounded-full text-sm mb-6 \${colors.secondary}\`}>
            {data.tagline}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold max-w-4xl mx-auto mb-6">
            {data.heroTitle}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            {data.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className={\`px-6 py-3 rounded-md text-white font-medium \${colors.primary}\`}>
              {data.cta}
            </button>
            <button className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50">
              Voir la démo
            </button>
          </div>
          <div className={\`w-full h-64 rounded-lg border-2 \${colors.accent} bg-gray-50 flex items-center justify-center\`}>
            <span className="text-gray-500">Capture d'écran du produit</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50" id="features">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pourquoi choisir {data.companyName} ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {data.description}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {data.features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className={\`w-12 h-12 rounded-lg \${colors.primary} flex items-center justify-center mx-auto mb-4\`}>
                  <span className="text-white">✓</span>
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Rejoignez des milliers d'entreprises qui nous font confiance
          </p>
          <button className={\`px-6 py-3 rounded-md text-white font-medium \${colors.primary}\`}>
            {data.cta}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className={\`w-6 h-6 rounded \${colors.primary}\`}></div>
                <span className="font-medium">{data.companyName}</span>
              </div>
              <p className="text-sm text-gray-600">
                {data.description}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Produit</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-gray-900">Tarifs</a></li>
                <li><a href="#" className="hover:text-gray-900">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">À propos</a></li>
                <li><a href="#" className="hover:text-gray-900">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900">Carrières</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-gray-900">Contact</a></li>
                <li><a href="#" className="hover:text-gray-900">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 mt-8 text-center text-sm text-gray-600">
            © 2024 {data.companyName}. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;`;
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Exporter votre landing page</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="html" className="h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="html">HTML/CSS</TabsTrigger>
            <TabsTrigger value="react">React/Tailwind</TabsTrigger>
          </TabsList>
          
          <TabsContent value="html" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Code HTML complet</h3>
                <p className="text-sm text-muted-foreground">
                  Page web complète avec CSS inline, prête à déployer
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(generateHTML(), 'html')}
                >
                  {copied === 'html' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied === 'html' ? 'Copié' : 'Copier'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadFile(generateHTML(), `${data.companyName.toLowerCase()}-landing.html`)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </div>
            <Card className="p-4">
              <Textarea
                value={generateHTML()}
                readOnly
                className="min-h-[400px] text-xs font-mono"
              />
            </Card>
          </TabsContent>
          
          <TabsContent value="react" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Composant React</h3>
                <p className="text-sm text-muted-foreground">
                  Composant React avec Tailwind CSS, prêt à intégrer
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(generateReact(), 'react')}
                >
                  {copied === 'react' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied === 'react' ? 'Copié' : 'Copier'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadFile(generateReact(), `${data.companyName}LandingPage.jsx`)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </div>
            <Card className="p-4">
              <Textarea
                value={generateReact()}
                readOnly
                className="min-h-[400px] text-xs font-mono"
              />
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex items-center gap-4 pt-4 border-t">
          <Badge variant="secondary">
            <ExternalLink className="w-3 h-3 mr-1" />
            Prêt pour le déploiement
          </Badge>
          <span className="text-xs text-muted-foreground">
            Code optimisé et responsive généré automatiquement
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}