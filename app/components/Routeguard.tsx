"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import { permissoes } from "@/lib/permissoes";

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    verificar();
  }, [pathname]);

  async function verificar() {
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

    const perfil =
      permissoes[
        data.perfil as keyof typeof permissoes
      ];

    if (!perfil?.includes(pathname)) {
      router.push("/acesso-negado");
    }
  }

  return <>{children}</>;
}