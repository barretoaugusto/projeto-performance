"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import PermissionGuard from "../components/permissionGuard";
import RouteGuard from "../components/Routeguard";

export default function UsuariosPage() {

const [usuarios, setUsuarios] = useState<any[]>([]);
const [nome, setNome] = useState("");
const [email, setEmail] = useState("");
const [perfil, setPerfil] = useState("Consultor");
const [clientes, setClientes] = useState<any[]>([]);
const [usuarioAtual, setUsuarioAtual] = useState<any>(null);
const [senha, setSenha] = useState("");
const [confirmarSenha, setConfirmarSenha] = useState("");
const [mostrarFormulario, setMostrarFormulario] = useState(false);
const [usuarioEditando, setUsuarioEditando] = useState<any>(null);

const router = useRouter()

async function verificarPermissao() {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    router.push("/login");
    return;
  }

  const { data } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", user.email)
    .single();

  if (!data) {
    router.push("/");
    return;
  }

  setUsuarioAtual(data);

  if (data.perfil !== "Administrador") {
    router.push("/");
  }

useEffect(() => {
  carregarUsuarios();
  carregarClientes();
  verificarPermissao();
  
  async function carregarClientes() {
  const { data } = await supabase
    .from("clientes")
    .select("*")
    .order("nome_fantasia");

  if (data) {
    setClientes(data);
  }
}
}, []);

}

const [clienteId, setClienteId] = useState("");

useEffect(() => {
  carregarUsuarios();
  carregarClientes();
  async function carregarClientes() {
  const { data } = await supabase
    .from("clientes")
    .select("*")
    .order("nome_fantasia");

  if (data) {
    setClientes(data);
  }
}
}, []);

async function alterarStatus(usuario: any) {

  console.log("ALTERAR STATUS", usuario);

  const { data, error } = await supabase
    .from("usuarios")
    .update({
      ativo: !usuario.ativo,
    })
    .eq("email", usuario.email)
    .select();

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    alert(error.message);
    return;
  }

  await carregarUsuarios();
}

function editarUsuario(usuario:any) {
  setMostrarFormulario(true);
  setUsuarioEditando(usuario);
  setNome(usuario.nome);
  setEmail(usuario.email);
  setPerfil(usuario.perfil);
  setClienteId(usuario.cliente_id || "");
  console.log("Usuario recebido", usuario);
console.log("Nome", usuario.nome);
console.log("Email", usuario.email);
}

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

  if (usuarioEditando) {

  const { error } = await supabase
    .from("usuarios")
    .update({
      nome,
      email,
      perfil,
      cliente_id: clienteId || null
    })
    .eq("id", usuarioEditando.id);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Usuário atualizado");

  setUsuarioEditando(null);

  setNome("");
  setEmail("");
  setSenha("");
  setConfirmarSenha("");
  setPerfil("");
  setClienteId("");
  setUsuarioEditando(null);
  setMostrarFormulario(false);

  carregarUsuarios();

  return;
}

if (senha.length < 6) {
  alert("Senha deve ter pelo menos 6 caracteres");
  return;
}

if (senha !== confirmarSenha) {
  alert("As senhas não conferem");
  return;
}

const { data: authUser, error: authError } =

  await supabase.auth.signUp({
    email,
    password: senha,
  });

if (
  perfil !== "Administrador" &&
  !clienteId
) {
  alert("Selecione um cliente");
  return;
}


if (authError) {
  alert(authError.message);
  return;
}

const { data: usuarioExistente } = await supabase
  .from("usuarios")
  .select("id")
  .eq("email", email)
  .maybeSingle();

if (usuarioExistente) {
  alert("Já existe um usuário com este e-mail");
  return;
}
const { error } = await supabase
  .from("usuarios")
  .insert({
    nome,
    email,
    perfil,
    cliente_id: clienteId || null,
    ativo: true,
  });

if (error) {
  alert(error.message);
  return;
}

alert("Usuário cadastrado!");

carregarUsuarios();
}

  return (
    <RouteGuard>
  <PermissionGuard
    permissoes={["Administrador"]}
  >
    <main className="p-10 bg-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold text-black">
          👥 Usuários
        </h1>

        <button
  onClick={() =>
    setMostrarFormulario(!mostrarFormulario)
  }
  className="bg-blue-600 text-white px-4 py-2 rounded"
>
  ➕ Novo Usuário
</button>

{mostrarFormulario && (
  <div className="bg-white text-black p-4 rounded shadow mt-4">

  <h2>{usuarioEditando ? "Editar Usuário" : "Novo Usuário"}</h2>

  <p>
  Perfil: {usuarioAtual?.perfil}
</p>


  <input
  type="text"
  placeholder="Nome"
  value={nome}
  onChange={(e) => setNome(e.target.value)}
  className="border p-2 m-2 bg-white text-black rounded"
/>

  <input
    type="email"
    placeholder="E-mail"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="border p-2 m-2 bg-white text-black rounded"
/>

  <input
  type="password"
  placeholder="Senha"
  value={senha}
  onChange={(e) => setSenha(e.target.value)}
  className="border p-2 m-2 bg-white text-black rounded"
/>
<input
  type="password"
  placeholder="Confirmar Senha"
  value={confirmarSenha}
  onChange={(e) => setConfirmarSenha(e.target.value)}
  className="border p-2 m-2 bg-white text-black rounded"
/>

<select
  value={perfil}
  onChange={(e) => setPerfil(e.target.value)}
  className="border p-2 m-2 bg-white text-black rounded"
>
  <option>Administrador</option>
  <option>Gestor</option>
  <option>Consultor</option>
  <option>Cliente</option>
</select>

<select
  value={clienteId}
  onChange={(e) => setClienteId(e.target.value)}
  className="border p-2 m-2 bg-white text-black rounded"
>
  
  <option value="">
    Selecione o Cliente
  </option>

  {clientes.map((clientes) => (
    <option
      key={clientes.id}
      value={clientes.id}
    >
      {clientes.nome_fantasia}
    </option>
  ))}
</select>

  <button
  onClick={salvarUsuario}
>
  {usuarioEditando ? "Atualizar" : "Salvar"}
</button>

</div>
)}
      </div>


      <div className="bg-white rounded shadow p-4">

        <table className="w-full">

          <thead>
            <tr className="border-b">
              <th className="border p-2 m-2 bg-white text-black rounded">
                Nome
              </th>

              <th className="border p-2 m-2 bg-white text-black rounded">
                E-mail
              </th>

              <th className="border p-2 m-2 bg-white text-black rounded">
                Perfil
              </th>

              <th className="border p-2 m-2 bg-white text-black rounded">
                Cliente
              </th>

              <th className="border p-2 m-2 bg-white text-black rounded">
                Status
              </th>

              <th className="border p-2 m-2 bg-white text-black rounded">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>

            {usuarios.map((usuario) => (

<tr key={usuario.id}>

  <td className="border p-2 m-2 bg-white text-black rounded">
    {usuario.nome}
  </td>

  <td className="border p-2 m-2 bg-white text-black rounded">
    {usuario.email}
  </td>

  <td className="border p-2 m-2 bg-white text-black rounded">
    {usuario.perfil}
  </td>

  <td className="border p-2 m-2 bg-white text-black rounded">
    {nomeCliente(usuario.cliente_id)}
  </td>

  <td className="border p-2 m-2 bg-white text-black rounded">
    <button
  onClick={() =>
    alterarStatus(usuario)
  }
>
  {usuario.ativo
    ? "✅ Ativo"
    : "❌ Inativo"}
</button>
  </td>

  <td className="border p-2 m-2 bg-white text-black rounded">
    <button
  onClick={() => editarUsuario(usuario)}
>
  ✏️ Editar
</button>
  </td>

</tr>

))}

          </tbody>

        </table>

      </div>

    </main>
  </PermissionGuard>
  </RouteGuard>
);
}
