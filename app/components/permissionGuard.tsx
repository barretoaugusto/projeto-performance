"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Props {
  children: React.ReactNode;
  permissoes: string[];
}

export default function PermissionGuard({
  children,
  permissoes,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [permitido, setPermitido] = useState(false);

  useEffect(() => {
    verificarPermissao();
  }, []);

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
      router.push("/login");
      return;
    }

    if (permissoes.includes(data.perfil)) {
      setPermitido(true);
    } else {
      router.push("/acesso-negado");
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="p-10">
        Carregando...
      </div>
    );
  }

  if (!permitido) return null;

  return <>{children}</>;
}
