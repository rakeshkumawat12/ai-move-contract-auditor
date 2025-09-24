import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Search, FileText, Shield, Target, Zap, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-card/50 to-background"></div>
        {/* Decorative gradients */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-chart-4/20 to-transparent blur-3xl" />
        <div className="relative container mx-auto px-4 py-20">
          {/* Hero Section */}
          <div className="text-center mb-32 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-card-foreground mb-6 border border-border/50">
              <Shield className="w-4 h-4" />
              Built by Move devs who care about your launch
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance gradient-text leading-tight">
              Your friendly security co‑pilot for Move
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              We started this project after watching teams lose sleep over last‑minute security worries. Think of us as a
              calm, careful reviewer who reads your code end‑to‑end, highlights risks in plain language, and suggests
              practical fixes so you can ship with confidence and keep building.
            </p>
            <Link href="/upload">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-glow group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ring-offset-background cursor-pointer"
              >
                <Upload className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Start a gentle, thorough audit
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-foreground tracking-tight">How it feels to use</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                No jargon. No guessing. Just a clear path from upload to insight, in minutes.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Upload Step */}
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-border/50 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-card-foreground tracking-tight">Share your code</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Paste a file or drop your repo. We treat your work with care and privacy.
                  </p>
                </CardContent>
              </Card>

              {/* Scan Step */}
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-border/50 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary/20 transition-colors">
                    <Search className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-card-foreground tracking-tight">Thoughtful review</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We read your Move like a senior teammate spotting risks, edge cases, and easy wins.
                  </p>
                </CardContent>
              </Card>

              {/* Report Step */}
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-border/50 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-chart-4/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-chart-4/20 transition-colors">
                    <FileText className="w-8 h-8 text-chart-4" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-card-foreground tracking-tight">Actionable next steps</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Clear explanations, highlighted lines, and practical fixes so shipping feels calm again.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-foreground">Why we built this</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Great products deserve a safe launch. We believe security tools should feel like helpful conversation,
                not a wall of red flags. That’s the standard we hold ourselves to.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/60 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-card-foreground">Signal over noise</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Fewer false alarms. We highlight what truly needs your attention and why.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/60 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                      <Search className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-card-foreground">Context, not just lines</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        We point to exact code and explain the trade offs so fixes feel obvious.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/60 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-chart-4/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-chart-4/20 transition-colors">
                      <Zap className="w-6 h-6 text-chart-4" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-card-foreground">Made for Move</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Purpose‑built for Move’s model of safety, resources, and capabilities.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/60 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-chart-3/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-chart-3/20 transition-colors">
                      <Shield className="w-6 h-6 text-chart-3" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-card-foreground">Private by default</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Your code stays yours. We use it only to help you improve it.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/60 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-chart-5/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-chart-5/20 transition-colors">
                      <CheckCircle className="w-6 h-6 text-chart-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-card-foreground">Fast, not rushed</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Helpful insight in minutes without sacrificing depth or clarity.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/60 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-chart-2/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-chart-2/20 transition-colors">
                      <FileText className="w-6 h-6 text-chart-2" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-card-foreground">Clarity you can share</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Clean summaries your team and community can actually read and trust.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="text-center bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm rounded-3xl p-12 border border-border/50">
            <h2 className="text-3xl font-bold mb-4 text-card-foreground">Let’s ship something you’re proud of</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              We’re here to help you catch issues early, tell a clear security story, and launch with confidence.
            </p>
            <Link href="/upload">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Shield className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Start your free audit
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
