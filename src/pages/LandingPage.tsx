import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  Shield, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Star, 
  DollarSign, 
  Clock, 
  Award,
  Sparkles,
  Lock,
  Zap,
  Globe,
  BarChart3,
  Target
} from 'lucide-react'
import { blink } from '@/blink/client'

export default function LandingPage() {
  const [userType, setUserType] = useState<'talent' | 'startup' | 'investor' | null>(null)

  const handleGetStarted = async (type: 'talent' | 'startup' | 'investor') => {
    setUserType(type)
    localStorage.setItem('pending_user_type', type)
    const redirectUrl = `${window.location.origin}/${type}`
    blink.auth.login(redirectUrl)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/3">
      {/* Premium Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-foreground tracking-tight">HCM</span>
                <div className="text-xs text-muted-foreground font-medium -mt-1">Platform</div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                How it Works
              </a>
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-full border-border/50 hover:border-primary/50 hover:bg-primary/5"
                onClick={() => blink.auth.login(window.location.origin)}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Apple-inspired */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            {/* Premium badge */}
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-8 shadow-lg">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">SEC Compliant</span>
              <div className="w-1 h-1 bg-primary/50 rounded-full"></div>
              <span className="text-sm font-medium text-muted-foreground">Accredited Investors Only</span>
            </div>
            
            {/* Hero headline */}
            <h1 className="text-display mb-8 bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent leading-tight">
              The Future of
              <br />
              <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                Capital Allocation
              </span>
            </h1>
            
            {/* Hero description */}
            <p className="text-xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
              The world's first unified marketplace where individuals and startups secure funding from 
              accredited investors through Fixed-Outcome Agreements and Revenue Share Agreements.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                size="lg" 
                className="btn-primary px-8 py-4 text-base font-semibold rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-primary/25 group"
                onClick={() => handleGetStarted('talent')}
              >
                <Users className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                I'm an Individual
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-white px-8 py-4 text-base font-semibold rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-accent/25 group"
                onClick={() => handleGetStarted('startup')}
              >
                <TrendingUp className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                I'm a Startup
                <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 px-8 py-4 text-base font-semibold rounded-2xl group"
                onClick={() => handleGetStarted('investor')}
              >
                <DollarSign className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                I'm an Investor
                <Target className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Stats Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '$2.5M+', label: 'Total Capital Cycled', icon: BarChart3 },
              { value: '98.5%', label: 'Repayment Success Rate', icon: CheckCircle },
              { value: '450+', label: 'Verified Investors', icon: Users },
              { value: '12 Days', label: 'Average Time to Fund', icon: Clock }
            ].map((stat, index) => (
              <div key={index} className="text-center group animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-2xl mb-4 group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2 tracking-tight">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Premium Design */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-headline mb-6 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
              How the Capital Engine Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
              A unified, transparent process that connects individuals and startups with capital through crowdfunded agreements.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* For Individuals */}
            <div className="animate-slide-up">
              <div className="card-premium rounded-3xl p-8 h-full hover-lift">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-title text-foreground">For Individuals</h3>
                </div>
                
                <div className="space-y-6">
                  {[
                    { step: '1', title: 'Build Your Profile', desc: 'Create a rich profile with verified credentials and get vouched by industry professionals.' },
                    { step: '2', title: 'Create Fixed-Outcome Agreement', desc: 'Set your funding goal and clear repayment terms with fixed monthly installments.' },
                    { step: '3', title: 'Get Funded & Repay', desc: 'Receive funds directly to your account, then repay automatically after securing employment.' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-sm font-bold text-primary">{item.step}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* For Startups */}
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="card-premium rounded-3xl p-8 h-full hover-lift">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center mr-4">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-title text-foreground">For Startups</h3>
                </div>
                
                <div className="space-y-6">
                  {[
                    { step: '1', title: 'Build Your Startup Profile', desc: 'Create a comprehensive profile with your team, pitch deck, and financial projections.' },
                    { step: '2', title: 'Create Revenue Share Agreement', desc: 'Set your funding goal and revenue sharing terms with clear repayment caps.' },
                    { step: '3', title: 'Get Crowdfunded & Share Revenue', desc: 'Receive seed capital from multiple investors, then share revenue monthly until cap is reached.' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-sm font-bold text-accent">{item.step}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* For Investors */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="card-premium rounded-3xl p-8 h-full hover-lift">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mr-4">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-title text-foreground">For Investors</h3>
                </div>
                
                <div className="space-y-6">
                  {[
                    { step: '1', title: 'Get Accredited', desc: 'Complete mandatory accredited investor verification through our trusted third-party service.' },
                    { step: '2', title: 'Browse & Invest', desc: 'Discover vetted individuals and startups, then crowdfund promising FOAs and RSAs.' },
                    { step: '3', title: 'Earn Returns', desc: 'Receive your pro-rata share of repayments automatically each month with full transparency.' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{item.step}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-headline mb-6 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
              Built for Trust & Compliance
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
              Every feature designed with security, transparency, and regulatory compliance at its core.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'SEC Compliant', desc: 'Mandatory accredited investor verification ensures full regulatory compliance.', color: 'primary' },
              { icon: Award, title: 'Verified Credentials', desc: 'PoSKL NFT badges and professional vouches create a trusted talent network.', color: 'accent' },
              { icon: Zap, title: 'Automated Repayments', desc: 'Smart contracts handle repayment scheduling and distribution automatically.', color: 'primary' },
              { icon: Target, title: 'Fixed Outcomes', desc: 'Clear, predictable repayment terms with no equity dilution or income sharing.', color: 'accent' },
              { icon: Lock, title: 'Employment Verification', desc: 'Secure document upload and admin review process for employment confirmation.', color: 'primary' },
              { icon: Globe, title: 'Transparent Tracking', desc: 'Real-time dashboards show complete lifecycle from funding to repayment.', color: 'accent' }
            ].map((feature, index) => (
              <div key={index} className="animate-slide-up hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
                <Card className="card-premium rounded-3xl p-8 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="p-0 mb-6">
                    <div className={`w-14 h-14 bg-${feature.color}/10 rounded-2xl flex items-center justify-center mb-4`}>
                      <feature.icon className={`h-7 w-7 text-${feature.color}`} />
                    </div>
                    <CardTitle className="text-lg font-semibold text-foreground">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {feature.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h2 className="text-headline mb-8 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
              Ready to Join the Capital Revolution?
            </h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
              Join the future of capital allocation. Whether you're an individual, startup, or investor, 
              the HCM Platform is your gateway to a new asset class.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="btn-primary px-8 py-4 text-base font-semibold rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-primary/25 group"
                onClick={() => handleGetStarted('talent')}
              >
                <Users className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Start as Individual
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-white px-8 py-4 text-base font-semibold rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-accent/25 group"
                onClick={() => handleGetStarted('startup')}
              >
                <TrendingUp className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Start as Startup
                <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 px-8 py-4 text-base font-semibold rounded-2xl group"
                onClick={() => handleGetStarted('investor')}
              >
                <DollarSign className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Become an Investor
                <Target className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="border-t border-border/50 bg-gradient-to-br from-muted/20 to-background py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-foreground tracking-tight">HCM Platform</span>
                <div className="text-xs text-muted-foreground font-medium -mt-1">Human Capital Market</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              &copy; 2025 Human Capital Market Platform. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}