//import React from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { useNavigate, Link } from "react-router-dom"

const Header = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Code Snippet Manager</h1>
        </div>
        <nav className="flex items-center space-x-4">
          {user ? (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
              >
                My Snippets
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/new")}
              >
                New Snippet
              </Button>
              <Button
                variant="outline"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
              <Link to="/gallery">Public Gallery</Link>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                variant="default"
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header 