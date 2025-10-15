"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

interface HydrationContextType {
  isHydrated: boolean
}

const HydrationContext = createContext<HydrationContextType>({
  isHydrated: false
})

export function HydrationProvider({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return (
    <HydrationContext.Provider value={{ isHydrated }}>
      {children}
    </HydrationContext.Provider>
  )
}

export function useHydration() {
  return useContext(HydrationContext)
}