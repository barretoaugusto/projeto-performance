"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AcoesPage() {
  const [acoes, setAcoes] = useState<any[]>([]);
  const [descricao, setDescricao] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [prazo, setPrazo] = useState("");
  const [status, setStatus] = useState("Aberta");
  const router = useRouter();
  const [filtroStatus, setFiltroStatus] = useState("Todos");
useEffect(() => {

  async function verificarLogin() {

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
    }

  }

  verificarLogin();

}, []);

  const [busca, setBusca] = useState("");

  const [responsaveis, setResponsaveis] =
    useState<Record<string, string>>({});

  const [prazos, setPrazos] =
    useState<Record<string, string>>({});

  useEffect(() => {
    carregarAcoes();
  }, []);

  async function carregarAcoes() {
    const { data, error } = await supabase
      .from("acoes")
      .select("*");

    if (error) {
      console.error(error);
      return;
    }

    setAcoes(data || []);
  }

  async function salvarAcao() {
    const { error } = await supabase
      .from("acoes")
      .insert([
        {
          descricao,
          responsavel,
          prazo,
          status,
        },
      ]);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    setDescricao("");
    setResponsavel("");
    setPrazo("");
    setStatus("Aberta");

    carregarAcoes();
  }

  function calcularStatus(acao: any) {

  if (acao.status === "Concluída") {
    return "🟢 Concluída";
  }

  if (
    acao.prazo &&
    new Date(acao.prazo) < new Date()
  ) {
    return "🔴 Atrasada";
  }

  return "🟡 Em Andamento";
}

function calcularPrazo(acao: any) {

  if (acao.status === "Concluída") {
    return "✅ Dentro do Prazo";
  }

  const hoje = new Date();
  const prazo = new Date(acao.prazo);

  const diferenca =
    Math.ceil(
      (prazo.getTime() - hoje.getTime()) /
      (1000 * 60 * 60 * 24)
    );

  if (diferenca < 0) {
    return `🚨 Atrasada há ${Math.abs(diferenca)} dias`;
  }

  return `⚠️ Vence em ${diferenca} dias`;
}

  async function atualizarStatus(
    id: string,
    novoStatus: string
  ) {
    const acaoAtual = acoes.find(
      (a) => a.id === id
    );

    const statusAnterior =
      acaoAtual?.status || "";

    const { error } = await supabase
      .from("acoes")
      .update({
        status: novoStatus,
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    const retorno = await supabase
  .from("acoes_historico")
  .insert([
    {
      acao_id: id,

      acao_descricao:
        acaoAtual?.descricao,

      usuario: "user.nome",

      campo: "Status",

      valor_antigo:
        statusAnterior,

      valor_novo:
        novoStatus,

      data_alteracao:
        new Date().toISOString(),
    },
  ]);

console.log("RETORNO:", retorno);
console.log("ERRO:", retorno.error);

console.log(
  "ERROR:",
  retorno.error
);

console.log(
  "MESSAGE:",
  retorno.error?.message
);

console.log(
  "DETAILS:",
  retorno.error?.details
);

console.log(
  "CODE:",
  retorno.error?.code
);


    carregarAcoes();
  }

  async function atualizarAcao(id: string) {
    const acaoAtual = acoes.find(
      (a) => a.id === id
    );
const responsavelAnterior =
  acaoAtual?.responsavel || "";

const prazoAnterior =
  acaoAtual?.prazo || "";

    const { error } = await supabase
      .from("acoes")
      .update({
        responsavel:
          responsaveis[id] ??
          acaoAtual?.responsavel,

        prazo:
          prazos[id] ??
          acaoAtual?.prazo,
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }
if (
  responsavelAnterior !==
  responsaveis[id]
) {
  await supabase
    .from("acoes_historico")
    .insert([
      {
        acao_id: id,
        acao_descricao:
          acaoAtual?.descricao,

        usuario: "user.nome",

        campo: "Responsável",

        valor_antigo:
          responsavelAnterior,

        valor_novo:
          responsaveis[id],

        data_alteracao:
          new Date().toISOString(),
      },
    ]);
}
if (
  prazoAnterior !==
  prazos[id]
) {
  await supabase
    .from("acoes_historico")
    .insert([
      {
        acao_id: id,
        acao_descricao:
          acaoAtual?.descricao,

        usuario: "user.nome",

        campo: "Prazo",

        valor_antigo:
          prazoAnterior,

        valor_novo:
          prazos[id],

        data_alteracao:
          new Date().toISOString(),
      },
    ]);
}

    carregarAcoes();
  }

  const totalAcoes = acoes.length;

const concluidas = acoes.filter(
  (a) => calcularStatus(a).includes("Concluída")
).length;

const andamento = acoes.filter(
  (a) => calcularStatus(a).includes("Andamento")
).length;

const atrasadas = acoes.filter(
  (a) => calcularPrazo(a).includes("Atrasada")
).length;

const percentualConclusao =
  totalAcoes > 0
    ? Math.round(
        (concluidas / totalAcoes) * 100
      )
    : 0;

  return (
    <main className="p-10 bg-slate-100 min-h-screen">
      <h1 className="text-3xl font-bold text-black mb-8">
        Plano de Ação
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">

  <div className="text-gray-700 font-semibold">
    <h3 className="text-gray-500">
      Total de Ações
    </h3>

    <p className="text-3xl font-bold">
      {totalAcoes}
    </p>
  </div>

  <div className="text-gray-700 font-semibold">
    <h3>
      Concluídas
    </h3>

    <p className="text-3xl font-bold text-green-700">
      {concluidas}
    </p>
  </div>

  <div className="text-gray-700 font-semibold">
    <h3>
      Em Andamento
    </h3>

    <p className="text-3xl font-bold text-yellow-700">
      {andamento}
    </p>
  </div>

  <div className="text-gray-700 font-semibold">
    <h3>
      Atrasadas
    </h3>

    <p className="text-3xl font-bold text-red-700">
      {atrasadas}
    </p>
  </div>

  <div className="text-gray-700 font-semibold">
    <h3>
      % Conclusão
    </h3>

    <p className="text-3xl font-bold text-blue-700">
      {percentualConclusao}%
    </p>
  </div>

</div>

      <div className="bg-white p-6 rounded shadow mb-6">
        <input
          placeholder="Descrição da ação"
          value={descricao}
          onChange={(e) =>
            setDescricao(e.target.value)
          }
          className="border p-2 w-full mb-3 text-black"
        />

        <input
          placeholder="Responsável"
          value={responsavel}
          onChange={(e) =>
            setResponsavel(e.target.value)
          }
          className="border p-2 w-full mb-3 text-black"
        />

        <input
          type="date"
          value={prazo}
          onChange={(e) =>
            setPrazo(e.target.value)
          }
          className="border p-2 w-full mb-3 text-black"
        />

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
          className="border p-2 w-full mb-3 text-black"
        >
          <option>Aberta</option>
          <option>Em Andamento</option>
          <option>Pausada</option>
          <option>Cancelada</option>
          <option>Concluída</option>
        </select>

        <button
          onClick={salvarAcao}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Salvar Ação
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <input
          placeholder="🔍 Buscar ação"
          value={busca}
          onChange={(e) =>
            setBusca(e.target.value)
          }
          className="border p-2 w-full mb-3 text-black"
        />

        <select
          value={filtroStatus}
          onChange={(e) =>
            setFiltroStatus(e.target.value)
          }
          className="border p-2 w-full text-black"
        >
          <option>Todos</option>
          <option>Aberta</option>
          <option>Em Andamento</option>
          <option>Pausada</option>
          <option>Cancelada</option>
          <option>Concluída</option>
        </select>
      </div>

      <div className="space-y-4">
        {acoes
          .filter(
            (acao) =>
              (filtroStatus === "Todos" ||
                acao.status ===
                  filtroStatus) &&
              acao.descricao
                ?.toLowerCase()
                .includes(
                  busca.toLowerCase()
                )
          )
          .map((acao) => (
            <div
              key={acao.id}
              className="bg-white p-4 rounded shadow"
            >
              <h2 className="text-xl font-bold text-black">
                {acao.descricao}
              </h2>

              <input
                placeholder="Responsável"
                value={
                  responsaveis[acao.id] ??
                  acao.responsavel ??
                  ""
                }
                onChange={(e) =>
                  setResponsaveis({
                    ...responsaveis,
                    [acao.id]:
                      e.target.value,
                  })
                }
                className="border p-2 w-full mt-3 text-black"
              />

              <input
                type="date"
                value={
                  prazos[acao.id] ??
                  acao.prazo ??
                  ""
                }
                onChange={(e) =>
                  setPrazos({
                    ...prazos,
                    [acao.id]:
                      e.target.value,
                  })
                }
                className="border p-2 w-full mt-2 text-black"
              />

              <button
                onClick={() =>
                  atualizarAcao(acao.id)
                }
                className="mt-2 bg-slate-700 text-white px-3 py-1 rounded"
              >
                💾 Salvar Dados
              </button>

              <button
                onClick={() =>
                router.push(
               `/historico?acao=${acao.id}`
                )
              }
              className="bg-slate-700 text-white px-3 py-1 rounded"
              >
               📜 Histórico
              </button>

              <p className="text-gray-700 mt-2">
                Responsável:{" "}
                {acao.responsavel}
              </p>

              <p className="text-gray-700">
               Prazo: {acao.prazo}
              </p>

              <p className="font-semibold text-blue-600">
               Status: {calcularStatus(acao)}
              </p>

              <p className="font-semibold text-blue-600">
               Situação: {calcularPrazo(acao)}
              </p>

              <div className="mt-3 flex gap-2 flex-wrap">
                <button
                  onClick={() =>
                    atualizarStatus(
                      acao.id,
                      "Em Andamento"
                    )
                  }
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  ▶ Em Andamento
                </button>

                <button
                  onClick={() =>
                    atualizarStatus(
                      acao.id,
                      "Pausada"
                    )
                  }
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  ⏸ Pausada
                </button>

                <button
                  onClick={() =>
                    atualizarStatus(
                      acao.id,
                      "Cancelada"
                    )
                  }
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  ❌ Cancelada
                </button>

                <button
                  onClick={() =>
                    atualizarStatus(
                      acao.id,
                      "Concluída"
                    )
                  }
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  ✅ Concluída
                </button>

              </div>
            </div>
          ))}
      </div>
    </main>
  );
}