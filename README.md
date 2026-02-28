# #politicamentecuriosos

Coletivo de projetos independentes de educação cívica e transparência parlamentar em Portugal.

**https://politicamentecuriosos.onrender.com**

## Conteúdo

O site apresenta projetos de cidadãos que trabalham para tornar a democracia portuguesa mais transparente e acessível: Parla!, Voto Aberto, Política Factual, Debaixo d'olho, e Manual da Juventude.

## Gestão de conteúdo

Todo o conteúdo é estático e editado diretamente nos ficheiros JSON. Após cada alteração, basta fazer `git push` para `main` — o Render faz deploy automático.

### Ficheiros

| O quê | Onde |
|-------|------|
| Projetos | `src/data/projects.json` |
| Artigos | `src/data/posts.json` |
| Logos de projetos | `public/images/logos/` |
| Imagens de artigos | `public/images/posts/` |

---

### Adicionar ou editar um projeto

Editar `src/data/projects.json`. Cada projeto tem esta estrutura:

```json
{
  "id": "uuid-unico",
  "name": "Nome do Projeto",
  "description": "Descrição do projeto.\n\nURLs no texto são convertidos automaticamente em links clicáveis:\nhttps://exemplo.pt — descrição do link",
  "logo_url": "images/logos/nome-do-logo.png",
  "website_url": "https://exemplo.pt",
  "contact_email": "email@exemplo.pt",
  "team_info": "Nome da pessoa ou equipa",
  "tags": ["tag1", "tag2"],
  "created_at": "2026-01-01T00:00:00+00:00",
  "updated_at": "2026-01-01T00:00:00+00:00"
}
```

**Notas:**
- **`id`** — UUID único. Gerar um em https://www.uuidgenerator.net/
- **`description`** — Texto simples. Usar `\n` para quebras de linha. URLs (começando por `http`) são automaticamente convertidos em links clicáveis na página de detalhe
- **`logo_url`** — Caminho relativo (sem `/` no início). Colocar a imagem PNG em `public/images/logos/`
- **`website_url`** — URL principal do projeto, mostrado no card. Pode ser `null`
- **`contact_email`**, **`team_info`** — Opcionais, podem ser `null`
- **`tags`** — Array de strings, ou `[]` se não houver tags
- A ordem dos projetos no JSON define a ordem de apresentação no site (do primeiro ao último)

---

### Criar um artigo

Editar `src/data/posts.json`. Cada artigo tem esta estrutura:

```json
{
  "id": "uuid-unico",
  "project_id": "uuid-do-projeto-associado",
  "title": "Título do Artigo",
  "content": "<p>Conteúdo em HTML.</p>",
  "excerpt": "Resumo curto para o card (opcional)",
  "cover_image_url": "images/posts/nome-da-imagem.png",
  "published": true,
  "published_at": "2026-01-01T12:00:00+00:00",
  "created_at": "2026-01-01T12:00:00+00:00",
  "updated_at": "2026-01-01T12:00:00+00:00"
}
```

**Notas:**
- **`published`** — Colocar `true` para publicar. Artigos com `false` não aparecem no site
- **`project_id`** — UUID de um projeto existente em `projects.json`. O artigo fica associado a esse projeto
- **`cover_image_url`** — Caminho relativo. Colocar a imagem em `public/images/posts/`
- **`excerpt`** — Se `null`, o card mostra os primeiros caracteres do conteúdo

#### Escrever conteúdo em HTML

O campo `content` aceita HTML. Tags suportadas:

```html
<!-- Parágrafos -->
<p>Texto normal.</p>

<!-- Negrito e itálico -->
<p>Texto com <strong>negrito</strong> e <em>itálico</em>.</p>

<!-- Links -->
<p>Visita o <a href="https://exemplo.pt">nosso site</a>.</p>

<!-- Listas -->
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>

<!-- Imagens inline -->
<img src="/images/posts/grafico.png" alt="Descrição da imagem" />

<!-- Títulos -->
<h2>Secção</h2>
<h3>Sub-secção</h3>
```

> **Dica:** Para imagens inline no corpo do artigo, usar caminhos absolutos com `/` (ex: `/images/posts/grafico.png`). Para a `cover_image_url`, usar caminho relativo sem `/` (ex: `images/posts/foto.png`).

---

### Imagens

- **Logos de projetos** — Colocar em `public/images/logos/`. Formato PNG recomendado
- **Imagens de artigos** — Colocar em `public/images/posts/`. Qualquer formato web (PNG, JPG, WebP)
- Manter nomes de ficheiro em minúsculas, sem espaços (usar hífens: `nome-da-imagem.png`)

## Desenvolvimento

```sh
npm install
npm run dev
```

## Deploy

O site está alojado no [Render](https://render.com) como static site. O deploy é automático: cada `git push` para `main` dispara um novo build.

## Stack

- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Render (static hosting, deploy automático via push para `main`)
