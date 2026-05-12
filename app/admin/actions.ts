'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Resend } from 'resend';



// --- AUXILIARES ---
async function uploadFile(file: File, bucket: string, folder: string) {
  const supabase = await createClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
  const { data, error } = await supabase.storage.from(bucket).upload(fileName, file)
  if (error) throw new Error(`Erro no upload: ${error.message}`)
  return data.path
}

// --- CONFIGURAÇÕES DE VAGAS ---
export async function getConfig() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('configuracoes_inscricoes').select('*').limit(1).single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateConfig(formData: FormData) {
  const supabase = await createClient()
  const vagasRaw = formData.get('vagas_total') as string
  const dataRaw = formData.get('data_limite_inscricao') as string
  const { data: existing } = await supabase.from('configuracoes_inscricoes').select('*').limit(1).single()
  if (!existing) throw new Error('Configuração base não encontrada no banco.')
  const updates: Record<string, unknown> = {}
  if (vagasRaw && vagasRaw !== '') updates.vagas_total = Number(vagasRaw)
  if (dataRaw && dataRaw !== '') updates.data_limite_inscricao = dataRaw
  const { error } = await supabase.from('configuracoes_inscricoes').update(updates).eq('id', existing.id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin'); revalidatePath('/'); return { success: true }
}

// --- INSCRIÇÕES E DOCUMENTOS ---
export async function getInscricoes() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('inscricoes').select('*').order('data_inscricao', { ascending: false })
  if (error) throw new Error(error.message); return data ?? []
}

export async function getInscricoesCount() {
  const supabase = await createClient()
  const { count, error } = await supabase.from('inscricoes').select('*', { count: 'exact', head: true })
  if (error) throw new Error(error.message); return count ?? 0
}

export async function getDocumentUrl(path: string | null, bucket: 'documentos-privados' | 'imagens-publicas') {
  if (!path) return null
  const supabase = await createClient()
  if (bucket === 'imagens-publicas') return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 3600) 
  return error ? null : data.signedUrl
}

export async function updateInscricaoStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('inscricoes').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/inscricoes'); return { success: true }
}

export async function updateStatusAndGetMessage(id: string, status: 'Aprovado' | 'Recusado', telefone: string, nome: string) {
  await updateInscricaoStatus(id, status)
  const phoneClean = telefone.replace(/\D/g, '')
  const message = status === 'Aprovado'
    ? `Olá! A inscrição de *${nome}* no Projeto Pereirinha foi *APROVADA*! ✅`
    : `Olá. Infelizmente a inscrição de *${nome}* foi *RECUSADA* após análise. ❌`
  return `https://wa.me/55${phoneClean}?text=${encodeURIComponent(message)}`
}

export async function deleteInscricao(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('inscricoes').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/inscricoes'); revalidatePath('/admin'); return { success: true }
}

// --- CATEGORIAS ---
export async function getCategorias() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('categorias').select('*').order('created_at', { ascending: true })
  if (error) throw new Error(error.message); return data ?? []
}

export async function createCategoria(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('categorias').insert({ nome: formData.get('nome') as string, descricao: formData.get('descricao') as string, ativa: true })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/categorias'); return { success: true }
}

export async function updateCategoria(id: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('categorias').update({ nome: formData.get('nome') as string, descricao: formData.get('descricao') as string, ativa: formData.get('ativa') === 'true' }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/categorias'); return { success: true }
}

export async function deleteCategoria(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('categorias').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/categorias'); return { success: true }
}

// --- COMUNICADOS ---
export async function getComunicados() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('comunicados').select('*').order('created_at', { ascending: false })
  if (error) throw new Error(error.message); return data ?? []
}

export async function createComunicado(formData: FormData) {
  const supabase = await createClient()
  const titulo = formData.get('titulo') as string
  const conteudo = formData.get('conteudo') as string
  const imagemFile = formData.get('imagem') as File | null
  let imagem_url = null
  if (imagemFile && imagemFile.size > 0) imagem_url = await uploadFile(imagemFile, 'imagens-publicas', 'comunicados')
  const { error } = await supabase.from('comunicados').insert({ titulo, conteudo, imagem_url, publicado: true })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/comunicados'); revalidatePath('/'); return { success: true }
}

export async function updateComunicado(id: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('comunicados').update({ titulo: formData.get('titulo') as string, conteudo: formData.get('conteudo') as string, publicado: formData.get('publicado') === 'true', updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/comunicados'); revalidatePath('/'); return { success: true }
}

export async function deleteComunicado(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('comunicados').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/comunicados'); revalidatePath('/'); return { success: true }
}

// --- SITE SETTINGS ---
export async function getSiteSettings() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('site_settings').select('*')
  if (error) throw new Error(error.message)
  const settings: Record<string, string> = {}
  for (const row of data ?? []) { settings[row.chave] = row.valor }
  return settings
}

export async function updateSiteSetting(chave: string, valor: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('site_settings').update({ valor, updated_at: new Date().toISOString() }).eq('chave', chave)
  if (error) throw new Error(error.message)
  revalidatePath('/admin', 'layout'); revalidatePath('/'); return { success: true }
}

export async function updateSettingImage(formData: FormData, chave: string) {
  const file = formData.get('image') as File | null
  if (!file || file.size === 0) return { success: false }
  const path = await uploadFile(file, 'imagens-publicas', 'configuracoes')
  const supabase = await createClient()
  const { data: { publicUrl } } = supabase.storage.from('imagens-publicas').getPublicUrl(path)
  await updateSiteSetting(chave, publicUrl)
  return { success: true, url: publicUrl }
}

export async function updateMultipleSiteSettings(settings: Record<string, string>) {
  const supabase = createClient();
  const updates = Object.entries(settings).map(([chave, valor]) => ({
    chave,
    valor,
  }));

  const { error } = await (await supabase).from("site_settings").upsert(updates, { onConflict: "chave" });

  if (error) throw error;
  return { success: true };
}

// --- ESTATÍSTICAS E INSTAGRAM ---
export async function getEstatisticas() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('estatisticas_site').select('*').single()
  if (error) return { alunos_atendidos: 0, campeonatos_ganhos: 0 }
  return data
}

export async function updateEstatisticas(alunos: number, campeonatos: number) {
  const supabase = await createClient()
  const { data: existing } = await supabase.from('estatisticas_site').select('id').single()
  const updates = { alunos_atendidos: alunos, campeonatos_ganhos: campeonatos, updated_at: new Date().toISOString() }
  if (existing) await supabase.from('estatisticas_site').update(updates).eq('id', existing.id)
  else await supabase.from('estatisticas_site').insert(updates)
  revalidatePath('/'); return { success: true }
}

export async function getInstagramPosts() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('posts_instagram').select('*').order('created_at', { ascending: false })
  if (error) throw new Error(error.message); return data ?? []
}

export async function createInstagramPost(formData: FormData) {
  const link_post = formData.get('link_post') as string
  const imagemFile = formData.get('imagem') as File
  const path = await uploadFile(imagemFile, 'imagens-publicas', 'instagram')
  const supabase = await createClient()
  await supabase.from('posts_instagram').insert({ link_post, imagem_url: path })
  revalidatePath('/'); return { success: true }
}

export async function deleteInstagramPost(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('posts_instagram').delete().eq('id', id)
  if (error) throw new Error(error.message); revalidatePath('/'); return { success: true }
}

// --- DASHBOARD STATS ---
export async function getDashboardStats() {
  const supabase = await createClient()
  const [total, config, cats, coms, recent] = await Promise.all([
    supabase.from('inscricoes').select('*', { count: 'exact', head: true }),
    supabase.from('configuracoes_inscricoes').select('*').limit(1).single(),
    supabase.from('categorias').select('*', { count: 'exact', head: true }),
    supabase.from('comunicados').select('*', { count: 'exact', head: true }),
    supabase.from('inscricoes').select('*').order('data_inscricao', { ascending: false }).limit(5),
  ])
  return {
    inscricoesTotal: total.count ?? 0,
    vagasTotal: config.data?.vagas_total ?? 0,
    vagasDisponiveis: Math.max(0, (config.data?.vagas_total ?? 0) - (total.count ?? 0)),
    dataLimite: config.data?.data_limite_inscricao ?? null,
    totalCategorias: cats.count ?? 0,
    totalComunicados: coms.count ?? 0,
    recentInscricoes: recent.data ?? []
  }
}


const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

export async function saveLead(data: { nome: string; whatsapp: string; origem: string }) {
  const supabase = await createClient();
  
  const { error } = await supabase.from('leads').insert([{ ...data, lido: false }]);
  if (error) throw new Error(error.message);

  const settings = await getSiteSettings();
  
  if (resend && settings.legal_email) {
    try {
      await resend.emails.send({
        from: 'Notificações <onboarding@resend.dev>',
        to: settings.legal_email,
        subject: `Novo Lead: ${data.nome}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Novo contato capturado!</h2>
            <p><strong>Nome:</strong> ${data.nome}</p>
            <p><strong>WhatsApp:</strong> ${data.whatsapp}</p>
            <p><strong>Origem:</strong> ${data.origem}</p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/leads" style="background: #2D1BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ver no Painel</a>
          </div>
        `
      });
    } catch (e) {
      console.error(e);
    }
  }

  revalidatePath('/admin/leads');
  return { success: true };
}

export async function getUnreadLeadsCount() {
  const supabase = await createClient();
  const { count } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('lido', false);
  return count ?? 0;
}

export async function markLeadsAsRead() {
  const supabase = await createClient();
  await supabase.from('leads').update({ lido: true }).eq('lido', false);
  revalidatePath('/admin/leads');
}

export async function getPricingSettings() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .in('chave', ['section_pricing_active', 'section_pricing_data'])
  
  if (error) throw new Error(error.message)
  
  const settings: Record<string, string> = {}
  data?.forEach(row => { settings[row.chave] = row.valor })
  
  return {
    active: settings.section_pricing_active === 'true',
    // Retorna string crua para ser tratada no front ou parseada aqui se preferir
    data: settings.section_pricing_data || '[]'
  }
}

// Salva especificamente os dados de preço
export async function savePricingSettings(isActive: boolean, plansJson: string) {
  // Reutiliza a função genérica para salvar no banco
  return await updateMultipleSiteSettings({
    section_pricing_active: String(isActive),
    section_pricing_data: plansJson
  })
}

export async function syncSocialStats(statsJson: string) {
  // Aqui entraria a lógica de fetch para as APIs sociais
  // Por ora, ela mantém os valores salvos pelo usuário
  return { success: true, data: statsJson };
}

export async function syncSocialStatsAction(statsJson: string, apiKey?: string) {
  const items = JSON.parse(statsJson || "[]");

  // Se não houver chave, apenas retorna os itens como estão (manuais)
  if (!apiKey) return statsJson;

  const updatedItems = await Promise.all(items.map(async (item: any) => {
    if (!item.type || item.type === "manual" || !item.value) return item;

    try {
      const username = item.value.replace('@', '').trim();
      let newValue = item.value;

      // Exemplo de integração com RapidAPI (Instagram Data)
      if (item.type === "instagram") {
        const res = await fetch(`https://instagram-data12.p.rapidapi.com/user/details?username=${username}`, {
          headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'instagram-data12.p.rapidapi.com'
          }
        });
        const data = await res.json();
        newValue = data.edge_followed_by?.count || newValue;
      }

      // Adicione outros blocos (youtube, twitter) seguindo o mesmo padrão da RapidAPI
      
      return { ...item, value: newValue.toString() };
    } catch (e) {
      return item;
    }
  }));

  return JSON.stringify(updatedItems);
}

// Altere a função updateSettingImage para suportar vídeos também
export async function updateSettingMedia(formData: FormData, chave: string) {
  const file = formData.get('media') as File | null
  if (!file || file.size === 0) return { success: false }

  // Validação de 30 segundos (aproximada por tamanho se preferir, ou apenas tipo)
  const isVideo = file.type.startsWith('video/')
  const path = await uploadFile(file, 'imagens-publicas', isVideo ? 'videos' : 'configuracoes')
  
  const supabase = await createClient()
  const { data: { publicUrl } } = supabase.storage.from('imagens-publicas').getPublicUrl(path)
  
  await updateSiteSetting(chave, publicUrl)
  return { success: true, url: publicUrl }
}

// TYPES AUXILIARES
export type TimeRow = {
  id: string
  nome: string
  escudo_url: string | null
  cor_primaria: string | null
  ativo: boolean | null
}

export type ClassificacaoRow = {
  id?: string
  time_id: string
  edicao: string
  posicao: number
  pontos: number
  jogos: number
  vitorias: number
  empates: number
  derrotas: number
  gols_pro: number
  gols_contra: number
}

// --- TIMES ---
export async function getTimes(): Promise<TimeRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('times')
    .select('*')
    .order('nome', { ascending: true })

  if (error) throw new Error(error.message)
  return (data as TimeRow[]) ?? []
}

export async function createTime(formData: FormData) {
  const supabase = await createClient()

  const nome = formData.get('nome') as string
  const cor = (formData.get('cor_primaria') as string) || null
  const escudo = formData.get('escudo') as File | null

  let escudoPath: string | null = null
  if (escudo && escudo.size > 0) {
    const ext = escudo.name.split('.').pop()
    const fileName = `times/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
    const { data, error: uploadError } = await supabase
      .storage
      .from('imagens-publicas')
      .upload(fileName, escudo)

    if (uploadError) throw new Error(uploadError.message)
    escudoPath = data?.path ?? null
  }

  const { error } = await supabase.from('times').insert({
    nome,
    cor_primaria: cor,
    escudo_url: escudoPath,
    ativo: true,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/admin/classificacao')
  revalidatePath('/')
  return { success: true }
}

export async function updateTime(id: string, formData: FormData) {
  const supabase = await createClient()

  const nome = formData.get('nome') as string
  const cor = (formData.get('cor_primaria') as string) || null
  const ativo = formData.get('ativo') === 'on'
  const escudo = formData.get('escudo') as File | null

  const updates: Record<string, unknown> = {
    nome,
    cor_primaria: cor,
    ativo,
  }

  if (escudo && escudo.size > 0) {
    const ext = escudo.name.split('.').pop()
    const fileName = `times/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
    const { data, error: uploadError } = await supabase
      .storage
      .from('imagens-publicas')
      .upload(fileName, escudo)
    if (uploadError) throw new Error(uploadError.message)
    updates.escudo_url = data?.path ?? null
  }

  const { error } = await supabase
    .from('times')
    .update(updates)
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/classificacao')
  revalidatePath('/')
  return { success: true }
}

export async function toggleTimeAtivo(id: string, ativo: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('times')
    .update({ ativo })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/classificacao')
  revalidatePath('/')
}

export async function deleteTime(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('times').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/classificacao')
  revalidatePath('/')
}

// --- CLASSIFICACAO ---
export async function getClassificacao(edicao = 'atual') {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('classificacao')
    .select(
      `*,
       times:time_id (id, nome, escudo_url, cor_primaria)`
    )
    .eq('edicao', edicao)
    .order('posicao', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getClassificacaoEdicoes() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('classificacao')
    .select('edicao')
    .order('edicao', { ascending: false })
    .neq('edicao', '')

  if (error) throw new Error(error.message)
  const uniq = Array.from(new Set((data ?? []).map((d) => d.edicao as string)))
  return uniq
}

export async function upsertClassificacao(rows: ClassificacaoRow[]) {
  const supabase = await createClient()

  const payload = rows.map((row) => ({
    ...row,
    posicao: Number(row.posicao),
    pontos: Number(row.pontos),
    jogos: Number(row.jogos),
    vitorias: Number(row.vitorias),
    empates: Number(row.empates),
    derrotas: Number(row.derrotas),
    gols_pro: Number(row.gols_pro),
    gols_contra: Number(row.gols_contra),
  }))

  const { error } = await supabase.from('classificacao').upsert(payload, {
    onConflict: 'time_id,edicao',
  })

  if (error) throw new Error(error.message)
  revalidatePath('/admin/classificacao')
  revalidatePath('/')
  return { success: true }
}

export async function deleteClassificacaoRow(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('classificacao').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/classificacao')
  revalidatePath('/')
}

export type JogoRow = {
  id: string
  time_casa_id: string
  time_visitante_id: string
  data_hora: string
  local: string | null
  rodada: string | null
  edicao: string | null
  gols_casa: number | null
  gols_visitante: number | null
  status: 'agendado' | 'ao_vivo' | 'encerrado' | 'cancelado'
  destaque: boolean | null
}

export async function getUltimosResultados(limit = 6) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('jogos')
    .select(
      `*,
       time_casa:time_casa_id (id, nome, escudo_url, cor_primaria),
       time_visitante:time_visitante_id (id, nome, escudo_url, cor_primaria)`
    )
    .eq('status', 'encerrado')
    .eq('destaque', true)
    .order('data_hora', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getProximosJogos(limit = 6) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('jogos')
    .select(
      `*,
       time_casa:time_casa_id (id, nome, escudo_url, cor_primaria),
       time_visitante:time_visitante_id (id, nome, escudo_url, cor_primaria)`
    )
    .eq('status', 'agendado')
    .eq('destaque', true)
    .order('data_hora', { ascending: true })
    .limit(limit)

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getJogos(status?: string) {
  const supabase = await createClient()
  let query = supabase
    .from('jogos')
    .select(
      `*,
       time_casa:time_casa_id (id, nome, escudo_url),
       time_visitante:time_visitante_id (id, nome, escudo_url)`
    )
    .order('data_hora', { ascending: false })

  if (status && status !== 'todos') {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function createJogo(formData: FormData) {
  const supabase = await createClient()
  const payload: Partial<JogoRow> = {
    time_casa_id: formData.get('time_casa_id') as string,
    time_visitante_id: formData.get('time_visitante_id') as string,
    data_hora: formData.get('data_hora') as string,
    local: (formData.get('local') as string) || null,
    rodada: (formData.get('rodada') as string) || null,
    edicao: (formData.get('edicao') as string) || 'atual',
    status: (formData.get('status') as any) || 'agendado',
    destaque: formData.get('destaque') === 'on',
  }

  const { error } = await supabase.from('jogos').insert(payload)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/jogos')
  revalidatePath('/')
}

export async function updateJogo(id: string, formData: FormData) {
  const supabase = await createClient()
  const payload: Partial<JogoRow> = {
    local: (formData.get('local') as string) || null,
    rodada: (formData.get('rodada') as string) || null,
    edicao: (formData.get('edicao') as string) || 'atual',
    status: (formData.get('status') as any) || 'agendado',
    destaque: formData.get('destaque') === 'on',
  }
  const { error } = await supabase
    .from('jogos')
    .update(payload)
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/jogos')
  revalidatePath('/')
}

export async function encerrarJogo(
  id: string,
  gols_casa: number,
  gols_visitante: number,
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('jogos')
    .update({
      gols_casa,
      gols_visitante,
      status: 'encerrado',
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/jogos')
  revalidatePath('/')
}

export async function deleteJogo(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('jogos').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/jogos')
  revalidatePath('/')
}

export async function getCopas() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('copas')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getCopaAtiva() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('copas')
    .select('*')
    .eq('ativa', true)
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') throw new Error(error.message)
  return data ?? null
}

export async function setCopaAtiva(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.rpc('set_copa_ativa', { p_copa_id: id })
  // Se preferir sem RPC: duas queries UPDATE
  if (error) throw new Error(error.message)
  revalidatePath('/admin/copa')
  revalidatePath('/')
}

export async function createCopa(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const nome = formData.get("nome") as string;
  const edicao = formData.get("edicao") as string;

  await supabase.from("copas").insert({ nome, edicao, ativa: false });
  revalidatePath("/admin/copa");
}

export async function getCopaBracket(copaId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('copa_confrontos')
    .select(
      `*,
       time_a:time_a_id (id, nome, escudo_url),
       time_b:time_b_id (id, nome, escudo_url)`
    )
    .eq('copa_id', copaId)
    .order('fase', { ascending: true })
    .order('ordem', { ascending: true })

  if (error) throw new Error(error.message)

  const fasesOrdenadas = ['oitavas', 'quartas', 'semifinal', 'final', 'terceiro_lugar']

  const grouped: Record<string, any[]> = {}
  for (const fase of fasesOrdenadas) {
    grouped[fase] = (data ?? []).filter((c) => c.fase === fase)
  }

  return grouped
}

export async function updateConfrontoCopa(
  id: string,
  gols_a: number,
  gols_b: number,
  penaltis_a?: number,
  penaltis_b?: number,
) {
  const supabase = await createClient()

  const { data: confronto, error: getErr } = await supabase
    .from('copa_confrontos')
    .select('*')
    .eq('id', id)
    .single()

  if (getErr) throw new Error(getErr.message)

  let vencedor_id: string | null = null

  if (gols_a > gols_b) vencedor_id = confronto.time_a_id
  if (gols_b > gols_a) vencedor_id = confronto.time_b_id
  if (gols_a === gols_b && penaltis_a != null && penaltis_b != null) {
    if (penaltis_a > penaltis_b) vencedor_id = confronto.time_a_id
    if (penaltis_b > penaltis_a) vencedor_id = confronto.time_b_id
  }

  const { error } = await supabase
    .from('copa_confrontos')
    .update({
      gols_a,
      gols_b,
      penaltis_a: penaltis_a ?? null,
      penaltis_b: penaltis_b ?? null,
      vencedor_id,
      status: 'encerrado',
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  // V1: sem progressão automática para manter simples
  revalidatePath('/admin/copa')
  revalidatePath('/')
}


