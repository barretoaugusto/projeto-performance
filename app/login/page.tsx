"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Login() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  async function entrar() {

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-black p-8 rounded shadow w-96">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Projeto Performance
        </h1>

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="border p-2 w-full mb-4"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) =>
            setSenha(e.target.value)
          }
          className="border p-2 w-full mb-4"
        />

        <button
          onClick={entrar}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Entrar
        </button>

      </div>

    </main>
  );
}