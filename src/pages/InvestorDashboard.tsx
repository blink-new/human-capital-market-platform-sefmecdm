import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Shield, 
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  Calendar,
  Target,
  Award,
  Building2,
  User,
  Eye
} from 'lucide-react'
import { blink } from '@/blink/client'
import DashboardNavigation from '@/components/DashboardNavigation'

interface Investment {
  id: string
  campaignId: string
  campaignTitle: string
  campaignType: 'Individual_FOA' | 'Startup_RSA'
  entityName: string
  investmentAmount: number
  investmentDate: string
  status: 'Active' | 'Repaying' | 'Completed' | 'Default'
  expectedReturn: number
  actualReturn: number
  nextPaymentDate?: string
  monthlyPayment?: number
  revenueSharePercentage?: number
  repaymentProgress: number
}

export default function InvestorDashboard() {
  const [user, setUser] = useState<any>(null)
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await blink.auth.me()
        setUser(userData)
        
        // Load mock investment data
        const mockInvestments: Investment[] = [
          {
            id: 'inv_1',
            campaignId: 'foa_1',
            campaignTitle: 'Full-Stack Developer Career Transition',
            campaignType: 'Individual_FOA',
            entityName: 'Alex Johnson',
            investmentAmount: 2500,
            investmentDate: '2024-12-15',
            status: 'Active',
            expectedReturn: 3750,
            actualReturn: 0,
            nextPaymentDate: '2025-02-01',
            monthlyPayment: 208.33,
            repaymentProgress: 0
          },
          {
            id: 'inv_2',
            campaignId: 'startup_1',
            campaignTitle: 'AI-Powered Analytics Platform',
            campaignType: 'Startup_RSA',
            entityName: 'DataFlow Analytics',
            investmentAmount: 5000,
            investmentDate: '2024-11-20',
            status: 'Repaying',
            expectedReturn: 10000,
            actualReturn: 1250,
            revenueSharePercentage: 5,
            repaymentProgress: 12.5
          },
          {
            id: 'inv_3',
            campaignId: 'foa_2',
            campaignTitle: 'UX Designer Bootcamp Graduate',
            campaignType: 'Individual_FOA',
            entityName: 'Sarah Chen',
            investmentAmount: 1500,
            investmentDate: '2024-10-10',
            status: 'Repaying',
            expectedReturn: 2250,
            actualReturn: 562.50,
            nextPaymentDate: '2025-01-15',
            monthlyPayment: 125.00,
            repaymentProgress: 25
          },
          {
            id: 'inv_4',
            campaignId: 'startup_2',
            campaignTitle: 'Sustainable Food Delivery',
            campaignType: 'Startup_RSA',
            entityName: 'GreenEats',
            investmentAmount: 3000,
            investmentDate: '2024-09-05',
            status: 'Repaying',
            expectedReturn: 7500,
            actualReturn: 2100,
            revenueSharePercentage: 6,
            repaymentProgress: 28
          }
        ]
        
        setInvestments(mockInvestments)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const calculateStats = () => {
    const totalInvested = investments.reduce((sum, inv) => sum + inv.investmentAmount, 0)
    const totalReturned = investments.reduce((sum, inv) => sum + inv.actualReturn, 0)
    const expectedTotalReturn = investments.reduce((sum, inv) => sum + inv.expectedReturn, 0)
    const activeInvestments = investments.filter(inv => inv.status === 'Active' || inv.status === 'Repaying').length
    const avgReturn = totalInvested > 0 ? ((totalReturned / totalInvested) * 100) : 0
    
    return {
      totalInvested,
      totalReturned,
      expectedTotalReturn,
      activeInvestments,
      avgReturn,
      netProfit: totalReturned - totalInvested
    }
  }

  const { totalInvested, totalReturned, expectedTotalReturn, activeInvestments, avgReturn, netProfit } = calculateStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <DashboardNavigation userType="investor" title="Investor Dashboard" user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.email?.split('@')[0] || 'Investor'}!
          </h2>
          <p className="text-muted-foreground">
            Track your investments and discover new opportunities in the human capital market.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalInvested.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Across {investments.length} investment{investments.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalReturned.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className={netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {netProfit >= 0 ? '+' : ''}${netProfit.toLocaleString()} profit
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeInvestments}</div>
              <p className="text-xs text-muted-foreground">
                {avgReturn.toFixed(1)}% avg return rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expected Returns</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${expectedTotalReturn.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                ${(expectedTotalReturn - totalInvested).toLocaleString()} potential profit
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="returns">Returns</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Investment Portfolio</h3>
              <Button onClick={() => window.location.href = '/marketplace'}>
                <Target className="h-4 w-4 mr-2" />
                Find New Investments
              </Button>
            </div>

            {investments.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Investments Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start building your portfolio by investing in talented individuals and promising startups.
                  </p>
                  <Button onClick={() => window.location.href = '/marketplace'} size="lg">
                    <Target className="h-4 w-4 mr-2" />
                    Browse Investment Opportunities
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {investments.map((investment) => (
                  <Card key={investment.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {investment.campaignType === 'Individual_FOA' ? (
                              <User className="h-5 w-5 text-primary" />
                            ) : (
                              <Building2 className="h-5 w-5 text-accent" />
                            )}
                            <CardTitle className="text-lg">{investment.campaignTitle}</CardTitle>
                          </div>
                          <CardDescription className="flex items-center space-x-4">
                            <span>Entity: {investment.entityName}</span>
                            <span>•</span>
                            <span>Invested: ${investment.investmentAmount.toLocaleString()}</span>
                            <span>•</span>
                            <span>Date: {new Date(investment.investmentDate).toLocaleDateString()}</span>
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={
                              investment.status === 'Active' ? 'default' :
                              investment.status === 'Repaying' ? 'secondary' :
                              investment.status === 'Completed' ? 'outline' : 'destructive'
                            }
                          >
                            {investment.status === 'Active' && <Clock className="h-3 w-3 mr-1" />}
                            {investment.status === 'Repaying' && <TrendingUp className="h-3 w-3 mr-1" />}
                            {investment.status === 'Completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {investment.status === 'Default' && <AlertCircle className="h-3 w-3 mr-1" />}
                            {investment.status}
                          </Badge>
                          <Badge variant="outline">
                            {investment.campaignType === 'Individual_FOA' ? 'FOA' : 'RSA'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Return Progress */}
                        {investment.status === 'Repaying' && (
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Return Progress</span>
                              <span>${investment.actualReturn.toLocaleString()} / ${investment.expectedReturn.toLocaleString()}</span>
                            </div>
                            <Progress value={investment.repaymentProgress} className="h-2" />
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Investment</div>
                            <div className="font-medium">${investment.investmentAmount.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Expected Return</div>
                            <div className="font-medium">${investment.expectedReturn.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Actual Return</div>
                            <div className="font-medium text-green-600">${investment.actualReturn.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">
                              {investment.campaignType === 'Individual_FOA' ? 'Next Payment' : 'Revenue Share'}
                            </div>
                            <div className="font-medium">
                              {investment.campaignType === 'Individual_FOA' 
                                ? investment.nextPaymentDate 
                                  ? new Date(investment.nextPaymentDate).toLocaleDateString()
                                  : 'Pending'
                                : `${investment.revenueSharePercentage}%`
                              }
                            </div>
                          </div>
                        </div>

                        {investment.status === 'Active' && (
                          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-blue-600 mr-2" />
                              <span className="text-sm">
                                {investment.campaignType === 'Individual_FOA' 
                                  ? 'Waiting for employment verification to begin repayments'
                                  : 'Revenue sharing will begin with next monthly report'
                                }
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-4 border-t">
                          <div className="text-sm text-muted-foreground">
                            ROI: {((investment.actualReturn / investment.investmentAmount) * 100).toFixed(1)}%
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="returns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Payment Schedule
                </CardTitle>
                <CardDescription>
                  Upcoming payments from your active investments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investments
                    .filter(inv => inv.status === 'Repaying' && inv.nextPaymentDate)
                    .sort((a, b) => new Date(a.nextPaymentDate!).getTime() - new Date(b.nextPaymentDate!).getTime())
                    .map((investment) => (
                      <div key={investment.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">{investment.campaignTitle}</div>
                          <div className="text-sm text-muted-foreground">{investment.entityName}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${investment.monthlyPayment?.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">
                            Due {new Date(investment.nextPaymentDate!).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  
                  {investments.filter(inv => inv.status === 'Repaying' && inv.nextPaymentDate).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No upcoming payments scheduled
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Investment Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-primary" />
                        Individual FOAs
                      </span>
                      <span className="font-medium">
                        {investments.filter(inv => inv.campaignType === 'Individual_FOA').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <Building2 className="h-4 w-4 mr-2 text-accent" />
                        Startup RSAs
                      </span>
                      <span className="font-medium">
                        {investments.filter(inv => inv.campaignType === 'Startup_RSA').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Average ROI</span>
                      <span className="font-medium text-green-600">{avgReturn.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Success Rate</span>
                      <span className="font-medium">
                        {investments.length > 0 
                          ? ((investments.filter(inv => inv.status !== 'Default').length / investments.length) * 100).toFixed(0)
                          : 0
                        }%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Profit</span>
                      <span className={`font-medium ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${netProfit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}