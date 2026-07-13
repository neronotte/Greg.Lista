import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AppBar from './AppBar'

describe('AppBar', () => {
  it('renders title', () => {
    render(<AppBar title="List@" />)
    expect(screen.getByText('List@')).toBeInTheDocument()
  })

  it('shows back arrow when backHref is provided', () => {
    render(<AppBar title="Dettaglio" backHref="/" />)
    expect(screen.getByRole('link', { name: 'Indietro' })).toBeInTheDocument()
  })

  it('does not show back arrow without backHref', () => {
    render(<AppBar title="Home" />)
    expect(screen.queryByRole('link', { name: 'Indietro' })).not.toBeInTheDocument()
  })

  it('applies shopping variant class', () => {
    const { container } = render(<AppBar title="Spesa" variant="shopping" />)
    expect(container.firstChild).toHaveClass('bg-brand-mid')
  })

  it('renders actions slot', () => {
    render(<AppBar title="Home" actions={<button>More</button>} />)
    expect(screen.getByRole('button', { name: 'More' })).toBeInTheDocument()
  })
})
