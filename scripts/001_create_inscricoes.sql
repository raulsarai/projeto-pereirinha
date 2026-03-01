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

ALTER TABLE inscricoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on inscricoes" ON inscricoes FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on inscricoes" ON inscricoes FOR SELECT USING (true);
