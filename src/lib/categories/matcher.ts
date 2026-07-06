// keyword → category name (matches seed data in 002_seed.sql)
const KEYWORD_MAP: Record<string, string> = {
  // Frutta e verdura
  mele: 'Frutta e verdura', pere: 'Frutta e verdura', banana: 'Frutta e verdura',
  banane: 'Frutta e verdura', arance: 'Frutta e verdura', limoni: 'Frutta e verdura',
  uva: 'Frutta e verdura', fragole: 'Frutta e verdura', pomodori: 'Frutta e verdura',
  pomodoro: 'Frutta e verdura', insalata: 'Frutta e verdura', lattuga: 'Frutta e verdura',
  zucchine: 'Frutta e verdura', carote: 'Frutta e verdura', cipolla: 'Frutta e verdura',
  cipolle: 'Frutta e verdura', aglio: 'Frutta e verdura', patate: 'Frutta e verdura',
  patata: 'Frutta e verdura', spinaci: 'Frutta e verdura', broccoli: 'Frutta e verdura',
  peperoni: 'Frutta e verdura', melanzane: 'Frutta e verdura', funghi: 'Frutta e verdura',

  // Pane e panificati
  pane: 'Pane e panificati', baguette: 'Pane e panificati', grissini: 'Pane e panificati',
  focaccia: 'Pane e panificati', pizza: 'Pane e panificati', crackers: 'Pane e panificati',
  fette: 'Pane e panificati', brioche: 'Pane e panificati', cornetti: 'Pane e panificati',

  // Carne
  pollo: 'Carne', manzo: 'Carne', maiale: 'Carne', vitello: 'Carne',
  bistecca: 'Carne', hamburger: 'Carne', salsicce: 'Carne', costine: 'Carne',

  // Pesce
  salmone: 'Pesce', tonno: 'Pesce', merluzzo: 'Pesce', gamberi: 'Pesce',
  cozze: 'Pesce', vongole: 'Pesce', branzino: 'Pesce', orata: 'Pesce',

  // Salumi e formaggi
  prosciutto: 'Salumi e formaggi', salame: 'Salumi e formaggi', mortadella: 'Salumi e formaggi',
  bresaola: 'Salumi e formaggi', pancetta: 'Salumi e formaggi', speck: 'Salumi e formaggi',
  parmigiano: 'Salumi e formaggi', grana: 'Salumi e formaggi', mozzarella: 'Salumi e formaggi',
  ricotta: 'Salumi e formaggi', pecorino: 'Salumi e formaggi', gorgonzola: 'Salumi e formaggi',

  // Latticini e uova
  latte: 'Latticini e uova', burro: 'Latticini e uova', yogurt: 'Latticini e uova',
  panna: 'Latticini e uova', uova: 'Latticini e uova', uovo: 'Latticini e uova',
  kefir: 'Latticini e uova',

  // Surgelati
  gelato: 'Surgelati', surgelati: 'Surgelati', bastoncini: 'Surgelati',
  pizza_surgelata: 'Surgelati',

  // Pasta/riso/cereali
  pasta: 'Pasta, riso e cereali', riso: 'Pasta, riso e cereali', farro: 'Pasta, riso e cereali',
  orzo: 'Pasta, riso e cereali', quinoa: 'Pasta, riso e cereali', cous: 'Pasta, riso e cereali',
  gnocchi: 'Pasta, riso e cereali', spaghetti: 'Pasta, riso e cereali',
  tagliatelle: 'Pasta, riso e cereali', penne: 'Pasta, riso e cereali',

  // Conserve e sughi
  pelati: 'Conserve e sughi', passata: 'Conserve e sughi', sughi: 'Conserve e sughi',
  sugo: 'Conserve e sughi', fagioli: 'Conserve e sughi', ceci: 'Conserve e sughi',
  lenticchie: 'Conserve e sughi', mais: 'Conserve e sughi',

  // Olio/aceto/condimenti
  olio: 'Olio, aceto e condimenti', aceto: 'Olio, aceto e condimenti',
  sale: 'Olio, aceto e condimenti', pepe: 'Olio, aceto e condimenti',
  maionese: 'Olio, aceto e condimenti', ketchup: 'Olio, aceto e condimenti',
  senape: 'Olio, aceto e condimenti', dado: 'Olio, aceto e condimenti',

  // Biscotti e dolci
  biscotti: 'Biscotti e dolci', cioccolato: 'Biscotti e dolci', nutella: 'Biscotti e dolci',
  miele: 'Biscotti e dolci', marmellata: 'Biscotti e dolci', zucchero: 'Biscotti e dolci',
  farina: 'Biscotti e dolci', torta: 'Biscotti e dolci',

  // Bevande
  acqua: 'Bevande', vino: 'Bevande', birra: 'Bevande', succo: 'Bevande',
  aranciata: 'Bevande', coca: 'Bevande', sprite: 'Bevande', tè: 'Bevande',
  caffè: 'Bevande', caffe: 'Bevande',

  // Igiene personale
  shampoo: 'Igiene personale', dentifricio: 'Igiene personale', sapone: 'Igiene personale',
  deodorante: 'Igiene personale', rasoio: 'Igiene personale', assorbenti: 'Igiene personale',

  // Pulizia casa
  detersivo: 'Pulizia casa', candeggina: 'Pulizia casa', ammorbidente: 'Pulizia casa',
  spugne: 'Pulizia casa', carta: 'Pulizia casa', scottex: 'Pulizia casa',
  pattumiera: 'Pulizia casa', sacchetti: 'Pulizia casa',
}

export function matchCategory(name: string): string | null {
  const normalized = name.toLowerCase().trim()
  // Exact match first
  if (KEYWORD_MAP[normalized]) return KEYWORD_MAP[normalized]
  // Partial match (word boundary)
  for (const [keyword, category] of Object.entries(KEYWORD_MAP)) {
    if (normalized.includes(keyword)) return category
  }
  return null
}

export async function suggestCategoryWithAI(name: string): Promise<string | null> {
  const local = matchCategory(name)
  if (local) return local

  try {
    const Anthropic = (await import('@anthropic-ai/sdk')).default
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const categories = [
      'Frutta e verdura', 'Pane e panificati', 'Carne', 'Pesce',
      'Salumi e formaggi', 'Latticini e uova', 'Surgelati',
      'Pasta, riso e cereali', 'Conserve e sughi', 'Olio, aceto e condimenti',
      'Biscotti e dolci', 'Bevande', 'Igiene personale', 'Pulizia casa', 'Varie',
    ]

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 32,
      system: `Sei un assistente per la spesa. Dato un nome di prodotto, rispondi SOLO con il nome della categoria più adatta tra quelle indicate. Non aggiungere nulla altro.\nCategorie: ${categories.join(', ')}`,
      messages: [{ role: 'user', content: name }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text.trim() : null
    if (text && categories.includes(text)) return text
    return 'Varie'
  } catch {
    return 'Varie'
  }
}
