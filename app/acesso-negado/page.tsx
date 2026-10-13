"use client";

import { useRouter } from "next/navigation";

export default function AcessoNegado() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-10 rounded shadow text-center">

        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Acesso Negado
        </h1>

        <p className="mb-6">
          Você não possui permissão para acessar esta área.
        </p>

        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          Voltar ao Dashboard
        </button>

      </div>
    </div>
  );
}