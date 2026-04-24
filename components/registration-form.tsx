"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import { useRegistrationData } from "@/hooks/use-registration-data"
import { CountdownTimer } from "./countdown-timer"
import { SlotsCounter } from "./slots-counter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckCircle2, UploadCloud, FileText, Image as ImageIcon, CalendarX } from "lucide-react"

// Schema de validação com ortografia corrigida
const registrationSchema = z.object({
  nome_completo: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  data_nascimento: z.string().min(1, "Data de nascimento obrigatória"),
  categoria: z.string().min(1, "Selecione uma categoria"),
  responsavel: z.string().min(3, "Nome do responsável obrigatório"),
  telefone: z
    .string()
    .min(10, "Telefone inválido")
    .regex(/^[\d()\s-]+$/, "Telefone inválido"),
  bairro: z.string().min(2, "Bairro obrigatório"),
  
  // Campos de arquivo
  rg_aluno: z.any().optional(),
  cpf_aluno: z.any().optional(),
  rg_responsavel: z.any().optional(),
  cpf_responsavel: z.any().optional(),
  comprovante_escolar: z.any().optional(),
  comprovante_residencia: z.any().optional(),
  foto_aluno: z.any().optional(),
})

type RegistrationFormData = z.infer<typeof registrationSchema>

interface CategoriaDB {
  id: string
  nome: string
  descricao: string | null
  ativa: boolean
}

async function fetchCategorias(): Promise<CategoriaDB[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .eq("ativa", true)
    .order("nome", { ascending: true })

  if (error) return []
  return data ?? []
}

export function RegistrationForm() {
  const [isMounted, setIsMounted] = useState(false)
  const { data: categoriasDB } = useSWR("categorias-public", fetchCategorias)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { vagasTotal, vagasDisponiveis, dataLimite, isLoading, mutate } =
    useRegistrationData()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const isExpired = dataLimite
    ? new Date(dataLimite).getTime() < Date.now()
    : false
  const noSlots = vagasDisponiveis === 0
  const isDisabled = isExpired || noSlots

  // Função auxiliar para upload
  async function uploadFile(fileList: FileList | undefined, bucket: string, folder: string) {
    if (!fileList || fileList.length === 0) return null
    
    const file = fileList[0]
    const supabase = createClient()
    
    // Remove caracteres especiais
    const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
    const fileName = `${folder}/${Date.now()}_${cleanName}`
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file)

    if (error) throw error
    return data.path
  }

  async function onSubmit(data: RegistrationFormData) {
    setSubmitError(null)
    try {
      const supabase = createClient()

      const [
        rgAlunoPath,
        cpfAlunoPath,
        rgRespPath,
        cpfRespPath,
        compEscolarPath,
        compResidPath,
        fotoAlunoPath
      ] = await Promise.all([
        uploadFile(data.rg_aluno, 'documentos-privados', 'rg_aluno'),
        uploadFile(data.cpf_aluno, 'documentos-privados', 'cpf_aluno'),
        uploadFile(data.rg_responsavel, 'documentos-privados', 'rg_responsavel'),
        uploadFile(data.cpf_responsavel, 'documentos-privados', 'cpf_responsavel'),
        uploadFile(data.comprovante_escolar, 'documentos-privados', 'comprovantes_escolares'),
        uploadFile(data.comprovante_residencia, 'documentos-privados', 'comprovantes_residencia'),
        uploadFile(data.foto_aluno, 'imagens-publicas', 'fotos_alunos'),
      ])

      const { error } = await supabase.from("inscricoes").insert({
        nome_completo: data.nome_completo,
        email: data.email,
        data_nascimento: data.data_nascimento,
        categoria: data.categoria,
        responsavel: data.responsavel,
        telefone: data.telefone,
        bairro: data.bairro,
        rg_aluno_url: rgAlunoPath,
        cpf_aluno_url: cpfAlunoPath,
        rg_responsavel_url: rgRespPath,
        cpf_responsavel_url: cpfRespPath,
        comprovante_escolar_url: compEscolarPath,
        comprovante_residencia_url: compResidPath,
        foto_aluno_url: fotoAlunoPath
      })

      if (error) throw error
      
      mutate()
      setSubmitted(true)
    } catch (err: any) {
      console.error(err)
      setSubmitError(err.message || "Erro ao enviar inscrição. Verifique os arquivos e tente novamente.")
    }
  }

  // 1. TELA DE SUCESSO
  if (submitted) {
    return (
      <section id="inscricao" className="bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-lg px-4 text-center">
          <div className="flex flex-col items-center gap-6 rounded-2xl bg-primary-foreground/10 p-10 backdrop-blur-sm">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="font-display text-3xl font-bold uppercase">
              Inscrição Recebida!
            </h2>
            <p className="text-primary-foreground/80">
              Recebemos seus dados e documentos. Nossa equipe irá analisar e entrar em contato em breve.
            </p>
          </div>
        </div>
      </section>
    )
  }

  // 2. TELA DE ENCERRADO (Mostra aviso em vez do form)
  if (isDisabled) {
    return (
      <section id="inscricao" className="bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-lg px-4 text-center">
          <div className="flex flex-col items-center gap-6 rounded-2xl bg-primary-foreground/10 p-10 backdrop-blur-sm border border-white/10">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20 text-red-400">
              <CalendarX className="h-10 w-10" />
            </div>
            <h2 className="font-display text-3xl font-bold uppercase text-red-400">
              {noSlots ? "Vagas Esgotadas" : "Inscrições Encerradas"}
            </h2>
            <p className="text-primary-foreground/80 text-lg">
              {noSlots 
                ? "Atingimos o limite máximo de alunos para esta turma." 
                : "O prazo para realizar novas inscrições foi encerrado."}
            </p>
            <p className="text-sm text-primary-foreground/50">
              Fique atento às nossas redes sociais para saber sobre novas turmas.
            </p>
          </div>
        </div>
      </section>
    )
  }

  // 3. FORMULÁRIO (Aberto)
  return (
    <section id="inscricao" className="bg-primary py-20 text-primary-foreground">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="mb-4 text-center font-display text-3xl font-bold uppercase tracking-tight md:text-4xl">
          Intenção de vaga
        </h2>
        <div className="mx-auto mb-10 h-1 w-16 bg-accent" />

        {/* Contadores */}
        <div className="mb-10 flex flex-col gap-6 rounded-2xl bg-primary-foreground/5 p-6 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
          <CountdownTimer targetDate={dataLimite} />
          <div className="hidden h-12 w-px bg-primary-foreground/10 md:block" />
          <div className="w-full md:w-1/2">
            <SlotsCounter
              available={vagasDisponiveis}
              total={vagasTotal}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Formulário */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-8 p-0 md:p-4"
        >
          {/* SEÇÃO 1: DADOS DO ALUNO */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-xl font-bold uppercase text-accent border-b border-white/10 pb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm text-primary">1</span>
              Dados do Aluno
            </h3>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="nome_completo">Nome Completo *</Label>
              <Input
                id="nome_completo"
                placeholder="Nome do aluno"
                className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-accent"
                {...register("nome_completo")}
              />
              {errors.nome_completo && <p className="text-xs text-destructive">{errors.nome_completo.message}</p>}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="data_nascimento">Data de Nascimento *</Label>
                <Input
                  id="data_nascimento"
                  type="date"
                  className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground focus-visible:ring-accent"
                  {...register("data_nascimento")}
                />
                {errors.data_nascimento && <p className="text-xs text-destructive">{errors.data_nascimento.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="categoria">Categoria *</Label>
                <Select
                  onValueChange={(val) => setValue("categoria", val, { shouldValidate: true })}
                >
                  <SelectTrigger className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground focus:ring-accent">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {(categoriasDB ?? []).map((cat) => (
                      <SelectItem key={cat.id} value={cat.nome}>
                        {cat.nome}{cat.descricao ? ` - ${cat.descricao}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoria && <p className="text-xs text-destructive">{errors.categoria.message}</p>}
              </div>
            </div>

            {/* Foto do Aluno */}
            <div className="rounded-lg border border-dashed border-primary-foreground/30 p-4 hover:bg-primary-foreground/5 transition-colors">
              <Label htmlFor="foto_aluno" className="mb-2 flex items-center gap-2 cursor-pointer font-medium text-accent">
                <ImageIcon size={18} /> Foto do Aluno (Rosto)
              </Label>
              <Input
                id="foto_aluno"
                type="file"
                accept="image/*"
                className="cursor-pointer border-primary-foreground/20 bg-primary-foreground/10 file:text-accent-foreground text-primary-foreground file:bg-accent file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 hover:file:bg-accent/90"
                {...register("foto_aluno")}
              />
              <p className="mt-1 text-xs text-primary-foreground/50">Foto recente, de frente, estilo 3x4 ou selfie clara.</p>
            </div>
          </div>

          {/* SEÇÃO 2: DOCUMENTOS DO ALUNO */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-xl font-bold uppercase text-accent border-b border-white/10 pb-2">
               <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm text-primary">2</span>
               Documentos do Aluno
            </h3>
            
            <div className="grid gap-5 md:grid-cols-2">
               <div className="flex flex-col gap-2">
                <Label htmlFor="rg_aluno" className="flex items-center gap-2"><FileText size={16}/> RG do Aluno</Label>
                <Input
                  id="rg_aluno"
                  type="file"
                  accept=".pdf,image/*"
                  className="cursor-pointer border-primary-foreground/20 bg-primary-foreground/10 file:text-accent-foreground text-primary-foreground file:bg-accent file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 hover:file:bg-accent/90"
                  {...register("rg_aluno")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="cpf_aluno" className="flex items-center gap-2"><FileText size={16}/> CPF do Aluno</Label>
                <Input
                  id="cpf_aluno"
                  type="file"
                  accept=".pdf,image/*"
                  className="cursor-pointer border-primary-foreground/20 bg-primary-foreground/10 file:text-accent-foreground text-primary-foreground file:bg-accent file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 hover:file:bg-accent/90"
                  {...register("cpf_aluno")}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="comprovante_escolar" className="flex items-center gap-2"><FileText size={16}/> Comprovante Escolar</Label>
              <Input
                id="comprovante_escolar"
                type="file"
                accept=".pdf,image/*"
                className="cursor-pointer border-primary-foreground/20 bg-primary-foreground/10 file:text-accent-foreground text-primary-foreground file:bg-accent file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 hover:file:bg-accent/90"
                {...register("comprovante_escolar")}
              />
            </div>
          </div>

          {/* SEÇÃO 3: RESPONSÁVEL E CONTATO */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-xl font-bold uppercase text-accent border-b border-white/10 pb-2">
               <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm text-primary">3</span>
               Responsável
            </h3>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="responsavel">Nome do Responsável *</Label>
              <Input
                id="responsavel"
                placeholder="Nome do pai, mãe ou responsável"
                className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-accent"
                {...register("responsavel")}
              />
              {errors.responsavel && <p className="text-xs text-destructive">{errors.responsavel.message}</p>}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email de Contato *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-accent"
                  {...register("email")}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="telefone">Telefone / WhatsApp *</Label>
                <Input
                  id="telefone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-accent"
                  {...register("telefone")}
                />
                {errors.telefone && <p className="text-xs text-destructive">{errors.telefone.message}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="bairro">Bairro / Região *</Label>
              <Input
                id="bairro"
                placeholder="Onde vocês moram?"
                className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-accent"
                {...register("bairro")}
              />
              {errors.bairro && <p className="text-xs text-destructive">{errors.bairro.message}</p>}
            </div>

            <div className="grid gap-5 md:grid-cols-2 mt-4">
               <div className="flex flex-col gap-2">
                <Label htmlFor="rg_responsavel" className="flex items-center gap-2"><FileText size={16}/> RG do Responsável</Label>
                <Input
                  id="rg_responsavel"
                  type="file"
                  accept=".pdf,image/*"
                  className="cursor-pointer border-primary-foreground/20 bg-primary-foreground/10 file:text-accent-foreground text-primary-foreground file:bg-accent file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 hover:file:bg-accent/90"
                  {...register("rg_responsavel")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="cpf_responsavel" className="flex items-center gap-2"><FileText size={16}/> CPF do Responsável</Label>
                <Input
                  id="cpf_responsavel"
                  type="file"
                  accept=".pdf,image/*"
                  className="cursor-pointer border-primary-foreground/20  bg-primary-foreground/10 file:text-accent-foreground text-primary-foreground file:bg-accent file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 hover:file:bg-accent/90"
                  {...register("cpf_responsavel")}
                />
              </div>
            </div>

             <div className="flex flex-col gap-2 mt-2">
              <Label htmlFor="comprovante_residencia" className="flex items-center gap-2"><FileText size={16}/> Comprovante de Residência</Label>
              <Input
                id="comprovante_residencia"
                type="file"
                accept=".pdf,image/*"
                className="cursor-pointer border-primary-foreground/20 bg-primary-foreground/10 file:text-accent-foreground text-primary-foreground file:bg-accent file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 hover:file:bg-accent/90"
                {...register("comprovante_residencia")}
              />
            </div>
          </div>

          {submitError && (
            <div className="rounded-lg bg-destructive/20 border border-destructive/50 px-4 py-3 text-sm text-destructive font-medium">
              🚨 {submitError}
            </div>
          )}

          <Button
            type="submit"
            disabled={isDisabled || isSubmitting}
            className="mt-6 h-14 w-full bg-accent text-lg font-bold uppercase tracking-wide text-accent-foreground hover:brightness-110 disabled:opacity-50 md:text-xl shadow-lg shadow-accent/20"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                 <UploadCloud className="animate-bounce" /> Enviando Arquivos...
              </span>
            ) : (
              "Confirmar Inscrição"
            )}
          </Button>
        </form>
      </div>
    </section>
  )
}