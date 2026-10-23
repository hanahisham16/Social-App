import { createContext, type Dispatch, type SetStateAction } from "react"

export type TokenContextType ={
    token : string | null ,
    setToken : Dispatch<SetStateAction<string | null>>
}

export const TokenContext = createContext<TokenContextType | null >(null)
