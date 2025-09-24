"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, Zap, Search, FileCheck, CheckCircle } from "lucide-react"

export default function LoadingAuditPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const steps = [
    { icon: FileCheck, label: "Parsing Contract", description: "Reading and validating Move code structure" },
    { icon: Search, label: "Static Analysis", description: "Scanning for vulnerabilities and security issues" },
    { icon: Shield, label: "Security Check", description: "Analyzing potential attack vectors" },
    { icon: CheckCircle, label: "Generating Report", description: "Compiling audit results and recommendations" },
  ]

  useEffect(() => {
    const stepDuration = 750 // 750ms per step
    const progressInterval = 50 // Update progress every 50ms

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 100 / ((steps.length * stepDuration) / progressInterval)
        return Math.min(newProgress, 100)
      })
    }, progressInterval)

    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, stepDuration)

    // Navigate to report after all steps complete
    const completeTimer = setTimeout(
      () => {
        router.push("/report")
      },
      steps.length * stepDuration + 500,
    )

    return () => {
      clearInterval(progressTimer)
      clearInterval(stepTimer)
      clearTimeout(completeTimer)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 text-center">
        {/* Main Loading Animation */}
        <div className="mb-12 mt-10">
          <div className="relative mx-auto w-32 h-32 mb-8">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500 animate-spin"></div>

            {/* Inner pulsing circle */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center animate-pulse">
              <Shield className="w-12 h-12 text-white" />
            </div>

            {/* Progress ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
              <circle
                cx="64"
                cy="64"
                r="60"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-slate-200"
              />
              <circle
                cx="64"
                cy="64"
                r="60"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                className="text-cyan-500 transition-all duration-300 ease-out"
                style={{
                  strokeDasharray: `${2 * Math.PI * 60}`,
                  strokeDashoffset: `${2 * Math.PI * 60 * (1 - progress / 100)}`,
                }}
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-4">Running Security Audit</h1>
          <p className="text-lg text-slate-600 mb-8">
            Our AI is analyzing your smart contract for vulnerabilities and security issues
          </p>

          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto mb-8">
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isCompleted = index < currentStep

            return (
              <div
                key={index}
                className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-500 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 scale-105"
                    : isCompleted
                      ? "bg-green-50 border border-green-200"
                      : "bg-slate-50 border border-slate-200 opacity-60"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-br from-cyan-500 to-blue-600 animate-pulse"
                      : isCompleted
                        ? "bg-green-500"
                        : "bg-slate-300"
                  }`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3
                    className={`font-semibold transition-colors duration-300 ${
                      isActive ? "text-cyan-900" : isCompleted ? "text-green-900" : "text-slate-600"
                    }`}
                  >
                    {step.label}
                  </h3>
                  <p
                    className={`text-sm transition-colors duration-300 ${
                      isActive ? "text-cyan-700" : isCompleted ? "text-green-700" : "text-slate-500"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
                {isCompleted && <CheckCircle className="w-6 h-6 text-green-500" />}
              </div>
            )
          })}
        </div>

        {/* Estimated Time */}
        <div className="mt-12 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200">
          <p className="text-sm text-slate-600">
            <Zap className="w-4 h-4 inline mr-1" />
            Estimated completion: {Math.max(0, Math.ceil(steps.length * 0.75 - currentStep * 0.75))} seconds
          </p>
        </div>
      </div>
    </div>
  )
}
