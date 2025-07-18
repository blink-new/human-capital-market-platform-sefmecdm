import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Award, Link } from 'lucide-react'
import { blink } from '@/blink/client'

export default function ProfileBuilder() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-foreground">Profile Builder</h1>
            <Button onClick={() => blink.auth.logout()}>Sign Out</Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <User className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Profile Builder Coming Soon
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Build a comprehensive profile with verified credentials, work samples, 
            and professional vouches to maximize your funding potential.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <User className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Rich Profiles</CardTitle>
                <CardDescription>
                  Showcase your skills, experience, and achievements
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Award className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Verified Credentials</CardTitle>
                <CardDescription>
                  Connect bootcamp certificates and earn PoSKL NFT badges
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Link className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Professional Vouches</CardTitle>
                <CardDescription>
                  Get endorsed by industry professionals and mentors
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}