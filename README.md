# G.R.E.S. Uniao de Sepetiba - Galeria (HTML/CSS/JS + Supabase)

Este projeto possui uma galeria publica integrada ao Supabase, sem painel administrativo frontend nesta fase.

## O que esta implementado

- `galeria.html` com:
  - listagem de albuns da tabela `albums`
  - abertura de album na mesma pagina
  - abas por tipo de midia: `foto`, `video`, `youtube`
  - visualizacao de foto em modal com fundo blur e fechamento por `X`, clique fora e `Esc`
- Integracao modular em JavaScript puro dentro de `js/gallery/`
- Arquivo de exemplo de credenciais: `js/gallery/supabase-env.example.js`

## Estrutura relevante

- `galeria.html`
- `css/galeria.css`
- `js/gallery/supabase-client.js`
- `js/gallery/supabase-env.example.js`
- `js/gallery/api/albums-api.js`
- `js/gallery/api/medias-api.js`
- `js/gallery/services/media-normalizer.js`
- `js/gallery/ui/components.js`
- `js/gallery/pages/galeria-page.js`

## Importante sobre credenciais

O arquivo real de credenciais (`js/gallery/supabase-env.js`) **nao e versionado** por seguranca e esta no `.gitignore`.

Cada pessoa (QA/dev) deve criar esse arquivo localmente e preencher manualmente os valores.

## Passo a passo para QA/dev

1. Criar o arquivo local de credenciais:

   - Copie `js/gallery/supabase-env.example.js`
   - Crie `js/gallery/supabase-env.js`

2. Preencher as variaveis no arquivo `js/gallery/supabase-env.js`:

```js
window.APP_ENV = {
  SUPABASE_URL: "COLE_AQUI",
  SUPABASE_ANON_KEY: "COLE_AQUI",
};
```

3. Confirmar URL correta:

- Use a URL base do projeto Supabase, por exemplo:
  - `https://seu-projeto.supabase.co`
- Nao use sufixo `/rest/v1/`.

4. Abrir o site e testar:

- Abrir `galeria.html`
- Validar:
  - carregamento dos albuns
  - abertura de album
  - abas Fotos, Videos, Youtube
  - modal de foto (abrir/fechar)

## Requisitos de banco e policies

### Tabela `albums`

Colunas esperadas na implementacao atual:

- `id`
- `title`
- `created_at`

### Tabela `medias`

Colunas esperadas:

- `id`
- `album_id`
- `tipo` (`foto`, `video`, `youtube`)
- `titulo`
- `url`
- `created_at`

### Policies (fase atual)

- Leitura publica em `albums` (select)
- Leitura publica em `medias` (select)

Sem upload publico pelo frontend nesta fase.

## Dados de teste (enquanto nao ha upload real)

Pode usar URLs temporarias no Supabase:

- Foto: `https://picsum.photos/seed/album1/1200/800`
- Foto: `https://placehold.co/1200x800/png?text=Uniao+de+Sepetiba`
- Video: `https://samplelib.com/lib/preview/mp4/sample-5s.mp4`
- Youtube: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`

## Troubleshooting rapido

- Mensagem de configuracao ausente:
  - Verifique se `js/gallery/supabase-env.js` existe e esta preenchido.
- Nao carrega albuns:
  - Verifique RLS/policy de `select` em `albums`.
  - Verifique se a tabela usa `title` (nao `nome`).
- Nao carrega midias:
  - Verifique RLS/policy de `select` em `medias`.
  - Verifique `album_id` e `tipo`.
- Youtube nao abre:
  - Verifique se o link e valido (`youtube.com/watch?v=` ou `youtu.be/...`).
