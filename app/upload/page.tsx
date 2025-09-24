"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, FileText, Code, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function UploadPage() {
  const [code, setCode] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)
  const [fileName, setFileName] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setCode(event.target.result as string)
        }
      }
      reader.readAsText(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setCode(event.target.result as string)
        }
      }
      reader.readAsText(file)
    }
  }

  const handleRunAudit = async () => {
    if (!code.trim()) return
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
      if (!res.ok) throw new Error("Audit request failed")
      const report = await res.json()
      if (typeof window !== "undefined") {
        localStorage.setItem("move_audit_report", JSON.stringify(report))
      }
      toast({ title: "Audit started", description: "Analyzing your contract now." })
      router.push("/loading-audit")
    } catch (e) {
      console.error(e)
      toast({ title: "Audit failed", description: "Please try again.", variant: "destructive" as any })
    }
  }

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) setCode(text)
      if (text) toast({ title: "Pasted from clipboard" })
    } catch (e) {
      console.error(e)
      toast({ title: "Clipboard blocked", description: "Use ⌘V/Ctrl+V to paste.", variant: "destructive" as any })
    }
  }

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      toast({ title: "Copied", description: "Code copied to clipboard." })
    } catch (e) {
      console.error(e)
      toast({ title: "Copy failed", description: "Please try again.", variant: "destructive" as any })
    }
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey
      if (meta && e.key === "Enter") {
        e.preventDefault()
        handleRunAudit()
      }
      if (meta && (e.key.toLowerCase?.() === "k")) {
        e.preventDefault()
        setCode("")
        toast({ title: "Cleared", description: "Textarea cleared." })
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [code])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
      {/* Navigation Header */}
      <nav className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Move Auditor
              </span>
            </div>
            <Button variant="ghost" onClick={() => router.push("/")} className="text-slate-600 hover:text-slate-900">
              ← Back to Home
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Upload your Move contract</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Not ready to upload a file? Paste your code instead. We’ll read it carefully and share clear, practical suggestions no jargon.
          </p>
        </div>

        <div className="space-y-8">
          {/* Enhanced File Upload Area */}
          <div
            className={`group relative border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 ${
              isDragOver
                ? "border-cyan-400 bg-gradient-to-br from-cyan-50 to-blue-50 scale-[1.02]"
                : "border-slate-300 hover:border-cyan-300 hover:bg-slate-50/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".move,.mv"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-6">
              <div
                className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isDragOver
                    ? "bg-gradient-to-br from-cyan-500 to-blue-600 scale-110"
                    : "bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-cyan-100 group-hover:to-blue-100"
                }`}
              >
                <Upload
                  className={`w-8 h-8 transition-colors duration-300 ${
                    isDragOver ? "text-white" : "text-slate-600 group-hover:text-cyan-600"
                  }`}
                />
              </div>

              {fileName ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <FileText className="w-5 h-5" />
                    <span className="font-medium">{fileName}</span>
                  </div>
                  <p className="text-sm text-slate-500">File uploaded successfully</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-900">Upload contract file</h3>
                  <p className="text-slate-600">Drag and drop your Move contract file here, or click to browse</p>
                  <p className="text-sm text-slate-500">Supports .move and .mv files • Private by default</p>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Or Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-6 py-2 bg-white text-slate-500 rounded-full border border-slate-200">
                or paste your code
              </span>
            </div>
          </div>

          {/* Enhanced Code Textarea */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-slate-700">
              <Code className="w-5 h-5" />
              <label className="font-medium">Smart Contract Code</label>
            </div>
            <div className="relative">
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePasteFromClipboard}
                  aria-label="Paste from clipboard"
                  className="text-xs px-2 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                >
                  Paste
                </button>
                <button
                  type="button"
                  onClick={handleCopyToClipboard}
                  aria-label="Copy to clipboard"
                  className="text-xs px-2 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                >
                  Copy
                </button>
                <button
                  type="button"
                  onClick={() => setCode("")}
                  aria-label="Clear textarea"
                  className="text-xs px-2 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                >
                  Clear
                </button>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                aria-label="Move smart contract code"
                placeholder="module 0x1::MyContract {...}"
                className="w-full h-96 p-6 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 text-sm font-mono bg-slate-50/50 transition-all duration-200 placeholder:text-slate-400"
              />
              {/* {code && (
                <div className="absolute top-4 right-4 text-xs text-slate-500 bg-white px-2 py-1 rounded border">
                  {code.split("\n").length} lines
                </div>
              )} */}
            </div>
            <p className="text-xs text-slate-500">Private by default. Your code is only used to generate this report.</p>
          </div>

          {/* Enhanced Run Audit Button */}
          <div className="text-center pt-8">
            <Button
              onClick={handleRunAudit}
              disabled={!code.trim()}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-12 py-4 text-lg rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none group cursor-pointer"
              size="lg"
            >
              <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Run Security Audit
            </Button>
            {code.trim() && (
              <p className="text-sm text-slate-500 mt-3">Ready to analyze {code.split("\n").length} lines of code</p>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
