import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Toaster } from 'sonner'

// Components
import LandingPage from './pages/LandingPage'
import TalentDashboard from './pages/TalentDashboard'
import StartupDashboard from './pages/StartupDashboard'
import InvestorDashboard from './pages/InvestorDashboard'
import UnifiedMarketplace from './pages/UnifiedMarketplace'
import ProfileBuilder from './pages/ProfileBuilder'
import AccreditationFlow from './pages/AccreditationFlow'
import AdminDashboard from './pages/AdminDashboard'
import LoadingScreen from './components/LoadingScreen'

interface User {
  id: string
  email: string
  fullName?: string
  userType?: 'talent' | 'startup' | 'investor' | 'admin'
  isAccredited?: boolean
  accreditationStatus?: string
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  // Auto-redirect based on pending user type from landing page
  useEffect(() => {
    if (user) {
      const pendingUserType = localStorage.getItem('pending_user_type')
      if (pendingUserType && window.location.pathname === '/') {
        localStorage.removeItem('pending_user_type')
        localStorage.setItem(`user_type_${user.id}`, pendingUserType)
        window.location.href = `/${pendingUserType}`
      }
    }
  }, [user])

  // Determine user type from URL or localStorage
  const getUserType = () => {
    const path = window.location.pathname
    if (path.includes('/investor') || path.includes('/marketplace') || path.includes('/accreditation')) {
      return 'investor'
    }
    if (path.includes('/startup')) {
      return 'startup'
    }
    if (path.includes('/talent') || path.includes('/profile')) {
      return 'talent'
    }
    if (path.includes('/admin')) {
      return 'admin'
    }
    
    // Check localStorage for user preference
    const storedUserType = localStorage.getItem(`user_type_${user?.id}`)
    return storedUserType || 'talent'
  }

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return (
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="*" element={<LandingPage />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    )
  }

  const userType = getUserType()

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/talent" element={<TalentDashboard />} />
          <Route path="/startup" element={<StartupDashboard />} />
          <Route path="/investor" element={<InvestorDashboard />} />
          <Route path="/marketplace" element={<UnifiedMarketplace />} />
          <Route path="/profile" element={<ProfileBuilder />} />
          <Route path="/accreditation" element={<AccreditationFlow />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  )
}

export default App