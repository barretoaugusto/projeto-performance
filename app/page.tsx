"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [clientes, setClientes] = useState(0);
  const [programas, setProgramas] = useState(0);
  const [projetos, setProjetos] = useState(0);
  const [lancamentos, setLancamentos] = useState(0);
  const [horas, setHoras] = useState(0);

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

      <div className="grid grid-cols-5 gap-6">

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

      </div>
    </main>
  );
}