"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function salvarClassificacao(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const total = Number(formData.get("rows_count") || 0);
  const rows: any[] = [];

  for (let i = 0; i < total; i++) {
    rows.push({
      id: formData.get(`row_${i}_id`) || undefined,
      time_id: formData.get(`row_${i}_time_id`) as string,
      edicao: "atual",
      posicao: Number(formData.get(`row_${i}_posicao`) || 0),
      pontos: Number(formData.get(`row_${i}_pontos`) || 0),
      jogos: Number(formData.get(`row_${i}_jogos`) || 0),
      vitorias: Number(formData.get(`row_${i}_vitorias`) || 0),
      empates: Number(formData.get(`row_${i}_empates`) || 0),
      derrotas: Number(formData.get(`row_${i}_derrotas`) || 0),
      gols_pro: Number(formData.get(`row_${i}_gols_pro`) || 0),
      gols_contra: Number(formData.get(`row_${i}_gols_contra`) || 0),
    });
  }

  await supabase.from("classificacao").upsert(rows);
  revalidatePath("/admin/classificacao");
  revalidatePath("/");
}

export async function adicionarTime(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const nome = formData.get("nome") as string;
  const cor_primaria = formData.get("cor_primaria") as string;

  const file = formData.get("escudo") as File | null;
  let escudo_url: string | null = null;

  if (file && file.size > 0) {
    const ext = file.name.split(".").pop();
    const path = `times/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("imagens-publicas")
      .upload(path, file);
    if (!error) escudo_url = path;
  }

  await supabase.from("times").insert({ nome, cor_primaria, escudo_url });
  revalidatePath("/admin/classificacao");
}

export async function salvarTime(id: string, formData: FormData): Promise<void> {
  const supabase = await createClient();
  const nome = formData.get("nome") as string;
  const cor_primaria = formData.get("cor_primaria") as string;
  const ativo = formData.get("ativo") === "on";

  await supabase.from("times").update({ nome, cor_primaria, ativo }).eq("id", id);
  revalidatePath("/admin/classificacao");
}