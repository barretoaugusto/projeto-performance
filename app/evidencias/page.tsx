"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import jsPDF from "jspdf";

export default function Evidencias() {

  const [acaoId, setAcaoId] =
    useState("");

  const [evidencias, setEvidencias] =
    useState<any[]>([]);

  const [acoes, setAcoes] =
    useState<any[]>([]);

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
  carregarEvidencias();
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

  } catch (error) {
    console.error(error);

    alert(
      "Erro ao salvar evidência"
    );
  }
}

async function carregarEvidencias() {

  const { data, error } =
    await supabase
      .from("evidencias")
      .select("*")
      .order("criado_em", {
        ascending: false,
      });

  if (!error && data) {
    setEvidencias(data);
  }
}

async function imageToBase64(url: string) {
  const response = await fetch(url);

  const blob = await response.blob();

  return new Promise<string>((resolve) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result as string);
    };

    reader.readAsDataURL(blob);
  });
}

async function gerarPDF(evidencia: any) {

  const pdf = new jsPDF();

  const nomeAcao =
    acoes.find(
      (acao) =>
        acao.id === evidencia.acao_id
    )?.descricao || "";

  pdf.setFontSize(18);

  pdf.text(
    "Relatório de Evidência",
    20,
    20
  );

  pdf.setFontSize(12);

  pdf.text(
    `Ação: ${nomeAcao}`,
    20,
    40
  );

  pdf.text(
    `Categoria: ${evidencia.categoria}`,
    20,
    50
  );

  pdf.text(
    `Descrição: ${evidencia.descricao}`,
    20,
    60
  );

  pdf.text(
    `Emitido em: ${new Date().toLocaleDateString()}`,
    20,
    75
  );

  let posY = 90;

  if (evidencia.foto_antes) {

    const imgAntes =
      await imageToBase64(
        evidencia.foto_antes
      );

    pdf.text(
      "Foto Antes",
      20,
      posY
    );

    pdf.addImage(
      imgAntes,
      "JPEG",
      20,
      posY + 5,
      60,
      60
    );

    posY += 75;
  }

  if (evidencia.foto_depois) {

    const imgDepois =
      await imageToBase64(
        evidencia.foto_depois
      );

    pdf.text(
      "Foto Depois",
      20,
      posY
    );

    pdf.addImage(
      imgDepois,
      "JPEG",
      20,
      posY + 5,
      60,
      60
    );
  }

  pdf.save(
    `evidencia-${evidencia.id}.pdf`
  );
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

{evidencias.map((evidencia) => (
  <div
    key={evidencia.id}
    className="border rounded p-4 mb-4">
    <p className="text-black">
      <strong>Categoria:</strong>{" "}
      {evidencia.categoria}
    </p>

    <p className="text-black">
      <strong>Descrição:</strong>{" "}
      {evidencia.descricao}
    </p>

    <p className="text-black">
      <strong>Ação:</strong>{" "}
      {
        acoes.find(
          (acao) =>
            acao.id === evidencia.acao_id
        )?.descricao || "Ação não encontrada"
      }
    </p>

   <div className="flex gap-6 mt-4">

  {evidencia.foto_antes && (
  <div>
    <p className="text-black font-bold mb-2">
      Foto Antes
    </p>

    <img width={150}height={150}
  src={evidencia.foto_antes}
  alt="Foto Antes"></img>
  </div>
)}

{evidencia.foto_depois && (
  <div>
    <p className="text-black font-bold mb-2">
      Foto Depois
    </p>

    <img width={150}height={150}
  src={evidencia.foto_depois}
  alt="Foto Depois">
  </img>
  </div>
)}

</div>

<button
  onClick={() =>
    gerarPDF(evidencia)
  }
  className="bg-green-600 text-white px-4 py-2 rounded mt-4"
>
  📄 Gerar PDF
</button>

</div>
))}
</main>
  );
}