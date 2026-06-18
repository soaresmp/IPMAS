import { createContext, useContext, useState } from 'react'
const AppContext = createContext(null)
export function AppProvider({ children }) {
  const [currentAgency, setCurrentAgency] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  return (
    <AppContext.Provider value={{ currentAgency, setCurrentAgency, currentUser, setCurrentUser }}>
      {children}
    </AppContext.Provider>
  )
}
export function useApp() { return useContext(AppContext) }
