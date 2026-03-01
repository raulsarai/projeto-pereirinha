-- Site settings table for dynamic content management
-- Stores key-value pairs for: faixa_etaria, horarios, endereco, logo_url
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chave TEXT NOT NULL UNIQUE,
  valor TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read settings (public landing page)
CREATE POLICY "site_settings_select_anon" ON public.site_settings
  FOR SELECT TO anon USING (true);

-- Allow authenticated users (admins) full access
CREATE POLICY "site_settings_select_authenticated" ON public.site_settings
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "site_settings_insert_authenticated" ON public.site_settings
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "site_settings_update_authenticated" ON public.site_settings
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "site_settings_delete_authenticated" ON public.site_settings
  FOR DELETE TO authenticated USING (true);

-- Insert default values
INSERT INTO public.site_settings (chave, valor) VALUES
  ('faixa_etaria', 'Jovens de 4 a 17 anos')
ON CONFLICT (chave) DO NOTHING;

INSERT INTO public.site_settings (chave, valor) VALUES
  ('horarios', 'Ter, Qua, Qui: 8h-10h e 14h-16h | Sab: 7h-13h')
ON CONFLICT (chave) DO NOTHING;

INSERT INTO public.site_settings (chave, valor) VALUES
  ('endereco', 'Rua Joao Jose da Silva, 590 - Vila Caraguata, SP')
ON CONFLICT (chave) DO NOTHING;

INSERT INTO public.site_settings (chave, valor) VALUES
  ('logo_url', '/images/logo.png')
ON CONFLICT (chave) DO NOTHING;
