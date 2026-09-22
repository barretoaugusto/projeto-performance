"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function UsuariosPage() {

const [usuarios, setUsuarios] = useState<any[]>([]);
const [nome, setNome] = useState("");
const [email, setEmail] = useState("");
const [perfil, setPerfil] = useState("Consultor");
const [clientes, setClientes] = useState<any[]>([]);
const [clienteId, setClienteId] = useState("");

async function carregarClientes() {

  const { data, error } = await supabase
  .from("clientes")
  .select("*")
  .order("nome_fantasia");

  if (data) {
    setClientes(data);
 }
}

useEffect(() => {
  carregarUsuarios();
  carregarClientes();
}, []);
``
function nomeCliente(id: string) {
  const cliente = clientes.find(
    (c) => c.id === id
  );

  return cliente
    ? cliente.nome_fantasia
    : "-";
}

async function carregarUsuarios() {

  const { data, error } =
    await supabase
      .from("usuarios")
      .select("*")
      

  if (!error && data) {
    setUsuarios(data);
  }
}

async function salvarUsuario() {

  const { data, error } = await supabase
    .from("usuarios")
    .insert({
      nome,
      email,
      perfil,
      cliente_id: clienteId || null,
      ativo: true
    })
    .select();

  if (error) {
    alert(error.message);
    return;
  }

  alert("Usuário cadastrado!");

  carregarUsuarios();
}
  return (
    <main className="p-6">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          👥 Usuários
        </h1>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          ➕ Novo Usuário
        </button>

        <div className="bg-white p-4 rounded shadow mt-4">

  <h2>Novo Usuário</h2>

  <input
    type="text"
    placeholder="Nome"
    className="border p-2 m-2"
  />

  <input
    type="email"
    placeholder="E-mail"
    className="border p-2 m-2"
  />

<select
  value={perfil}
  onChange={(e) => setPerfil(e.target.value)}
>
  <option>Administrador</option>
  <option>Gestor</option>
  <option>Consultor</option>
  <option>Cliente</option>
</select>

<select
  value={clienteId}
  onChange={(e) => setClienteId(e.target.value)}
>
  <option value="">
    Selecione o Cliente
  </option>

  {clientes.map((clientes) => (
    <option
      key={clientes.id}
      value={clientes.id}
    >
      {clientes.nome}
    </option>
  ))}
</select>

  <select
    className="border p-2 m-2"
  >
    <option>
      Administrador
    </option>

    <option>
      Gestor
    </option>

    <option>
      Consultor
    </option>

    <option>
      Cliente
    </option>
  </select>

  <button
  onClick={salvarUsuario}
>
  Salvar
</button>

</div>

      </div>

      <div className="bg-white rounded shadow p-4">

        <table className="w-full">

          <thead>
            <tr className="border-b">
              <th className="text-left p-2">
                Nome
              </th>

              <th className="text-left p-2">
                E-mail
              </th>

              <th className="text-left p-2">
                Perfil
              </th>

              <th className="text-left p-2">
                Cliente
              </th>

              <th className="text-left p-2">
                Status
              </th>

              <th className="text-left p-2">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>

            {usuarios.map((usuario) => (

<tr key={usuario.id}>

  <td className="p-2">
    {usuario.nome}
  </td>

  <td className="p-2">
    {usuario.email}
  </td>

  <td className="p-2">
    {usuario.perfil}
  </td>

  <td>
{nomeCliente(usuario.cliente_id)}
</td>

  <td className="p-2">
    {usuario.ativo
      ? "✅ Ativo"
      : "❌ Inativo"}
  </td>

  <td className="p-2">
    ✏️ Editar
  </td>

</tr>

))}

          </tbody>

        </table>

      </div>

    </main>
  );
}
