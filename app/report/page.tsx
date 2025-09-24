"use client"

import { Button } from "@/components/ui/button"
import {
  ChevronDown,
  Shield,
  Clock,
  FileText,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Zap,
  Eye,
} from "lucide-react"
import { useState, useEffect } from "react"

export default function ReportPage() {
  const [expandedVulnerabilities, setExpandedVulnerabilities] = useState<number[]>([0])
  const [isLoaded, setIsLoaded] = useState(false)
  const [animateScore, setAnimateScore] = useState(0)
  const [report, setReport] = useState<null | {
    summary: {
      score: number
      contractName: string
      linesOfCode: number
      fileSizeKB: number
      durationSec: number
      chain?: string
    }
    vulnerabilities: Array<{
      title: string
      severity: "High" | "Medium" | "Low"
      lineNo: number
      description: string
      suggestedFix: string
      impact: "Critical" | "High" | "Medium" | "Low"
      confidence: "High" | "Medium" | "Low"
    }>
    aiAnalysis: string[]
    optimizations: Array<{ title: string; desc: string }>
  }>(null)

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("move_audit_report") : null
      if (raw) {
        const parsed = JSON.parse(raw)
        setReport(parsed)
      }
    } catch {}
  }, [])

  useEffect(() => {
    setIsLoaded(true)
    const target = report?.summary?.score ?? 85
    const timer = setTimeout(() => {
      let current = 0
      const increment = target / 30
      const scoreTimer = setInterval(() => {
        current += increment
        if (current >= target) {
          setAnimateScore(target)
          clearInterval(scoreTimer)
        } else {
          setAnimateScore(Math.floor(current))
        }
      }, 50)
    }, 500)
    return () => clearTimeout(timer)
  }, [report?.summary?.score])

  const toggleVulnerability = (index: number) => {
    setExpandedVulnerabilities((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const vulnerabilities = report?.vulnerabilities ?? []

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "from-red-500 to-red-600"
      case "Medium":
        return "from-amber-500 to-orange-500"
      case "Low":
        return "from-emerald-500 to-green-500"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "High":
        return <XCircle className="w-5 h-5" />
      case "Medium":
        return <AlertTriangle className="w-5 h-5" />
      case "Low":
        return <CheckCircle className="w-5 h-5" />
      default:
        return <Shield className="w-5 h-5" />
    }
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">No report yet</h1>
          <p className="text-slate-600 mb-6">Upload your Move contract and run an audit to see your results here.</p>
          <a href="/upload" className="inline-flex items-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow hover:shadow-md transition-shadow">
            Go to Upload
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-100/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative container mx-auto px-4 py-12 max-w-6xl">
        <div
          className={`space-y-12 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200/60 shadow-sm">
              <FileText className="w-5 h-5 text-cyan-600" />
              <span className="text-sm font-medium text-slate-600">Thoughtful review complete</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent leading-tight">
              Your audit report
            </h1>
            <p className="text-xl text-slate-600 font-medium">{report?.summary?.contractName ?? "Contract.move"}</p>

            <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  Generated on: {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Chain: {report?.summary?.chain ?? "Sui"}</span>
              </div>
            </div>

            <div className="relative inline-block">
              <div className="relative bg-gradient-to-br from-white to-slate-50 p-8 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/40">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 rounded-3xl" />
                <div className="relative flex items-center justify-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 animate-pulse" />
                  </div>
                  <div className="text-left">
                    <div className="text-4xl font-bold text-slate-900 tabular-nums tracking-tight">
                      {animateScore}
                      <span className="text-2xl text-slate-600">/100</span>
                    </div>
                    <div className="text-emerald-600 font-semibold text-lg">Secure</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-8 shadow-lg shadow-slate-200/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Contract overview</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  label: "Contract Name",
                  value: report?.summary?.contractName ?? "Contract.move",
                  icon: FileText,
                  color: "from-blue-500 to-blue-600",
                },
                {
                  label: "Lines of Code",
                  value: `${report?.summary?.linesOfCode ?? 0} Lines`,
                  icon: TrendingUp,
                  color: "from-purple-500 to-purple-600",
                },
                { label: "File Size", value: `${report?.summary?.fileSizeKB ?? 0} KB`, icon: Shield, color: "from-emerald-500 to-emerald-600" },
                { label: "Audit Duration", value: `${report?.summary?.durationSec ?? 0} secs`, icon: Clock, color: "from-amber-500 to-amber-600" },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`group bg-gradient-to-br from-white to-slate-50 p-6 rounded-xl border border-slate-200/60 hover:shadow-lg hover:shadow-slate-200/40 transition-all duration-300 hover:-translate-y-1 ${isLoaded ? "animate-fade-in-up" : ""}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">{item.label}</span>
                  </div>
                  <div className="text-lg font-bold text-slate-900">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-8 shadow-lg shadow-slate-200/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Security analysis</h2>
              <div className="ml-auto px-3 py-1 bg-slate-100 rounded-full text-sm font-medium text-slate-600">
                {vulnerabilities.length} Issues Found
              </div>
            </div>

            <div className="space-y-4">
              {vulnerabilities.map((vuln, index) => (
                <div
                  key={index}
                  className={`group bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200/60 overflow-hidden hover:shadow-lg hover:shadow-slate-200/40 transition-all duration-300 ${isLoaded ? "animate-fade-in-up" : ""}`}
                  style={{ animationDelay: `${(index + 4) * 100}ms` }}
                >
                  <button
                    onClick={() => toggleVulnerability(index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50/50 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getSeverityColor(vuln.severity)} flex items-center justify-center text-white shadow-lg`}
                      >
                        {getSeverityIcon(vuln.severity)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-lg">{vuln.title}</div>
                        <div className="flex items-center gap-3 mt-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              vuln.severity === "High"
                                ? "bg-red-100 text-red-700"
                                : vuln.severity === "Medium"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {vuln.severity} Risk
                          </span>
                          <span className="text-sm text-slate-500">Line {vuln.lineNo}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-6 h-6 text-slate-400 transition-all duration-300 group-hover:text-slate-600 ${
                        expandedVulnerabilities.includes(index) ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedVulnerabilities.includes(index) && (
                    <div className="px-6 pb-6 animate-fade-in">
                      <div className="bg-slate-50/50 rounded-xl p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <span className="text-sm font-medium text-slate-600">Impact Level</span>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-3 h-3 rounded-full bg-gradient-to-r ${getSeverityColor(vuln.severity)}`}
                              />
                              <span className="font-medium text-slate-900">{vuln.impact}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <span className="text-sm font-medium text-slate-600">Confidence</span>
                            <div className="font-medium text-slate-900">{vuln.confidence}</div>
                          </div>
                          <div className="space-y-2">
                            <span className="text-sm font-medium text-slate-600">Line Number</span>
                            <div className="font-mono text-sm bg-slate-200 px-2 py-1 rounded w-fit">{vuln.lineNo}</div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-slate-600 block mb-2">Description</span>
                            <p className="text-slate-700 leading-relaxed">{vuln.description}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-slate-600 block mb-2">Recommended Fix</span>
                            <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200/60 rounded-lg p-4">
                              <p className="text-slate-700 leading-relaxed">{vuln.suggestedFix}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-50/50 to-blue-50/50 backdrop-blur-sm rounded-2xl border border-cyan-200/60 p-8 shadow-lg shadow-cyan-200/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">AI notes</h2>
            </div>
            <div className="space-y-4">
              {(report?.aiAnalysis ?? []).map((comment, index) => (
                <div
                  key={index}
                  className={`flex gap-4 p-4 bg-white/60 rounded-xl border border-cyan-200/40 ${isLoaded ? "animate-fade-in-up" : ""}`}
                  style={{ animationDelay: `${(index + 8) * 100}ms` }}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-slate-700 leading-relaxed">{comment}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 backdrop-blur-sm rounded-2xl border border-amber-200/60 p-8 shadow-lg shadow-amber-200/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Optimization ideas</h2>
            </div>
            <div className="space-y-4">
              {(report?.optimizations ?? []).map((item, index) => (
                <div
                  key={index}
                  className={`flex gap-4 p-4 bg-white/60 rounded-xl border border-amber-200/40 hover:shadow-md transition-all duration-300 ${isLoaded ? "animate-fade-in-up" : ""}`}
                  style={{ animationDelay: `${(index + 11) * 100}ms` }}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-slate-700 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-8 shadow-lg shadow-slate-200/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                <Download className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Export report</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => {
                  if (!report) return
                  const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = `${report.summary.contractName.replace(/\W+/g, "_") || "report"}.json`
                  document.body.appendChild(a)
                  a.click()
                  a.remove()
                  URL.revokeObjectURL(url)
                }}
                className="group bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-slate-600/25 hover:shadow-xl hover:shadow-slate-600/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                <FileText className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Download JSON
              </Button>
              <Button className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 hover:-translate-y-0.5">
                <Download className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
