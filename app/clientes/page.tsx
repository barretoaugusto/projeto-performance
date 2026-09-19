"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [nomeFantasia, setNomeFantasia] = useState("");
  const [segmento, setSegmento] = useState("");
  const [erp, setErp] = useState("");

  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    const { data, error } = await supabase
      .from("clientes")
      .select("*");

    if (error) {
      console.error(error);
      return;
    }

    setClientes(data || []);
  }

  async function salvarCliente() {
    const { error } = await supabase
      .from("clientes")
      .insert([
        {
          nome_fantasia: nomeFantasia,
          segmento: segmento,
          erp_utilizado: erp,
          razao_social: nomeFantasia,
        },
      ]);

    if (error) {
      console.error(error);
      alert("Erro ao salvar cliente");
      return;
    }

    setNomeFantasia("");
    setSegmento("");
    setErp("");

    setMostrarFormulario(false);

    carregarClientes();
  }

  return (
    <main className="p-10 bg-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">
          Clientes
        </h1>

        <button
          onClick={() =>
            setMostrarFormulario(!mostrarFormulario)
          }
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Novo Cliente
        </button>
      </div>

      {mostrarFormulario && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <input
            type="text"
            placeholder="Nome Fantasia"
            value={nomeFantasia}
            onChange={(e) =>
              setNomeFantasia(e.target.value)
            }
            className="border p-2 w-full mb-3 text-black"
          />

          <input
            type="text"
            placeholder="Segmento"
            value={segmento}
            onChange={(e) =>
              setSegmento(e.target.value)
            }
            className="border p-2 w-full mb-3 text-black"
          />

          <input
            type="text"
            placeholder="ERP"
            value={erp}
            onChange={(e) =>
              setErp(e.target.value)
            }
            className="border p-2 w-full mb-3 text-black"
          />

          <button
            onClick={salvarCliente}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Salvar Cliente
          </button>
        </div>
      )}

      <div className="space-y-4">
        {clientes.map((cliente) => (
          <div
            key={cliente.id}
            className="bg-white p-4 rounded shadow"
          >
            <h2 className="text-xl font-bold text-black">
              {cliente.nome_fantasia}
            </h2>

            <p className="text-gray-700">
              Segmento: {cliente.segmento}
            </p>

            <p className="text-gray-700">
              ERP: {cliente.erp_utilizado}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}