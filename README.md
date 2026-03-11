# Exitus — Site Institucional

Site de landing page da plataforma Exitus de IA Pedagógica.

## Stack

- **React 18** + **Vite 6**
- CSS via template literal injetado em `<style>`
- Fontes: Sora + Poppins (Google Fonts)
- Imagens em `public/assets/`

## Estrutura do Projeto

```
exitus-site/
├── public/
│   ├── assets/          ← imagens do site (JPG/PNG)
│   └── favicon.svg
├── src/
│   ├── App.jsx          ← componente principal (todos os componentes)
│   ├── index.css        ← reset global
│   └── main.jsx         ← entry point
├── index.html
├── package.json
├── vite.config.js
├── netlify.toml         ← config Netlify
└── vercel.json          ← config Vercel
```

## Desenvolvimento Local

```bash
npm install
npm run dev
# Abre em http://localhost:5173
```

## Build de Produção

```bash
npm run build
npm run preview  # visualiza o build localmente
```

## Deploy

### Netlify (recomendado)

1. Crie uma conta em [netlify.com](https://netlify.com)
2. Clique em **"Add new site" → "Import an existing project"**
3. Conecte ao GitHub (suba o código primeiro: `git init && git add . && git commit -m "init"`)
4. Selecione o repositório
5. Configurações detectadas automaticamente pelo `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Clique **Deploy site** ✅

### Vercel

1. Instale o CLI: `npm i -g vercel`
2. Na pasta do projeto: `vercel`
3. Siga as instruções do CLI

### GitHub Pages (alternativo)

```bash
npm install --save-dev gh-pages
```
Adicione ao `package.json`:
```json
"homepage": "https://SEU_USUARIO.github.io/exitus-site",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```
Então: `npm run deploy`

## Personalização

- **Cores**: objeto `C` no topo de `src/App.jsx`
- **Imagens**: substituir arquivos em `public/assets/`
- **Textos**: editar diretamente nos componentes React em `src/App.jsx`
- **SEO**: editar tags meta em `index.html`
