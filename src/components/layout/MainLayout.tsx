import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Code2, Settings, PlusCircle, Library, Search } from 'lucide-react'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const navItems = [
    { path: '/snippets', label: 'My Snippets', icon: <Library className="w-4 h-4" /> },
    { path: '/new', label: 'New Snippet', icon: <PlusCircle className="w-4 h-4" /> },
    { path: '/browse', label: 'Browse', icon: <Search className="w-4 h-4" /> },
    { path: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen bg-background">
      {user && (
        <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="link" onClick={() => navigate('/')} className="font-bold text-lg">
                  <Code2 className="w-5 h-5 mr-2" />
                  Snippet Manager
                </Button>
                <nav className="hidden md:flex items-center space-x-2">
                  {navItems.map((item) => (
                    <Button
                      key={item.path}
                      variant={location.pathname === item.path ? "secondary" : "ghost"}
                      onClick={() => navigate(item.path)}
                      className="flex items-center gap-2"
                    >
                      {item.icon}
                      {item.label}
                    </Button>
                  ))}
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground hidden md:inline-block">
                  {user.email}
                </span>
                <ThemeToggle />
                <Button variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  )
}

export default MainLayout 