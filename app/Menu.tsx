"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";

export default function Menu() {
  const router = useRouter();

  const [usuarioAtual, setUsuarioAtual] = useState<any>(null);

async function carregarUsuarioAtual() {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", user.email)
    .single();

  if (data) {
    setUsuarioAtual(data);
  }
}

useEffect(() => {
  carregarUsuarioAtual();
}, []);
const perfil = usuarioAtual?.perfil;

  return (
    <aside className="w-64 bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-8">
        Projeto Performance
      </h1>

      <p>
  {usuarioAtual?.nome}
</p>

<p>
  {usuarioAtual?.perfil}
</p>

      <nav className="flex flex-col gap-3">

        <button
          onClick={() => router.push("/")}
          className="text-left hover:bg-slate-700 p-2 rounded"
        >
          📊 Dashboard
        </button>

  {["Administrador", "Gestor"].includes(perfil) && (
  <button
    onClick={() => router.push("/clientes")}
    className="text-left hover:bg-slate-700 p-2 rounded"
  >
    👥 Clientes
  </button>
)}

   {perfil === "Administrador" && (
  <button
    onClick={() => router.push("/usuarios")}
    className="text-left hover:bg-slate-700 p-2 rounded"
  >
    👥 Usuários
  </button>
)}

        {["Administrador", "Gestor"].includes(perfil) && (
  <button
    onClick={() => router.push("/programas")}
    className="text-left hover:bg-slate-700 p-2 rounded"
  >
    📁 Programas
  </button>
)}

  {["Administrador", "Gestor", "Cliente"].includes(perfil) && (
  <button
    onClick={() => router.push("/projetos")}
    className="text-left hover:bg-slate-700 p-2 rounded"
  >
    📋 Projetos
  </button>
)}

        {["Administrador", "Gestor"].includes(perfil) && (
  <button
    onClick={() => router.push("/lancamentos")}
    className="text-left hover:bg-slate-700 p-2 rounded"
  >
    📑 Lançamentos de Ocorrências
  </button>
)}

     {["Administrador", "Gestor", "Cliente", "Consultor"].includes(perfil) && (
  <button
    onClick={() => router.push("/acoes")}
    className="text-left hover:bg-slate-700 p-2 rounded"
  >
    ✅ Plano de Ação
  </button>
)}

    {["Administrador", "Gestor", "Cliente", "Consultor"].includes(perfil) && (
  <button
    onClick={() => router.push("/evidencias")}
    className="text-left hover:bg-slate-700 p-2 rounded"
  >
    📎 Evidências
  </button>
)}

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