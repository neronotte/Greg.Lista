export type Locale = "en" | "it";

export const translations = {
  en: {
    // Common
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    close: "Close",
    back: "Back",
    loading: "Loading…",
    error: "Error",
    saving: "Saving…",

    // Navigation
    nav: {
      lists: "Lists",
      sessions: "Sessions",
      family: "Family",
    },

    // Home page
    home: {
      title: "My Lists",
      greeting: "Hello, {name} 👋",
      noLists: "No lists yet",
      noListsHint: "Tap + to create your first shopping list",
      familySection: "Family",
      personalSection: "Personal",
      item: "item",
      items: "items",
    },

    // List form
    listForm: {
      createTitle: "New List",
      editTitle: "Edit List",
      nameLabel: "List name",
      namePlaceholder: "e.g. Weekly Groceries",
      nameRequired: "Name is required",
      iconLabel: "Icon",
      visibilityLabel: "Visibility",
      personal: "Personal",
      familyLabel: "Family",
      selectFamily: "Select family…",
      createButton: "Create List",
      saveButton: "Save Changes",
    },

    // List detail
    listDetail: {
      items: "{count} items",
      emptyTitle: "Empty list",
      emptyHint: 'Tap "Add Item" to get started',
      addItem: "Add Item",
      startShopping: "Start Shopping",
      deleteConfirm: "Are you sure you want to delete this list?",
      miscCategory: "Other",
    },

    // Item form
    itemForm: {
      addTitle: "Add Item",
      editTitle: "Edit Item",
      nameLabel: "Item name",
      namePlaceholder: "e.g. Milk",
      categoryLabel: "Category",
      selectCategory: "Auto-detect",
      quantityLabel: "Quantity",
      quantityPlaceholder: "e.g. 2",
      unitLabel: "Unit",
      unitPlaceholder: "e.g. liters",
      notesLabel: "Notes",
      notesPlaceholder: "Additional notes…",
      addButton: "Add Item",
      saveButton: "Save Changes",
      nameRequired: "Name is required",
    },

    // Shopping session
    session: {
      title: "Shopping",
      active: "Active",
      paused: "Paused",
      completed: "Completed",
      completeButton: "Complete Shopping",
      completeMessage: "Complete this session? You can reopen it later from history.",
      completing: "Completing…",
      reopenButton: "Reopen",
      progress: "{checked} of {total}",
      emptyTitle: "No items",
      emptyHint: "This session has no items",
      completedOn: "Shopping completed · {date}",
      startButton: "Start Session",
    },

    // History page
    history: {
      title: "Sessions",
      subtitle: "Your shopping history",
      noSessions: "No sessions yet",
      noSessionsHint: "Start a shopping session from a list",
      activeSection: "Active & Paused",
      completedSection: "Completed",
    },

    // Families page
    families: {
      title: "Family",
      noFamilies: "No families yet",
      noFamiliesSubtitle: "No family yet",
      noFamiliesHint: "Create a family to share lists with others",
      groupCount: "{count} groups",
      groupCountSingle: "1 group",
      admin: "Admin",
      member: "Member",
      createFamily: "Create Family",
      inviteMember: "Invite Member",
    },

    // Family form
    familyForm: {
      createTitle: "Create Family",
      nameLabel: "Family name",
      namePlaceholder: "e.g. Gregori Family",
      createButton: "Create Family",
    },

    // Invite
    invite: {
      title: "Invite Member",
      emailLabel: "Email address",
      emailPlaceholder: "e.g. john@example.com",
      sendButton: "Send Invite",
      pendingInvites: "Pending Invites",
      toReview: "{count} to review",
      acceptButton: "Accept",
      declineButton: "Decline",
      invitedBy: "Invited by {name}",
      noInvites: "No invites",
      noInvitesHint: "When someone invites you to a family, you'll find it here",
      inviteCountSingle: "1 invite",
      inviteCount: "{count} invites",
      pendingFrom: "Pending since",
    },

    // Profile page
    profile: {
      title: "Profile",
      accountSection: "Account",
      displayNameLabel: "Display name",
      displayNamePlaceholder: "Your name",
      familiesSection: "My Families",
      settingsSection: "Settings",
      themeLabel: "Theme",
      languageLabel: "Language",
      manageFamilies: "Manage Families",
      invitations: "Invitations",
      signOut: "Sign Out",
      editName: "Edit name",
    },

    // Theme
    theme: {
      light: "Light",
      dark: "Dark",
      system: "System",
    },

    // Language
    language: {
      en: "English",
      it: "Italiano",
    },

    // Login
    login: {
      title: "List@",
      subtitle: "Your shopping list",
      signInFailed: "Sign in failed. Please try again.",
      continueWithGoogle: "Continue with Google",
    },

    // Visibility labels
    visibility: {
      private: "Personal",
      family: "Family",
    },

    // Confirmations
    confirm: {
      deleteList: "Are you sure you want to delete this list?",
      deleteItem: "Are you sure you want to delete this item?",
      deleteFamily: "Are you sure you want to delete this family?",
      leaveFamily: "Are you sure you want to leave this family?",
      completeSession: "Complete this shopping session?",
    },
  },

  it: {
    // Common
    save: "Salva",
    cancel: "Annulla",
    delete: "Elimina",
    edit: "Modifica",
    create: "Crea",
    close: "Chiudi",
    back: "Indietro",
    loading: "Caricamento…",
    error: "Errore",
    saving: "Salvataggio…",

    // Navigation
    nav: {
      lists: "Liste",
      sessions: "Sessioni",
      family: "Famiglia",
    },

    // Home page
    home: {
      title: "Le Mie Liste",
      greeting: "Ciao, {name} 👋",
      noLists: "Nessuna lista",
      noListsHint: "Tocca + per creare la tua prima lista della spesa",
      familySection: "Famiglia",
      personalSection: "Personali",
      item: "articolo",
      items: "articoli",
    },

    // List form
    listForm: {
      createTitle: "Nuova Lista",
      editTitle: "Modifica Lista",
      nameLabel: "Nome lista",
      namePlaceholder: "es. Spesa settimanale",
      nameRequired: "Il nome è obbligatorio",
      iconLabel: "Icona",
      visibilityLabel: "Visibilità",
      personal: "Personale",
      familyLabel: "Famiglia",
      selectFamily: "Seleziona famiglia…",
      createButton: "Crea Lista",
      saveButton: "Salva Modifiche",
    },

    // List detail
    listDetail: {
      items: "{count} articoli",
      emptyTitle: "Lista vuota",
      emptyHint: 'Tocca "Aggiungi" per iniziare',
      addItem: "Aggiungi",
      startShopping: "Inizia Spesa",
      deleteConfirm: "Sei sicuro di voler eliminare questa lista?",
      miscCategory: "Varie",
    },

    // Item form
    itemForm: {
      addTitle: "Aggiungi Articolo",
      editTitle: "Modifica Articolo",
      nameLabel: "Nome articolo",
      namePlaceholder: "es. Latte",
      categoryLabel: "Categoria",
      selectCategory: "Auto-rileva",
      quantityLabel: "Quantità",
      quantityPlaceholder: "es. 2",
      unitLabel: "Unità",
      unitPlaceholder: "es. litri",
      notesLabel: "Note",
      notesPlaceholder: "Note aggiuntive…",
      addButton: "Aggiungi",
      saveButton: "Salva Modifiche",
      nameRequired: "Il nome è obbligatorio",
    },

    // Shopping session
    session: {
      title: "Spesa",
      active: "Attiva",
      paused: "In Pausa",
      completed: "Completata",
      completeButton: "Completa Spesa",
      completeMessage: "Completare? Potrai riaprirla dallo storico.",
      completing: "Concludo…",
      reopenButton: "Riapri",
      progress: "{checked} di {total}",
      emptyTitle: "Nessun articolo",
      emptyHint: "Questa sessione non ha articoli",
      completedOn: "Spesa completata · {date}",
      startButton: "Inizia Sessione",
    },

    // History page
    history: {
      title: "Sessioni",
      subtitle: "La tua cronologia acquisti",
      noSessions: "Nessuna sessione",
      noSessionsHint: "Inizia una sessione di spesa da una lista",
      activeSection: "Attive e In Pausa",
      completedSection: "Completate",
    },

    // Families page
    families: {
      title: "Famiglia",
      noFamilies: "Nessuna famiglia",
      noFamiliesSubtitle: "Nessuna famiglia",
      noFamiliesHint: "Crea una famiglia per condividere le liste",
      groupCount: "{count} gruppi",
      groupCountSingle: "1 gruppo",
      admin: "Admin",
      member: "Membro",
      createFamily: "Crea Famiglia",
      inviteMember: "Invita Membro",
    },

    // Family form
    familyForm: {
      createTitle: "Crea Famiglia",
      nameLabel: "Nome famiglia",
      namePlaceholder: "es. Famiglia Rossi",
      createButton: "Crea Famiglia",
    },

    // Invite
    invite: {
      title: "Invita Membro",
      emailLabel: "Indirizzo email",
      emailPlaceholder: "es. mario@esempio.com",
      sendButton: "Invia Invito",
      pendingInvites: "Inviti in Attesa",
      toReview: "{count} da rivedere",
      acceptButton: "Accetta",
      declineButton: "Rifiuta",
      invitedBy: "Invitato da {name}",
      noInvites: "Nessun invito",
      noInvitesHint: "Quando qualcuno ti invita in una famiglia, lo troverai qui",
      inviteCountSingle: "1 invito",
      inviteCount: "{count} inviti",
      pendingFrom: "In attesa dal",
    },

    // Profile page
    profile: {
      title: "Profilo",
      accountSection: "Account",
      displayNameLabel: "Nome visualizzato",
      displayNamePlaceholder: "Il tuo nome",
      familiesSection: "Le Mie Famiglie",
      settingsSection: "Impostazioni",
      themeLabel: "Tema",
      languageLabel: "Lingua",
      manageFamilies: "Gestisci Famiglie",
      invitations: "Inviti",
      signOut: "Esci",
      editName: "Modifica nome",
    },

    // Theme
    theme: {
      light: "Chiaro",
      dark: "Scuro",
      system: "Sistema",
    },

    // Language
    language: {
      en: "English",
      it: "Italiano",
    },

    // Login
    login: {
      title: "List@",
      subtitle: "La tua lista della spesa",
      signInFailed: "Accesso fallito. Riprova.",
      continueWithGoogle: "Continua con Google",
    },

    // Visibility labels
    visibility: {
      private: "Personale",
      family: "Famiglia",
    },

    // Confirmations
    confirm: {
      deleteList: "Sei sicuro di voler eliminare questa lista?",
      deleteItem: "Sei sicuro di voler eliminare questo articolo?",
      deleteFamily: "Sei sicuro di voler eliminare questa famiglia?",
      leaveFamily: "Sei sicuro di voler lasciare questa famiglia?",
      completeSession: "Completare questa sessione di spesa?",
    },
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

// Helper to interpolate variables in strings
export function t(
  translations: typeof import("./translations").translations.en,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const keys = key.split(".");
  let value: unknown = translations;

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key; // Return key if not found
    }
  }

  if (typeof value !== "string") return key;

  if (!vars) return value;

  return value.replace(/\{(\w+)\}/g, (_, name) =>
    vars[name] !== undefined ? String(vars[name]) : `{${name}}`,
  );
}
