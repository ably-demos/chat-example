import { useTheme as useNextTheme } from "next-themes"

import { Theme } from "@/components/ThemeProvider"

export const useTheme = () => {
  const { theme, setTheme } = useNextTheme()
  return {
    theme: theme as Theme | undefined,
    setTheme: setTheme as (theme: Theme) => void,
  }
}
