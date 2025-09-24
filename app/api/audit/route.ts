import type { NextRequest } from "next/server"

type Vulnerability = {
  title: string
  severity: "High" | "Medium" | "Low"
  lineNo: number
  description: string
  suggestedFix: string
  impact: "Critical" | "High" | "Medium" | "Low"
  confidence: "High" | "Medium" | "Low"
}

type AuditReport = {
  summary: {
    score: number
    contractName: string
    linesOfCode: number
    fileSizeKB: number
    durationSec: number
    chain?: string
  }
  vulnerabilities: Vulnerability[]
  aiAnalysis: string[]
  optimizations: { title: string; desc: string }[]
}

function deriveContractName(moveCode: string): string {
  const moduleMatch = moveCode.match(/module\s+([\w:._]+)\s*\{/)
  if (moduleMatch && moduleMatch[1]) return `${moduleMatch[1]}.move`
  return "Contract.move"
}

async function tryOpenRouter(code: string): Promise<AuditReport | null> {
  const key = process.env.OPENROUTER_API_KEY
  if (!key) return null
  try {
    const url = "https://openrouter.ai/api/v1/chat/completions"
    const model = process.env.OPENROUTER_MODEL || "mistralai/mistral-7b-instruct:free"
    const system = `You are a Move smart contract auditor. Respond with STRICT JSON only, no markdown, following exactly this schema:
{
  "summary": {"score": number, "contractName": string, "linesOfCode": number, "fileSizeKB": number, "durationSec": number, "chain": string},
  "vulnerabilities": [{"title": string, "severity": "High"|"Medium"|"Low", "lineNo": number, "description": string, "suggestedFix": string, "impact": "Critical"|"High"|"Medium"|"Low", "confidence": "High"|"Medium"|"Low"}],
  "aiAnalysis": string[],
  "optimizations": [{"title": string, "desc": string}]
}`
    const user = `Analyze this Move code and produce the JSON:\n\n${code}`
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        // Optional, but recommended by OpenRouter for attribution
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "Move Contract Auditor",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.2,
      }),
    })
    if (!res.ok) return null
    const data = await res.json().catch(() => null) as any
    const content: string | undefined = data?.choices?.[0]?.message?.content
    if (!content) return null
    const jsonStart = content.indexOf("{")
    const jsonEnd = content.lastIndexOf("}")
    const sliced = jsonStart >= 0 && jsonEnd >= 0 ? content.slice(jsonStart, jsonEnd + 1) : content
    const parsed = JSON.parse(sliced) as AuditReport
    return parsed
  } catch {
    return null
  }
}

async function tryOllama(code: string): Promise<AuditReport | null> {
  const base = process.env.OLLAMA_BASE_URL || "http://localhost:11434"
  try {
    const prompt = `You are a Move smart contract auditor. Analyze the following Move code and return STRICT JSON with this schema:
{
  "summary": {"score": number, "contractName": string, "linesOfCode": number, "fileSizeKB": number, "durationSec": number, "chain": string},
  "vulnerabilities": [{"title": string, "severity": "High"|"Medium"|"Low", "lineNo": number, "description": string, "suggestedFix": string, "impact": "Critical"|"High"|"Medium"|"Low", "confidence": "High"|"Medium"|"Low"}],
  "aiAnalysis": string[],
  "optimizations": [{"title": string, "desc": string}]
}
Only output JSON, no extra text. Here is the code:\n\n${code}`

    const res = await fetch(`${base}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || "llama3.1",
        prompt,
        stream: false,
        options: { temperature: 0.2 },
      }),
    })
    if (!res.ok) return null
    const data = await res.json().catch(() => null) as any
    const text: string | undefined = data?.response
    if (!text) return null
    const parsed = JSON.parse(text) as AuditReport
    return parsed
  } catch {
    return null
  }
}

async function tryGemini(code: string): Promise<AuditReport | null> {
  const key = process.env.GOOGLE_API_KEY
  if (!key) return null
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`
    const system = `You are a Move smart contract auditor. Respond with STRICT JSON following exactly this schema with no markdown nor commentary:\n{
  "summary": {"score": number, "contractName": string, "linesOfCode": number, "fileSizeKB": number, "durationSec": number, "chain": string},
  "vulnerabilities": [{"title": string, "severity": "High"|"Medium"|"Low", "lineNo": number, "description": string, "suggestedFix": string, "impact": "Critical"|"High"|"Medium"|"Low", "confidence": "High"|"Medium"|"Low"}],
  "aiAnalysis": string[],
  "optimizations": [{"title": string, "desc": string}]
}`
    const user = `Analyze this Move code and produce the JSON:\n\n${code}`
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: `${system}\n\n${user}` }] },
        ],
        generationConfig: { temperature: 0.2 },
      }),
    })
    if (!res.ok) return null
    const data = await res.json().catch(() => null) as any
    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) return null
    const jsonStart = text.indexOf("{")
    const jsonEnd = text.lastIndexOf("}")
    const sliced = jsonStart >= 0 && jsonEnd >= 0 ? text.slice(jsonStart, jsonEnd + 1) : text
    const parsed = JSON.parse(sliced) as AuditReport
    return parsed
  } catch {
    return null
  }
}

function heuristicReport(code: string): AuditReport {
  const lines = code.split(/\r?\n/)
  const contractName = deriveContractName(code)
  const fileSizeKB = Math.max(1, Math.round(new Blob([code]).size / 1024))
  const vulns: Vulnerability[] = []
  lines.forEach((line, idx) => {
    if (/abort\s+\(/i.test(line)) {
      vulns.push({
        title: "Unchecked abort usage",
        severity: "Medium",
        lineNo: idx + 1,
        description: "Found 'abort(...)' which may lead to unexpected termination without proper error codes handling.",
        suggestedFix: "Wrap aborts with well-defined error codes and document failure modes.",
        impact: "Medium",
        confidence: "Medium",
      })
    }
    if (/public\s+fun\s+\w+\s*\(/.test(line) && /friend\s+/.test(code) === false) {
      // naive exposure signal
      vulns.push({
        title: "Public function exposure",
        severity: "Low",
        lineNo: idx + 1,
        description: "Public function detected. Verify access controls and capability checks.",
        suggestedFix: "Restrict to entry functions as needed and validate signer/capabilities.",
        impact: "Low",
        confidence: "Low",
      })
    }
  })
  const score = Math.max(50, 100 - vulns.length * 5)
  return {
    summary: {
      score,
      contractName,
      linesOfCode: lines.length,
      fileSizeKB,
      durationSec: 2,
      chain: "Sui",
    },
    vulnerabilities: vulns.slice(0, 10),
    aiAnalysis: [
      "Heuristic analysis applied due to no free LLM configured.",
      "Review abort usages and ensure explicit error codes.",
      "Confirm access control on public functions and capability checks.",
    ],
    optimizations: [
      { title: "Gas Optimization", desc: "Cache repetitive storage reads in local variables." },
      { title: "Documentation", desc: "Add doc comments for public entry functions and resources." },
      { title: "Error Handling", desc: "Define module error codes and reference them consistently." },
    ],
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as { code?: string; chain?: string }
    const code = (body.code || "").toString()
    if (!code.trim()) {
      return new Response(JSON.stringify({ error: "Missing 'code'" }), { status: 400 })
    }

    // Try providers: OpenRouter -> Gemini -> Ollama -> heuristic
    let report: AuditReport | null = null
    report = await tryOpenRouter(code)
    if (!report) report = await tryGemini(code)
    if (!report) report = await tryOllama(code)
    if (!report) report = heuristicReport(code)

    // Override chain if provided
    if (body.chain && report?.summary) {
      report.summary.chain = body.chain
    }

    return new Response(JSON.stringify(report), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 })
  }
}


