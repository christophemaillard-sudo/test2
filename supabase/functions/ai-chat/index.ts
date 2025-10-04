import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

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

interface Message {
  role: string;
  content: string;
}

interface RequestBody {
  messages: Message[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not set");
    }

    const { messages }: RequestBody = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error("Invalid messages format");
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Anthropic API error:", error);
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.content[0].text;

    let landingPageData = null;
    let message = aiResponse;

    if (aiResponse.includes("LANDING_PAGE_DATA:")) {
      const parts = aiResponse.split("LANDING_PAGE_DATA:");
      const jsonPart = parts[1].split("\n\n")[0].trim();
      
      try {
        const jsonMatch = jsonPart.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          landingPageData = JSON.parse(jsonMatch[0]);
          message = parts[1].substring(jsonPart.length).trim();
        }
      } catch (e) {
        console.error("Failed to parse landing page data:", e);
      }
    }

    return new Response(
      JSON.stringify({
        message,
        landingPageData,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
