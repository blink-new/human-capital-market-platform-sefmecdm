import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  ArrowRight, 
  ArrowLeft, 
  DollarSign, 
  Calendar, 
  Calculator,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { blink } from '@/blink/client'
import { toast } from 'sonner'

interface FOAData {
  title: string
  description: string
  fundingGoal: number
  repaymentMultiplier: number
  repaymentDurationMonths: number
}

interface FOACreationWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function FOACreationWizard({ open, onOpenChange, onSuccess }: FOACreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [foaData, setFoaData] = useState<FOAData>({
    title: '',
    description: '',
    fundingGoal: 5000,
    repaymentMultiplier: 1.5,
    repaymentDurationMonths: 18
  })

  const totalSteps = 4

  const calculateRepaymentDetails = () => {
    const fixedRepaymentTotal = foaData.fundingGoal * foaData.repaymentMultiplier
    const monthlyInstallmentAmount = fixedRepaymentTotal / foaData.repaymentDurationMonths
    return { fixedRepaymentTotal, monthlyInstallmentAmount }
  }

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
    setLoading(true)
    try {
      const user = await blink.auth.me()
      const { fixedRepaymentTotal, monthlyInstallmentAmount } = calculateRepaymentDetails()
      
      // Create FOA record
      const foaId = `foa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // For now, we'll store in localStorage since we can't create the database
      // In production, this would be stored in the database
      const existingFOAs = JSON.parse(localStorage.getItem('user_foas') || '[]')
      const newFOA = {
        id: foaId,
        talentUserId: user.id,
        title: foaData.title,
        description: foaData.description,
        fundingGoal: foaData.fundingGoal,
        amountRaised: 0,
        fixedRepaymentTotal,
        monthlyInstallmentAmount,
        repaymentDurationMonths: foaData.repaymentDurationMonths,
        status: 'Active',
        employmentVerificationStatus: 'Not Submitted',
        createdAt: new Date().toISOString()
      }
      
      existingFOAs.push(newFOA)
      localStorage.setItem('user_foas', JSON.stringify(existingFOAs))
      
      toast.success('FOA created successfully!')
      onOpenChange(false)
      onSuccess?.()
      
      // Reset form
      setCurrentStep(1)
      setFoaData({
        title: '',
        description: '',
        fundingGoal: 5000,
        repaymentMultiplier: 1.5,
        repaymentDurationMonths: 18
      })
    } catch (error) {
      console.error('Error creating FOA:', error)
      toast.error('Failed to create FOA. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">FOA Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Full-Stack Developer Career Transition"
                    value={foaData.title}
                    onChange={(e) => setFoaData({ ...foaData, title: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your career goals, how you'll use the funding, and what makes you a great investment..."
                    value={foaData.description}
                    onChange={(e) => setFoaData({ ...foaData, description: e.target.value })}
                    className="mt-1 min-h-[120px]"
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
              <h3 className="text-lg font-semibold mb-4">Funding Details</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fundingGoal">Funding Goal (USD)</Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fundingGoal"
                      type="number"
                      min="1000"
                      max="50000"
                      step="500"
                      value={foaData.fundingGoal}
                      onChange={(e) => setFoaData({ ...foaData, fundingGoal: Number(e.target.value) })}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Typical range: $3,000 - $15,000
                  </p>
                </div>
                
                <div className="bg-card/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                    Funding Guidelines
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Consider living expenses during job search</li>
                    <li>• Include costs for courses, certifications, or equipment</li>
                    <li>• Factor in networking and interview travel expenses</li>
                    <li>• Keep it realistic based on your expected salary</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Repayment Terms</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="repaymentMultiplier">Repayment Multiplier</Label>
                  <Input
                    id="repaymentMultiplier"
                    type="number"
                    min="1.2"
                    max="2.0"
                    step="0.1"
                    value={foaData.repaymentMultiplier}
                    onChange={(e) => setFoaData({ ...foaData, repaymentMultiplier: Number(e.target.value) })}
                    className="mt-1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Total repayment = Funding Goal × Multiplier (typically 1.3x - 1.7x)
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="duration">Repayment Duration (Months)</Label>
                  <div className="relative mt-1">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="duration"
                      type="number"
                      min="12"
                      max="36"
                      value={foaData.repaymentDurationMonths}
                      onChange={(e) => setFoaData({ ...foaData, repaymentDurationMonths: Number(e.target.value) })}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Typical range: 12-24 months
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 4: {
        const { fixedRepaymentTotal, monthlyInstallmentAmount } = calculateRepaymentDetails()
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Review & Confirm</h3>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">{foaData.title}</CardTitle>
                  <CardDescription>{foaData.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Funding Goal:</span>
                        <span className="font-medium">${foaData.fundingGoal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Repayment:</span>
                        <span className="font-medium">${fixedRepaymentTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Duration:</span>
                        <span className="font-medium">{foaData.repaymentDurationMonths} months</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Monthly Payment:</span>
                        <span className="font-medium">${monthlyInstallmentAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Return Multiple:</span>
                        <span className="font-medium">{foaData.repaymentMultiplier}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Return:</span>
                        <span className="font-medium text-green-600">
                          ${(fixedRepaymentTotal - foaData.fundingGoal).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                  What happens next?
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Your FOA will be published to the marketplace</li>
                  <li>• Accredited investors can browse and fund your agreement</li>
                  <li>• You'll receive funds once fully funded</li>
                  <li>• Repayments begin after employment verification</li>
                </ul>
              </div>
            </div>
          </div>
        )
      }

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Fixed-Outcome Agreement</DialogTitle>
          <DialogDescription>
            Set up your funding terms and repayment schedule
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
          </div>

          {/* Step Content */}
          {renderStep()}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
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
                  (currentStep === 1 && (!foaData.title || !foaData.description)) ||
                  (currentStep === 2 && foaData.fundingGoal < 1000)
                }
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-primary hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating FOA...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Create FOA
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}