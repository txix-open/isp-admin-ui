import { Dispatch, SetStateAction, createContext } from 'react'
export interface ContextProps {
    setTheme: Dispatch<SetStateAction<'dark' | 'light' | string>>
}
export const Context = createContext<ContextProps>({
    setTheme: () => 'light'
})