import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ItemRow from './ItemRow'

describe('ItemRow', () => {
  it('renders item name', () => {
    render(<ItemRow id="1" name="Parmigiano" />)
    expect(screen.getByText('Parmigiano')).toBeInTheDocument()
  })

  it('shows quantity and unit', () => {
    render(<ItemRow id="1" name="Latte" quantity="2" unit="L" />)
    expect(screen.getByText('2 L')).toBeInTheDocument()
  })

  it('shows category when showCategory=true', () => {
    render(<ItemRow id="1" name="Mele" categoryName="Frutta e verdura" showCategory />)
    expect(screen.getByText('Frutta e verdura')).toBeInTheDocument()
  })

  it('applies line-through and bg-checked when checked', () => {
    const { container } = render(<ItemRow id="1" name="Mele" checked />)
    expect(container.firstChild).toHaveClass('bg-bg-checked')
    expect(screen.getByText('Mele')).toHaveClass('line-through')
  })

  it('calls onToggle with new checked state on click', async () => {
    const onToggle = vi.fn()
    render(<ItemRow id="1" name="Mele" checked={false} onToggle={onToggle} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalledWith('1', true)
  })
})
