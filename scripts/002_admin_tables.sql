-- Admin tables for Projeto Pereirinha admin panel

-- Categorias table for organizing registrations
CREATE TABLE IF NOT EXISTS public.categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  ativa BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users (admins) full access to categorias
CREATE POLICY "categorias_select_authenticated" ON public.categorias
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "categorias_insert_authenticated" ON public.categorias
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "categorias_update_authenticated" ON public.categorias
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "categorias_delete_authenticated" ON public.categorias
  FOR DELETE TO authenticated USING (true);

-- Allow anonymous users to read active categorias (for the landing page)
CREATE POLICY "categorias_select_anon" ON public.categorias
  FOR SELECT TO anon USING (ativa = true);

-- Comunicados table for announcements
CREATE TABLE IF NOT EXISTS public.comunicados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  publicado BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.comunicados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comunicados_select_authenticated" ON public.comunicados
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "comunicados_insert_authenticated" ON public.comunicados
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "comunicados_update_authenticated" ON public.comunicados
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "comunicados_delete_authenticated" ON public.comunicados
  FOR DELETE TO authenticated USING (true);

-- Allow anonymous users to read published comunicados
CREATE POLICY "comunicados_select_anon" ON public.comunicados
  FOR SELECT TO anon USING (publicado = true);

-- Add categoria_id column to inscricoes if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'inscricoes'
      AND column_name = 'categoria_id'
  ) THEN
    ALTER TABLE public.inscricoes ADD COLUMN categoria_id UUID REFERENCES public.categorias(id);
  END IF;
END $$;

-- Add status column to inscricoes if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'inscricoes'
      AND column_name = 'status'
  ) THEN
    ALTER TABLE public.inscricoes ADD COLUMN status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmada', 'cancelada'));
  END IF;
END $$;

-- Make sure inscricoes has proper RLS for authenticated users too
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'inscricoes' AND policyname = 'inscricoes_select_authenticated'
  ) THEN
    CREATE POLICY "inscricoes_select_authenticated" ON public.inscricoes
      FOR SELECT TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'inscricoes' AND policyname = 'inscricoes_update_authenticated'
  ) THEN
    CREATE POLICY "inscricoes_update_authenticated" ON public.inscricoes
      FOR UPDATE TO authenticated USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'inscricoes' AND policyname = 'inscricoes_delete_authenticated'
  ) THEN
    CREATE POLICY "inscricoes_delete_authenticated" ON public.inscricoes
      FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- Make sure configuracoes_inscricoes has proper RLS for authenticated users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'configuracoes_inscricoes' AND policyname = 'config_select_authenticated'
  ) THEN
    CREATE POLICY "config_select_authenticated" ON public.configuracoes_inscricoes
      FOR SELECT TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'configuracoes_inscricoes' AND policyname = 'config_update_authenticated'
  ) THEN
    CREATE POLICY "config_update_authenticated" ON public.configuracoes_inscricoes
      FOR UPDATE TO authenticated USING (true);
  END IF;
END $$;
