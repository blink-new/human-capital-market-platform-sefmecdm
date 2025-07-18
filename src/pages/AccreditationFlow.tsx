import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  DollarSign,
  Building,
  User,
  ArrowRight,
  ArrowLeft,
  Upload
} from 'lucide-react'
import { blink } from '@/blink/client'
import { toast } from 'sonner'

interface AccreditationData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    address: string
  }
  financialInfo: {
    annualIncome: number
    netWorth: number
    investmentExperience: string
    employmentStatus: string
    employer: string
  }
  verification: {
    documentType: string
    documentUploaded: boolean
  }
}

export default function AccreditationFlow() {
  const [user, setUser] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [accreditationStatus, setAccreditationStatus] = useState('Not Started')
  const [accreditationData, setAccreditationData] = useState<AccreditationData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: ''
    },
    financialInfo: {
      annualIncome: 0,
      netWorth: 0,
      investmentExperience: '',
      employmentStatus: '',
      employer: ''
    },
    verification: {
      documentType: '',
      documentUploaded: false
    }
  })

  const totalSteps = 4

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await blink.auth.me()
        setUser(userData)
        
        // Load accreditation status from localStorage
        const storedStatus = localStorage.getItem(`accreditation_${userData.id}`) || 'Not Started'
        setAccreditationStatus(storedStatus)
        
        // Pre-fill email
        setAccreditationData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            email: userData.email
          }
        }))
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      // In production, this would call VerifyInvestor.com API
      // For demo, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update accreditation status
      setAccreditationStatus('Pending')
      localStorage.setItem(`accreditation_${user.id}`, 'Pending')
      
      // Simulate approval after a short delay
      setTimeout(() => {
        setAccreditationStatus('Verified')
        localStorage.setItem(`accreditation_${user.id}`, 'Verified')
        toast.success('Accreditation verified successfully!')
      }, 3000)
      
      toast.success('Accreditation submitted for review!')
    } catch (error) {
      console.error('Accreditation error:', error)
      toast.error('Accreditation submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Legal Name</Label>
                  <Input
                    id="fullName"
                    value={accreditationData.personalInfo.fullName}
                    onChange={(e) => setAccreditationData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                    }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={accreditationData.personalInfo.email}
                    onChange={(e) => setAccreditationData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, email: e.target.value }
                    }))}
                    className="mt-1"
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={accreditationData.personalInfo.phone}
                    onChange={(e) => setAccreditationData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, phone: e.target.value }
                    }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={accreditationData.personalInfo.address}
                    onChange={(e) => setAccreditationData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, address: e.target.value }
                    }))}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Financial Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="annualIncome">Annual Income (USD)</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="annualIncome"
                        type="number"
                        min="0"
                        value={accreditationData.financialInfo.annualIncome}
                        onChange={(e) => setAccreditationData(prev => ({
                          ...prev,
                          financialInfo: { ...prev.financialInfo, annualIncome: Number(e.target.value) }
                        }))}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="netWorth">Net Worth (USD)</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="netWorth"
                        type="number"
                        min="0"
                        value={accreditationData.financialInfo.netWorth}
                        onChange={(e) => setAccreditationData(prev => ({
                          ...prev,
                          financialInfo: { ...prev.financialInfo, netWorth: Number(e.target.value) }
                        }))}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="employer">Current Employer</Label>
                  <div className="relative mt-1">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="employer"
                      value={accreditationData.financialInfo.employer}
                      onChange={(e) => setAccreditationData(prev => ({
                        ...prev,
                        financialInfo: { ...prev.financialInfo, employer: e.target.value }
                      }))}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg mt-6">
                <h4 className="font-medium mb-2 flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-blue-600" />
                  Accredited Investor Requirements
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Annual income exceeding $200,000 (individual) or $300,000 (joint)</li>
                  <li>• Net worth exceeding $1,000,000 (excluding primary residence)</li>
                  <li>• Hold certain professional certifications or licenses</li>
                  <li>• Be a knowledgeable employee of a private fund</li>
                </ul>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Document Verification</h3>
              <div className="space-y-4">
                <div>
                  <Label>Required Documents</Label>
                  <div className="mt-2 space-y-3">
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">Tax Returns (Last 2 Years)</div>
                        <div className="text-sm text-muted-foreground">Form 1040 or equivalent</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">Bank Statements</div>
                        <div className="text-sm text-muted-foreground">Last 3 months</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">Investment Account Statements</div>
                        <div className="text-sm text-muted-foreground">Brokerage, 401k, etc.</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-amber-600" />
                  Security & Privacy
                </h4>
                <p className="text-sm text-muted-foreground">
                  All documents are encrypted and processed by our trusted third-party verification service. 
                  Your information is never stored on our servers and is deleted after verification.
                </p>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Review & Submit</h3>
              
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span>{accreditationData.personalInfo.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{accreditationData.personalInfo.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span>{accreditationData.personalInfo.phone}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Financial Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Annual Income:</span>
                      <span>${accreditationData.financialInfo.annualIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Net Worth:</span>
                      <span>${accreditationData.financialInfo.netWorth.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Employer:</span>
                      <span>{accreditationData.financialInfo.employer}</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    What happens next?
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Your information will be verified by our trusted third-party service</li>
                    <li>• Verification typically takes 1-2 business days</li>
                    <li>• You'll receive an email notification once approved</li>
                    <li>• Access to the FOA marketplace will be granted immediately upon approval</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading accreditation flow...</p>
        </div>
      </div>
    )
  }

  // Show status page if already submitted
  if (accreditationStatus !== 'Not Started') {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-foreground">Accreditation Status</h1>
              <Button onClick={() => blink.auth.logout()}>Sign Out</Button>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="text-center">
            <CardContent className="py-12">
              {accreditationStatus === 'Pending' && (
                <>
                  <Clock className="h-16 w-16 text-amber-500 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold mb-4">Verification in Progress</h2>
                  <p className="text-muted-foreground mb-6">
                    Your accreditation is being reviewed by our trusted third-party verification service. 
                    This typically takes 1-2 business days.
                  </p>
                  <Badge variant="secondary" className="mb-4">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending Review
                  </Badge>
                </>
              )}

              {accreditationStatus === 'Verified' && (
                <>
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold mb-4">Accreditation Verified!</h2>
                  <p className="text-muted-foreground mb-6">
                    Congratulations! You are now a verified accredited investor and can access 
                    all investment opportunities on the HCM Platform.
                  </p>
                  <Badge variant="default" className="mb-6">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified Accredited Investor
                  </Badge>
                  <div className="space-y-3">
                    <Button size="lg" className="w-full">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Browse FOA Marketplace
                    </Button>
                    <Button variant="outline" size="lg" className="w-full">
                      View Investment Dashboard
                    </Button>
                  </div>
                </>
              )}

              {accreditationStatus === 'Rejected' && (
                <>
                  <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold mb-4">Verification Unsuccessful</h2>
                  <p className="text-muted-foreground mb-6">
                    Unfortunately, we were unable to verify your accredited investor status. 
                    Please contact our support team for assistance.
                  </p>
                  <Badge variant="destructive" className="mb-6">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Verification Failed
                  </Badge>
                  <Button variant="outline">
                    Contact Support
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-foreground">Accredited Investor Verification</h1>
            <Button onClick={() => blink.auth.logout()}>Sign Out</Button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>

        {/* Step Content */}
        <Card>
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !accreditationData.personalInfo.fullName) ||
                (currentStep === 2 && (!accreditationData.financialInfo.annualIncome || !accreditationData.financialInfo.netWorth))
              }
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-primary hover:bg-primary/90"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Submit for Verification
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}