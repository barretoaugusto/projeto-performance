"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Menu() {
  const router = useRouter();

  return (
    <aside className="w-64 bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-8">
        Projeto Performance
      </h1>

      <nav className="flex flex-col gap-3">

        <button
          onClick={() => router.push("/")}
          className="text-left hover:bg-slate-700 p-2 rounded"
        >
          📊 Dashboard
        </button>

        <button
          onClick={() => router.push("/clientes")}
          className="text-left hover:bg-slate-700 p-2 rounded"
        >
          👥 Clientes
        </button>

        <button
          onClick={() => router.push("/programas")}
          className="text-left hover:bg-slate-700 p-2 rounded"
        >
          📁 Programas
        </button>

        <button
          onClick={() => router.push("/projetos")}
          className="text-left hover:bg-slate-700 p-2 rounded"
        >
          📋 Projetos
        </button>

        <button
          onClick={() => router.push("/lancamentos")}
          className="text-left hover:bg-slate-700 p-2 rounded"
        >
          📝 Lançamentos
        </button>

        <button
          onClick={() => router.push("/acoes")}
          className="text-left hover:bg-slate-700 p-2 rounded"
        >
          ✅ Plano de Ação
        </button>

        <button
          onClick={() => router.push("/evidencias")}
          className="text-left hover:bg-slate-700 p-2 rounded"
        >
          📎 Evidências
        </button>

        <button
          onClick={async () => {

         await supabase.auth.signOut();

         router.push("/login");

         }}
         className="text-red-500"
        >
         🚪 Sair
        </button>

      </nav>
    </aside>
  );
}