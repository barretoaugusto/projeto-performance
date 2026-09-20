"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <HistoricoPage />
    </Suspense>
  );
}

function HistoricoPage() {
  const searchParams = useSearchParams();
  const acaoId = searchParams.get("acao");
   console.log("AÇÃO ID:", acaoId);
  
  const [historico, setHistorico] = useState<any[]>([]);

  useEffect(() => {
  if (acaoId) {
    carregarHistorico();
  }
}, [acaoId]);

  async function carregarHistorico() {

    console.log("Filtro:", acaoId);

  let query =
    supabase
      .from("acoes_historico")
      .select("*")
      .order("data_alteracao", {
  ascending: false,
});

  if (acaoId) {
    query =
      query.eq(
        "acao_id",
        acaoId
      );
  }

const { data, error } = await query;

console.log("ERRO:", error);
console.log("DATA:", data);

if (!error && data) {
  setHistorico(data);
}

  if (!error && data) {
    setHistorico(data);
  }
  console.log("Retorno:", data);
}

  return (
    <main className="p-10 bg-slate-100 min-h-screen">
      <h1 className="text-3xl font-bold text-black mb-8">
        📜 Histórico de Alterações
      </h1>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-200">
  <tr>
    <th className="p-3 text-left text-black">
      Data
    </th>

    <th className="p-3 text-left text-black">
      Ação
    </th>

    <th className="p-3 text-left text-black">
      Usuário
    </th>

    <th className="p-3 text-left text-black">
      Campo
    </th>

    <th className="p-3 text-left text-black">
      Valor Antigo
    </th>

    <th className="p-3 text-left text-black">
      Valor Novo
    </th>
  </tr>
</thead>

          <tbody className="text-black">
            {historico.map((item) => (
              <tr
  key={item.id}
  className="border-t"
>
  <td className="p-3 text-black">
    {new Date(
      item.data_alteracao
    ).toLocaleString()}
  </td>

  <td className="p-3 text-black">
    {item.acao_descricao}
  </td>

  <td className="p-3 text-black">
    {item.usuario}
  </td>

  <td className="p-3 text-black">
    {item.campo}
  </td>

  <td className="p-3 text-black">
    {item.valor_antigo}
  </td>

  <td className="p-3 text-black">
    {item.valor_novo}
  </td>
</tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}