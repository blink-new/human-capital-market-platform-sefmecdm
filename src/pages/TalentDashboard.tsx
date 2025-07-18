import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  User,
  FileText,
  Award,
  Upload,
  Eye,
  Share2
} from 'lucide-react'
import { blink } from '@/blink/client'
import FOACreationWizard from '@/components/FOACreationWizard'
import DashboardNavigation from '@/components/DashboardNavigation'

export default function TalentDashboard() {
  const [user, setUser] = useState<any>(null)
  const [foas, setFoas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showFOAWizard, setShowFOAWizard] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await blink.auth.me()
        setUser(userData)
        
        // Load FOAs from localStorage (in production, this would be from database)
        const storedFOAs = JSON.parse(localStorage.getItem('user_foas') || '[]')
        setFoas(storedFOAs)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const loadFOAs = () => {
    const storedFOAs = JSON.parse(localStorage.getItem('user_foas') || '[]')
    setFoas(storedFOAs)
  }

  const calculateStats = () => {
    const totalRaised = foas.reduce((sum, foa) => sum + foa.amountRaised, 0)
    const activeFOAs = foas.filter(foa => foa.status === 'Active').length
    const avgFundingProgress = foas.length > 0 
      ? foas.reduce((sum, foa) => sum + (foa.amountRaised / foa.fundingGoal), 0) / foas.length * 100
      : 0
    
    return { totalRaised, activeFOAs, avgFundingProgress }
  }

  const { totalRaised, activeFOAs, avgFundingProgress } = calculateStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <DashboardNavigation userType="talent" title="Talent Dashboard" user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.email?.split('@')[0] || 'Talent'}!
          </h2>
          <p className="text-muted-foreground">
            Manage your Fixed-Outcome Agreements and track your funding progress.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRaised.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {foas.length > 0 ? `Across ${foas.length} FOA${foas.length > 1 ? 's' : ''}` : 'No FOAs yet'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active FOAs</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeFOAs}</div>
              <p className="text-xs text-muted-foreground">
                {avgFundingProgress > 0 ? `${avgFundingProgress.toFixed(0)}% avg funded` : 'Create your first FOA'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Repayment Status</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Pending</div>
              <p className="text-xs text-muted-foreground">
                Awaiting employment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">
                +5% this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="foas" className="space-y-6">
          <TabsList>
            <TabsTrigger value="foas">My FOAs</TabsTrigger>
            <TabsTrigger value="repayments">Repayments</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="foas" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Fixed-Outcome Agreements</h3>
              <Button onClick={() => setShowFOAWizard(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create New FOA
              </Button>
            </div>

            {foas.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No FOAs Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first Fixed-Outcome Agreement to start raising funds for your career goals.
                  </p>
                  <Button onClick={() => setShowFOAWizard(true)} size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First FOA
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {foas.map((foa) => (
                  <Card key={foa.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{foa.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {foa.description}
                          </CardDescription>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                            <span>Goal: ${foa.fundingGoal.toLocaleString()}</span>
                            <span>•</span>
                            <span>Repayment: ${foa.fixedRepaymentTotal.toLocaleString()}</span>
                            <span>•</span>
                            <span>{foa.repaymentDurationMonths} months</span>
                          </div>
                        </div>
                        <Badge 
                          variant={foa.status === 'Active' ? 'default' : 'secondary'}
                          className="ml-4"
                        >
                          {foa.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Funding Progress</span>
                            <span>${foa.amountRaised.toLocaleString()} / ${foa.fundingGoal.toLocaleString()}</span>
                          </div>
                          <Progress value={(foa.amountRaised / foa.fundingGoal) * 100} className="h-2" />
                        </div>
                        
                        <div className="flex justify-between items-center pt-4 border-t">
                          <div className="text-sm text-muted-foreground">
                            Monthly Repayment: ${foa.monthlyInstallmentAmount.toFixed(2)}
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                            <Button size="sm">
                              <Share2 className="h-4 w-4 mr-1" />
                              Share FOA
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="repayments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Repayment Schedule
                </CardTitle>
                <CardDescription>
                  Your repayment schedule will be activated once employment is verified.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-12 text-center">
                  <div>
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Active Repayments</h3>
                    <p className="text-muted-foreground mb-4">
                      Upload your employment verification to activate repayment schedule.
                    </p>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Employment Letter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Completion
                </CardTitle>
                <CardDescription>
                  Complete your profile to increase your funding potential.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Profile Completeness</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  
                  <div className="space-y-3 pt-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Basic Information</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Work Links</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Verified Credentials</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Professional Vouch</span>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-6">
                    Complete Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* FOA Creation Wizard */}
      <FOACreationWizard 
        open={showFOAWizard}
        onOpenChange={setShowFOAWizard}
        onSuccess={loadFOAs}
      />
    </div>
  )
}