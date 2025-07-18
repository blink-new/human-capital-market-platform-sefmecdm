import { TrendingUp } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
      <div className="text-center animate-fade-in">
        {/* Premium logo animation */}
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/25 animate-pulse">
            <TrendingUp className="h-10 w-10 text-white" />
          </div>
          {/* Subtle glow effect */}
          <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl blur-xl opacity-30 animate-pulse"></div>
        </div>
        
        {/* Premium typography */}
        <h1 className="text-2xl font-bold text-foreground mb-3 tracking-tight">
          Human Capital Market
        </h1>
        <p className="text-muted-foreground text-sm font-medium mb-8 max-w-xs mx-auto leading-relaxed">
          Initializing the future of capital allocation
        </p>
        
        {/* Premium loading indicator */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  )
}