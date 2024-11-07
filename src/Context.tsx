import { createContext } from "react";

export type focus = "main" | "prompt"
export const FocusContext = createContext<focus>("main");