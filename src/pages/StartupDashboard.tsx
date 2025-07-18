import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Plus, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Building2,
  FileText,
  Award,
  Upload,
  Eye,
  Share2,
  Users,
  BarChart3,
  Calendar,
  Target
} from 'lucide-react'
import { blink } from '@/blink/client'
import { toast } from 'sonner'
import DashboardNavigation from '@/components/DashboardNavigation'

interface RSACampaign {
  id: string
  title: string
  description: string
  fundingGoal: number
  amountRaised: number
  revenueSharePercentage: number
  repaymentCap: number
  status: string
  createdAt: string
  monthlyRevenue: number
  totalRevenuePaid: number
}

interface RevenueReport {
  id: string
  campaignId: string
  month: string
  revenue: number
  reportedAt: string
  status: 'Pending' | 'Approved' | 'Disputed'
}

export default function StartupDashboard() {
  const [user, setUser] = useState<any>(null)
  const [campaigns, setCampaigns] = useState<RSACampaign[]>([])
  const [revenueReports, setRevenueReports] = useState<RevenueReport[]>([])
  const [loading, setLoading] = useState(true)
  const [showRSAWizard, setShowRSAWizard] = useState(false)
  const [showRevenueDialog, setShowRevenueDialog] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<RSACampaign | null>(null)
  const [newRevenue, setNewRevenue] = useState<number>(0)

  // RSA Creation Form State
  const [rsaData, setRsaData] = useState({
    title: '',
    description: '',
    fundingGoal: 50000,
    revenueSharePercentage: 5,
    repaymentCap: 2
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await blink.auth.me()
        setUser(userData)
        
        // Load campaigns from localStorage
        const storedCampaigns = JSON.parse(localStorage.getItem('startup_campaigns') || '[]')
        setCampaigns(storedCampaigns)

        // Load revenue reports from localStorage
        const storedReports = JSON.parse(localStorage.getItem('revenue_reports') || '[]')
        setRevenueReports(storedReports)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const calculateStats = () => {
    const totalRaised = campaigns.reduce((sum, campaign) => sum + campaign.amountRaised, 0)
    const activeCampaigns = campaigns.filter(campaign => campaign.status === 'Active').length
    const totalRevenuePaid = campaigns.reduce((sum, campaign) => sum + campaign.totalRevenuePaid, 0)
    const avgFundingProgress = campaigns.length > 0 
      ? campaigns.reduce((sum, campaign) => sum + (campaign.amountRaised / campaign.fundingGoal), 0) / campaigns.length * 100
      : 0
    
    return { totalRaised, activeCampaigns, totalRevenuePaid, avgFundingProgress }
  }

  const { totalRaised, activeCampaigns, totalRevenuePaid, avgFundingProgress } = calculateStats()

  const handleCreateRSA = async () => {
    try {
      const user = await blink.auth.me()
      
      const rsaId = `rsa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const newRSA: RSACampaign = {
        id: rsaId,
        title: rsaData.title,
        description: rsaData.description,
        fundingGoal: rsaData.fundingGoal,
        amountRaised: 0,
        revenueSharePercentage: rsaData.revenueSharePercentage,
        repaymentCap: rsaData.repaymentCap,
        status: 'Active',
        createdAt: new Date().toISOString(),
        monthlyRevenue: 0,
        totalRevenuePaid: 0
      }
      
      const existingCampaigns = JSON.parse(localStorage.getItem('startup_campaigns') || '[]')
      existingCampaigns.push(newRSA)
      localStorage.setItem('startup_campaigns', JSON.stringify(existingCampaigns))
      
      setCampaigns(existingCampaigns)
      toast.success('RSA campaign created successfully!')
      setShowRSAWizard(false)
      
      // Reset form
      setRsaData({
        title: '',
        description: '',
        fundingGoal: 50000,
        revenueSharePercentage: 5,
        repaymentCap: 2
      })
    } catch (error) {
      console.error('Error creating RSA:', error)
      toast.error('Failed to create RSA campaign. Please try again.')
    }
  }

  const handleReportRevenue = async () => {
    if (!selectedCampaign || !newRevenue) return

    try {
      const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format
      
      const newReport: RevenueReport = {
        id: reportId,
        campaignId: selectedCampaign.id,
        month: currentMonth,
        revenue: newRevenue,
        reportedAt: new Date().toISOString(),
        status: 'Pending'
      }
      
      const existingReports = [...revenueReports, newReport]
      localStorage.setItem('revenue_reports', JSON.stringify(existingReports))
      setRevenueReports(existingReports)
      
      // Update campaign with new revenue
      const updatedCampaigns = campaigns.map(campaign => {
        if (campaign.id === selectedCampaign.id) {
          const revenueShare = newRevenue * (campaign.revenueSharePercentage / 100)
          return {
            ...campaign,
            monthlyRevenue: newRevenue,
            totalRevenuePaid: campaign.totalRevenuePaid + revenueShare
          }
        }
        return campaign
      })
      
      localStorage.setItem('startup_campaigns', JSON.stringify(updatedCampaigns))
      setCampaigns(updatedCampaigns)
      
      toast.success(`Revenue report submitted for ${currentMonth}`)
      setShowRevenueDialog(false)
      setSelectedCampaign(null)
      setNewRevenue(0)
    } catch (error) {
      console.error('Error reporting revenue:', error)
      toast.error('Failed to submit revenue report. Please try again.')
    }
  }

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
      <DashboardNavigation userType="startup" title="Startup Dashboard" user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.email?.split('@')[0] || 'Founder'}!
          </h2>
          <p className="text-muted-foreground">
            Manage your Revenue Share Agreements and track your funding progress.
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
                {campaigns.length > 0 ? `Across ${campaigns.length} RSA${campaigns.length > 1 ? 's' : ''}` : 'No RSAs yet'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active RSAs</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCampaigns}</div>
              <p className="text-xs text-muted-foreground">
                {avgFundingProgress > 0 ? `${avgFundingProgress.toFixed(0)}% avg funded` : 'Create your first RSA'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Shared</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenuePaid.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Paid to investors
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Company Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">
                +3% this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList>
            <TabsTrigger value="campaigns">My RSAs</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Reports</TabsTrigger>
            <TabsTrigger value="investors">Investors</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Revenue Share Agreements</h3>
              <Button onClick={() => setShowRSAWizard(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create New RSA
              </Button>
            </div>

            {campaigns.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No RSAs Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first Revenue Share Agreement to start raising funds for your startup.
                  </p>
                  <Button onClick={() => setShowRSAWizard(true)} size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First RSA
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{campaign.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {campaign.description}
                          </CardDescription>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                            <span>Goal: ${campaign.fundingGoal.toLocaleString()}</span>
                            <span>•</span>
                            <span>Revenue Share: {campaign.revenueSharePercentage}%</span>
                            <span>•</span>
                            <span>Cap: {campaign.repaymentCap}x</span>
                          </div>
                        </div>
                        <Badge 
                          variant={campaign.status === 'Active' ? 'default' : 'secondary'}
                          className="ml-4"
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Funding Progress</span>
                            <span>${campaign.amountRaised.toLocaleString()} / ${campaign.fundingGoal.toLocaleString()}</span>
                          </div>
                          <Progress value={(campaign.amountRaised / campaign.fundingGoal) * 100} className="h-2" />
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Monthly Revenue</div>
                            <div className="font-medium">${campaign.monthlyRevenue.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Revenue Shared</div>
                            <div className="font-medium">${campaign.totalRevenuePaid.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Investors</div>
                            <div className="font-medium">{Math.floor(Math.random() * 15) + 3}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Days Active</div>
                            <div className="font-medium">
                              {Math.floor((Date.now() - new Date(campaign.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center pt-4 border-t">
                          <div className="text-sm text-muted-foreground">
                            Next revenue report due: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedCampaign(campaign)
                                setShowRevenueDialog(true)
                              }}
                            >
                              <Upload className="h-4 w-4 mr-1" />
                              Report Revenue
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                            <Button size="sm">
                              <Share2 className="h-4 w-4 mr-1" />
                              Share RSA
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

          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Revenue Reports
                </CardTitle>
                <CardDescription>
                  Monthly revenue reports for your active RSA campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                {revenueReports.length === 0 ? (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Revenue Reports</h3>
                    <p className="text-muted-foreground">
                      Submit your first monthly revenue report to start sharing revenue with investors.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {revenueReports.map((report) => {
                      const campaign = campaigns.find(c => c.id === report.campaignId)
                      const revenueShare = report.revenue * ((campaign?.revenueSharePercentage || 0) / 100)
                      
                      return (
                        <div key={report.id} className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">{campaign?.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {report.month} • Reported {new Date(report.reportedAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${report.revenue.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">
                              ${revenueShare.toLocaleString()} shared ({campaign?.revenueSharePercentage}%)
                            </div>
                          </div>
                          <Badge variant={
                            report.status === 'Approved' ? 'default' :
                            report.status === 'Pending' ? 'secondary' : 'destructive'
                          }>
                            {report.status}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Investor Relations
                </CardTitle>
                <CardDescription>
                  Manage relationships with your RSA investors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Investor Dashboard Coming Soon</h3>
                  <p className="text-muted-foreground">
                    View detailed investor information, communication history, and payment tracking.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* RSA Creation Dialog */}
      <Dialog open={showRSAWizard} onOpenChange={setShowRSAWizard}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Revenue Share Agreement</DialogTitle>
            <DialogDescription>
              Set up your funding terms and revenue sharing structure
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Campaign Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., AI-Powered Analytics Platform Expansion"
                  value={rsaData.title}
                  onChange={(e) => setRsaData({ ...rsaData, title: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your startup, growth plans, and how you'll use the funding..."
                  value={rsaData.description}
                  onChange={(e) => setRsaData({ ...rsaData, description: e.target.value })}
                  className="mt-1 min-h-[120px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="fundingGoal">Funding Goal (USD)</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fundingGoal"
                    type="number"
                    min="10000"
                    max="500000"
                    step="5000"
                    value={rsaData.fundingGoal}
                    onChange={(e) => setRsaData({ ...rsaData, fundingGoal: Number(e.target.value) })}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="revenueShare">Revenue Share (%)</Label>
                <Input
                  id="revenueShare"
                  type="number"
                  min="2"
                  max="15"
                  step="0.5"
                  value={rsaData.revenueSharePercentage}
                  onChange={(e) => setRsaData({ ...rsaData, revenueSharePercentage: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="repaymentCap">Repayment Cap (x)</Label>
                <Input
                  id="repaymentCap"
                  type="number"
                  min="1.5"
                  max="5"
                  step="0.1"
                  value={rsaData.repaymentCap}
                  onChange={(e) => setRsaData({ ...rsaData, repaymentCap: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                RSA Summary
              </h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Funding Goal:</span>
                  <span>${rsaData.fundingGoal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Revenue Share:</span>
                  <span>{rsaData.revenueSharePercentage}% of monthly revenue</span>
                </div>
                <div className="flex justify-between">
                  <span>Maximum Repayment:</span>
                  <span>${(rsaData.fundingGoal * rsaData.repaymentCap).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowRSAWizard(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={handleCreateRSA}
                disabled={!rsaData.title || !rsaData.description}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Create RSA Campaign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Revenue Report Dialog */}
      <Dialog open={showRevenueDialog} onOpenChange={setShowRevenueDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Report Monthly Revenue</DialogTitle>
            <DialogDescription>
              Submit your monthly revenue for {selectedCampaign?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <Label htmlFor="revenue">Monthly Revenue (USD)</Label>
              <div className="relative mt-1">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="revenue"
                  type="number"
                  min="0"
                  step="100"
                  value={newRevenue}
                  onChange={(e) => setNewRevenue(Number(e.target.value))}
                  className="pl-10"
                  placeholder="Enter your monthly revenue"
                />
              </div>
            </div>

            {newRevenue > 0 && selectedCampaign && (
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Revenue Share Calculation</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Monthly Revenue:</span>
                    <span>${newRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Share Percentage:</span>
                    <span>{selectedCampaign.revenueSharePercentage}%</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Amount to Share:</span>
                    <span className="text-green-600">
                      ${(newRevenue * (selectedCampaign.revenueSharePercentage / 100)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowRevenueDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={handleReportRevenue}
                disabled={!newRevenue}
              >
                <Upload className="h-4 w-4 mr-2" />
                Submit Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}