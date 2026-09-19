"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LancamentosPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [programas, setProgramas] = useState<any[]>([]);
  const [projetos, setProjetos] = useState<any[]>([]);

  const [clienteId, setClienteId] = useState("");
  const [programaId, setProgramaId] = useState("");
  const [projetoId, setProjetoId] = useState("");

  const [dataLancamento, setDataLancamento] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");

  const [atividades, setAtividades] = useState("");
  const [problemas, setProblemas] = useState("");
  const [proximosPassos, setProximosPassos] = useState("");

  useEffect(() => {
    carregarClientes();
    carregarProgramas();
    carregarProjetos();
  }, []);

  async function carregarClientes() {
    const { data } = await supabase
      .from("clientes")
      .select("*");

    setClientes(data || []);
  }

  async function carregarProgramas() {
    const { data } = await supabase
      .from("programas")
      .select("*");

    setProgramas(data || []);
  }

  async function carregarProjetos() {
    const { data } = await supabase
      .from("projetos")
      .select("*");

    setProjetos(data || []);
  }

  async function salvarLancamento() {
    const inicio = new Date(
      `2000-01-01T${horaInicio}:00`
    );

    const fim = new Date(
      `2000-01-01T${horaFim}:00`
    );

    const horasTrabalhadas =
      (fim.getTime() - inicio.getTime()) /
      (1000 * 60 * 60);

    const { error } = await supabase
      .from("lancamentos")
      .insert([
        {
          cliente_id: clienteId,
          programa_id: programaId,
          projeto_id: projetoId,
          data_lancamento: dataLancamento,
          hora_inicio: horaInicio,
          hora_fim: horaFim,
          horas_trabalhadas: horasTrabalhadas,
          atividades_realizadas: atividades,
          problemas_encontrados: problemas,
          proximos_passos: proximosPassos,
        },
      ]);

    if (error) {
      alert(JSON.stringify(error));
      console.error(error);
      return;
    }

    alert("Lançamento salvo com sucesso!");

    setClienteId("");
    setProgramaId("");
    setProjetoId("");
    setDataLancamento("");
    setHoraInicio("");
    setHoraFim("");
    setAtividades("");
    setProblemas("");
    setProximosPassos("");
  }

  return (
    <main className="p-10 bg-slate-100 min-h-screen">
      <h1 className="text-3xl font-bold text-black mb-8">
        Lançamento Diário
      </h1>

      <div className="bg-white p-6 rounded shadow">

        <select
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          className="border p-2 w-full mb-3 text-black"
        >
          <option value="">
            Selecione um Cliente
          </option>

          {clientes.map((cliente) => (
            <option
              key={cliente.id}
              value={cliente.id}
            >
              {cliente.nome_fantasia}
            </option>
          ))}
        </select>

        <select
          value={programaId}
          onChange={(e) => setProgramaId(e.target.value)}
          className="border p-2 w-full mb-3 text-black"
        >
          <option value="">
            Selecione um Programa
          </option>

          {programas.map((programa) => (
            <option
              key={programa.id}
              value={programa.id}
            >
              {programa.nome}
            </option>
          ))}
        </select>

        <select
          value={projetoId}
          onChange={(e) => setProjetoId(e.target.value)}
          className="border p-2 w-full mb-3 text-black"
        >
          <option value="">
            Selecione um Projeto
          </option>

          {projetos.map((projeto) => (
            <option
              key={projeto.id}
              value={projeto.id}
            >
              {projeto.nome}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={dataLancamento}
          onChange={(e) =>
            setDataLancamento(e.target.value)
          }
          className="border p-2 w-full mb-3 text-black"
        />

        <input
          type="time"
          value={horaInicio}
          onChange={(e) =>
            setHoraInicio(e.target.value)
          }
          className="border p-2 w-full mb-3 text-black"
        />

        <input
          type="time"
          value={horaFim}
          onChange={(e) =>
            setHoraFim(e.target.value)
          }
          className="border p-2 w-full mb-3 text-black"
        />

        <textarea
          placeholder="Atividades Realizadas"
          value={atividades}
          onChange={(e) =>
            setAtividades(e.target.value)
          }
          className="border p-2 w-full mb-3 text-black"
        />

        <textarea
          placeholder="Problemas Encontrados"
          value={problemas}
          onChange={(e) =>
            setProblemas(e.target.value)
          }
          className="border p-2 w-full mb-3 text-black"
        />

        <textarea
          placeholder="Próximos Passos"
          value={proximosPassos}
          onChange={(e) =>
            setProximosPassos(e.target.value)
          }
          className="border p-2 w-full mb-3 text-black"
        />

        <button
          onClick={salvarLancamento}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Salvar
        </button>

      </div>
    </main>
  );
}