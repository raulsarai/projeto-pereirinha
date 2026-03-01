-- Create inscricoes table
CREATE TABLE IF NOT EXISTS inscricoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  email TEXT NOT NULL,
  data_nascimento DATE NOT NULL,
  categoria TEXT NOT NULL,
  responsavel TEXT NOT NULL,
  telefone TEXT NOT NULL,
  bairro TEXT NOT NULL,
  data_inscricao TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'pendente'
);

-- Create configuracoes_inscricoes table
CREATE TABLE IF NOT EXISTS configuracoes_inscricoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vagas_total INTEGER DEFAULT 30,
  data_limite_inscricao TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT NOW()
);

-- Allow public read access to configuracoes_inscricoes
ALTER TABLE configuracoes_inscricoes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read on configuracoes" ON configuracoes_inscricoes;
CREATE POLICY "Allow public read on configuracoes" ON configuracoes_inscricoes FOR SELECT USING (true);

-- Allow public insert and read on inscricoes (anyone can register)
ALTER TABLE inscricoes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert on inscricoes" ON inscricoes;
CREATE POLICY "Allow public insert on inscricoes" ON inscricoes FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public read count on inscricoes" ON inscricoes;
CREATE POLICY "Allow public read count on inscricoes" ON inscricoes FOR SELECT USING (true);

-- Insert default config: 30 slots, deadline 30 days from now
INSERT INTO configuracoes_inscricoes (vagas_total, data_limite_inscricao)
SELECT 30, NOW() + INTERVAL '30 days'
WHERE NOT EXISTS (SELECT 1 FROM configuracoes_inscricoes);
