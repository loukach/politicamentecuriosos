# #politicamentecuriosos

Coletivo de projetos independentes de educação cívica e transparência parlamentar em Portugal.

**https://politicamentecuriosos.onrender.com**

## Conteúdo

O site apresenta projetos de cidadãos que trabalham para tornar a democracia portuguesa mais transparente e acessível: Parla!, Voto Aberto, Política Factual, Debaixo d'olho, e Manual da Juventude.

## Gestão de conteúdo

Todo o conteúdo é estático e editado diretamente nos ficheiros JSON:

- **Projetos** — `src/data/projects.json`
- **Artigos** — `src/data/posts.json`
- **Logos** — `public/images/logos/`
- **Imagens de artigos** — `public/images/posts/`

## Desenvolvimento

```sh
npm install
npm run dev
```

## Stack

- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Render (static hosting, deploy automático via push para `main`)
