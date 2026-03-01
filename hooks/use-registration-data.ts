"use client"

import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"

interface RegistrationData {
  vagasTotal: number
  vagasDisponiveis: number
  dataLimite: string | null
  isLoading: boolean
  error: Error | null
  mutate: () => void
}

async function fetchRegistrationData() {
  const supabase = createClient()

  const [configResult, countResult] = await Promise.all([
    supabase
      .from("configuracoes_inscricoes")
      .select("vagas_total, data_limite_inscricao")
      .limit(1)
      .single(),
    supabase
      .from("inscricoes")
      .select("id", { count: "exact", head: true }),
  ])

  if (configResult.error) throw configResult.error

  const vagasTotal = configResult.data?.vagas_total ?? 30
  const inscricoesCount = countResult.count ?? 0

  return {
    vagasTotal,
    vagasDisponiveis: Math.max(0, vagasTotal - inscricoesCount),
    dataLimite: configResult.data?.data_limite_inscricao ?? null,
  }
}

export function useRegistrationData(): RegistrationData {
  const { data, error, isLoading, mutate } = useSWR(
    "registration-data",
    fetchRegistrationData,
    {
      refreshInterval: 10000,
      revalidateOnFocus: true,
    }
  )

  return {
    vagasTotal: data?.vagasTotal ?? 30,
    vagasDisponiveis: data?.vagasDisponiveis ?? 30,
    dataLimite: data?.dataLimite ?? null,
    isLoading,
    error: error ?? null,
    mutate,
  }
}
