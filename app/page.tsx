"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [clientes, setClientes] = useState(0);
  const [programas, setProgramas] = useState(0);
  const [projetos, setProjetos] = useState(0);
  const [lancamentos, setLancamentos] = useState(0);
  const [horas, setHoras] = useState(0);
  const [acoesAbertas, setAcoesAbertas] = useState(0);
  const [acoesConcluidas, setAcoesConcluidas] = useState(0);
  const [acoesAndamento, setAcoesAndamento] = useState(0);
  const [acoesPausadas, setAcoesPausadas] = useState(0);
  const [acoesCanceladas, setAcoesCanceladas] = useState(0);
  const [taxaConclusao, setTaxaConclusao] = useState(0);
  const [acoesAtivas, setAcoesAtivas] = useState(0);
  const [eficiencia, setEficiencia] = useState(0);
  
  useEffect(() => {
    carregarIndicadores();
  }, []);

  async function carregarIndicadores() {
    const clientesResult = await supabase
      .from("clientes")
      .select("*", { count: "exact", head: true });

    const programasResult = await supabase
      .from("programas")
      .select("*", { count: "exact", head: true });

    const projetosResult = await supabase
      .from("projetos")
      .select("*", { count: "exact", head: true });

    const lancamentosResult = await supabase
      .from("lancamentos")
      .select("*", { count: "exact", head: true });

    const horasResult = await supabase
      .from("lancamentos")
      .select("horas_trabalhadas");

    let totalHoras = 0;

    horasResult.data?.forEach((item: any) => {
      totalHoras += Number(
        item.horas_trabalhadas || 0
      );
    });
    const acoesResult = await supabase
  .from("acoes")
  .select("status");

    const abertas = acoesResult.data?.filter(
    (acao: any) => acao.status === "Aberta"
  ).length || 0;

const concluidas =
  acoesResult.data?.filter(
    (acao: any) => acao.status === "Concluída"
  ).length || 0;
  const andamento =
  acoesResult.data?.filter(
    (acao: any) => acao.status === "Em Andamento"
  ).length || 0;

const pausadas =
  acoesResult.data?.filter(
    (acao: any) => acao.status === "Pausada"
  ).length || 0;

const canceladas =
  acoesResult.data?.filter(
    (acao: any) => acao.status === "Cancelada"
  ).length || 0;
const eficienciaCalc =
  andamento + concluidas > 0
    ? Math.round(
        (
          concluidas /
          (andamento + concluidas)
        ) * 100
      )
    : 0;

setEficiencia(eficienciaCalc);

<div className="bg-white p-6 rounded shadow">
  <h2 className="text-gray-600">
    Taxa Conclusão
  </h2>

  <p className="text-4xl font-bold text-green-700">
    {taxaConclusao}%
  </p>
</div>

setAcoesAbertas(abertas);
setAcoesConcluidas(concluidas);
setAcoesAndamento(andamento);
setAcoesPausadas(pausadas);
setAcoesCanceladas(canceladas);
setAcoesAtivas(
  abertas + andamento + pausadas
);

<div className="bg-white p-6 rounded shadow">
  <h2 className="text-gray-600">
    Ações Ativas
  </h2>

  <p className="text-4xl font-bold text-blue-700">
    {acoesAtivas}
  </p>
</div>


const totalAcoes =
  abertas +
  concluidas +
  andamento +
  pausadas +
  canceladas;

const taxa =
  totalAcoes > 0
    ? Math.round(
        (concluidas / totalAcoes) * 100
      )
    : 0;

setTaxaConclusao(taxa);

    setClientes(clientesResult.count || 0);
    setProgramas(programasResult.count || 0);
    setProjetos(projetosResult.count || 0);
    setLancamentos(lancamentosResult.count || 0);
    setHoras(totalHoras);
  }

  return (
    <main className="p-10 bg-slate-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-10 text-black">
        Desempenho do Projeto
      </h1>

      <div className="grid grid-cols-10 gap-6">

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-600">
            Clientes
          </h2>

          <p className="text-4xl font-bold text-black">
            {clientes}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-600">
            Programas
          </h2>

          <p className="text-4xl font-bold text-black">
            {programas}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-600">
            Projetos
          </h2>

          <p className="text-4xl font-bold text-black">
            {projetos}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-600">
            Lançamentos
          </h2>

          <p className="text-4xl font-bold text-black">
            {lancamentos}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-600">
            Horas
          </h2>

          <p className="text-4xl font-bold text-black">
            {horas}h
          </p>
        </div>
        <div className="bg-white p-6 rounded shadow">
  <h2 className="text-gray-600">
    Ações Abertas
  </h2>

  <p className="text-4xl font-bold text-orange-600">
    {acoesAbertas}
  </p>
</div>

<div className="bg-white p-6 rounded shadow">
  <h2 className="text-gray-600">
    Ações Concluídas
  </h2>

  <p className="text-4xl font-bold text-green-600">
    {acoesConcluidas}
  </p>
</div>
<div className="bg-white p-6 rounded shadow">
  <h2 className="text-gray-600">
    Em Andamento
  </h2>

  <p className="text-4xl font-bold text-blue-600">
    {acoesAndamento}
  </p>
</div>

<div className="bg-white p-6 rounded shadow">
  <h2 className="text-gray-600">
    Pausadas
  </h2>

  <p className="text-4xl font-bold text-yellow-600">
    {acoesPausadas}
  </p>
</div>

<div className="bg-white p-6 rounded shadow">
  <h2 className="text-gray-600">
    Canceladas
  </h2>

  <p className="text-4xl font-bold text-red-600">
    {acoesCanceladas}
  </p>
</div>

<div className="bg-white p-6 rounded shadow">
  <h2 className="text-gray-600">
    Eficiência
  </h2>

  <p className="text-4xl font-bold text-purple-700">
    {eficiencia}%
  </p>
</div>

      </div>
    </main>
  );
}