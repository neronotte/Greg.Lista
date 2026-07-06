import { describe, it, expect, vi, beforeEach } from 'vitest'
import { matchCategory } from './matcher'

describe('matchCategory', () => {
  it('returns correct category for exact match', () => {
    expect(matchCategory('pane')).toBe('Pane e panificati')
    expect(matchCategory('mele')).toBe('Frutta e verdura')
    expect(matchCategory('latte')).toBe('Latticini e uova')
  })

  it('is case-insensitive', () => {
    expect(matchCategory('Parmigiano')).toBe('Salumi e formaggi')
    expect(matchCategory('PASTA')).toBe('Pasta, riso e cereali')
  })

  it('matches partial strings', () => {
    expect(matchCategory('parmigiano reggiano')).toBe('Salumi e formaggi')
    expect(matchCategory('succo di frutta')).toBe('Bevande')
  })

  it('returns null for unknown product', () => {
    expect(matchCategory('xyzprodotto')).toBeNull()
  })
})

// Mock must be at top level for Vitest hoisting
const mockCreate = vi.fn()
vi.mock('@anthropic-ai/sdk', () => ({
  default: class {
    messages = { create: mockCreate }
  },
}))

describe('suggestCategoryWithAI', () => {
  beforeEach(() => { mockCreate.mockReset() })

  it('returns local match without calling AI', async () => {
    const { suggestCategoryWithAI } = await import('./matcher')
    const result = await suggestCategoryWithAI('pane')
    expect(result).toBe('Pane e panificati')
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('calls Claude and returns category when local match fails', async () => {
    mockCreate.mockResolvedValue({ content: [{ type: 'text', text: 'Varie' }] })
    const { suggestCategoryWithAI } = await import('./matcher')
    const result = await suggestCategoryWithAI('prodotto_sconosciuto_xyz')
    expect(result).toBe('Varie')
  })

  it('falls back to Varie on API error', async () => {
    mockCreate.mockRejectedValue(new Error('API error'))
    const { suggestCategoryWithAI } = await import('./matcher')
    const result = await suggestCategoryWithAI('prodotto_sconosciuto_xyz')
    expect(result).toBe('Varie')
  })
})
