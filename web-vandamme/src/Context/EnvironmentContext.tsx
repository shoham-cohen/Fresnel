
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

type EnvironmentContextType = {
  isSimulation: boolean
  setIsSimulation: (value: boolean) => void
}

const EnvironmentContext =
  createContext<EnvironmentContextType | null>(null)

type Props = {
  children: ReactNode
}

export function EnvironmentProvider({ children }: Props) {
  const [isSimulation, setIsSimulation] = useState(false)

  return (
    <EnvironmentContext.Provider
      value={{ isSimulation, setIsSimulation }}
    >
      {children}
    </EnvironmentContext.Provider>
  )
}

export function useEnvironment() {
  const context = useContext(EnvironmentContext)

  if (context === null) {
    throw new Error(
      'useEnvironment must be used within EnvironmentProvider',
    )
  }

  return context
}