# List@ — Requisiti Funzionali

## RF-01 Autenticazione

| ID | Requisito |
|---|---|
| RF-01.1 | L'utente può accedere tramite OAuth Google |
| RF-01.2 | Al primo accesso viene creato automaticamente un profilo utente |
| RF-01.3 | Le pagine dell'app sono accessibili solo a utenti autenticati; chi non è autenticato viene reindirizzato a `/login` |

---

## RF-02 Gestione Profilo

| ID | Requisito |
|---|---|
| RF-02.1 | L'utente può visualizzare il proprio profilo (nome, avatar) |
| RF-02.2 | L'utente può modificare il proprio nome visualizzato |

---

## RF-03 Famiglie

| ID | Requisito |
|---|---|
| RF-03.1 | L'utente può creare una famiglia, diventandone automaticamente owner |
| RF-03.2 | L'owner può invitare altri utenti in una famiglia tramite indirizzo email |
| RF-03.3 | L'utente invitato riceve una notifica/link e può accettare o rifiutare l'invito |
| RF-03.4 | Un utente può appartenere a più famiglie contemporaneamente |
| RF-03.5 | L'owner può rimuovere un membro dalla famiglia |
| RF-03.6 | Un membro può lasciare una famiglia |
| RF-03.7 | L'owner può rinominare la famiglia |

---

## RF-04 Gestione Liste

| ID | Requisito |
|---|---|
| RF-04.1 | L'utente può creare una lista con un nome |
| RF-04.2 | Una lista può essere **privata** (visibile solo al creatore) o **di famiglia** (visibile a tutti i membri della famiglia scelta) |
| RF-04.3 | L'utente può modificare il nome e la visibilità di una lista |
| RF-04.4 | L'utente può eliminare una lista di sua proprietà |
| RF-04.4a | Prima dell'eliminazione della lista, il sistema richiede una conferma esplicita dell'utente |
| RF-04.5 | L'utente può copiare una lista esistente (crea una nuova lista con gli stessi articoli) |
| RF-04.6 | I membri della famiglia possono visualizzare e modificare le liste di famiglia |

---

## RF-05 Gestione Articoli

| ID | Requisito |
|---|---|
| RF-05.1 | L'utente può aggiungere articoli a una lista, specificando: nome (obbligatorio), quantità, unità di misura, note, categoria merceologica |
| RF-05.2 | Se non viene specificata una categoria, il sistema tenta di assegnarla automaticamente in base al nome dell'articolo |
| RF-05.3 | Gli articoli vengono visualizzati raggruppati per categoria, nell'ordine dei reparti del supermercato |
| RF-05.4 | L'utente può modificare un articolo |
| RF-05.5 | L'utente può eliminare un articolo dalla lista |
| RF-05.6 | L'utente può riordinare manualmente gli articoli all'interno di una categoria |

---

## RF-06 Categorie Merceologiche

| ID | Requisito |
|---|---|
| RF-06.1 | Il sistema fornisce un set predefinito di categorie ordinate per reparto (frutta e verdura, pane, carne, pesce, salumi, latticini, surgelati, dispensa, bevande, igiene, pulizia, varie) |
| RF-06.2 | L'utente può sovrascrivere la categoria di un singolo articolo |

---

## RF-07 Modalità Spesa (Sessioni)

| ID | Requisito |
|---|---|
| RF-07.1 | L'utente può avviare una sessione di spesa da qualsiasi lista, specificando il supermercato (opzionale) |
| RF-07.2 | L'avvio di una sessione crea un'**istanza** della lista, taggata con data/ora, utente e supermercato; la lista originale resta immutata |
| RF-07.3 | Durante la sessione, l'utente può spuntare gli articoli acquistati |
| RF-07.4 | La sessione persiste tra un refresh e l'altro (lo stato non viene perso) |
| RF-07.5 | L'utente può riaprire una sessione precedente per continuare la spesa (es. secondo supermercato) |
| RF-07.6 | L'utente può marcare una sessione come completata |
| RF-07.7 | Le sessioni di lista di famiglia sono visibili e utilizzabili da tutti i membri della famiglia |
| RF-07.8 | Più sessioni della stessa lista possono coesistere (sessioni diverse, supermercati diversi) |

---

## RF-08 Storico

| ID | Requisito |
|---|---|
| RF-08.1 | L'utente può consultare lo storico delle sessioni di spesa (data, supermercato, lista di origine) |
| RF-08.2 | L'utente può aprire una sessione passata in modalità sola lettura per vedere cosa è stato acquistato |
