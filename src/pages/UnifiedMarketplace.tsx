import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Filter, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  User,
  Award,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Building2,
  Users,
  BarChart3
} from 'lucide-react'
import { blink } from '@/blink/client'
import { toast } from 'sonner'
import DashboardNavigation from '@/components/DashboardNavigation'

interface Campaign {
  id: string
  type: 'Individual_FOA' | 'Startup_RSA'
  userId: string
  title: string
  description: string
  fundingGoal: number
  amountRaised: number
  status: string
  createdAt: string
  // FOA specific fields
  fixedRepaymentTotal?: number
  monthlyInstallmentAmount?: number
  repaymentDurationMonths?: number
  // RSA specific fields
  revenueSharePercentage?: number
  repaymentCap?: number
  // Profile data
  profile?: {
    name: string
    bio: string
    credentials: string[]
    profileScore: number
    entityType?: 'individual' | 'startup'
    teamSize?: number
    industry?: string
  }
}

export default function UnifiedMarketplace() {
  const [user, setUser] = useState<any>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filterBy, setFilterBy] = useState('all')
  const [campaignTypeFilter, setCampaignTypeFilter] = useState<'all' | 'Individual_FOA' | 'Startup_RSA'>('all')
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [investmentAmount, setInvestmentAmount] = useState<number>(0)
  const [showInvestDialog, setShowInvestDialog] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await blink.auth.me()
        setUser(userData)
        
        // Load FOAs from localStorage
        const storedFOAs = JSON.parse(localStorage.getItem('user_foas') || '[]')
        const foaCampaigns = storedFOAs.map((foa: any) => ({
          ...foa,
          type: 'Individual_FOA' as const,
          userId: foa.talentUserId,
          profile: {
            name: 'Alex Johnson',
            bio: 'Full-stack developer with 2 years of experience, recently completed advanced React bootcamp.',
            credentials: ['React Certification', 'Node.js Expert', 'AWS Certified'],
            profileScore: 85,
            entityType: 'individual' as const
          }
        }))

        // Load startup campaigns from localStorage
        const storedStartupCampaigns = JSON.parse(localStorage.getItem('startup_campaigns') || '[]')
        const startupCampaigns = storedStartupCampaigns.map((campaign: any) => ({
          ...campaign,
          type: 'Startup_RSA' as const,
          profile: {
            name: campaign.title.replace(' Campaign', ''),
            bio: 'Early-stage startup with strong traction and experienced team.',
            credentials: ['Y Combinator', 'Series A Ready', 'Product-Market Fit'],
            profileScore: 92,
            entityType: 'startup' as const,
            teamSize: 8,
            industry: 'SaaS'
          }
        }))

        // Add some mock startup campaigns for demo
        const mockStartupCampaigns: Campaign[] = [
          {
            id: 'startup_1',
            type: 'Startup_RSA',
            userId: 'startup_user_1',
            title: 'AI-Powered Analytics Platform',
            description: 'Revolutionary analytics platform using machine learning to provide real-time business insights. Seeking $150k to scale our engineering team and expand market reach.',
            fundingGoal: 150000,
            amountRaised: 87000,
            status: 'Active',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            revenueSharePercentage: 5,
            repaymentCap: 2,
            profile: {
              name: 'DataFlow Analytics',
              bio: 'Early-stage B2B SaaS startup with 50+ enterprise customers and $30k MRR.',
              credentials: ['Y Combinator S23', 'Product-Market Fit', 'Enterprise Ready'],
              profileScore: 94,
              entityType: 'startup',
              teamSize: 12,
              industry: 'AI/ML'
            }
          },
          {
            id: 'startup_2',
            type: 'Startup_RSA',
            userId: 'startup_user_2',
            title: 'Sustainable Food Delivery',
            description: 'Carbon-neutral food delivery platform connecting local restaurants with eco-conscious consumers. Proven model in 3 cities, ready to expand.',
            fundingGoal: 75000,
            amountRaised: 45000,
            status: 'Active',
            createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            revenueSharePercentage: 6,
            repaymentCap: 2.5,
            profile: {
              name: 'GreenEats',
              bio: 'Mission-driven startup reducing food delivery carbon footprint by 80%.',
              credentials: ['B-Corp Certified', 'Climate Tech', 'Proven Unit Economics'],
              profileScore: 88,
              entityType: 'startup',
              teamSize: 6,
              industry: 'FoodTech'
            }
          }
        ]

        const allCampaigns = [...foaCampaigns, ...startupCampaigns, ...mockStartupCampaigns]
        setCampaigns(allCampaigns)
        setFilteredCampaigns(allCampaigns)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    let filtered = [...campaigns]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(campaign => 
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.profile?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply campaign type filter
    if (campaignTypeFilter !== 'all') {
      filtered = filtered.filter(campaign => campaign.type === campaignTypeFilter)
    }

    // Apply status filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(campaign => {
        switch (filterBy) {
          case 'active':
            return campaign.status === 'Active'
          case 'funded':
            return campaign.amountRaised >= campaign.fundingGoal
          case 'partial':
            return campaign.amountRaised > 0 && campaign.amountRaised < campaign.fundingGoal
          default:
            return true
        }
      })
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'funding_high':
          return b.fundingGoal - a.fundingGoal
        case 'funding_low':
          return a.fundingGoal - b.fundingGoal
        case 'progress':
          return (b.amountRaised / b.fundingGoal) - (a.amountRaised / a.fundingGoal)
        default:
          return 0
      }
    })

    setFilteredCampaigns(filtered)
  }, [campaigns, searchTerm, sortBy, filterBy, campaignTypeFilter])

  const handleInvest = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    setInvestmentAmount(Math.min(1000, campaign.fundingGoal - campaign.amountRaised))
    setShowInvestDialog(true)
  }

  const processInvestment = async () => {
    if (!selectedCampaign || !investmentAmount) return

    try {
      // In production, this would process payment through Stripe
      // For now, we'll simulate the investment
      const updatedCampaigns = campaigns.map(campaign => {
        if (campaign.id === selectedCampaign.id) {
          return {
            ...campaign,
            amountRaised: Math.min(campaign.fundingGoal, campaign.amountRaised + investmentAmount)
          }
        }
        return campaign
      })

      // Update localStorage based on campaign type
      if (selectedCampaign.type === 'Individual_FOA') {
        const foaCampaigns = updatedCampaigns.filter(c => c.type === 'Individual_FOA')
        localStorage.setItem('user_foas', JSON.stringify(foaCampaigns))
      } else {
        const startupCampaigns = updatedCampaigns.filter(c => c.type === 'Startup_RSA')
        localStorage.setItem('startup_campaigns', JSON.stringify(startupCampaigns))
      }

      setCampaigns(updatedCampaigns)
      
      toast.success(`Successfully invested $${investmentAmount.toLocaleString()} in ${selectedCampaign.title}!`)
      setShowInvestDialog(false)
      setSelectedCampaign(null)
      setInvestmentAmount(0)
    } catch (error) {
      console.error('Investment error:', error)
      toast.error('Investment failed. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading marketplace...</p>
        </div>
      </div>
    )
  }

  const individualCampaigns = filteredCampaigns.filter(c => c.type === 'Individual_FOA')
  const startupCampaigns = filteredCampaigns.filter(c => c.type === 'Startup_RSA')

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <DashboardNavigation userType="investor" title="Investment Marketplace" user={user} />
      
      {/* Marketplace Stats */}
      <div className="bg-card/30 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center space-x-6">
            <Badge variant="secondary" className="px-4 py-2">
              <TrendingUp className="h-4 w-4 mr-2" />
              {filteredCampaigns.length} Active Campaigns
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <DollarSign className="h-4 w-4 mr-2" />
              ${campaigns.reduce((sum, c) => sum + c.fundingGoal, 0).toLocaleString()} Total Opportunity
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              {campaigns.filter(c => c.amountRaised >= c.fundingGoal).length} Fully Funded
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns by title, description, or entity name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Select value={campaignTypeFilter} onValueChange={setCampaignTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Campaign type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                <SelectItem value="Individual_FOA">Individuals (FOA)</SelectItem>
                <SelectItem value="Startup_RSA">Startups (RSA)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="partial">Partially Funded</SelectItem>
                <SelectItem value="funded">Fully Funded</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="funding_high">Highest Funding</SelectItem>
                <SelectItem value="funding_low">Lowest Funding</SelectItem>
                <SelectItem value="progress">Most Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabbed View */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Campaigns ({filteredCampaigns.length})</TabsTrigger>
            <TabsTrigger value="individuals">Individuals ({individualCampaigns.length})</TabsTrigger>
            <TabsTrigger value="startups">Startups ({startupCampaigns.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <CampaignGrid campaigns={filteredCampaigns} onInvest={handleInvest} />
          </TabsContent>

          <TabsContent value="individuals" className="mt-6">
            <CampaignGrid campaigns={individualCampaigns} onInvest={handleInvest} />
          </TabsContent>

          <TabsContent value="startups" className="mt-6">
            <CampaignGrid campaigns={startupCampaigns} onInvest={handleInvest} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Investment Dialog */}
      <Dialog open={showInvestDialog} onOpenChange={setShowInvestDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invest in {selectedCampaign?.title}</DialogTitle>
            <DialogDescription>
              Enter your investment amount for this {selectedCampaign?.type === 'Individual_FOA' ? 'Fixed-Outcome Agreement' : 'Revenue Share Agreement'}
            </DialogDescription>
          </DialogHeader>

          {selectedCampaign && (
            <div className="space-y-6">
              <div className="bg-card/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Investment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Funding Goal:</span>
                    <span>${selectedCampaign.fundingGoal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Already Raised:</span>
                    <span>${selectedCampaign.amountRaised.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining:</span>
                    <span>${(selectedCampaign.fundingGoal - selectedCampaign.amountRaised).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>
                      {selectedCampaign.type === 'Individual_FOA' ? 'Total Repayment:' : 'Revenue Share:'}
                    </span>
                    <span>
                      {selectedCampaign.type === 'Individual_FOA' 
                        ? `$${selectedCampaign.fixedRepaymentTotal?.toLocaleString()}`
                        : `${selectedCampaign.revenueSharePercentage}% until ${selectedCampaign.repaymentCap}x cap`
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Investment Amount (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    min="100"
                    max={selectedCampaign.fundingGoal - selectedCampaign.amountRaised}
                    step="100"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum: $100 • Maximum: ${(selectedCampaign.fundingGoal - selectedCampaign.amountRaised).toLocaleString()}
                </p>
              </div>

              {investmentAmount > 0 && (
                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    Expected Return
                  </h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Your Investment:</span>
                      <span>${investmentAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Your Share:</span>
                      <span>{((investmentAmount / selectedCampaign.fundingGoal) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Expected Return:</span>
                      <span className="text-green-600">
                        {selectedCampaign.type === 'Individual_FOA' 
                          ? `$${((investmentAmount / selectedCampaign.fundingGoal) * (selectedCampaign.fixedRepaymentTotal || 0)).toLocaleString()}`
                          : `${selectedCampaign.revenueSharePercentage}% of revenue until ${((investmentAmount * (selectedCampaign.repaymentCap || 2)) / 1000).toFixed(0)}k returned`
                        }
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />
                  Important Notice
                </h4>
                <p className="text-sm text-muted-foreground">
                  {selectedCampaign.type === 'Individual_FOA' 
                    ? 'This is a Fixed-Outcome Agreement. Repayments begin only after the individual secures employment and uploads verification.'
                    : 'This is a Revenue Share Agreement. Returns are based on the startup\'s monthly revenue reports and are subject to business performance.'
                  } All investments are subject to risk.
                </p>
              </div>

              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowInvestDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={processInvestment}
                  disabled={!investmentAmount || investmentAmount < 100}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Invest ${investmentAmount.toLocaleString()}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface CampaignGridProps {
  campaigns: Campaign[]
  onInvest: (campaign: Campaign) => void
}

function CampaignGrid({ campaigns, onInvest }: CampaignGridProps) {
  if (campaigns.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Campaigns Found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters to find investment opportunities.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {campaigns.map((campaign) => {
        const fundingProgress = (campaign.amountRaised / campaign.fundingGoal) * 100
        const isFullyFunded = campaign.amountRaised >= campaign.fundingGoal
        const isStartup = campaign.type === 'Startup_RSA'

        return (
          <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <div className="flex gap-2">
                  <Badge variant={isFullyFunded ? 'secondary' : 'default'}>
                    {isFullyFunded ? 'Fully Funded' : 'Active'}
                  </Badge>
                  <Badge variant="outline" className={isStartup ? 'bg-accent/10 text-accent border-accent/20' : 'bg-primary/10 text-primary border-primary/20'}>
                    {isStartup ? 'RSA' : 'FOA'}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Score</div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 text-amber-500 mr-1" />
                    <span className="font-medium">{campaign.profile?.profileScore}%</span>
                  </div>
                </div>
              </div>
              
              <CardTitle className="text-lg">{campaign.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {campaign.description}
              </CardDescription>
              
              <div className="flex items-center space-x-2 mt-2">
                {isStartup ? (
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <User className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm font-medium">{campaign.profile?.name}</span>
                {isStartup && campaign.profile?.teamSize && (
                  <Badge variant="outline" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    {campaign.profile.teamSize} team
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Funding Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Funding Progress</span>
                    <span className="font-medium">
                      ${campaign.amountRaised.toLocaleString()} / ${campaign.fundingGoal.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={fundingProgress} className="h-2" />
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {isStartup ? (
                    <>
                      <div>
                        <div className="text-muted-foreground">Revenue Share</div>
                        <div className="font-medium">{campaign.revenueSharePercentage}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Repayment Cap</div>
                        <div className="font-medium">{campaign.repaymentCap}x</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Industry</div>
                        <div className="font-medium">{campaign.profile?.industry}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Time Left</div>
                        <div className="font-medium flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {Math.floor(Math.random() * 30) + 1} days
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <div className="text-muted-foreground">Monthly Repayment</div>
                        <div className="font-medium">${campaign.monthlyInstallmentAmount?.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Duration</div>
                        <div className="font-medium">{campaign.repaymentDurationMonths} months</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Total Return</div>
                        <div className="font-medium text-green-600">
                          ${((campaign.fixedRepaymentTotal || 0) - campaign.fundingGoal).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Time Left</div>
                        <div className="font-medium flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {Math.floor(Math.random() * 30) + 1} days
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Credentials */}
                <div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {isStartup ? 'Credentials' : 'Credentials'}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {campaign.profile?.credentials.slice(0, 2).map((credential, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {credential}
                      </Badge>
                    ))}
                    {(campaign.profile?.credentials.length || 0) > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{(campaign.profile?.credentials.length || 0) - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  className="w-full mt-4" 
                  onClick={() => onInvest(campaign)}
                  disabled={isFullyFunded}
                >
                  {isFullyFunded ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Fully Funded
                    </>
                  ) : (
                    <>
                      <DollarSign className="h-4 w-4 mr-2" />
                      Invest Now
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}