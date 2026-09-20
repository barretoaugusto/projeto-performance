"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Evidencias() {

  const [acaoId, setAcaoId] =
    useState("");

  const [acoes, setAcoes] =
    useState<any[]>([]);

    <div className="mb-4">
  <label className="block text-black mb-2">
    Ação
  </label>

  <select
    value={acaoId}
    onChange={(e) =>
      setAcaoId(e.target.value)
    }
    className="border p-2 w-full text-black"
  >
    <option value="">
      Selecione uma ação
    </option>

    {acoes.map((acao) => (
      <option
        key={acao.id}
        value={acao.id}
      >
        {acao.descricao}
      </option>
    ))}
  </select>
</div>

  const [categoria, setCategoria] =
    useState("");

  const [descricao, setDescricao] =
    useState("");

  const [fotoAntes, setFotoAntes] =
    useState<File | null>(null);

  const [fotoDepois, setFotoDepois] =
    useState<File | null>(null);

  useEffect(() => {
    carregarAcoes();
  }, []);

  async function carregarAcoes() {
  const { data } =
    await supabase
      .from("acoes")
      .select("id, descricao");

  if (data) {
    setAcoes(data);
  }
  }

async function salvarEvidencia() {
  try {

    if (!acaoId) {
      alert("Selecione uma ação");
      return;
    }

    let fotoAntesUrl = "";
    let fotoDepoisUrl = "";

    if (fotoAntes) {

      const nomeArquivo =
        `antes-${Date.now()}-${fotoAntes.name}`;

      const { error } =
        await supabase.storage
          .from("evidencias")
          .upload(
            nomeArquivo,
            fotoAntes
          );
          console.log(
  "UPLOAD ANTES",
  error
);

      if (!error) {

        fotoAntesUrl =
          supabase.storage
            .from("evidencias")
            .getPublicUrl(nomeArquivo)
            .data.publicUrl;
      }
    }

    if (fotoDepois) {

      const nomeArquivo =
        `depois-${Date.now()}-${fotoDepois.name}`;

      const { error } =
  await supabase.storage
    .from("evidencias")
    .upload(
      nomeArquivo,
      fotoDepois
    );

console.log(
  "UPLOAD DEPOIS",
  error
);

      if (!error) {

        fotoDepoisUrl =
          supabase.storage
            .from("evidencias")
            .getPublicUrl(nomeArquivo)
            .data.publicUrl;
      }
    }

    const { error } =
      await supabase
        .from("evidencias")
        .insert([
          {
            acao_id: acaoId,
            categoria,
            descricao,
            foto_antes: fotoAntesUrl,
            foto_depois: fotoDepoisUrl,
          },
        ]);

    if (error) {
      console.error(error);
      alert("Erro ao salvar evidência");
      return;
    }

    alert("Evidência salva com sucesso!");

  } catch (error) {

    console.error(error);

    alert(
      "Erro ao salvar evidência"
    );
  }
}

  return (
    <main className="p-10 bg-slate-100 min-h-screen">
      <h1 className="text-4xl font-bold text-black mb-8">
        📎 Evidências
      </h1>

      <div className="bg-white p-6 rounded shadow">

        <div className="mb-4">
  <label className="block text-black mb-2">
    Ação
  </label>

  <select
    value={acaoId}
    onChange={(e) =>
      setAcaoId(e.target.value)
    }
    className="border p-2 w-full text-black"
  >
    <option value="">
      Selecione uma ação
    </option>

    {acoes.map((acao) => (
      <option
        key={acao.id}
        value={acao.id}
      >
        {acao.descricao}
      </option>
    ))}
  </select>
</div>

        <div className="mb-4">
          <label className="block text-black mb-2">
            Categoria
          </label>

          <input
            type="text"
            value={categoria}
            onChange={(e) =>
              setCategoria(e.target.value)
            }
            className="border p-2 w-full text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block text-black mb-2">
            Descrição
          </label>

          <textarea
            value={descricao}
            onChange={(e) =>
              setDescricao(e.target.value)
            }
            className="border p-2 w-full text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block text-black mb-2">
            Foto Antes
          </label>

          <input
         type="file"
            className="text-black"
            onChange={(e) =>
            setFotoAntes(
            e.target.files?.[0] || null
    )
  }
/>
        </div>

        <div className="mb-4">
          <label className="block text-black mb-2">
            Foto Depois
          </label>

          <input
            type="file"
            className="text-black"
             onChange={(e) =>
             setFotoDepois(
             e.target.files?.[0] || null
    )
  }
/>

        </div>

        <button
  onClick={salvarEvidencia}
  className="bg-blue-600 text-white px-4 py-2 rounded"
>
  Salvar Evidência
</button>

      </div>
    </main>
  );
}