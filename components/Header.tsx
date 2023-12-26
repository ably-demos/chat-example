import appConfig from "@/config/app"
import MainNav from "@/components/MainNav"
import ThemeToggle from "@/components/ThemeToggle"

const Header = () => {
  return (
    <header className="w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={appConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
