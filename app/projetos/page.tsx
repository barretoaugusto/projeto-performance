"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ProjetosPage() {
  const [projetos, setProjetos] = useState<any[]>([]);
  const [programas, setProgramas] = useState<any[]>([]);

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [programaId, setProgramaId] = useState("");

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");

  useEffect(() => {
    carregarProjetos();
    carregarProgramas();
  }, []);

  async function carregarProjetos() {
    const { data, error } = await supabase
      .from("projetos")
      .select("*");

    if (error) {
      console.error(error);
      return;
    }

    setProjetos(data || []);
  }

  async function carregarProgramas() {
    const { data, error } = await supabase
      .from("programas")
      .select("*");

    if (error) {
      console.error(error);
      return;
    }

    setProgramas(data || []);
  }

  async function salvarProjeto() {
    const { error } = await supabase
      .from("projetos")
      .insert([
        {
          programa_id: programaId,
          nome,
          tipo,
        },
      ]);

    if (error) {
      console.error(error);
      alert(JSON.stringify(error));
      return;
    }

    setProgramaId("");
    setNome("");
    setTipo("");

    setMostrarFormulario(false);

    carregarProjetos();
  }

  return (
    <main className="p-10 bg-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">
          Projetos
        </h1>

        <button
          onClick={() =>
            setMostrarFormulario(!mostrarFormulario)
          }
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Novo Projeto
        </button>
      </div>

      {mostrarFormulario && (
        <div className="bg-white p-6 rounded shadow mb-6">

          <select
            value={programaId}
            onChange={(e) =>
              setProgramaId(e.target.value)
            }
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

          <input
            placeholder="Nome do Projeto"
            value={nome}
            onChange={(e) =>
              setNome(e.target.value)
            }
            className="border p-2 w-full mb-3 text-black"
          />

          <input
            placeholder="Tipo"
            value={tipo}
            onChange={(e) =>
              setTipo(e.target.value)
            }
            className="border p-2 w-full mb-3 text-black"
          />

          <button
            onClick={salvarProjeto}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Salvar Projeto
          </button>

        </div>
      )}

      <div className="space-y-4">
        {projetos.map((projeto) => (
          <div
            key={projeto.id}
            className="bg-white p-4 rounded shadow"
          >
            <h2 className="text-xl font-bold text-black">
              {projeto.nome}
            </h2>

            <p className="text-gray-700">
              Tipo: {projeto.tipo}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}