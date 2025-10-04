import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface LandingPageData {
  id?: string;
  company_name: string;
  tagline: string;
  description: string;
  hero_title: string;
  hero_subtitle: string;
  features: Array<{
    title: string;
    description: string;
  }>;
  cta: string;
  theme: 'fintech' | 'saas' | 'ecommerce' | 'default';
  created_at?: string;
  updated_at?: string;
}

export async function saveLandingPage(data: Omit<LandingPageData, 'id' | 'created_at' | 'updated_at'>) {
  const { data: result, error } = await supabase
    .from('landing_pages')
    .insert({
      company_name: data.company_name,
      tagline: data.tagline,
      description: data.description,
      hero_title: data.hero_title,
      hero_subtitle: data.hero_subtitle,
      features: data.features,
      cta: data.cta,
      theme: data.theme
    })
    .select()
    .single();

  if (error) throw error;
  return result as LandingPageData;
}

export async function updateLandingPage(id: string, data: Partial<Omit<LandingPageData, 'id' | 'created_at' | 'updated_at'>>) {
  const { data: result, error } = await supabase
    .from('landing_pages')
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return result as LandingPageData;
}

export async function getLandingPages() {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as LandingPageData[];
}

export async function getLandingPage(id: string) {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as LandingPageData | null;
}

export async function deleteLandingPage(id: string) {
  const { error } = await supabase
    .from('landing_pages')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
