import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ShoppingCart, List, Users, User, Plus, ChevronLeft, Check,
  Pause, Play, Trash2, Edit2, X, UserPlus, Lock, Globe,
  CheckCheck, Crown, ChevronDown, MoreHorizontal,
} from "lucide-react";

// ── TYPES ────────────────────────────────────────────────────────────────────

type Category =
  | "Produce" | "Dairy" | "Bakery" | "Meat & Fish"
  | "Beverages" | "Household" | "Personal Care" | "Other";

interface Item {
  id: string;
  name: string;
  category: Category;
  qty: number;
  unit: string;
  note?: string;
}

interface ShoppingList {
  id: string;
  name: string;
  emoji: string;
  isFamily: boolean;
  items: Item[];
  color: string;
}

interface Session {
  id: string;
  listId: string;
  listName: string;
  listEmoji: string;
  isFamily: boolean;
  status: "active" | "paused" | "completed";
  startedAt: string;
  shop?: string;
  bought: string[];
}

interface Member {
  id: string;
  name: string;
  initials: string;
  color: string;
  role: "admin" | "member";
}

interface Family {
  id: string;
  name: string;
  members: Member[];
}

type Tab = "lists" | "sessions" | "family" | "profile";

type AppScreen =
  | { type: "lists" }
  | { type: "list-detail"; listId: string }
  | { type: "session"; sessionId: string };

// ── CONSTANTS ─────────────────────────────────────────────────────────────────

const CAT_META: Record<Category, { emoji: string; bg: string; fg: string; border: string }> = {
  "Produce":       { emoji: "🥦", bg: "bg-emerald-50",  fg: "text-emerald-700", border: "border-emerald-100" },
  "Dairy":         { emoji: "🥛", bg: "bg-sky-50",       fg: "text-sky-700",     border: "border-sky-100" },
  "Bakery":        { emoji: "🍞", bg: "bg-amber-50",     fg: "text-amber-700",   border: "border-amber-100" },
  "Meat & Fish":   { emoji: "🥩", bg: "bg-red-50",       fg: "text-red-700",     border: "border-red-100" },
  "Beverages":     { emoji: "☕", bg: "bg-orange-50",    fg: "text-orange-700",  border: "border-orange-100" },
  "Household":     { emoji: "🧹", bg: "bg-slate-50",     fg: "text-slate-600",   border: "border-slate-100" },
  "Personal Care": { emoji: "🧴", bg: "bg-violet-50",    fg: "text-violet-700",  border: "border-violet-100" },
  "Other":         { emoji: "📦", bg: "bg-stone-50",     fg: "text-stone-600",   border: "border-stone-100" },
};

const CATS = Object.keys(CAT_META) as Category[];
const UNITS = ["pcs", "g", "kg", "L", "mL", "bag", "box", "pack", "bottle", "can", "jar", "loaf", "bunch", "bar"];
const LIST_COLORS = ["#3D7A56", "#E07A5F", "#4A90A4", "#9B7BC8", "#E6A020", "#C45C8A"];
const EMOJIS = ["🛒", "🍎", "🔥", "🎉", "🏠", "🌿", "🥗", "🍕", "🛍️", "💊", "🎁", "🧴"];

const genId = () => Math.random().toString(36).slice(2, 9);

// ── INITIAL DATA ──────────────────────────────────────────────────────────────

const initFamily: Family = {
  id: "f1",
  name: "The Anderson Family",
  members: [
    { id: "m1", name: "Sarah Anderson", initials: "SA", color: "#3D7A56", role: "admin" },
    { id: "m2", name: "Tom Anderson",   initials: "TA", color: "#4A90A4", role: "member" },
    { id: "m3", name: "Lily Anderson",  initials: "LA", color: "#E07A5F", role: "member" },
  ],
};

const initLists: ShoppingList[] = [
  {
    id: "l1", name: "Weekly Groceries", emoji: "🛒", isFamily: true, color: "#3D7A56",
    items: [
      { id: "i1",  name: "Apples",          category: "Produce",     qty: 6,   unit: "pcs" },
      { id: "i2",  name: "Baby Spinach",     category: "Produce",     qty: 1,   unit: "bag" },
      { id: "i3",  name: "Cherry Tomatoes",  category: "Produce",     qty: 1,   unit: "punnet" },
      { id: "i4",  name: "Whole Milk",       category: "Dairy",       qty: 2,   unit: "L" },
      { id: "i5",  name: "Greek Yogurt",     category: "Dairy",       qty: 500, unit: "g" },
      { id: "i6",  name: "Cheddar Cheese",   category: "Dairy",       qty: 200, unit: "g" },
      { id: "i7",  name: "Sourdough Bread",  category: "Bakery",      qty: 1,   unit: "loaf" },
      { id: "i8",  name: "Croissants",       category: "Bakery",      qty: 4,   unit: "pcs", note: "butter ones" },
      { id: "i9",  name: "Chicken Breast",   category: "Meat & Fish", qty: 500, unit: "g" },
      { id: "i10", name: "Salmon Fillet",    category: "Meat & Fish", qty: 2,   unit: "pcs" },
      { id: "i11", name: "Orange Juice",     category: "Beverages",   qty: 1,   unit: "L" },
      { id: "i12", name: "Dishwasher Tabs",  category: "Household",   qty: 1,   unit: "box" },
    ],
  },
  {
    id: "l2", name: "Office Snacks", emoji: "🍎", isFamily: false, color: "#E07A5F",
    items: [
      { id: "i13", name: "Mixed Nuts",      category: "Other",     qty: 200, unit: "g" },
      { id: "i14", name: "Dark Chocolate",  category: "Other",     qty: 2,   unit: "bars" },
      { id: "i15", name: "Sparkling Water", category: "Beverages", qty: 6,   unit: "cans" },
      { id: "i16", name: "Protein Bars",    category: "Other",     qty: 5,   unit: "pcs" },
    ],
  },
  {
    id: "l3", name: "BBQ Party", emoji: "🔥", isFamily: true, color: "#E6A020",
    items: [
      { id: "i17", name: "Beef Burgers",  category: "Meat & Fish", qty: 8,  unit: "pcs" },
      { id: "i18", name: "Pork Ribs",     category: "Meat & Fish", qty: 1,  unit: "kg" },
      { id: "i19", name: "Burger Buns",   category: "Bakery",      qty: 8,  unit: "pcs" },
      { id: "i20", name: "Corn on Cob",   category: "Produce",     qty: 6,  unit: "pcs" },
      { id: "i21", name: "BBQ Sauce",     category: "Other",       qty: 2,  unit: "bottles" },
      { id: "i22", name: "Beer",          category: "Beverages",   qty: 24, unit: "cans" },
      { id: "i23", name: "Lemonade",      category: "Beverages",   qty: 2,  unit: "L" },
      { id: "i24", name: "Paper Plates",  category: "Household",   qty: 1,  unit: "pack" },
    ],
  },
];

const initSessions: Session[] = [
  {
    id: "s1", listId: "l1", listName: "Weekly Groceries", listEmoji: "🛒", isFamily: true,
    status: "paused", startedAt: "Jan 21, 10:30", shop: "Whole Foods Market",
    bought: ["i1", "i4", "i7"],
  },
  {
    id: "s2", listId: "l2", listName: "Office Snacks", listEmoji: "🍎", isFamily: false,
    status: "completed", startedAt: "Jan 19, 14:00", shop: "Trader Joe's",
    bought: ["i13", "i14", "i15", "i16"],
  },
];

// ── TINY SHARED PIECES ────────────────────────────────────────────────────────

function VisibilityBadge({ isFamily }: { isFamily: boolean }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
      isFamily ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
    }`}>
      {isFamily ? <><Globe size={9} /> Family</> : <><Lock size={9} /> Personal</>}
    </span>
  );
}

function StatusBadge({ status }: { status: Session["status"] }) {
  const cfg = {
    active:    "bg-green-100 text-green-700",
    paused:    "bg-amber-100 text-amber-700",
    completed: "bg-blue-100 text-blue-700",
  }[status];
  return <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${cfg}`}>{status}</span>;
}

// ── BOTTOM SHEET ──────────────────────────────────────────────────────────────

function Sheet({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 320 }}
        className="relative w-full bg-card rounded-t-3xl shadow-2xl overflow-hidden"
        style={{ maxHeight: "88%" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-border mx-auto mt-3 mb-1" />
        <div className="overflow-y-auto" style={{ maxHeight: "calc(88vh - 28px)" }}>
          <div className="p-6 pt-3">{children}</div>
        </div>
      </motion.div>
    </div>
  );
}

// ── STATUS BAR ────────────────────────────────────────────────────────────────

function PhoneStatusBar() {
  return (
    <div className="h-11 flex items-center justify-between px-6 bg-background shrink-0">
      <span className="text-xs font-black text-foreground">9:41</span>
      <div className="flex items-center gap-1.5">
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor" className="text-foreground">
          <rect x="0" y="4" width="2.5" height="7" rx="0.8" opacity="0.3"/>
          <rect x="4"  y="2.5" width="2.5" height="8.5" rx="0.8" opacity="0.5"/>
          <rect x="8"  y="1"   width="2.5" height="10" rx="0.8" opacity="0.75"/>
          <rect x="12" y="0"   width="2.5" height="11" rx="0.8"/>
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor" className="text-foreground">
          <path d="M7.5 2.5C9.5 2.5 11.3 3.3 12.6 4.7L14 3.3C12.3 1.6 9.9.5 7.5.5S2.7 1.6 1 3.3l1.4 1.4C3.7 3.3 5.5 2.5 7.5 2.5z" opacity="0.5"/>
          <path d="M7.5 5.5c1.3 0 2.5.5 3.3 1.4l1.4-1.4C11 4.1 9.4 3.5 7.5 3.5S4 4.1 2.8 5.5l1.4 1.4C5 5.9 6.2 5.5 7.5 5.5z" opacity="0.8"/>
          <circle cx="7.5" cy="9.5" r="1.5"/>
        </svg>
        <div className="flex items-center gap-0.5">
          <div className="w-6 h-3 rounded-sm border border-foreground/40 p-0.5">
            <div className="h-full w-[78%] bg-foreground rounded-[1px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SCREEN: LISTS HOME ────────────────────────────────────────────────────────

function ListsScreen({
  lists, sessions, onOpenList, onDeleteList, onCreateList,
}: {
  lists: ShoppingList[];
  sessions: Session[];
  onOpenList: (id: string) => void;
  onDeleteList: (id: string) => void;
  onCreateList: (name: string, emoji: string, isFamily: boolean) => void;
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("🛒");
  const [newIsFamily, setNewIsFamily] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const familyLists   = lists.filter(l => l.isFamily);
  const personalLists = lists.filter(l => !l.isFamily);

  function getActiveSess(listId: string) {
    return sessions.find(s => s.listId === listId && s.status !== "completed");
  }

  function handleCreate() {
    if (!newName.trim()) return;
    onCreateList(newName.trim(), newEmoji, newIsFamily);
    setNewName(""); setNewEmoji("🛒"); setNewIsFamily(false);
    setShowCreate(false);
  }

  function ListCard({ list }: { list: ShoppingList }) {
    const active = getActiveSess(list.id);
    const cats = new Set(list.items.map(i => i.category)).size;

    return (
      <div className="relative" onClick={() => { setMenuOpen(null); onOpenList(list.id); }}>
        <div className="bg-card rounded-2xl p-4 border border-border shadow-sm active:scale-[0.98] transition-transform cursor-pointer select-none">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                 style={{ backgroundColor: list.color + "20" }}>
              {list.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[15px] text-foreground truncate">{list.name}</h3>
                <button
                  onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === list.id ? null : list.id); }}
                  className="p-1 -mr-1 text-muted-foreground rounded-lg"
                >
                  <MoreHorizontal size={17} />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <VisibilityBadge isFamily={list.isFamily} />
                <span className="text-xs text-muted-foreground">{list.items.length} items · {cats} categories</span>
              </div>
              {active && (
                <div className={`mt-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 ${
                  active.status === "active"
                    ? "bg-green-50 border border-green-200"
                    : "bg-amber-50 border border-amber-200"
                }`}>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    active.status === "active" ? "bg-green-500 animate-pulse" : "bg-amber-500"
                  }`} />
                  <span className={`text-xs font-semibold ${active.status === "active" ? "text-green-800" : "text-amber-800"}`}>
                    {active.status === "active" ? "In progress" : "Session paused"} · {active.bought.length}/{list.items.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen === list.id && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -6 }}
              transition={{ duration: 0.12 }}
              className="absolute right-2 top-12 bg-card border border-border rounded-2xl shadow-xl z-20 overflow-hidden w-44"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => { onOpenList(list.id); setMenuOpen(null); }}
                      className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-muted flex items-center gap-2 font-medium">
                <Edit2 size={14} /> Open list
              </button>
              <div className="h-px bg-border mx-3" />
              <button onClick={() => { onDeleteList(list.id); setMenuOpen(null); }}
                      className="w-full text-left px-4 py-3 text-sm text-destructive hover:bg-red-50 flex items-center gap-2 font-medium">
                <Trash2 size={14} /> Delete list
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" onClick={() => setMenuOpen(null)}>
      {/* Header */}
      <div className="px-5 pt-2 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[26px] font-black text-foreground leading-tight">My Lists</h1>
            <p className="text-sm text-muted-foreground font-medium">Hello, Sarah 👋</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-extrabold shadow-sm">
            SA
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-6">
        {familyLists.length > 0 && (
          <section>
            <div className="flex items-center gap-1.5 mb-3">
              <Users size={12} className="text-primary" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary">Family</span>
            </div>
            <div className="space-y-3">
              {familyLists.map(l => <ListCard key={l.id} list={l} />)}
            </div>
          </section>
        )}
        {personalLists.length > 0 && (
          <section>
            <div className="flex items-center gap-1.5 mb-3">
              <Lock size={12} className="text-muted-foreground" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">Personal</span>
            </div>
            <div className="space-y-3">
              {personalLists.map(l => <ListCard key={l.id} list={l} />)}
            </div>
          </section>
        )}
        {lists.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🛍️</div>
            <p className="font-bold text-foreground text-lg">No lists yet</p>
            <p className="text-sm text-muted-foreground mt-1">Tap + to create your first list</p>
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={e => { e.stopPropagation(); setShowCreate(true); }}
        className="absolute right-5 bottom-[88px] w-14 h-14 rounded-full bg-primary shadow-lg flex items-center justify-center text-white z-10 active:scale-95 transition-transform"
        style={{ boxShadow: "0 6px 24px rgba(61,122,86,0.42)" }}
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>

      {/* Create Sheet */}
      <AnimatePresence>
        {showCreate && (
          <Sheet onClose={() => setShowCreate(false)}>
            <h2 className="text-xl font-black text-foreground mb-5">New Shopping List</h2>
            <div className="mb-5">
              <label className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-2 block">Pick an emoji</label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => setNewEmoji(e)}
                          className={`w-11 h-11 text-xl rounded-xl transition-all active:scale-95 ${
                            newEmoji === e ? "bg-primary/10 ring-2 ring-primary scale-110" : "bg-muted"
                          }`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-1.5 block">List name</label>
              <input
                value={newName} onChange={e => setNewName(e.target.value)}
                placeholder="e.g. Weekly Groceries"
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary font-medium placeholder:font-normal"
                autoFocus
                onKeyDown={e => e.key === "Enter" && handleCreate()}
              />
            </div>
            <div className="mb-6">
              <label className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-2 block">Visibility</label>
              <div className="flex gap-3">
                {([false, true] as const).map(fam => (
                  <button key={String(fam)} onClick={() => setNewIsFamily(fam)}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all text-sm font-bold ${
                            newIsFamily === fam
                              ? "border-primary bg-primary/8 text-primary"
                              : "border-border text-muted-foreground"
                          }`}>
                    {fam ? <Globe size={15} /> : <Lock size={15} />}
                    {fam ? "Family" : "Personal"}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleCreate}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-extrabold text-sm active:scale-[0.98] transition-transform">
              Create List
            </button>
          </Sheet>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── SCREEN: LIST DETAIL ───────────────────────────────────────────────────────

function ListDetailScreen({
  list, sessions, onBack, onAddItem, onDeleteItem, onUpdateItem, onStartSession, onResumeSession,
}: {
  list: ShoppingList;
  sessions: Session[];
  onBack: () => void;
  onAddItem: (listId: string, item: Omit<Item, "id">) => void;
  onDeleteItem: (listId: string, itemId: string) => void;
  onUpdateItem: (listId: string, item: Item) => void;
  onStartSession: (listId: string, shop?: string) => void;
  onResumeSession: (sessionId: string) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [showStart, setShowStart] = useState(false);
  const [shopName, setShopName] = useState("");
  const blankItem = { name: "", category: "Produce" as Category, qty: "1", unit: "pcs", note: "" };
  const [newItem, setNewItem] = useState(blankItem);

  const activeSess = sessions.find(s => s.listId === list.id && s.status !== "completed");
  const groups = useMemo(() => {
    return CATS
      .map(cat => ({ cat, items: list.items.filter(i => i.category === cat) }))
      .filter(g => g.items.length > 0);
  }, [list.items]);

  function handleAdd() {
    if (!newItem.name.trim()) return;
    onAddItem(list.id, { name: newItem.name.trim(), category: newItem.category, qty: Number(newItem.qty) || 1, unit: newItem.unit, note: newItem.note || undefined });
    setNewItem(blankItem);
    setShowAdd(false);
  }

  function handleSaveEdit() {
    if (!editItem) return;
    onUpdateItem(list.id, editItem);
    setEditItem(null);
  }

  function handleStartSession() {
    onStartSession(list.id, shopName.trim() || undefined);
    setShopName(""); setShowStart(false);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-2 pb-3 flex items-center gap-3 border-b border-border shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 text-muted-foreground active:bg-muted rounded-xl">
          <ChevronLeft size={22} />
        </button>
        <div className="text-2xl">{list.emoji}</div>
        <div className="flex-1 min-w-0">
          <h1 className="font-black text-foreground text-lg leading-tight truncate">{list.name}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <VisibilityBadge isFamily={list.isFamily} />
            <span className="text-xs text-muted-foreground">{list.items.length} items</span>
          </div>
        </div>
      </div>

      {/* Active session banner */}
      {activeSess && (
        <div className={`mx-5 mt-3 shrink-0 rounded-2xl px-4 py-3 flex items-center gap-3 ${
          activeSess.status === "active"
            ? "bg-green-50 border border-green-200"
            : "bg-amber-50 border border-amber-200"
        }`}>
          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
            activeSess.status === "active" ? "bg-green-500 animate-pulse" : "bg-amber-500"
          }`} />
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold ${activeSess.status === "active" ? "text-green-800" : "text-amber-800"}`}>
              Session {activeSess.status === "active" ? "in progress" : "paused"}
              {activeSess.shop && ` · ${activeSess.shop}`}
            </p>
            <p className="text-xs text-muted-foreground">{activeSess.bought.length}/{list.items.length} items bought</p>
          </div>
          <button
            onClick={() => onResumeSession(activeSess.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold text-white shrink-0 ${
              activeSess.status === "active" ? "bg-green-600" : "bg-amber-500"
            }`}
          >
            {activeSess.status === "active" ? "Continue" : "Resume"}
          </button>
        </div>
      )}

      {/* Items grouped by category */}
      <div className="flex-1 overflow-y-auto px-5 py-3 space-y-5 pb-4">
        {groups.map(({ cat, items }) => {
          const m = CAT_META[cat];
          return (
            <div key={cat}>
              <div className={`flex items-center gap-2 mb-2.5 px-3 py-2 rounded-xl border ${m.bg} ${m.border}`}>
                <span className="text-sm">{m.emoji}</span>
                <span className={`text-[11px] font-extrabold uppercase tracking-widest ${m.fg}`}>{cat}</span>
                <span className={`text-[11px] ${m.fg} opacity-60 ml-auto`}>{items.length}</span>
              </div>
              <div className="space-y-2 pl-1">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3 bg-card rounded-xl px-3 py-2.5 border border-border">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground leading-tight">{item.name}</p>
                      {item.note && <p className="text-xs text-muted-foreground mt-0.5">{item.note}</p>}
                    </div>
                    <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">{item.qty} {item.unit}</span>
                    <div className="flex gap-0.5 shrink-0">
                      <button onClick={() => setEditItem(item)} className="p-1.5 text-muted-foreground active:text-primary rounded-lg">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => onDeleteItem(list.id, item.id)} className="p-1.5 text-muted-foreground active:text-destructive rounded-lg">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {list.items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-5xl mb-3">🛍️</div>
            <p className="font-bold text-foreground">Empty list</p>
            <p className="text-sm text-muted-foreground mt-1">Tap "Add Item" to get started</p>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="px-5 pb-5 pt-3 border-t border-border flex gap-3 shrink-0">
        <button onClick={() => setShowAdd(true)}
                className="flex-1 py-3.5 border-2 border-primary text-primary rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-transform">
          <Plus size={17} strokeWidth={3} /> Add Item
        </button>
        {!activeSess ? (
          <button onClick={() => setShowStart(true)}
                  className="flex-1 py-3.5 bg-primary text-white rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
                  style={{ boxShadow: "0 4px 16px rgba(61,122,86,0.35)" }}>
            <ShoppingCart size={17} /> Start
          </button>
        ) : (
          <button onClick={() => onResumeSession(activeSess.id)}
                  className="flex-1 py-3.5 bg-primary text-white rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
                  style={{ boxShadow: "0 4px 16px rgba(61,122,86,0.35)" }}>
            <Play size={17} /> Go Shop
          </button>
        )}
      </div>

      {/* Add Item Sheet */}
      <AnimatePresence>
        {showAdd && (
          <Sheet onClose={() => setShowAdd(false)}>
            <h2 className="text-xl font-black text-foreground mb-5">Add Item</h2>
            <ItemForm item={newItem} onChange={setNewItem} onSubmit={handleAdd} submitLabel="Add to List" />
          </Sheet>
        )}
      </AnimatePresence>

      {/* Edit Item Sheet */}
      <AnimatePresence>
        {editItem && (
          <Sheet onClose={() => setEditItem(null)}>
            <h2 className="text-xl font-black text-foreground mb-5">Edit Item</h2>
            <ItemForm
              item={{ name: editItem.name, category: editItem.category, qty: String(editItem.qty), unit: editItem.unit, note: editItem.note || "" }}
              onChange={v => setEditItem(p => p ? { ...p, ...v, qty: Number(v.qty) || 1 } : p)}
              onSubmit={handleSaveEdit}
              submitLabel="Save Changes"
            />
          </Sheet>
        )}
      </AnimatePresence>

      {/* Start Session Sheet */}
      <AnimatePresence>
        {showStart && (
          <Sheet onClose={() => setShowStart(false)}>
            <h2 className="text-xl font-black text-foreground mb-1">Start Shopping</h2>
            <p className="text-sm text-muted-foreground mb-5">Where are you going?</p>
            <input
              value={shopName} onChange={e => setShopName(e.target.value)}
              placeholder="e.g. Whole Foods Market (optional)"
              className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary mb-5 font-medium placeholder:font-normal"
              autoFocus
              onKeyDown={e => e.key === "Enter" && handleStartSession()}
            />
            <button onClick={handleStartSession}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2"
                    style={{ boxShadow: "0 4px 16px rgba(61,122,86,0.35)" }}>
              <ShoppingCart size={17} /> Start Shopping Session
            </button>
          </Sheet>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── ITEM FORM (shared between add & edit) ─────────────────────────────────────

type ItemFormState = { name: string; category: Category; qty: string; unit: string; note: string };

function ItemForm({ item, onChange, onSubmit, submitLabel }: {
  item: ItemFormState;
  onChange: (v: ItemFormState) => void;
  onSubmit: () => void;
  submitLabel: string;
}) {
  const set = (k: keyof ItemFormState) => (v: string) => onChange({ ...item, [k]: v });

  return (
    <div className="space-y-4">
      <Field label="Item name">
        <input value={item.name} onChange={e => set("name")(e.target.value)}
               placeholder="e.g. Organic Apples"
               className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary font-medium placeholder:font-normal"
               autoFocus
               onKeyDown={e => e.key === "Enter" && onSubmit()} />
      </Field>
      <Field label="Category">
        <SelectField value={item.category} onChange={set("category")} options={CATS} />
      </Field>
      <div className="flex gap-3">
        <Field label="Quantity" className="flex-1">
          <input type="number" value={item.qty} onChange={e => set("qty")(e.target.value)}
                 className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary font-medium" />
        </Field>
        <Field label="Unit" className="flex-1">
          <SelectField value={item.unit} onChange={set("unit")} options={UNITS} />
        </Field>
      </div>
      <Field label="Note (optional)">
        <input value={item.note} onChange={e => set("note")(e.target.value)}
               placeholder="e.g. low fat, organic…"
               className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary placeholder:font-normal" />
      </Field>
      <button onClick={onSubmit}
              className="w-full mt-1 py-4 bg-primary text-white rounded-2xl font-extrabold text-sm active:scale-[0.98] transition-transform"
              style={{ boxShadow: "0 4px 16px rgba(61,122,86,0.32)" }}>
        {submitLabel}
      </button>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

function SelectField({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
              className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none appearance-none focus:ring-2 focus:ring-primary font-medium">
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
    </div>
  );
}

// ── SCREEN: SESSION ───────────────────────────────────────────────────────────

function SessionScreen({
  session, list, onBack, onToggle, onPause, onResume, onComplete, onDelete,
}: {
  session: Session;
  list: ShoppingList | undefined;
  onBack: () => void;
  onToggle: (sessionId: string, itemId: string) => void;
  onPause: (sessionId: string) => void;
  onResume: (sessionId: string) => void;
  onComplete: (sessionId: string) => void;
  onDelete: (sessionId: string) => void;
}) {
  const [confirmComplete, setConfirmComplete] = useState(false);

  if (!list) return (
    <div className="flex flex-col h-full items-center justify-center">
      <p className="text-muted-foreground">List not found</p>
      <button onClick={onBack} className="mt-4 text-primary font-semibold">Go back</button>
    </div>
  );

  const groups = useMemo(() => (
    CATS.map(cat => ({ cat, items: list.items.filter(i => i.category === cat) })).filter(g => g.items.length > 0)
  ), [list.items]);

  const bought = session.bought.length;
  const total  = list.items.length;
  const pct    = total > 0 ? bought / total : 0;
  const isActive    = session.status === "active";
  const isCompleted = session.status === "completed";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-2 pb-3 border-b border-border shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="p-2 -ml-2 text-muted-foreground active:bg-muted rounded-xl">
            <ChevronLeft size={22} />
          </button>
          <div className="text-2xl">{list.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-foreground text-base truncate">{list.name}</span>
              <StatusBadge status={session.status} />
            </div>
            {session.shop && <p className="text-xs text-muted-foreground mt-0.5 font-medium">📍 {session.shop}</p>}
          </div>
          {!isCompleted && (
            <button onClick={() => onDelete(session.id)} className="p-2 text-muted-foreground active:text-destructive rounded-xl">
              <Trash2 size={18} />
            </button>
          )}
        </div>
        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={false}
              animate={{ width: `${pct * 100}%` }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
            />
          </div>
          <span className="text-xs font-extrabold text-primary whitespace-nowrap tabular-nums">{bought}/{total}</span>
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-5 py-3 space-y-5 pb-4">
        {groups.map(({ cat, items }) => {
          const m       = CAT_META[cat];
          const catBought = items.filter(i => session.bought.includes(i.id)).length;
          const allDone   = catBought === items.length && items.length > 0;

          return (
            <div key={cat} className={`transition-opacity ${allDone ? "opacity-50" : ""}`}>
              <div className={`flex items-center gap-2 mb-2.5 px-3 py-2 rounded-xl border ${m.bg} ${m.border}`}>
                <span className="text-sm">{m.emoji}</span>
                <span className={`text-[11px] font-extrabold uppercase tracking-widest ${m.fg}`}>{cat}</span>
                <span className={`text-[11px] ${m.fg} opacity-60 ml-auto`}>{catBought}/{items.length}</span>
              </div>
              <div className="space-y-2 pl-1">
                {items.map(item => {
                  const isBought = session.bought.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => !isCompleted && onToggle(session.id, item.id)}
                      className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 border transition-all text-left active:scale-[0.98] ${
                        isBought ? "bg-muted/50 border-border/40" : "bg-card border-border"
                      } ${isCompleted ? "cursor-default" : ""}`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        isBought ? "bg-primary border-primary" : "border-border"
                      }`}>
                        {isBought && <Check size={13} className="text-white" strokeWidth={3} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm font-semibold transition-all ${
                          isBought ? "line-through text-muted-foreground" : "text-foreground"
                        }`}>{item.name}</span>
                        {item.note && <p className="text-xs text-muted-foreground mt-0.5">{item.note}</p>}
                      </div>
                      <span className="text-xs font-bold text-muted-foreground whitespace-nowrap shrink-0">
                        {item.qty} {item.unit}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      {!isCompleted ? (
        <div className="px-5 pb-5 pt-3 border-t border-border flex gap-3 shrink-0">
          <button
            onClick={() => isActive ? onPause(session.id) : onResume(session.id)}
            className="flex-1 py-3.5 border-2 border-border text-foreground rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
          >
            {isActive ? <><Pause size={17} /> Pause</> : <><Play size={17} /> Resume</>}
          </button>
          <button onClick={() => setConfirmComplete(true)}
                  className="flex-1 py-3.5 bg-primary text-white rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
                  style={{ boxShadow: "0 4px 16px rgba(61,122,86,0.35)" }}>
            <CheckCheck size={17} /> Done
          </button>
        </div>
      ) : (
        <div className="px-5 pb-5 pt-3 border-t border-border shrink-0">
          <div className="flex items-center justify-center gap-2 py-2">
            <CheckCheck size={18} className="text-primary" />
            <span className="font-extrabold text-primary text-sm">Shopping completed · {session.startedAt}</span>
          </div>
        </div>
      )}

      {/* Confirm complete */}
      <AnimatePresence>
        {confirmComplete && (
          <Sheet onClose={() => setConfirmComplete(false)}>
            <div className="text-center py-2">
              <div className="text-5xl mb-3">{pct === 1 ? "🎉" : "🛒"}</div>
              <h2 className="text-xl font-black text-foreground mb-1">Complete Session?</h2>
              <p className="text-sm text-muted-foreground mb-6">
                {bought} of {total} items bought{pct < 1 ? ` (${total - bought} remaining)` : " — all done!"}.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmComplete(false)}
                        className="flex-1 py-3.5 border-2 border-border text-foreground rounded-2xl font-extrabold text-sm">
                  Cancel
                </button>
                <button onClick={() => { onComplete(session.id); setConfirmComplete(false); }}
                        className="flex-1 py-3.5 bg-primary text-white rounded-2xl font-extrabold text-sm"
                        style={{ boxShadow: "0 4px 16px rgba(61,122,86,0.35)" }}>
                  Complete
                </button>
              </div>
            </div>
          </Sheet>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── SCREEN: SESSIONS LIST ─────────────────────────────────────────────────────

function SessionsScreen({
  sessions, lists, onOpenSession, onDeleteSession,
}: {
  sessions: Session[];
  lists: ShoppingList[];
  onOpenSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}) {
  const active    = sessions.filter(s => s.status !== "completed");
  const completed = sessions.filter(s => s.status === "completed");

  function SessionCard({ sess }: { sess: Session }) {
    const list = lists.find(l => l.id === sess.listId);
    const pct  = list ? sess.bought.length / Math.max(list.items.length, 1) : 0;

    return (
      <div onClick={() => onOpenSession(sess.id)}
           className="bg-card rounded-2xl p-4 border border-border shadow-sm cursor-pointer active:scale-[0.98] transition-transform select-none">
        <div className="flex items-start gap-3">
          <div className="text-2xl mt-0.5">{sess.listEmoji}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-[15px] text-foreground">{sess.listName}</span>
              <StatusBadge status={sess.status} />
              <VisibilityBadge isFamily={sess.isFamily} />
            </div>
            {sess.shop && <p className="text-xs text-muted-foreground mt-0.5 font-medium">📍 {sess.shop}</p>}
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-xs text-muted-foreground">{sess.startedAt}</span>
              {list && <span className="text-xs font-bold text-primary">{sess.bought.length}/{list.items.length} items</span>}
            </div>
            {list && sess.status !== "completed" && (
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct * 100}%` }} />
              </div>
            )}
          </div>
          <button onClick={e => { e.stopPropagation(); onDeleteSession(sess.id); }}
                  className="p-1.5 text-muted-foreground active:text-destructive rounded-lg shrink-0">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-2 pb-4 shrink-0">
        <h1 className="text-[26px] font-black text-foreground leading-tight">Sessions</h1>
        <p className="text-sm text-muted-foreground font-medium">Your shopping history</p>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-6">
        {active.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary">Active & Paused</span>
            </div>
            <div className="space-y-3">{active.map(s => <SessionCard key={s.id} sess={s} />)}</div>
          </section>
        )}
        {completed.length > 0 && (
          <section>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground block mb-3">Completed</span>
            <div className="space-y-3">{completed.map(s => <SessionCard key={s.id} sess={s} />)}</div>
          </section>
        )}
        {sessions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <p className="font-bold text-foreground text-lg">No sessions yet</p>
            <p className="text-sm text-muted-foreground mt-1">Start a shopping session from a list</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── SCREEN: FAMILY ────────────────────────────────────────────────────────────

function FamilyScreen({
  family, onAddMember, onRemoveMember,
}: {
  family: Family;
  onAddMember: (name: string, email: string) => void;
  onRemoveMember: (id: string) => void;
}) {
  const [showInvite, setShowInvite] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleInvite() {
    if (!name.trim() || !email.trim()) return;
    onAddMember(name.trim(), email.trim());
    setSent(true);
    setTimeout(() => { setSent(false); setName(""); setEmail(""); setShowInvite(false); }, 1800);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-2 pb-4 shrink-0">
        <h1 className="text-[26px] font-black text-foreground leading-tight">Family</h1>
        <p className="text-sm text-muted-foreground font-medium">{family.name}</p>
      </div>

      {/* Family hero card */}
      <div className="mx-5 mb-5 rounded-3xl p-5 bg-primary text-white relative overflow-hidden shrink-0"
           style={{ boxShadow: "0 8px 28px rgba(61,122,86,0.38)" }}>
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute right-4 -bottom-6 w-20 h-20 rounded-full bg-white/8 pointer-events-none" />
        <h2 className="font-black text-xl leading-tight mb-0.5">{family.name}</h2>
        <p className="text-white/70 text-sm font-medium mb-4">{family.members.length} members</p>
        <div className="flex -space-x-2.5">
          {family.members.map(m => (
            <div key={m.id} title={m.name}
                 className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center text-xs font-extrabold text-white"
                 style={{ backgroundColor: m.color }}>
              {m.initials}
            </div>
          ))}
        </div>
      </div>

      {/* Members */}
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground block mb-3">Members</span>
        <div className="space-y-2 mb-4">
          {family.members.map(member => (
            <div key={member.id} className="flex items-center gap-3 bg-card rounded-2xl px-4 py-3.5 border border-border">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-extrabold text-white shrink-0"
                   style={{ backgroundColor: member.color }}>
                {member.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-foreground">{member.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {member.role === "admin" ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                      <Crown size={9} /> Admin
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground font-medium">Member</span>
                  )}
                </div>
              </div>
              {member.role !== "admin" && (
                <button onClick={() => onRemoveMember(member.id)}
                        className="p-2 text-muted-foreground active:text-destructive rounded-xl">
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        <button onClick={() => setShowInvite(true)}
                className="w-full py-4 border-2 border-dashed border-border rounded-2xl flex items-center justify-center gap-2 text-sm font-bold text-muted-foreground active:border-primary active:text-primary transition-colors">
          <UserPlus size={18} /> Invite Family Member
        </button>
      </div>

      <AnimatePresence>
        {showInvite && (
          <Sheet onClose={() => setShowInvite(false)}>
            {sent ? (
              <div className="text-center py-6">
                <div className="text-6xl mb-4">✉️</div>
                <h2 className="text-xl font-black text-foreground">Invitation Sent!</h2>
                <p className="text-sm text-muted-foreground mt-2">They'll receive an invite link to join {family.name}</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-black text-foreground mb-1">Invite Member</h2>
                <p className="text-sm text-muted-foreground mb-5">They'll be added to <strong>{family.name}</strong></p>
                <div className="space-y-4">
                  <Field label="Name">
                    <input value={name} onChange={e => setName(e.target.value)}
                           placeholder="e.g. Emma Anderson"
                           className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary font-medium placeholder:font-normal"
                           autoFocus />
                  </Field>
                  <Field label="Email or Username">
                    <input value={email} onChange={e => setEmail(e.target.value)}
                           placeholder="e.g. emma@email.com"
                           type="email"
                           className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary font-medium placeholder:font-normal" />
                  </Field>
                  <button onClick={handleInvite}
                          className="w-full mt-2 py-4 bg-primary text-white rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2"
                          style={{ boxShadow: "0 4px 16px rgba(61,122,86,0.32)" }}>
                    <UserPlus size={17} /> Send Invitation
                  </button>
                </div>
              </>
            )}
          </Sheet>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── SCREEN: PROFILE ───────────────────────────────────────────────────────────

function ProfileScreen({ family }: { family: Family }) {
  const me = family.members[0];
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-2 pb-4 shrink-0">
        <h1 className="text-[26px] font-black text-foreground leading-tight">Profile</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <div className="flex items-center gap-4 bg-card rounded-2xl p-4 border border-border mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-extrabold text-white shrink-0"
               style={{ backgroundColor: me.color }}>
            {me.initials}
          </div>
          <div>
            <h2 className="font-black text-lg text-foreground leading-tight">{me.name}</h2>
            <div className="flex items-center gap-1 text-xs font-bold text-primary mt-0.5">
              <Crown size={11} /> Admin · {family.name}
            </div>
          </div>
        </div>

        {[
          { title: "Account",       items: ["Edit Profile", "Change Email", "Change Password"] },
          { title: "Notifications", items: ["Shopping Reminders", "Family Activity", "New Sessions"] },
          { title: "App",           items: ["Dark Mode", "Language", "Clear Cache", "About"] },
        ].map(section => (
          <div key={section.title} className="mb-4">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground block mb-2">{section.title}</span>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {section.items.map((item, i) => (
                <div key={item} className={`px-4 py-3.5 flex items-center justify-between active:bg-muted cursor-pointer ${i > 0 ? "border-t border-border" : ""}`}>
                  <span className="text-sm font-semibold text-foreground">{item}</span>
                  <ChevronLeft size={16} className="text-muted-foreground rotate-180" />
                </div>
              ))}
            </div>
          </div>
        ))}

        <button className="w-full py-4 border-2 border-destructive/30 text-destructive rounded-2xl font-extrabold text-sm mt-2 active:bg-red-50 transition-colors">
          Sign Out
        </button>
      </div>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────

export default function App() {
  const [tab,      setTab]      = useState<Tab>("lists");
  const [screen,   setScreen]   = useState<AppScreen>({ type: "lists" });
  const [lists,    setLists]    = useState<ShoppingList[]>(initLists);
  const [sessions, setSessions] = useState<Session[]>(initSessions);
  const [family,   setFamily]   = useState<Family>(initFamily);

  // Navigation
  function goToList(listId: string) { setTab("lists"); setScreen({ type: "list-detail", listId }); }
  function goToSession(sessionId: string) { setScreen({ type: "session", sessionId }); }
  function goBack() { setScreen({ type: "lists" }); }

  // Lists
  function createList(name: string, emoji: string, isFamily: boolean) {
    setLists(p => [...p, {
      id: genId(), name, emoji, isFamily, items: [],
      color: LIST_COLORS[p.length % LIST_COLORS.length],
    }]);
  }
  function deleteList(id: string) {
    setLists(p => p.filter(l => l.id !== id));
    setSessions(p => p.filter(s => s.listId !== id));
    if (screen.type === "list-detail" && screen.listId === id) goBack();
  }
  function addItem(listId: string, item: Omit<Item, "id">) {
    setLists(p => p.map(l => l.id === listId ? { ...l, items: [...l.items, { ...item, id: genId() }] } : l));
  }
  function deleteItem(listId: string, itemId: string) {
    setLists(p => p.map(l => l.id === listId ? { ...l, items: l.items.filter(i => i.id !== itemId) } : l));
  }
  function updateItem(listId: string, item: Item) {
    setLists(p => p.map(l => l.id === listId ? { ...l, items: l.items.map(i => i.id === item.id ? item : i) } : l));
  }

  // Sessions
  function startSession(listId: string, shop?: string) {
    const list = lists.find(l => l.id === listId);
    if (!list) return;
    const now = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    const sess: Session = {
      id: genId(), listId, listName: list.name, listEmoji: list.emoji,
      isFamily: list.isFamily, status: "active", startedAt: now, shop, bought: [],
    };
    setSessions(p => [...p, sess]);
    goToSession(sess.id);
  }
  function resumeSession(id: string) {
    setSessions(p => p.map(s => s.id === id ? { ...s, status: "active" } : s));
    goToSession(id);
  }
  function pauseSession(id: string) {
    setSessions(p => p.map(s => s.id === id ? { ...s, status: "paused" } : s));
  }
  function completeSession(id: string) {
    setSessions(p => p.map(s => s.id === id ? { ...s, status: "completed" } : s));
    goBack();
  }
  function deleteSession(id: string) {
    setSessions(p => p.filter(s => s.id !== id));
    if (screen.type === "session" && screen.sessionId === id) goBack();
  }
  function toggleItem(sessionId: string, itemId: string) {
    setSessions(p => p.map(s => s.id === sessionId ? {
      ...s, bought: s.bought.includes(itemId)
        ? s.bought.filter(id => id !== itemId)
        : [...s.bought, itemId],
    } : s));
  }

  // Family
  function addMember(name: string) {
    const initials = name.split(" ").map(w => w[0] ?? "").join("").slice(0, 2).toUpperCase();
    setFamily(p => ({
      ...p, members: [...p.members, {
        id: genId(), name, initials, role: "member",
        color: LIST_COLORS[p.members.length % LIST_COLORS.length],
      }],
    }));
  }
  function removeMember(id: string) {
    setFamily(p => ({ ...p, members: p.members.filter(m => m.id !== id) }));
  }

  const isDeep    = screen.type !== "lists";
  const curList   = screen.type === "list-detail" ? lists.find(l => l.id === screen.listId) : undefined;
  const curSession = screen.type === "session" ? sessions.find(s => s.id === screen.sessionId) : undefined;

  const TABS = [
    { id: "lists"    as Tab, label: "Lists",    icon: <List size={22} /> },
    { id: "sessions" as Tab, label: "Sessions", icon: <ShoppingCart size={22} /> },
    { id: "family"   as Tab, label: "Family",   icon: <Users size={22} /> },
    { id: "profile"  as Tab, label: "Profile",  icon: <User size={22} /> },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "radial-gradient(ellipse at 30% 20%, #d4e8db 0%, #c8ddd0 30%, #b8cfc3 100%)",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* Phone frame */}
      <div className="w-full h-screen md:w-[390px] md:h-[844px] bg-background flex flex-col md:rounded-[44px] md:overflow-hidden overflow-hidden relative"
           style={{
             boxShadow: "0 40px 80px rgba(0,0,0,0.35), 0 0 0 8px #1a1a1a, inset 0 0 0 1px rgba(255,255,255,0.15)",
           }}>

        <PhoneStatusBar />

        {/* Screen content */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence initial={false} mode="wait">
            {screen.type === "session" && curSession && (
              <motion.div key={`sess-${screen.sessionId}`} className="absolute inset-0 bg-background overflow-hidden"
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}>
                <SessionScreen
                  session={curSession}
                  list={lists.find(l => l.id === curSession.listId)}
                  onBack={goBack}
                  onToggle={toggleItem}
                  onPause={pauseSession}
                  onResume={id => setSessions(p => p.map(s => s.id === id ? { ...s, status: "active" } : s))}
                  onComplete={completeSession}
                  onDelete={deleteSession}
                />
              </motion.div>
            )}
            {screen.type === "list-detail" && curList && (
              <motion.div key={`list-${screen.listId}`} className="absolute inset-0 bg-background overflow-hidden"
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}>
                <ListDetailScreen
                  list={curList}
                  sessions={sessions}
                  onBack={goBack}
                  onAddItem={addItem}
                  onDeleteItem={deleteItem}
                  onUpdateItem={updateItem}
                  onStartSession={startSession}
                  onResumeSession={resumeSession}
                />
              </motion.div>
            )}
            {screen.type === "lists" && (
              <motion.div key="main" className="absolute inset-0 bg-background overflow-hidden"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}>
                {tab === "lists" && (
                  <ListsScreen lists={lists} sessions={sessions} onOpenList={goToList} onDeleteList={deleteList} onCreateList={createList} />
                )}
                {tab === "sessions" && (
                  <SessionsScreen sessions={sessions} lists={lists} onOpenSession={goToSession} onDeleteSession={deleteSession} />
                )}
                {tab === "family" && (
                  <FamilyScreen family={family} onAddMember={addMember} onRemoveMember={removeMember} />
                )}
                {tab === "profile" && (
                  <ProfileScreen family={family} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom nav (only when not in sub-screen) */}
        <AnimatePresence>
          {!isDeep && (
            <motion.div
              initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="shrink-0 bg-card border-t border-border flex items-center"
              style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)", minHeight: 68 }}
            >
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                        className={`flex-1 flex flex-col items-center gap-0.5 py-2 transition-colors ${
                          tab === t.id ? "text-primary" : "text-muted-foreground"
                        }`}>
                  {t.icon}
                  <span className="text-[10px] font-extrabold">{t.label}</span>
                  <motion.div
                    className="h-1 w-1 rounded-full bg-primary"
                    initial={false}
                    animate={{ opacity: tab === t.id ? 1 : 0, scale: tab === t.id ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
