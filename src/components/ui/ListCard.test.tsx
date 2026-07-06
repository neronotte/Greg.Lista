import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ListCard from './ListCard'

const base = {
  id: 'abc',
  name: 'Spesa settimanale',
  itemCount: 5,
  updatedAt: new Date().toISOString(),
}

describe('ListCard', () => {
  it('renders list name', () => {
    render(<ListCard {...base} visibility="private" />)
    expect(screen.getByText('Spesa settimanale')).toBeInTheDocument()
  })

  it('shows lock icon for private list', () => {
    render(<ListCard {...base} visibility="private" />)
    expect(screen.getByLabelText('Lista privata')).toBeInTheDocument()
  })

  it('shows users icon for family list', () => {
    render(<ListCard {...base} visibility="family" familyName="Gregori" />)
    expect(screen.getByLabelText('Lista famiglia — Gregori')).toBeInTheDocument()
  })

  it('renders item count', () => {
    render(<ListCard {...base} visibility="private" />)
    expect(screen.getByText('5 articoli')).toBeInTheDocument()
  })

  it('renders singular for 1 item', () => {
    render(<ListCard {...base} itemCount={1} visibility="private" />)
    expect(screen.getByText('1 articolo')).toBeInTheDocument()
  })

  it('links to the list detail page', () => {
    render(<ListCard {...base} visibility="private" />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/lists/abc')
  })
})
