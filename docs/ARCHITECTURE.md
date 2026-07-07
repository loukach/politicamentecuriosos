# Arquitetura e manutenção técnica

Guia para quem vai corrigir bugs ou adicionar funcionalidades neste projeto. Para editar conteúdo (projetos, artigos, imagens) sem tocar em código, ver o `README.md` — este documento é o complemento técnico.

## Visão geral

Site estático, sem backend nem CMS próprios. Todo o conteúdo vive em dois ficheiros JSON (`src/data/projects.json`, `src/data/posts.json`), lidos em build-time pelo Vite. Não há testes automatizados — o único check em CI é um build (ver secção "Deploy & CI" abaixo). A principal verificação antes de um `git push` continua a ser correr `npm run dev` e olhar para o browser.

**Exceção:** o formulário de subscrição por email (`handleSubscribe` em `src/pages/Index.tsx`) chama uma API externa — `POST https://parla-estudio-api.onrender.com/api/politicamentecuriosos/subscribe` — que vive noutro repositório (`parla-estudio`, `api/app.py`), não neste. Essa rota envia um email via Resend para lucas@parla-app.eu a cada subscrição; não guarda nada em base de dados. Se o formulário parar de funcionar, o bug provavelmente está no outro repositório ou na configuração `CORS_ORIGINS`/`RESEND_API_KEY` desse serviço no Render, não aqui.

**Stack:** React 18 + TypeScript + Vite, React Router v6 (`BrowserRouter`), Tailwind CSS + shadcn/ui (Radix primitives), `date-fns` para datas, `posthog-js` para analytics. Alojado no Render como static site.

## Estrutura de ficheiros

```
src/
  data/
    types.ts       # interfaces Project, Post, PostWithProject
    index.ts        # camada de leitura: resolveUrl(), getProjects(), getProject(),
                     #   getPublishedPosts(), getProjectPosts(), getPost()
    projects.json    # conteúdo dos projetos (fonte de verdade)
    posts.json       # conteúdo dos artigos do blog
  pages/
    Index.tsx         # homepage: hero, captura de email, grelha de projetos em destaque, últimas atualizações
    Projects.tsx       # /projects — grelha completa
    ProjectDetail.tsx   # /projects/:id
    Blog.tsx             # /blog — grelha completa
    PostDetail.tsx        # /blog/:id
    NotFound.tsx           # rota "*"
  components/
    Navbar.tsx
    ProjectCard.tsx
    PostCard.tsx
    ui/                # primitivas shadcn (Badge, Button, Card, Input, Skeleton)
  App.tsx              # define as rotas (react-router)
  lib/utils.ts          # cn() — helper clsx + tailwind-merge
public/images/
  logos/               # logo quadrado de cada projeto
  screenshots/          # captura de ecrã da homepage de cada projeto
  posts/                 # imagens de capa dos artigos
.github/workflows/
  ci.yml                 # build check (npm ci && npm run build) em push/PR para main
```

Sem ficheiros de rotas dinâmicas nem API routes — tudo é client-side routing sobre dados estáticos importados no bundle.

## Deploy & CI

O Render está configurado com `autoDeployTrigger: checksPass` (não `commit`) — só faz deploy automático de um commit depois de um status check do GitHub (o "CI" definido em `.github/workflows/ci.yml`) passar nesse commit. Isto é diferente da maioria dos outros serviços Render da conta, que fazem deploy assim que há um commit novo, sem gate.

**Gotcha histórico:** entre 27 de fevereiro e 12 de junho de 2026 (e depois, entre 12 de junho e 7 de julho), nada foi automaticamente publicado, apesar de vários commits em `main` — porque não existia nenhum check de GitHub configurado, e sem check, a condição `checksPass` nunca é satisfeita. O site ficou semanas a mostrar uma versão desatualizada sem que isso fosse óbvio a partir do repositório (o `git log` local/remoto parecia normal; só comparando com o dashboard do Render, via `list_deploys`/`get_deploy`, é que ficou visível o commit realmente em produção). O ficheiro `.github/workflows/ci.yml` foi adicionado precisamente para dar ao `checksPass` algo para verificar.

**Se o site parecer desatualizado depois de um push:**
1. Confirmar que o workflow `CI` passou para esse commit: `gh run list --branch main --limit 5` (ou o separador Actions no GitHub)
2. Se o CI passou mas o Render não avançou, confirmar qual o commit realmente em produção (dashboard do Render → Events, ou via Render MCP `list_deploys`/`get_deploy` no serviço `politicamentecuriosos`) e comparar com `git log origin/main`
3. Testar o site com um parâmetro anti-cache (`?cachebust=1`) antes de assumir que o deploy falhou — o CDN do Render por vezes serve uma versão em cache por breves minutos mesmo depois do deploy ficar "live"

## Camada de dados (`src/data/index.ts`)

- `resolveUrl(url)` — se `url` for `null` ou já começar por `http`, devolve tal e qual; caso contrário, prefixa com `import.meta.env.BASE_URL`. Aplica-se a qualquer campo de imagem (`logo_url`, `screenshot_url`, `cover_image_url`). Ao adicionar um novo campo de imagem a `Project`/`Post`, tem de se mapear aqui também, senão o caminho relativo não resolve.
- **`getProjects()` ordena por `featured` (true primeiro) e depois por `created_at` decrescente dentro de cada grupo — não pela ordem no ficheiro JSON.** Isto já causou confusão: o `README.md` chegou a documentar (incorretamente) que a ordem no ficheiro é que manda. Se um projeto aparece na posição errada, é sempre por causa de `featured`/`created_at`, nunca por reordenar o array.
- `getPublishedPosts()` filtra `published: true` e ordena por `published_at` (ou `created_at` se `published_at` for `null`) decrescente.
- `getProject(id)` / `getPost(id)` — lookup direto por `id`, sem ordenação.
- `getProjectPosts(projectId)` — posts publicados associados a um projeto, para a secção "Atualizações de X" na página de detalhe.

## Padrões de UI a reutilizar

- **Cartões** (`ProjectCard.tsx`, `PostCard.tsx`) seguem sempre a mesma receita: `Card` com `overflow-hidden`, imagem de topo (`object-cover object-top`, com um `div` de gradiente como *fallback* quando a imagem é `null`), barra de gradiente de 2px (`from-primary via-secondary to-accent`), depois o conteúdo em `CardContent`.
- **Páginas de detalhe** (`ProjectDetail.tsx`, `PostDetail.tsx`) repetem o padrão: banner `w-full h-64 md:h-80 object-cover object-top rounded-2xl mb-8`, omitido por completo (sem *fallback*) quando não há imagem — diferente do comportamento nos cartões, que mostram sempre um gradiente. É intencional: no cartão a altura tem de ser consistente na grelha; na página de detalhe, não há grelha a manter alinhada.
- **`Linkify`** (definido dentro de `ProjectDetail.tsx`) converte URLs em texto simples (campo `description`) em links clicáveis — usado porque as descrições no JSON usam `\n` e URLs em vez de HTML.
- **`tagColors`** — array de 5 classes de cor, repetido *tal e qual* em `ProjectCard.tsx` e `ProjectDetail.tsx` (não está partilhado num só sítio). Se mudar a paleta, tem de se editar os dois ficheiros.
- **`post.content` é injetado com `dangerouslySetInnerHTML`** em `PostDetail.tsx`. Só é seguro porque o conteúdo é sempre escrito à mão por um maintainer no `posts.json`, nunca vindo de um formulário público. Não ligar isto a nenhuma fonte não confiável sem sanitizar primeiro.

## Tarefas comuns

### Corretiva (bug fixes)

- **"O projeto X está na posição errada"** → não é a ordem no JSON. Ver `featured` e `created_at` desse projeto e comparar com os outros (`getProjects()` em `src/data/index.ts`).
- **Imagem partida num cartão** → confirmar que o ficheiro existe mesmo em `public/images/{logos,screenshots,posts}/` com o nome exato referido no JSON (maiúsculas/minúsculas incluídas), e que o campo não tem `/` inicial.
- **Antes de dar push, correr sempre `npm run dev` e verificar visualmente.** O CI (`.github/workflows/ci.yml`) só corre `npm run build` — apanha erros de TypeScript/import, mas não um campo em falta num JSON ou um valor errado, já que não há testes automatizados.
- **Site não atualiza depois do push?** Ver a secção "Deploy & CI" acima — provavelmente é o gate `checksPass` do Render, não um bug no código.
- O `vite` sobe automaticamente a porta se `5173` estiver ocupada (por outro projeto a correr na máquina) — confirmar sempre o URL real no output do terminal.

### Evolutiva (novas funcionalidades)

**Adicionar um campo novo a `Project` ou `Post`:**
1. `src/data/types.ts` — adicionar o campo à interface
2. Se for um campo de imagem/URL: `src/data/index.ts` — adicionar `resolveUrl()` no mapeamento
3. `src/data/projects.json` / `posts.json` — preencher o campo em todas as entradas existentes (TypeScript não vai queixar-se de campos em falta num ficheiro `.json`, só nos sítios em que o tipo é usado — testar sempre visualmente)
4. Atualizar o exemplo de schema e as notas em `README.md`
5. Se o campo deve aparecer na UI: editar `ProjectCard.tsx`/`ProjectDetail.tsx` (ou os equivalentes de `Post`)

**Adicionar uma página nova:**
1. Criar `src/pages/NovaPage.tsx`
2. Registar a rota em `App.tsx`
3. Se for uma secção de navegação principal, adicionar o link em `Navbar.tsx` (desktop e o bloco do menu mobile — são dois blocos JSX separados, não um só)

**Adicionar um tipo de conteúdo novo (além de projetos/artigos):**
Replicar o padrão existente: interface em `types.ts`, ficheiro `.json` próprio, getters em `data/index.ts`, componente de cartão + página de listagem + página de detalhe, seguindo a estrutura de `Project`/`ProjectCard`/`Projects`/`ProjectDetail`.

## Gotchas específicos deste projeto

- **Sites de terceiros protegidos por Cloudflare (ex: dre.tretas.org, quemvotou.pt) bloqueiam `curl`/`fetch` simples.** Para capturar logos ou screenshots desses sites, é preciso usar um browser real (ex: Playwright) — um pedido HTTP direto sem executar JavaScript recebe a página de desafio "Just a moment...", não o conteúdo.
- **`object-cover` sem `object-position` corta o centro vertical da imagem por defeito.** Este projeto usa `object-top` nas imagens de topo/hero para mostrar sempre o cabeçalho do site capturado, em vez de uma fatia aleatória do meio da página.
- Projetos sem `website_url` (ex: "Política Factual", que é só Instagram) devem ter `screenshot_url: null` — a UI já trata este caso graciosamente, não forçar uma imagem.
