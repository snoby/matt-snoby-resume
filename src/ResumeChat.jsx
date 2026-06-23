import { useEffect, useRef, useState } from 'react'
import { getChatResponse, suggestedQuestions } from './resumeChatData.js'

const API_BASE_URL =
  window.__APP_CONFIG__?.RESUME_API_BASE_URL ||
  import.meta.env.VITE_RESUME_API_BASE_URL ||
  'http://10.0.0.85:8000'

async function askResumeApi(question) {
  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question }),
  })

  if (!response.ok) {
    throw new Error(`Resume API returned ${response.status}`)
  }

  return response.json()
}

function ResumeChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [displayedResponse, setDisplayedResponse] = useState('')
  const messagesEndRef = useRef(null)
  const typingIntervalRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, displayedResponse])

  useEffect(() => {
    if (!isOpen) return undefined

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        window.clearInterval(typingIntervalRef.current)
      }
    }
  }, [])

  const typeResponse = (response, citations = []) => {
    if (typingIntervalRef.current) {
      window.clearInterval(typingIntervalRef.current)
    }

    setIsTyping(true)
    setDisplayedResponse('')

    let index = 0
    typingIntervalRef.current = window.setInterval(() => {
      if (index < response.length) {
        setDisplayedResponse(response.slice(0, index + 1))
        index += 1
        return
      }

      window.clearInterval(typingIntervalRef.current)
      typingIntervalRef.current = null
      setIsTyping(false)
      setMessages((prev) => [...prev, { role: 'assistant', content: response, citations }])
      setDisplayedResponse('')
    }, 8)
  }

  const submitQuestion = async (question) => {
    const trimmed = question.trim()
    if (!trimmed || isTyping) return

    setMessages((prev) => [...prev, { role: 'user', content: trimmed }])
    setInput('')

    setIsTyping(true)
    setDisplayedResponse('')

    try {
      const result = await askResumeApi(trimmed)
      typeResponse(result.answer || getChatResponse(trimmed), result.citations || [])
    } catch (error) {
      console.error('Resume API request failed, falling back to local response.', error)
      window.setTimeout(() => {
        typeResponse(getChatResponse(trimmed))
      }, 250)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end bg-slate-950/55 p-3 backdrop-blur-sm sm:p-6">
      <div className="glass-card flex h-[80vh] w-full max-w-2xl flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-cyan-300">Ask AI About Matt</p>
            <h2 className="mt-1 text-lg font-semibold text-white">Hiring manager quick screen</h2>
            <p className="mt-1 text-xs text-slate-300">Chat-style answers based on the resume and proof-of-work shown on this page.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          {messages.length === 0 && !isTyping ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="max-w-xl">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-cyan-300">Suggested Questions</p>
                <h3 className="mt-3 text-2xl font-bold text-white">What do you want to know?</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  This is a lightweight recruiter and hiring-manager interface. It is meant to surface role fit, strongest evidence,
                  AI usage, and honest limits quickly.
                </p>
              </div>

              <div className="mt-6 grid w-full max-w-xl gap-3">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => {
                      void submitQuestion(question)
                    }}
                    className="glass-subcard w-full p-4 text-left text-sm leading-relaxed text-slate-200 transition hover:bg-white/10"
                  >
                    "{question}"
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'rounded-br-md bg-cyan-300/20 text-cyan-50'
                      : 'rounded-bl-md bg-white/8 text-slate-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.role === 'assistant' && message.citations?.length ? (
                    <div className="mt-3 border-t border-white/10 pt-3">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300/90">Citations</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.citations.map((citation) => (
                          <span
                            key={`${citation.id}-${citation.topic}`}
                            className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan-100"
                            title={citation.content}
                          >
                            {citation.category}: {citation.topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}

            {isTyping ? (
              <div className="flex justify-start">
                <div className="max-w-[88%] rounded-2xl rounded-bl-md bg-white/8 px-4 py-3 text-sm leading-relaxed text-slate-100">
                  <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-3">
                    <span className="chat-thinking-spinner" aria-hidden="true" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300/90">Thinking</span>
                  </div>
                  <p className="whitespace-pre-wrap">
                    {displayedResponse}
                    <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-cyan-300 align-[-2px]" />
                  </p>
                </div>
              </div>
            ) : null}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-white/10 px-4 py-4 sm:px-6">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              void submitQuestion(input)
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about platform fit, AI work, leadership, gaps, or strongest projects..."
              disabled={isTyping}
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300/40 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="rounded-xl border border-cyan-300/30 bg-cyan-300/15 px-4 py-3 font-mono text-xs uppercase tracking-wider text-cyan-100 transition hover:bg-cyan-300/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResumeChat
