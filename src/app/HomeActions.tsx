'use client'

import { useState } from 'react'
import FAB from '@/components/ui/FAB'
import BottomSheet from '@/components/ui/BottomSheet'
import ListForm from '@/components/lists/ListForm'

interface HomeActionsProps {
  families: { id: string; name: string }[]
}

export default function HomeActions({ families }: HomeActionsProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <FAB onClick={() => setOpen(true)} ariaLabel="New list" />
      <BottomSheet open={open} onClose={() => setOpen(false)} title="New Shopping List">
        <ListForm families={families} onDone={() => setOpen(false)} />
      </BottomSheet>
    </>
  )
}
