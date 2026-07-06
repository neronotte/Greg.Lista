# List@ — Design System

Ispirazione: WhatsApp. Mobile-first (phone → tablet → desktop).

---

## 1. Principi di design

| Principio        | Applicazione                                                                                 |
| ---------------- | -------------------------------------------------------------------------------------------- |
| **Mobile-first** | Progettato per il telefono in mano al supermercato; tablet e desktop sono layout ampliati    |
| **Immediato**    | Ogni azione chiave (spuntare un item) deve essere raggiungibile con un pollice, senza scroll |
| **Familiare**    | Il vocabolario visivo di WhatsApp abbassa la curva di apprendimento                          |
| **Leggibile**    | Contrasto elevato, font grande, densità bassa — lista della spesa = corsia illuminata        |
| **Persistente**  | Lo stato sopravvive al refresh; nessuna perdita di dati visibile                             |

### Navigazione e caricamento dati

- La navigazione tra route deve essere immediata: l'utente vede subito la pagina di atterraggio.
- Stack routing: usare Next.js App Router (`next/link`, `loading.tsx`); non introdurre `react-router`.
- Il caricamento dati deve mostrare skeleton contestuali alla pagina, evitando schermate vuote bloccanti.
- Quando i dati sono pronti, lo skeleton viene sostituito dal contenuto reale senza salti di layout.

---

## 2. Palette colori

### Colori primari

| Token          | Hex       | Uso                                         |
| -------------- | --------- | ------------------------------------------- |
| `brand-dark`   | `#075E54` | AppBar, header pagine principali            |
| `brand-mid`    | `#128C7E` | Bordi attivi, icone selezionate, testo link |
| `brand-bright` | `#25D366` | FAB, badge online, stato completato         |
| `brand-accent` | `#34B7F1` | Tick letti, link secondari, highlight       |

### Superficie e sfondo

| Token        | Hex       | Uso                                               |
| ------------ | --------- | ------------------------------------------------- |
| `bg-app`     | `#ECE5DD` | Sfondo globale (il "carta da parati" di WhatsApp) |
| `bg-surface` | `#FFFFFF` | Card, item non spuntati, form input               |
| `bg-checked` | `#DCF8C6` | Item spuntato (bolla verde WhatsApp)              |
| `bg-header`  | `#F0F2F5` | Header sezioni, category divider                  |

### Testo

| Token            | Hex       | Uso                                           |
| ---------------- | --------- | --------------------------------------------- |
| `text-primary`   | `#111B21` | Titoli, nomi item, testo principale           |
| `text-secondary` | `#667781` | Sottotitoli, timestamp, quantità, note        |
| `text-disabled`  | `#AEBAC1` | Placeholder, azioni non disponibili           |
| `text-on-brand`  | `#FFFFFF` | Testo su sfondo `brand-dark` o `brand-bright` |

### Semantici

| Token              | Hex       | Uso                                         |
| ------------------ | --------- | ------------------------------------------- |
| `semantic-error`   | `#FF3B30` | Errori, swipe-to-delete, avvisi distruttivi |
| `semantic-warning` | `#FF9500` | Avvisi non distruttivi                      |
| `semantic-success` | `#25D366` | Operazione completata (= `brand-bright`)    |
| `semantic-info`    | `#34B7F1` | Informazioni (= `brand-accent`)             |

### Divider e bordi

| Token            | Hex       | Uso                          |
| ---------------- | --------- | ---------------------------- |
| `border-default` | `#E9EDEF` | Separatori lista, bordi card |
| `border-strong`  | `#AEBAC1` | Input attivi, outline modale |

---

## 3. Tipografia

Font: **Inter** (Google Fonts) come fallback system — `-apple-system, 'Inter', 'Helvetica Neue', Arial, sans-serif`

> WhatsApp usa font di sistema. Inter è l'equivalente web: neutro, leggibile, denso di informazioni senza affaticare.

### Scale

| Nome       | Size | Weight | Line-height | Uso                                    |
| ---------- | ---- | ------ | ----------- | -------------------------------------- |
| `display`  | 24px | 700    | 1.2         | Titolo app nella AppBar                |
| `title-lg` | 20px | 600    | 1.3         | Titolo pagina, nome lista              |
| `title-md` | 17px | 600    | 1.4         | Nome item, header sezione              |
| `body`     | 16px | 400    | 1.5         | Testo principale, descrizioni          |
| `body-sm`  | 14px | 400    | 1.5         | Sottotitoli, note item                 |
| `caption`  | 12px | 400    | 1.4         | Timestamp, categorie chip, badge       |
| `micro`    | 11px | 500    | 1.2         | Tick di stato, etichette molto piccole |

### Regole tipografiche

- **Item spuntato**: `body` con `text-decoration: line-through` + `text-secondary`
- **Category header**: `caption` uppercase, `text-secondary`, letter-spacing `0.08em`
- **Quantità**: `body-sm` in `text-secondary`, affiancata al nome item

---

## 4. Spaziatura

Base unit: **4px**

| Token      | px  | Uso tipico                                 |
| ---------- | --- | ------------------------------------------ |
| `space-1`  | 4   | Gap interno micro (icona ↔ testo)          |
| `space-2`  | 8   | Padding chip, gap tra elementi inline      |
| `space-3`  | 12  | Padding verticale item lista               |
| `space-4`  | 16  | Padding orizzontale standard, gap tra card |
| `space-5`  | 20  | Padding pagina laterale su phone           |
| `space-6`  | 24  | Spaziatura sezioni                         |
| `space-8`  | 32  | Gap tra blocchi principali                 |
| `space-12` | 48  | Margine bottom nav (clearance)             |

---

## 5. Border radius

| Token         | px   | Uso                                 |
| ------------- | ---- | ----------------------------------- |
| `radius-sm`   | 4    | Badge, chip categoria               |
| `radius-md`   | 8    | Input, bottoni secondari            |
| `radius-lg`   | 12   | Card lista, modale                  |
| `radius-xl`   | 18   | Item spuntato (bolla), bottom sheet |
| `radius-full` | 9999 | FAB, avatar, pill                   |

---

## 6. Ombre ed elevazione

Sistema a 3 livelli, ispirato a Material ma più sottile.

| Livello      | CSS                               | Uso                               |
| ------------ | --------------------------------- | --------------------------------- |
| `shadow-sm`  | `0 1px 2px rgba(0,0,0,0.08)`      | Card lista a riposo               |
| `shadow-md`  | `0 2px 8px rgba(0,0,0,0.12)`      | AppBar, card in hover/focus       |
| `shadow-lg`  | `0 8px 24px rgba(0,0,0,0.18)`     | Bottom sheet, modale, FAB         |
| `shadow-fab` | `0 4px 12px rgba(37,211,102,0.4)` | FAB (ombra colorata brand-bright) |

---

## 7. Iconografia

Libreria: **Lucide React** (`lucide-react`) — tratto sottile 1.5px, stile outline coerente con WhatsApp.

### Icone chiave

| Icona Lucide          | Uso                                                   |
| --------------------- | ----------------------------------------------------- |
| `ShoppingCart`        | Avvia sessione spesa                                  |
| `Check`, `CheckCheck` | Item spuntato / tutti spuntati (come i tick WhatsApp) |
| `Plus`                | FAB crea lista / aggiunge item                        |
| `Search`              | Barra di ricerca                                      |
| `MoreVertical`        | Menu contestuale (3 puntini verticali)                |
| `ChevronRight`        | Navigazione nested                                    |
| `Trash2`              | Elimina (swipe action)                                |
| `Copy`                | Duplica lista                                         |
| `Users`               | Lista famiglia                                        |
| `Lock`                | Lista privata                                         |
| `Store`               | Supermercato in sessione spesa                        |
| `ArrowLeft`           | Back navigation                                       |
| `Bell`                | Notifiche                                             |
| `User`                | Profilo / avatar placeholder                          |

Dimensioni standard: **24px** (azioni), **20px** (inline nel testo), **16px** (chip/badge).

---

## 8. Motion & animazioni

Stile: rapido, utilitaristico. Nessuna animazione decorativa.

| Tipo     | Durata    | Easing                           | Uso                                            |
| -------- | --------- | -------------------------------- | ---------------------------------------------- |
| Micro    | 120ms     | `ease-out`                       | Tap feedback, checkbox tick                    |
| Standard | 200ms     | `ease-in-out`                    | Slide in/out item, stato hover                 |
| Entrante | 280ms     | `cubic-bezier(0.34,1.56,0.64,1)` | FAB pop-in, bottom sheet open (spring leggero) |
| Uscente  | 200ms     | `ease-in`                        | Dismissione modale, swipe-delete               |
| Skeleton | 1.2s loop | `ease-in-out`                    | Loading placeholder (shimmer)                  |

**Regola**: nessuna animazione > 300ms. Su `prefers-reduced-motion: reduce` → tutte a 0ms.

---

## 9. Layout responsive

### Breakpoint

| Nome        | min-width | Dispositivo target               |
| ----------- | --------- | -------------------------------- |
| `xs` (base) | 0         | Phone portrait                   |
| `sm`        | 480px     | Phone landscape / piccolo        |
| `md`        | 768px     | Tablet portrait                  |
| `lg`        | 1024px    | Tablet landscape / desktop small |
| `xl`        | 1280px    | Desktop                          |

### Struttura per breakpoint

#### Phone (`xs`–`sm`) — layout primario

```
┌─────────────────────┐
│  AppBar             │  h-14, bg-brand-dark, sticky top
├─────────────────────┤
│                     │
│  Page Content       │  flex-1, overflow-y-auto
│  (scrollabile)      │
│                     │
├─────────────────────┤
│  Bottom Nav         │  h-16, bg-surface, sticky bottom
└─────────────────────┘
```

- Larghezza max contenuto: 100%
- Padding laterale: `space-4` (16px)
- FAB: posizione fixed bottom-right, `mb-20` (sopra bottom nav)

#### Tablet (`md`) — layout a due colonne opzionale

```
┌─────────────────────────────────────────┐
│  AppBar                                 │
├──────────────┬──────────────────────────┤
│              │                          │
│  Sidebar     │  Detail Panel            │
│  Liste       │  (lista selezionata)     │
│  240px       │  flex-1                  │
│              │                          │
└──────────────┴──────────────────────────┘
```

- Bottom Nav sostituito da sidebar left (stile WhatsApp Web)
- Nessun FAB — azione "nuova lista" nel header sidebar

#### Desktop (`lg`+) — layout tre colonne

```
┌────────────────────────────────────────────────────┐
│  AppBar                                            │
├──────────┬──────────────────┬──────────────────────┤
│          │                  │                      │
│ Sidebar  │  Lista items     │  Detail / Shopping   │
│ Liste    │                  │  Session             │
│ 280px    │  380px           │  flex-1              │
│          │                  │                      │
└──────────┴──────────────────┴──────────────────────┘
```

- Contenuto centrato, max-width: 1440px
- Tre pannelli sempre visibili

---

## 10. Componenti

### 10.1 AppBar

```
┌─────────────────────────────────────────┐
│ ←  Nome Lista / Titolo Pagina    ⋮  🔍  │
└─────────────────────────────────────────┘
```

- Sfondo: `brand-dark` (#075E54)
- Testo: `text-on-brand`, `title-lg`
- Altezza: 56px (h-14)
- Sticky top, `shadow-md`
- Back arrow (`ArrowLeft`) solo su view nested
- Icone destra: max 2, spazio 40×40px tap target
- Variante **shopping mode**: sfondo `brand-bright` (#25D366) per segnalare lo stato attivo

---

### 10.2 Bottom Navigation (phone)

```
┌──────────┬──────────┬──────────┐
│  Liste   │  Spesa   │ Profilo  │
│  (icon)  │  (icon)  │  (icon)  │
└──────────┴──────────┴──────────┘
```

- Sfondo: `bg-surface`, `shadow-md` (ombra verso l'alto: `0 -1px 4px rgba(0,0,0,0.1)`)
- Altezza: 64px (h-16)
- 3 tab: **Liste**, **In Spesa** (sessioni attive), **Profilo**
- Tab attivo: icona + label `brand-mid`, indicatore dot `brand-bright` sopra l'icona
- Tab inattivo: icona `text-disabled`, nessuna label
- Tap target: 44×44px minimo
- Se esistono inviti pendenti, la tab Profilo mostra un badge numerico rosso

---

### 10.3 FAB (Floating Action Button)

- Dimensione: 56×56px, `radius-full`
- Sfondo: `brand-bright` (#25D366)
- Icona: `Plus`, bianca, 24px
- Posizione: fixed `bottom-20 right-4` (sopra bottom nav)
- Ombra: `shadow-fab`
- Animazione tap: scale 0.92 → 1 in 120ms
- **Esteso** (tablet+): pill con label es. "Nuova lista" — larghezza auto, padding `space-4`

---

### 10.4 List Card (anteprima lista)

```
┌─────────────────────────────────────────┐
│ [🔒/👥]  Nome Lista           3 items  │
│          Ultima modifica: ieri      ›   │
└─────────────────────────────────────────┘
```

- Sfondo: `bg-surface`
- Bordo bottom: 1px `border-default`
- Padding: `space-3` verticale, `space-4` orizzontale
- Icona visibilità (Lock / Users): 20px, `text-secondary`
- Titolo: `title-md`, `text-primary`
- Metadati (data, conteggio): `body-sm`, `text-secondary`
- Chevron: `text-disabled`
- Swipe left → azione **Elimina** (sfondo `semantic-error`, icona `Trash2`)
- Swipe right → azione **Copia** (sfondo `brand-mid`, icona `Copy`)
- Tap → naviga al dettaglio

---

### 10.5 Item Lista

**Stato normale:**

```
┌─────────────────────────────────────────┐
│ ○  Parmigiano Reggiano    500g    › ⋮   │
│    Salumi e formaggi                    │
└─────────────────────────────────────────┘

### 10.6 Confirm Dialog (azioni distruttive)

```

┌─────────────────────────────────────────┐
│ Elimina lista │
│ Vuoi davvero eliminare questa lista?... │
│ │
│ [Annulla] [Elimina] │
└─────────────────────────────────────────┘

```

- Uso: conferma esplicita per azioni distruttive (es. eliminazione lista)
- Overlay: `bg-[rgba(17,27,33,0.5)]`
- Container: `bg-surface`, `radius-lg`, `shadow-lg`, bordo `border-default`
- Pulsante secondario: bordo `brand-mid`, testo `brand-mid`
- Pulsante distruttivo: sfondo `semantic-error`, testo `text-on-brand`
- Stati: `pending` blocca chiusura da overlay e disabilita azioni
```

**Stato spuntato (shopping mode):**

```
┌─────────────────────────────────────────┐
│ ✓  ~~Parmigiano Reggiano~~  500g        │  bg-checked
└─────────────────────────────────────────┘
```

Specifiche:

- Altezza minima: 60px
- Checkbox: cerchio 24×24px, bordo `border-strong`; se spuntato: sfondo `brand-mid`, tick bianco (`Check` 16px)
- Nome item: `body`, `text-primary` → se spuntato: `line-through text-secondary`
- Quantità + unità: `body-sm`, `text-secondary`, allineato a destra del nome
- Categoria: `caption`, `text-disabled`, riga sotto il nome (solo in view lista, non in shopping mode)
- Menu contestuale: `MoreVertical` 20px, `text-secondary` — appare solo su hover/long-press
- Shopping mode: tap ovunque sulla riga → toggle spuntato; no chevron
- Animazione spunta: checkbox scala 0→1 con spring 280ms; sfondo riga transisce a `bg-checked` in 200ms

---

### 10.6 Category Header (divider)

```
─────────── FRUTTA E VERDURA ─────────────
```

- Sfondo: `bg-header`
- Testo: `caption` uppercase, `text-secondary`, letter-spacing 0.08em
- Padding: `space-2` verticale, `space-4` orizzontale
- Sticky durante lo scroll della lista
- Nessun bordo — il contrasto di sfondo è sufficiente

---

### 10.7 Search Bar

```
┌─────────────────────────────────────────┐
│ 🔍  Cerca nella lista...                │
└─────────────────────────────────────────┘
```

- Sfondo: `bg-header` (#F0F2F5)
- Radius: `radius-full`
- Padding: `space-2` verticale, `space-4` orizzontale
- Icona: `Search` 18px, `text-secondary`
- Font: `body`, placeholder `text-disabled`
- Appare sotto l'AppBar (non dentro), si può nascondere con scroll up

---

### 10.8 Input Field

Stile **outlined**, ispirato ai form WhatsApp Business:

```
┌─────────────────────────────────────────┐
│  Nome lista                             │
│                          ______________ │
└─────────────────────────────────────────┘
  Label: caption, text-secondary
  Underline: 1px border-default → 2px brand-mid (focus)
```

Specifiche:

- Label: `caption`, `text-secondary`, sale sopra con animazione su focus (label float)
- Testo inserito: `body`, `text-primary`
- Bordo: solo bottom, 1px `border-default`; focus: 2px `brand-mid`
- Errore: bordo `semantic-error`, label `semantic-error`, messaggio di errore `caption` sotto
- Altezza: 48px
- **Variante textarea**: stessa logica, auto-resize, max 4 righe

---

### 10.9 Bottom Sheet (modale)

Usato per: aggiunta item, modifica item, selezione supermercato, conferme.

```
┌─────────────────────────────────────────┐
│         ──── (drag handle)              │
│                                         │
│  Titolo azione                          │
│                                         │
│  [contenuto]                            │
│                                         │
│  [CTA primaria]                         │
│  [Annulla]                              │
└─────────────────────────────────────────┘
```

- Radius top: `radius-xl` (18px)
- Sfondo: `bg-surface`
- Ombra: `shadow-lg`
- Drag handle: 32×4px, `bg-border-default`, centrato, `radius-full`
- Overlay: `rgba(17,27,33,0.5)` (colore `text-primary` con opacità)
- Animazione: slide-up 280ms spring
- Altezza: auto, max 90vh con scroll interno
- Su tablet/desktop: si trasforma in dialog centrato (max-width 480px)

---

### 10.10 Bottoni

#### Primary

- Sfondo: `brand-bright` (#25D366)
- Testo: `text-on-brand`, `body` 600
- Radius: `radius-md`
- Padding: 14px verticale, `space-6` orizzontale
- Width: full su phone; auto su tablet+
- Ombra: `shadow-sm`
- Pressed: sfondo `brand-mid`, scale 0.97

#### Secondary (ghost)

- Sfondo: trasparente
- Bordo: 1.5px `brand-mid`
- Testo: `brand-mid`, `body` 600
- Stessi sizing del primary

#### Destructive

- Sfondo: `semantic-error`
- Testo: bianco
- Uso: conferme eliminazione

#### Text / Link

- Sfondo: nessuno
- Testo: `brand-mid`, `body`
- Uso: "Annulla" nei bottom sheet, azioni secondarie

---

### 10.11 Badge / Chip

**Chip categoria:**

```
[ Frutta e verdura ]
```

- Sfondo: `bg-header`, bordo 1px `border-default`
- Testo: `caption`, `text-secondary`
- Radius: `radius-sm`
- Padding: `space-1` verticale, `space-2` orizzontale

**Badge contatore:**

- Sfondo: `semantic-error` (non letti) o `brand-bright` (completati)
- Testo: `micro`, `text-on-brand`
- Dimensione minima: 20×20px, `radius-full`

### 10.14 Pagina Inviti In Attesa

- Accesso: da Profilo tramite riga dedicata "Inviti in attesa"
- Contenuto: elenco degli inviti pendenti con nome famiglia, data e navigazione al dettaglio invito
- Stato vuoto: empty state dedicato, con messaggio che spiega dove appariranno i nuovi inviti

---

### 10.12 Avatar

- Forma: cerchio, `radius-full`
- Dimensioni: 40px (lista), 32px (item inline), 56px (profilo)
- Fallback: iniziali su sfondo colorato deterministico (hash dell'email → 1 dei 6 colori brand)
- Colori fallback: `brand-dark`, `brand-mid`, `#6B4C9A`, `#D97706`, `#DC2626`, `#0891B2`

---

### 10.13 Shopping Session Header

Elemento speciale — in cima alla view di spesa, mostra il contesto della sessione.

```
┌─────────────────────────────────────────┐
│ 🛒  Carrefour Milano   •  06 lug 2026   │
│     12 items rimanenti  ████░░░░  5/12  │
└─────────────────────────────────────────┘
```

- Sfondo: `brand-dark`
- Testo: `text-on-brand`
- Progress bar: `brand-bright`, sfondo `rgba(255,255,255,0.2)`
- Altezza: 72px

---

### 10.14 Empty State

Appare quando una lista è vuota o nessuna lista esiste.

```
        🛒
   Nessun item
   Aggiungi il primo prodotto
   [ + Aggiungi item ]
```

- Icona: 64px, `text-disabled`
- Titolo: `title-md`, `text-secondary`
- Sottotitolo: `body-sm`, `text-disabled`
- CTA: bottone secondary
- Posizione: centrato verticalmente nel contenuto disponibile

---

### 10.15 Toast / Snackbar

- Sfondo: `text-primary` (#111B21) — quasi nero, come WhatsApp
- Testo: `text-on-brand`, `body-sm`
- Radius: `radius-md`
- Posizione: bottom center, sopra il bottom nav (`mb-20`)
- Durata: 3s auto-dismiss
- Azione opzionale: testo `brand-bright` ("Annulla", "Riapri")
- Animazione: slide-up 200ms, fade-out 200ms

---

## 11. Pattern di interazione

### Swipe actions (solo phone)

| Direzione                 | Azione           | Colore           | Icona    |
| ------------------------- | ---------------- | ---------------- | -------- |
| ← su List Card            | Elimina          | `semantic-error` | `Trash2` |
| → su List Card            | Copia lista      | `brand-mid`      | `Copy`   |
| ← su Item                 | Elimina item     | `semantic-error` | `Trash2` |
| → su Item (shopping mode) | Spunta/de-spunta | `brand-bright`   | `Check`  |

Soglia attivazione: 80px. Azione completa a 160px (oltre metà larghezza).

### Long press

- Su List Card: apre bottom sheet con azioni rapide (Rinomina, Copia, Condividi, Elimina)
- Su Item: apre bottom sheet modifica item
- Feedback: vibrazione haptica 10ms + scala card 0.98

### Pull to refresh

- Indicatore: spinner `brand-mid`, appare a 60px di pull
- Soglia attivazione: 80px
- Solo nella lista delle liste e nella shopping session

---

## 12. Schermata per schermata

### Login

- Sfondo: `brand-dark`
- Logo "List@" centrato, grande, bianco
- Sottotitolo: "La tua lista della spesa", `body`, `rgba(255,255,255,0.7)`
- Bottone Google OAuth: bianco, testo `text-primary`, logo Google, full-width
- Nessun bottom nav, nessun AppBar

### Home — Le mie liste

- AppBar: "List@", icone Search + More
- Search bar collassabile sotto AppBar
- Lista di List Card, raggruppate per visibilità (Le mie / Famiglia)
- Sezione header stile category divider
- FAB: crea nuova lista

### Dettaglio lista

- AppBar: nome lista + icona visibilità, icone Edit + More + ShoppingCart (avvia spesa)
- Items raggruppati per categoria (category header sticky)
- FAB: aggiungi item
- Bottone prominente "Avvia Spesa" se nessuna sessione attiva — anchored bottom, sopra nav

### Shopping Session

- AppBar variante verde: nome supermercato + data
- Session header con progress bar
- Items: due sezioni — "Da prendere" / "Nel carrello"
- Nessun FAB (non si aggiungono items durante la spesa — si può abilitare da settings)
- Bottone "Concludi spesa" anchored bottom

### Profilo

- AppBar: "Profilo"
- Avatar grande (80px) + nome + email
- Sezioni: Famiglia, Impostazioni, Esci

---

## 13. Dark Mode

Supportato tramite `prefers-color-scheme: dark` + toggle manuale.

| Token Light              | Token Dark                          |
| ------------------------ | ----------------------------------- |
| `bg-app` #ECE5DD         | `#0D1418`                           |
| `bg-surface` #FFFFFF     | `#1F2C34`                           |
| `bg-header` #F0F2F5      | `#182229`                           |
| `bg-checked` #DCF8C6     | `#0D3B26`                           |
| `text-primary` #111B21   | `#E9EDEF`                           |
| `text-secondary` #667781 | `#8696A0`                           |
| `border-default` #E9EDEF | `#2A3942`                           |
| `brand-dark` #075E54     | `#00A884` (lightened per contrasto) |

AppBar in dark mode: `#1F2C34` (non il verde scuro).

---

## 14. Accessibilità

- Contrasto minimo testo/sfondo: **4.5:1** (WCAG AA)
- Contrasto `brand-bright` su bianco: ~3.1:1 — usare solo per elementi grafici, non per testo body
- Tap target minimo: **44×44px** su tutti gli elementi interattivi
- Focus visible: outline 2px `brand-mid`, offset 2px (per keyboard navigation su desktop)
- `aria-label` obbligatorio su icone senza testo visibile
- `role="status"` sui toast
- `aria-checked` sugli item checkbox della shopping session

---

## 15. Variabili CSS (Tailwind v4)

```css
@theme {
  /* Brand */
  --color-brand-dark: #075e54;
  --color-brand-mid: #128c7e;
  --color-brand-bright: #25d366;
  --color-brand-accent: #34b7f1;

  /* Background */
  --color-bg-app: #ece5dd;
  --color-bg-surface: #ffffff;
  --color-bg-checked: #dcf8c6;
  --color-bg-header: #f0f2f5;

  /* Text */
  --color-text-primary: #111b21;
  --color-text-secondary: #667781;
  --color-text-disabled: #aebac1;

  /* Semantic */
  --color-error: #ff3b30;
  --color-warning: #ff9500;

  /* Border */
  --color-border: #e9edef;
  --color-border-strong: #aebac1;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 18px;

  /* Font */
  --font-sans: "Inter", -apple-system, "Helvetica Neue", Arial, sans-serif;
}
```
