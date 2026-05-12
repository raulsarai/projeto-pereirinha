import { getTimes, getClassificacao, getClassificacaoEdicoes } from "@/app/admin/actions";
import { ClassificacaoClient } from "./classificacao-client";

export default async function ClassificacaoPage() {
  const [edicoes, classificacao, times] = await Promise.all([
    getClassificacaoEdicoes(),
    getClassificacao("atual"),
    getTimes(),
  ]);

  return (
    <ClassificacaoClient
      edicoes={edicoes}
      classificacao={classificacao ?? []}
      times={times}
    />
  );
}