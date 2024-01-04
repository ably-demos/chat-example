import { Theme } from "@/providers/ThemeProvider"
import { useTheme as useNextTheme } from "next-themes"

export const useTheme = () => {
  const { theme, setTheme } = useNextTheme()
  return {
    theme: theme as Theme | undefined,
    setTheme: setTheme as (theme: Theme) => void,
  }
}
