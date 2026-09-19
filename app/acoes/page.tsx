"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AcoesPage() {
  const [acoes, setAcoes] = useState<any[]>([]);
  const [descricao, setDescricao] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [prazo, setPrazo] = useState("");
  const [status, setStatus] = useState("Aberta");

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
    const { data, error } = await supabase
      .from("acoes")
      .insert([
        {
          descricao,
          responsavel,
          prazo,
          status,
        },
      ]);

console.log("DATA:", data);
console.log("ERROR:", error);
    if (error) {
  console.log(error.message);
  console.log(error.details);
  console.log(error.hint);
  alert(error.message);
  return;
}

    setDescricao("");
    setResponsavel("");
    setPrazo("");
    setStatus("Aberta");

    carregarAcoes();
  }

  async function concluirAcao(id: string) {
    const { error } = await supabase
      .from("acoes")
      .update({
        status: "Concluída",
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    carregarAcoes();
  }

  return (
    <main className="p-10 bg-slate-100 min-h-screen">
      <h1 className="text-3xl font-bold text-black mb-8">
        Plano de Ação
      </h1>

      <div className="bg-white p-6 rounded shadow mb-6">

        <input
          placeholder="Descrição da ação"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="border p-2 w-full mb-3 text-black"
        />

        <input
          placeholder="Responsável"
          value={responsavel}
          onChange={(e) => setResponsavel(e.target.value)}
          className="border p-2 w-full mb-3 text-black"
        />

        <input
          type="date"
          value={prazo}
          onChange={(e) => setPrazo(e.target.value)}
          className="border p-2 w-full mb-3 text-black"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 w-full mb-3 text-black"
        >
          <option>Aberta</option>
          <option>Em Andamento</option>
          <option>Concluída</option>
          <option>Cancelada</option>
        </select>

        <button
          onClick={salvarAcao}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Salvar Ação
        </button>

      </div>

      <div className="space-y-4">
        {acoes.map((acao) => (
          <div
            key={acao.id}
            className="bg-white p-4 rounded shadow"
          >
            <h2 className="text-xl font-bold text-black">
              {acao.descricao}
            </h2>

            <p className="text-gray-700 mt-2">
              Responsável: {acao.responsavel}
            </p>

            <p className="text-gray-700">
              Prazo: {acao.prazo}
            </p>

            <p className="font-semibold text-blue-600">
              Status: {acao.status}
            </p>

            {acao.status !== "Concluída" && (
              <button
                onClick={() => concluirAcao(acao.id)}
                className="mt-3 bg-green-600 text-white px-3 py-1 rounded"
              >
                ✅ Concluir
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}