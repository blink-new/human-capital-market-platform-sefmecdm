import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Building2, 
  DollarSign, 
  Shield, 
  TrendingUp,
  Target,
  FileText,
  Settings,
  LogOut
} from 'lucide-react'
import { blink } from '@/blink/client'

interface DashboardNavigationProps {
  userType: 'talent' | 'startup' | 'investor' | 'admin'
  title: string
  user?: any
}

export default function DashboardNavigation({ userType, title, user }: DashboardNavigationProps) {
  const getUserTypeIcon = () => {
    switch (userType) {
      case 'talent':
        return <User className="h-3 w-3 mr-1" />
      case 'startup':
        return <Building2 className="h-3 w-3 mr-1" />
      case 'investor':
        return <DollarSign className="h-3 w-3 mr-1" />
      case 'admin':
        return <Shield className="h-3 w-3 mr-1" />
      default:
        return <User className="h-3 w-3 mr-1" />
    }
  }

  const getUserTypeLabel = () => {
    switch (userType) {
      case 'talent':
        return 'Talent'
      case 'startup':
        return 'Startup'
      case 'investor':
        return 'Accredited Investor'
      case 'admin':
        return 'Admin'
      default:
        return 'User'
    }
  }

  const getQuickActions = () => {
    switch (userType) {
      case 'talent':
        return (
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/profile'}>
            <FileText className="h-4 w-4 mr-2" />
            Profile
          </Button>
        )
      case 'startup':
        return (
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/profile'}>
            <FileText className="h-4 w-4 mr-2" />
            Company Profile
          </Button>
        )
      case 'investor':
        return (
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/marketplace'}>
            <Target className="h-4 w-4 mr-2" />
            Browse Marketplace
          </Button>
        )
      case 'admin':
        return (
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-3 mr-6">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-md">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-foreground tracking-tight">HCM</span>
                <div className="text-xs text-muted-foreground font-medium -mt-1">Platform</div>
              </div>
            </div>
            
            {/* Dashboard Title */}
            <div className="flex items-center space-x-3">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h1>
              <Badge variant="secondary" className="hidden sm:flex">
                {getUserTypeIcon()}
                {getUserTypeLabel()}
              </Badge>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* User Type Switcher */}
            <div className="hidden md:flex items-center space-x-2">
              <Button 
                variant={userType === 'talent' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => {
                  if (user) {
                    localStorage.setItem(`user_type_${user.id}`, 'talent')
                    window.location.href = '/talent'
                  }
                }}
              >
                <User className="h-4 w-4 mr-1" />
                Talent
              </Button>
              <Button 
                variant={userType === 'startup' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => {
                  if (user) {
                    localStorage.setItem(`user_type_${user.id}`, 'startup')
                    window.location.href = '/startup'
                  }
                }}
              >
                <Building2 className="h-4 w-4 mr-1" />
                Startup
              </Button>
              <Button 
                variant={userType === 'investor' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => {
                  if (user) {
                    localStorage.setItem(`user_type_${user.id}`, 'investor')
                    window.location.href = '/investor'
                  }
                }}
              >
                <DollarSign className="h-4 w-4 mr-1" />
                Investor
              </Button>
            </div>
            
            {/* Quick Actions */}
            {getQuickActions()}
            
            {/* Sign Out */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => blink.auth.logout()}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}