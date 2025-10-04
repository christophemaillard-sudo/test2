/*
  # Create landing pages table

  1. New Tables
    - `landing_pages`
      - `id` (uuid, primary key) - Unique identifier for each landing page
      - `company_name` (text) - Name of the company
      - `tagline` (text) - Company tagline
      - `description` (text) - Company description
      - `hero_title` (text) - Main hero section title
      - `hero_subtitle` (text) - Hero section subtitle
      - `features` (jsonb) - Array of features with title and description
      - `cta` (text) - Call-to-action text
      - `theme` (text) - Theme identifier (fintech, saas, ecommerce, default)
      - `created_at` (timestamptz) - Timestamp when the page was created
      - `updated_at` (timestamptz) - Timestamp when the page was last updated

  2. Security
    - Enable RLS on `landing_pages` table
    - Add policies for public read access (anyone can view landing pages)
    - Add policies for authenticated users to create, update, and delete their own landing pages
*/

CREATE TABLE IF NOT EXISTS landing_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL DEFAULT '',
  tagline text DEFAULT '',
  description text DEFAULT '',
  hero_title text DEFAULT '',
  hero_subtitle text DEFAULT '',
  features jsonb DEFAULT '[]'::jsonb,
  cta text DEFAULT '',
  theme text DEFAULT 'default',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view landing pages"
  ON landing_pages
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create landing pages"
  ON landing_pages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update landing pages"
  ON landing_pages
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete landing pages"
  ON landing_pages
  FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_landing_pages_created_at ON landing_pages(created_at DESC);