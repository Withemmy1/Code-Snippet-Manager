import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from '@/components/ui/toaster'
import MainLayout from '@/components/layout/MainLayout'
import Login from '@/components/auth/Login'
import Register from '@/components/auth/Register'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import UserSettings from '@/components/user/UserSettings'
import SnippetList from '@/components/snippets/SnippetList'
import SnippetForm from '@/components/snippets/SnippetForm'
import Dashboard from '@/components/dashboard/Dashboard'
import { ThemeProvider } from '@/components/theme-provider'
import PublicGallery from '@/components/snippets/PublicGallery'

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <MainLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/snippets" element={<SnippetList />} />
                <Route path="/new" element={<SnippetForm />} />
                <Route path="/snippets/:id" element={<SnippetForm />} />
                <Route path="/settings" element={<UserSettings />} />
                <Route path="/browse" element={<SnippetList public={true} />} />
                <Route path="/gallery" element={<PublicGallery />} />
              </Route>
            </Routes>
          </MainLayout>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App 