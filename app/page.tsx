"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

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
  const [acoesPorResponsavel, setAcoesPorResponsavel] = useState<any[]>([]);
  const [acoesVencidas, setAcoesVencidas] = useState(0);
  const [vencendo7Dias, setVencendo7Dias] = useState(0);
  const [dentroPrazo, setDentroPrazo] = useState(0);
  const [rankingResponsaveis, setRankingResponsaveis] = useState<any[]>([]);
  const [horasPorCliente, setHorasPorCliente] = useState<any[]>([]);
  const dadosStatus = [
  {
    name: "Abertas",
    value: acoesAbertas,
  },
  {
    name: "Em Andamento",
    value: acoesAndamento,
  },
  {
    name: "Pausadas",
    value: acoesPausadas,
  },
  {
    name: "Concluídas",
    value: acoesConcluidas,
  },
  {
    name: "Canceladas",
    value: acoesCanceladas,
  },
];

const COLORS = [
  "#f97316",
  "#2563eb",
  "#eab308",
  "#16a34a",
  "#dc2626",
];

useEffect(() => {
  carregarIndicadores();
}, []);

  async function carregarIndicadores() {
    const responsaveisResult =
  await supabase
    .from("acoes")
    .select("responsavel");
    
  console.log(
  "responsaveisResult",
  responsaveisResult.data);
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

    const horasClienteResult = await supabase
      .from("lancamentos")
      .select("cliente_id, horas_trabalhadas");

    const clientesLista = await supabase
      .from("clientes")
      .select("id, nome_fantasia, razao_social");

   console.log(
  "horasClienteResult",
  horasClienteResult.data
);

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

  const prazosResult = await supabase
  .from("acoes")
  .select("prazo,status");

      const hoje = new Date();

let vencidas = 0;
let vencendo = 0;
let dentro = 0;

prazosResult.data?.forEach(
  (acao: any) => {

    if (
      acao.status ===
      "Concluída"
    ) {
      return;
    }

    const prazo =
      new Date(acao.prazo);

    const diferencaDias =
      Math.ceil(
        (
          prazo.getTime() -
          hoje.getTime()
        ) /
        (1000 * 60 * 60 * 24)
      );

    if (diferencaDias < 0) {
      vencidas++;
    } else if (
      diferencaDias <= 7
    ) {
      vencendo++;
    } else {
      dentro++;
    }
  }
);

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
const agrupado: Record<
  string,
  number
> = {};

responsaveisResult.data?.forEach(
  (item: any) => {
    const nome =
  (item.responsavel || "Não Definido")
    .trim()
    .toUpperCase();

    agrupado[nome] =
      (agrupado[nome] || 0) + 1;
  }
);

const dadosResponsavel =
  Object.entries(agrupado).map(
    ([nome, total]) => ({
      nome,
      total,
    })
  );

const ranking =
  [...dadosResponsavel]
    .sort(
      (a, b) =>
        b.total - a.total
    )
    .slice(0, 5);

const horasAgrupadas: Record<string, number> = {};

horasClienteResult.data?.forEach(
  (item: any) => {
    const cliente =
     item.cliente_id ||
     "Sem Cliente";

    horasAgrupadas[cliente] =
      (horasAgrupadas[cliente] || 0) +
      Number(
        item.horas_trabalhadas || 0
      );
  }
);

const rankingHoras =
  Object.entries(
    horasAgrupadas
  )
    .map(([clienteId, horas]) => {

      const cliente =
        clientesLista.data?.find(
          (c: any) =>
            c.id === clienteId
        );

      return {
        cliente:
          cliente?.nome_fantasia ||
          cliente?.razao_social ||
          clienteId,

        horas,
      };
    })
    .sort(
      (a, b) =>
        b.horas - a.horas
    );

setHorasPorCliente(
  rankingHoras
);

setRankingResponsaveis(
  ranking
);

console.log(
  "responsaveisResult",
  responsaveisResult.data
);

console.log(
  "dadosResponsavel",
  dadosResponsavel
);

setAcoesPorResponsavel(
  dadosResponsavel
);

setEficiencia(eficienciaCalc);
setAcoesAbertas(abertas);
setAcoesConcluidas(concluidas);
setAcoesAndamento(andamento);
setAcoesPausadas(pausadas);
setAcoesCanceladas(canceladas);
setAcoesAtivas(abertas + andamento + pausadas);
setAcoesVencidas(vencidas);
setVencendo7Dias(vencendo);
setDentroPrazo(dentro);

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

console.log("dadosStatus", dadosStatus);
console.log(
  "acoesPorResponsavel",
  acoesPorResponsavel
);

  return (
    <main className="p-10 bg-slate-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-10 text-black">
        Desempenho do Projeto
      </h1>

      <div className="grid grid-cols-4 gap-6">

  <div className="bg-white p-6 rounded shadow">
    <h2 className="text-gray-600">Clientes</h2>
    <p className="text-4xl font-bold text-black">
      {clientes}
    </p>
  </div>

  <div className="bg-white p-6 rounded shadow">
    <h2 className="text-gray-600">Programas</h2>
    <p className="text-4xl font-bold text-black">
      {programas}
    </p>
  </div>

  <div className="bg-white p-6 rounded shadow">
    <h2 className="text-gray-600">Projetos</h2>
    <p className="text-4xl font-bold text-black">
      {projetos}
    </p>
  </div>

  <div className="bg-white p-6 rounded shadow">
    <h2 className="text-gray-600">Lançamentos</h2>
    <p className="text-4xl font-bold text-black">
      {lancamentos}
    </p>
  </div>

  <div className="bg-white p-6 rounded shadow">
    <h2 className="text-gray-600">Horas</h2>
    <p className="text-4xl font-bold text-black">
      {horas}h
    </p>
  </div>

  <div className="bg-white p-6 rounded shadow">
    <h2 className="text-gray-600">Ações Abertas</h2>
    <p className="text-4xl font-bold text-orange-600">
      {acoesAbertas}
    </p>
  </div>

  <div className="bg-white p-6 rounded shadow">
    <h2 className="text-gray-600">Ações Concluídas</h2>
    <p className="text-4xl font-bold text-green-600">
      {acoesConcluidas}
    </p>
  </div>

  <div className="bg-white p-6 rounded shadow">
    <h2 className="text-gray-600">Em Andamento</h2>
    <p className="text-4xl font-bold text-blue-600">
      {acoesAndamento}
    </p>
  </div>

  <div className="bg-white p-6 rounded shadow">
    <h2 className="text-gray-600">Pausadas</h2>
    <p className="text-4xl font-bold text-yellow-600">
      {acoesPausadas}
    </p>
  </div>

  <div className="bg-white p-6 rounded shadow">
    <h2 className="text-gray-600">Canceladas</h2>
    <p className="text-4xl font-bold text-red-600">
      {acoesCanceladas}
    </p>
  </div>

  <div className="bg-white p-6 rounded shadow">
    <h2 className="text-gray-600">Eficiência</h2>
    <p className="text-4xl font-bold text-purple-700">
      {eficiencia}%
    </p>
  </div>

  <div className="bg-white p-6 rounded shadow">
    <h2 className="text-gray-600">Taxa Conclusão</h2>
    <p className="text-4xl font-bold text-green-700">
      {taxaConclusao}%
    </p>
  </div>

  <div className="bg-white p-6 rounded shadow">
    <h2 className="text-gray-600">Ações Ativas</h2>
    <p className="text-4xl font-bold text-blue-700">
      {acoesAtivas}
    </p>
  </div>

  <div className="bg-white p-6 rounded shadow">
  <h2 className="text-gray-600">
    Ações Vencidas
  </h2>

  <p className="text-4xl font-bold text-red-600">
    {acoesVencidas}
  </p>
</div>

<div className="bg-white p-6 rounded shadow">
  <h2 className="text-gray-600">
    Vencem em 7 dias
  </h2>

  <p className="text-4xl font-bold text-yellow-600">
    {vencendo7Dias}
  </p>
</div>

<div className="bg-white p-6 rounded shadow">
  <h2 className="text-gray-600">
    Dentro do Prazo
  </h2>

  <p className="text-4xl font-bold text-green-600">
    {dentroPrazo}
  </p>
</div>

</div>

<div className="bg-white p-6 rounded shadow mt-8">
  <h2 className="text-2xl font-bold text-black mb-4">
    Status das Ações
  </h2>

  <div style={{ width: "100%", height: 500 }}>
    <ResponsiveContainer>
      <PieChart>
        <Pie
  data={dadosStatus}
  isAnimationActive={false}
          cx="50%"
          cy="50%"
          outerRadius={160}
          dataKey="value"
          label={({ name, value }) =>
  `${name}: ${value}`
}
        >
          {dadosStatus.map(
            (entry, index) => (
              <Cell
                key={index}
                fill={
                  COLORS[index %
                    COLORS.length]
                }
              />
            )
          )}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>
<div className="bg-white p-6 rounded shadow mt-8">
  <h2 className="text-2xl font-bold text-black mb-4">
    Ações por Responsável
  </h2>

  <div
    style={{
      width: "100%",
      height: 400,
    }}
  >
    <ResponsiveContainer>
      <BarChart
  width={500}
  height={300}
  data={acoesPorResponsavel}
>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="nome" />
        <YAxis />
        <Tooltip />

        <Bar
          dataKey="total"
          fill="#2563eb"
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

<div className="bg-white p-6 rounded shadow mt-8">
  <h2 className="text-2xl font-bold text-black mb-4">
    🏆 Ranking de Responsáveis
  </h2>

  {rankingResponsaveis.map(
    (item, index) => (
      <div
  key={item.nome}
  className="flex justify-between border-b py-2 text-black"
>
        <span className="text-black">
  {index + 1}º {item.nome}
</span>

<span className="font-bold text-black">
  {item.total} ações
</span>
      </div>
    )
  )}
</div>

<div className="bg-white p-6 rounded shadow mt-8">
  <h2 className="text-2xl font-bold text-black mb-4">
    ⏱ Horas por Cliente
  </h2>

  {horasPorCliente.map(
    (item, index) => (
      <div
  key={item.cliente}
  className="flex justify-between border-b py-2 text-black"
>
  <span>
    {index + 1}º {item.cliente}
  </span>

  <span className="font-bold">
    {item.horas}h
  </span>
</div>

    )
  )}
</div>

</main>
);
}