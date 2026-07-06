# List@ — Requisiti Tecnici (Non Funzionali)

## RT-01 Piattaforma e Deploy

| ID      | Requisito                                                            |
| ------- | -------------------------------------------------------------------- |
| RT-01.1 | L'applicazione è deployata su **Vercel** (piano free)                |
| RT-01.2 | Il codice sorgente è ospitato su **GitHub** (`neronotte/Greg.Lista`) |
| RT-01.3 | Il deploy avviene automaticamente ad ogni push su `main`             |
| RT-01.4 | La root directory del progetto Next.js su Vercel è `/src`            |

---

## RT-02 Stack Tecnologico

| ID      | Requisito                                                                |
| ------- | ------------------------------------------------------------------------ |
| RT-02.1 | Framework: **Next.js 16** con App Router                                 |
| RT-02.2 | Linguaggio: **TypeScript** (strict mode)                                 |
| RT-02.3 | Stile: **Tailwind CSS v4**                                               |
| RT-02.4 | Database e Auth: **Supabase** (piano free: 500 MB DB, 50k MAU)           |
| RT-02.5 | Client Supabase: `@supabase/ssr` per compatibilità con Server Components |

---

## RT-03 Autenticazione e Sicurezza

| ID      | Requisito                                                                                                            |
| ------- | -------------------------------------------------------------------------------------------------------------------- |
| RT-03.1 | Autenticazione tramite **Supabase Auth** con provider OAuth Google                                                   |
| RT-03.2 | Le regole di visibilità (private / family) sono applicate a livello di database tramite **Row Level Security (RLS)** |
| RT-03.3 | Le variabili d'ambiente sensibili (`SUPABASE_SERVICE_ROLE_KEY`) non sono mai esposte al browser                      |
| RT-03.4 | La sessione utente viene aggiornata a ogni request tramite il proxy Next.js                                          |
| RT-03.5 | Tutte le route (eccetto `/login` e `/auth/callback`) richiedono autenticazione                                       |

---

## RT-04 UI e Accessibilità

| ID      | Requisito                                                                                                                                                        |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RT-04.1 | L'interfaccia è **mobile-first**: il layout primario è ottimizzato per smartphone (uso in supermercato)                                                          |
| RT-04.2 | L'app deve essere utilizzabile con una sola mano su telefono (target touch area ≥ 44×44 px)                                                                      |
| RT-04.3 | L'interfaccia deve essere funzionale anche su desktop (responsive)                                                                                               |
| RT-04.4 | Nella schermata di sessione spesa, l'azione principale di completamento è esposta nell'AppBar come icona dedicata, distinta visivamente dalle azioni distruttive |
| RT-04.5 | Le azioni irreversibili o semanticamente critiche (es. conclusione sessione) richiedono una conferma tramite modale coerente con il design system                |

---

## RT-05 Performance

| ID      | Requisito                                                                                           |
| ------- | --------------------------------------------------------------------------------------------------- |
| RT-05.1 | Le pagine principali devono caricarsi in meno di 2 secondi su connessione mobile 4G                 |
| RT-05.2 | Lo stato di una sessione di spesa è persisto nel database; nessun dato critico vive solo in memoria |

---

## RT-06 Struttura del Repository

| ID      | Requisito                                                                                                            |
| ------- | -------------------------------------------------------------------------------------------------------------------- |
| RT-06.1 | La root del repository è riservata alla documentazione (CLAUDE.md, README.md, `/docs`)                               |
| RT-06.2 | Il progetto Next.js risiede in `/src`                                                                                |
| RT-06.3 | Le migration SQL risiedono in `/src/supabase/migrations/` e sono versionate in ordine numerico (`001_`, `002_`, ...) |
| RT-06.4 | Le credenziali non vengono mai committate; il file `.env.local` è nel `.gitignore`                                   |
| RT-06.5 | Il file `.env.local.example` documenta le variabili d'ambiente necessarie                                            |
