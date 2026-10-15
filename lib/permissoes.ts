export const permissoes = {
  Administrador: [
    "/",
    "/usuarios",
    "/clientes",
    "/programas",
    "/projetos",
    "/acoes",
    "/evidencias",
  ],

  Gestor: [
    "/",
    "/clientes",
    "/programas",
    "/projetos",
    "/acoes",
    "/evidencias",
  ],

  Cliente: [
    "/",
    "/projetos",
    "/acoes",
    "/evidencias",
  ],

  Consultor: [
    "/",
    "/acoes",
    "/evidencias",
  ],
};
