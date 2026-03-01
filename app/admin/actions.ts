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