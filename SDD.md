# Software Design Document — Notas Workflow

**Versão:** 1.0  
**Data:** 2026-06-28  
**Autor:** Wellington Cruz  

---

## 1. Visão Geral

**Notas Workflow** é uma aplicação web de anotações colaborativas que combina a riqueza de edição do OneNote com a organização visual em raias (swim lanes) do Microsoft Planner. O usuário se autentica via Google ou Microsoft, e suas notas são armazenadas diretamente no Drive ou OneDrive respectivamente. A busca utiliza modelo de linguagem gratuito para resultados semânticos.

---

## 2. Objetivos do Produto

| # | Objetivo |
|---|----------|
| 1 | Permitir criação e edição rica de notas (texto, imagens, listas, código) |
| 2 | Organizar notas em raias visuais (kanban-style) por caderno/seção |
| 3 | Busca inteligente via LLM gratuito sobre o conteúdo das notas |
| 4 | Autenticação e armazenamento via Google Drive ou OneDrive |
| 5 | Interface 100% acessível conforme WCAG 2.2 |
| 6 | Deploy em servidor com domínio próprio |

---

## 3. Stack Tecnológica

### Frontend
| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 15 (App Router) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS + CSS Variables (design tokens Itaú) |
| Editor de notas | TipTap v2 (baseado em ProseMirror) |
| State management | Zustand |
| Drag & drop (raias) | dnd-kit |
| Ícones | Lucide React |

### Backend
| Camada | Tecnologia |
|--------|-----------|
| API | Next.js API Routes (Edge Runtime) |
| Autenticação | NextAuth.js v5 (Google + Microsoft providers) |
| Busca semântica | Ollama (local) com modelo `nomic-embed-text` ou API Groq (gratuita) com `llama-3.1-8b-instant` |
| Embeddings cache | Upstash Redis (free tier) |

### Storage
| Provider | SDK |
|----------|-----|
| Google Drive | Google Drive API v3 (`googleapis`) |
| OneDrive | Microsoft Graph API (`@microsoft/microsoft-graph-client`) |

### Infraestrutura
| Item | Tecnologia |
|------|-----------|
| Hospedagem | Vercel (free tier) ou VPS (Ubuntu + Nginx + PM2) |
| Domínio | Próprio (ex: notasworkflow.app) |
| SSL | Let's Encrypt / Vercel auto-SSL |
| CI/CD | GitHub Actions |

---

## 4. Design System

### 4.1 Fundação — Tokens Itaú

```css
/* Escala de espaçamento (base 4px) */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;

/* Border radius */
--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 16px;
--radius-xl: 22px;
--radius-full: 9999px;

/* Sombras */
--shadow-sm: 0 1px 2px rgba(0,0,0,.06), 0 1px 3px rgba(0,0,0,.10);
--shadow-md: 0 4px 6px rgba(0,0,0,.07), 0 2px 4px rgba(0,0,0,.06);
--shadow-lg: 0 10px 15px rgba(0,0,0,.08), 0 4px 6px rgba(0,0,0,.05);

/* Duração de animação */
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 400ms;
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
```

### 4.2 Paleta de Cores — Estilo Apple

```css
/* Cores de sistema (light mode) */
--color-blue:        #007AFF;
--color-green:       #34C759;
--color-indigo:      #5856D6;
--color-orange:      #FF9500;
--color-pink:        #FF2D55;
--color-purple:      #AF52DE;
--color-red:         #FF3B30;
--color-teal:        #5AC8FA;
--color-yellow:      #FFCC00;

/* Escala de cinza (label colors) */
--color-label-primary:     rgba(0,0,0,0.85);
--color-label-secondary:   rgba(0,0,0,0.50);
--color-label-tertiary:    rgba(0,0,0,0.30);
--color-label-quaternary:  rgba(0,0,0,0.18);

/* Backgrounds */
--color-bg-primary:       #FFFFFF;
--color-bg-secondary:     #F2F2F7;
--color-bg-tertiary:      #FFFFFF;
--color-bg-grouped:       #F2F2F7;

/* Separadores */
--color-separator:        rgba(60,60,67,0.29);
--color-separator-opaque: #C6C6C8;

/* Dark mode */
@media (prefers-color-scheme: dark) {
  --color-bg-primary:     #1C1C1E;
  --color-bg-secondary:   #2C2C2E;
  --color-bg-tertiary:    #3A3A3C;
  --color-label-primary:  rgba(255,255,255,0.85);
  --color-label-secondary:rgba(255,255,255,0.55);
  --color-separator:      rgba(84,84,88,0.65);
}
```

### 4.3 Tipografia — SF Pro / Inter

```css
/* Itaú usa Inter como fallback público */
--font-display: 'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-text:    'SF Pro Text', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono:    'SF Mono', 'JetBrains Mono', 'Fira Code', monospace;

/* Escala tipográfica (rem) */
--text-xs:   0.75rem;   /* 12px */
--text-sm:   0.875rem;  /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg:   1.125rem;  /* 18px */
--text-xl:   1.25rem;   /* 20px */
--text-2xl:  1.5rem;    /* 24px */
--text-3xl:  1.875rem;  /* 30px */
--text-4xl:  2.25rem;   /* 36px */

/* Pesos */
--font-regular:   400;
--font-medium:    500;
--font-semibold:  600;
--font-bold:      700;
```

### 4.4 Componentes Core

| Componente | Descrição |
|-----------|-----------|
| `<Button>` | 3 variantes: primary, secondary, ghost. 3 tamanhos: sm, md, lg. Estado focus com outline visível (WCAG) |
| `<Card>` | Surface com shadow-sm, radius-lg, padding-6 |
| `<Lane>` | Swim lane vertical com header, contador de notas, dropzone |
| `<NoteCard>` | Card draggável com título, preview, tags, data |
| `<Editor>` | TipTap com toolbar (negrito, itálico, lista, código, imagem) |
| `<SearchBar>` | Input com ícone lupa, debounce 300ms, badge "IA" quando semântica ativa |
| `<Sidebar>` | Navegação por cadernos, seções e tags |
| `<Avatar>` | Foto do usuário com fallback inicial, tamanhos sm/md/lg |

---

## 5. Arquitetura de Informação

```
Conta do Usuário
└── Cadernos (Notebooks)           ← pasta no Drive/OneDrive
    └── Seções (Sections)          ← subpasta
        └── Raias (Lanes)          ← metadado no arquivo de índice
            └── Notas (Notes)      ← arquivo .json ou .md
```

### Estrutura de Arquivo de Nota (JSON)

```json
{
  "id": "uuid-v4",
  "title": "Título da nota",
  "content": "<TipTap JSON serializado>",
  "tags": ["trabalho", "ideia"],
  "laneId": "uuid-lane",
  "sectionId": "uuid-section",
  "notebookId": "uuid-notebook",
  "createdAt": "2026-06-28T10:00:00Z",
  "updatedAt": "2026-06-28T10:00:00Z",
  "embedding": [0.023, -0.14, ...]  // vetor 768d, cacheado no Redis
}
```

---

## 6. Fluxos de Usuário

### 6.1 Fluxo de Login

```
[Tela de Login]
  ├── [Entrar com Google] → OAuth 2.0 → Google Drive scope
  └── [Entrar com Microsoft] → OAuth 2.0 → OneDrive scope
        ↓
  [Primeira visita] → Cria pasta "Notas Workflow" no Drive/OneDrive
        ↓
  [Dashboard principal]
```

### 6.2 Fluxo de Criação de Nota

```
[Sidebar] → Seleciona seção
  → [Board de Raias] → Clica "+ Nova Nota" na raia
  → [Modal/Page do Editor] → Escreve conteúdo
  → [Auto-save a cada 2s] → Persiste no Drive/OneDrive
  → [Gera embedding em background] → Salva no local storage 
```

### 6.3 Fluxo de Busca Inteligente

```
[SearchBar] → Usuário digita query
  → [debounce 300ms]
  → [API /api/search]
    ├── Gera embedding da query via Groq/Ollama
    ├── Busca por similaridade coseno no Redis
    ├── Fallback: busca textual simples (indexOf)
    └── Retorna notas rankeadas por relevância
  → [Resultados com highlight do trecho relevante]
```

---

## 7. Rotas da Aplicação

### Páginas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | `LandingPage` | Página pública com CTA de login |
| `/login` | `LoginPage` | Botões Google + Microsoft |
| `/app` | `Dashboard` | Board principal com raias |
| `/app/note/[id]` | `NoteEditor` | Editor full-page de uma nota |
| `/app/search` | `SearchPage` | Resultados de busca |
| `/app/settings` | `SettingsPage` | Preferências do usuário |

### API Routes

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/auth/[...nextauth]` | NextAuth handlers |
| GET | `/api/notebooks` | Lista cadernos |
| POST | `/api/notebooks` | Cria caderno |
| GET | `/api/notes` | Lista notas (por seção/lane) |
| POST | `/api/notes` | Cria nota |
| PUT | `/api/notes/[id]` | Atualiza nota |
| DELETE | `/api/notes/[id]` | Remove nota |
| POST | `/api/search` | Busca semântica |
| POST | `/api/embed` | Gera/atualiza embedding de nota |

---

## 8. Acessibilidade — WCAG 2.2

### Critérios Implementados

| Critério | Nível | Implementação |
|---------|-------|--------------|
| 1.1.1 Conteúdo não textual | A | `alt` em todas as imagens; `aria-label` em ícones |
| 1.3.1 Informação e relações | A | HTML semântico (`<main>`, `<nav>`, `<article>`, `<header>`) |
| 1.3.2 Sequência significativa | A | DOM segue ordem visual lógica |
| 1.3.3 Características sensoriais | A | Instruções não dependem apenas de cor/forma |
| 1.4.1 Uso de cor | A | Informação nunca transmitida só por cor |
| 1.4.3 Contraste mínimo | AA | Mínimo 4.5:1 texto normal, 3:1 texto grande |
| 1.4.4 Redimensionar texto | AA | Layout responsivo até 200% de zoom |
| 1.4.10 Reflow | AA | Nenhum scroll horizontal em 320px |
| 1.4.11 Contraste em componentes | AA | Borders de inputs com 3:1 contra fundo |
| 1.4.12 Espaçamento de texto | AA | Sem quebra com letter/word/line-spacing aumentados |
| 1.4.13 Conteúdo em hover/focus | AA | Tooltips dispensáveis, persistem, não obscurecem |
| 2.1.1 Teclado | A | Todos os fluxos navegáveis via teclado |
| 2.1.2 Sem armadilha de teclado | A | Modais com focus trap + Esc para fechar |
| 2.4.3 Ordem de foco | A | Focus segue ordem lógica |
| 2.4.7 Foco visível | AA | Outline azul 3px com offset 2px |
| 2.4.11 Foco não obscurecido | AA (novo 2.2) | Scroll automático mantém elemento focado visível |
| 2.4.12 Foco não obscurecido (aprimorado) | AAA | Nenhuma sobreposição no foco |
| 2.5.3 Etiqueta no nome | A | Labels visíveis incluídas no nome acessível |
| 2.5.7 Movimentos de arrasto | AA (novo 2.2) | Alternativa de teclado para drag-and-drop de raias |
| 2.5.8 Tamanho do alvo | AA (novo 2.2) | Mínimo 24×24px, recomendado 44×44px |
| 3.2.2 Ao receber entrada | A | Sem mudanças de contexto inesperadas |
| 3.3.2 Rótulos ou instruções | A | Labels em todos os campos |
| 4.1.2 Nome, função, valor | A | ARIA roles em todos os widgets customizados |
| 4.1.3 Mensagens de status | AA | Live regions para auto-save, busca, erros |

### Componentes de Acessibilidade

```tsx
// Focus trap em modais
<FocusTrap active={isOpen}>
  <dialog role="dialog" aria-modal="true" aria-labelledby="modal-title">
    ...
  </dialog>
</FocusTrap>

// Live region para auto-save
<div role="status" aria-live="polite" className="sr-only">
  {saveStatus} // "Nota salva" / "Salvando..."
</div>

// Alternativa de teclado para drag-and-drop
// Seleção com Enter/Space, mover com Alt+Setas
<div
  role="option"
  aria-grabbed={isDragging}
  aria-describedby="drag-instructions"
  onKeyDown={handleKeyboardDrag}
>
```

---

## 9. Integração de Armazenamento

### Google Drive

```typescript
// Estrutura de pastas criada no Drive do usuário
Notas Workflow/
  └── [Caderno]/
        └── [Seção]/
              ├── _index.json      ← metadados de raias
              └── [nota-uuid].json ← conteúdo da nota

// Scopes OAuth necessários
'https://www.googleapis.com/auth/drive.file'
// drive.file = acesso apenas a arquivos criados pelo app
```

### OneDrive (Microsoft Graph)

```typescript
// Estrutura equivalente no OneDrive
/me/drive/root:/Notas Workflow/[Caderno]/[Seção]/

// Permissões OAuth necessárias
'Files.ReadWrite'
'offline_access'
```

---

## 10. Busca Inteligente

### Provider Principal: Groq (gratuito)

```typescript
// POST /api/search
async function semanticSearch(query: string, userId: string) {
  // 1. Gera embedding da query
  const queryEmbedding = await groq.embeddings.create({
    model: 'nomic-embed-text-v1',  // gratuito via Groq
    input: query,
  });

  // 2. Busca embeddings do usuário no Redis
  const noteKeys = await redis.smembers(`user:${userId}:notes`);
  const embeddings = await redis.mget(...noteKeys.map(k => `embed:${k}`));

  // 3. Calcula similaridade coseno
  const ranked = embeddings
    .map((emb, i) => ({
      noteId: noteKeys[i],
      score: cosineSimilarity(queryEmbedding.data[0].embedding, JSON.parse(emb))
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return ranked;
}
```

### Fallback: Busca Textual

```typescript
// Quando Groq indisponível ou usuário sem internet
function textSearch(query: string, notes: Note[]) {
  const terms = query.toLowerCase().split(' ');
  return notes
    .filter(n => terms.some(t => 
      n.title.toLowerCase().includes(t) || 
      n.content.toLowerCase().includes(t)
    ))
    .sort((a, b) => /* TF-IDF simples */ 0);
}
```

---

## 11. Estrutura de Pastas do Projeto

```
notasworkflow/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (app)/
│   │   ├── layout.tsx
│   │   ├── page.tsx              ← Dashboard com raias
│   │   ├── note/[id]/
│   │   │   └── page.tsx
│   │   ├── search/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   │   └── route.ts
│   │   ├── notes/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── search/
│   │   │   └── route.ts
│   │   └── embed/
│   │       └── route.ts
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Avatar.tsx
│   ├── board/
│   │   ├── Lane.tsx
│   │   ├── NoteCard.tsx
│   │   └── Board.tsx
│   ├── editor/
│   │   ├── Editor.tsx
│   │   └── Toolbar.tsx
│   ├── search/
│   │   └── SearchBar.tsx
│   └── layout/
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       └── Logo.tsx
├── lib/
│   ├── auth.ts                   ← NextAuth config
│   ├── drive.ts                  ← Google Drive client
│   ├── onedrive.ts               ← OneDrive client
│   ├── search.ts                 ← Busca semântica
│   ├── redis.ts                  ← Upstash client
│   └── tokens.ts                 ← Design tokens
├── hooks/
│   ├── useNotes.ts
│   ├── useSearch.ts
│   └── useStorage.ts
├── types/
│   └── index.ts
├── public/
│   ├── logo.svg
│   └── og-image.png
├── .env.local.example
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 12. Variáveis de Ambiente

```env
# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://notasworkflow.app

# Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Microsoft
AZURE_AD_CLIENT_ID=
AZURE_AD_CLIENT_SECRET=
AZURE_AD_TENANT_ID=common

# Groq (busca IA gratuita)
GROQ_API_KEY=

# Upstash Redis (embeddings cache)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

## 13. Tela de Login — Especificação (MVP)

> **MVP:** Sem validação real — apenas UI funcional com botões de OAuth.

### Layout

```
┌─────────────────────────────────────────┐
│              [Logo SVG]                 │
│           Notas Workflow                │
│    Organize suas ideias em raias        │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  🔵  Entrar com Google         │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  🪟  Entrar com Microsoft      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Ao entrar, você concorda com os        │
│  Termos de Uso e Política de Privacidade│
└─────────────────────────────────────────┘
```

### Comportamento MVP

- Botão Google → `signIn('google')` via NextAuth (sem tela de callback ainda)
- Botão Microsoft → `signIn('azure-ad')` via NextAuth
- Após clique, exibe spinner inline no botão
- Redireciona para `/app` após auth bem-sucedida

---

## 14. Dashboard — Especificação Visual

### Layout Principal

```
┌─ Header ──────────────────────────────────────────────────┐
│ [Logo] Notas Workflow   [SearchBar]        [Avatar] [⚙️]   │
├─ Sidebar ──┬─ Board Area ──────────────────────────────────┤
│            │                                               │
│ 📓 Caderno1│ [Raia: Ideias]  [Raia: Em progresso] [Raia+] │
│  > Seção A │ ┌──────────┐    ┌──────────┐                 │
│  > Seção B │ │ Nota 1   │    │ Nota 3   │                 │
│            │ │ Preview..│    │ Preview..│                 │
│ 📓 Caderno2│ └──────────┘    └──────────┘                 │
│  > Seção C │ ┌──────────┐                                  │
│            │ │ Nota 2   │    [+ Nova nota]                 │
│ [+ Caderno]│ └──────────┘                                  │
└────────────┴───────────────────────────────────────────────┘
```

---

## 15. Cronograma de Desenvolvimento

| Sprint | Duração | Entregas |
|--------|---------|---------|
| 1 | 1 semana | Setup Next.js, design tokens, componentes base (Button, Card, Input) |
| 2 | 1 semana | Tela de Login, autenticação NextAuth Google + Microsoft |
| 3 | 1 semana | Sidebar, estrutura de cadernos/seções no Drive/OneDrive |
| 4 | 1 semana | Board de raias, NoteCard, drag-and-drop (dnd-kit) |
| 5 | 1 semana | Editor TipTap, auto-save, CRUD de notas |
| 6 | 1 semana | Busca semântica (Groq + Redis), SearchPage |
| 7 | 1 semana | Acessibilidade WCAG 2.2, testes Axe/NVDA |
| 8 | 1 semana | Deploy, domínio, CI/CD, testes e2e (Playwright) |

---

## 16. Logo

Arquivo: `public/logo.svg`

Conceito: lápis estilizado (estilo Apple — linhas limpas, monocromático com accent azul `#007AFF`) escrevendo o texto "Notas Workflow" em fonte SF Pro / Inter Bold.

Variantes:
- `logo.svg` — ícone + texto horizontal (header)
- `logo-icon.svg` — apenas ícone (favicon, app icon)
- `logo-dark.svg` — versão para dark mode

---

*Documento gerado em 2026-06-28. Próxima revisão após Sprint 1.*
