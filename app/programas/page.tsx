"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function ProgramasPage() {
  const [programas, setProgramas] = useState<any[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nome, setNome] = useState("");
  const router = useRouter();

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
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    carregarProgramas();
  }, []);

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

  async function salvarPrograma() {
    const { error } = await supabase
      .from("programas")
      .insert([
        {
          nome: nome,
          descricao: descricao,
        },
      ]);

    if (error) {
  console.error(error);

  alert(
    JSON.stringify(error)
  );

  return;
}


    setNome("");
    setDescricao("");
    setMostrarFormulario(false);

    carregarProgramas();
  }

  return (
    <main className="p-10 bg-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">
          Programas
        </h1>

        <button
          onClick={() =>
            setMostrarFormulario(!mostrarFormulario)
          }
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Novo Programa
        </button>
      </div>

      {mostrarFormulario && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <input
            type="text"
            placeholder="Nome do Programa"
            value={nome}
            onChange={(e) =>
              setNome(e.target.value)
            }
            className="border p-2 w-full mb-3 text-black"
          />

          <textarea
            placeholder="Descrição"
            value={descricao}
            onChange={(e) =>
              setDescricao(e.target.value)
            }
            className="border p-2 w-full mb-3 text-black"
          />

          <button
            onClick={salvarPrograma}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Salvar Programa
          </button>
        </div>
      )}

      <div className="space-y-4">
        {programas.map((programa) => (
          <div
            key={programa.id}
            className="bg-white p-4 rounded shadow"
          >
            <h2 className="text-xl font-bold text-black">
              {programa.nome}
            </h2>

            <p className="text-gray-700">
              {programa.descricao}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}