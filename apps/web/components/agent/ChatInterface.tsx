"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot, Sparkles, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useFetchWithPayment, useActiveAccount } from "thirdweb/react";
import { client } from "@/lib/thirdweb";

// Strip markdown headers from chat messages for cleaner display
function cleanMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, '') // Remove ### headers at start of lines
    .replace(/\n#{1,6}\s+/g, '\n') // Remove ### headers after newlines
    .trim();
}

export default function ChatInterface({ 
  agentId, 
  agentName,
  priceUsdc,
  isFree 
}: { 
  agentId: string; 
  agentName: string;
  priceUsdc?: number;
  isFree?: boolean;
}) {
  const [messages, setMessages] = useState<{ id: string; role: string; content: string }[]>([
    { id: "1", role: "assistant", content: `Hello! I am ${agentName}. How can I assist you today?` }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const account = useActiveAccount();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // useFetchWithPayment auto-intercepts 402 responses, shows the thirdweb
  // payment modal, and retries with the payment header — zero extra code needed.
  const { fetchWithPayment, isPending: isPaymentPending } = useFetchWithPayment(client);

  const readStream = async (response: Response, assistantId: string) => {
    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") return;
        try {
          const token = JSON.parse(data);
          setMessages(prev => prev.map(m =>
            m.id === assistantId ? { ...m, content: m.content + token } : m
          ));
        } catch {}
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || isPaymentPending) return;

    const userMessage = { id: Date.now().toString(), role: "user", content: input };
    const assistantId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, userMessage, { id: assistantId, role: "assistant", content: "" }]);
    setInput("");
    setIsLoading(true);

    try {
      const url = `/api/agents/${agentName}/ask/stream`;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Include user wallet for query logging
      if (account?.address) {
        headers["X-User-Wallet"] = account.address;
      }

      const init = {
        method: "POST",
        headers,
        body: JSON.stringify({ question: userMessage.content }),
      };

      if (isFree) {
        // Free agents: plain fetch — no x402 interception, no JSON.parse attempt
        const response = await fetch(url, init);
        if (!response.ok) throw new Error(`Server error ${response.status}`);
        await readStream(response, assistantId);
      } else {
        // Paid agents: fetchWithPayment handles x402 payment modal + retry
        const response = await fetchWithPayment(url, init);
        await readStream(response as unknown as Response, assistantId);
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      setMessages(prev => prev.map(m =>
        m.id === assistantId
          ? { ...m, content: `Error: ${err?.message ?? "Something went wrong."}` }
          : m
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-[700px] lg:h-[calc(100vh-150px)] flex flex-col glass border-black/5 shadow-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50/50">
      {/* Chat Header - Bing-like */}
      <div className="px-8 py-6 border-b border-black/5 bg-gradient-to-r from-primary/5 to-primary/10 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Bot size={20} />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-lg tracking-tight">{agentName}</h3>
              <p className="text-xs text-foreground/50 font-medium">AI Agent • Always Online</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isFree ? (
              <Badge variant="glass" className="bg-green-500/10 text-green-700 border-green-500/20">
                FREE
              </Badge>
            ) : (
              <Badge variant="glass" className="bg-primary/10 text-primary border-primary/20">
                {priceUsdc} USDC/query
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Messages - Bing-like Design */}
      <div className="flex-1 overflow-y-auto overscroll-contain p-8 flex flex-col gap-8 scroll-smooth bg-gradient-to-b from-transparent to-gray-50/30">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className={cn(
                "flex gap-5",
                message.role === "user" ? "flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md",
                message.role === "user"
                  ? "bg-gradient-to-br from-gray-800 to-black text-white"
                  : "bg-gradient-to-br from-primary to-primary/80 text-white"
              )}>
                {message.role === "user" ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={cn(
                "flex-1 max-w-[75%] px-6 py-4 rounded-3xl text-sm leading-relaxed shadow-sm",
                message.role === "user"
                  ? "bg-gradient-to-br from-gray-100 to-gray-50 text-gray-900 border border-gray-200/50"
                  : "bg-white border border-primary/10 text-foreground/90"
              )}>
                <p className="whitespace-pre-wrap">{cleanMarkdown(message.content)}</p>
              </div>
            </motion.div>
          ))}
          {isLoading && messages[messages.length - 1]?.content === "" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex gap-5"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white shadow-md">
                <Sparkles size={18} className="animate-pulse" />
              </div>
              <div className="flex-1 max-w-[75%] bg-white border border-primary/10 px-6 py-4 rounded-3xl shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                  <span className="ml-2 text-xs text-foreground/50 font-medium">AI is thinking...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Bing-like */}
      <div className="p-8 bg-white/80 backdrop-blur-sm border-t border-black/5">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl blur-xl opacity-50" />
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              disabled={isLoading || isPaymentPending}
              placeholder={isPaymentPending ? "Processing payment..." : `Ask ${agentName} anything...`}
              className="w-full bg-white px-7 py-5 pr-16 rounded-3xl text-sm border-2 border-black/10 focus:outline-none focus:border-primary/40 transition-all duration-300 shadow-lg shadow-black/5 disabled:opacity-50 font-medium placeholder:text-foreground/40"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || isPaymentPending || !input.trim()}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center gap-3 text-[11px] text-foreground/40">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="font-medium">
              {isFree ? "Free queries powered by Cloniq" : `${priceUsdc} USDC per message via X402`}
            </span>
          </div>
          <span className="text-foreground/20">•</span>
          <span className="font-medium">Powered by Base</span>
        </div>
      </div>
    </Card>
  );
}

// Internal Card component to avoid import issues
function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("rounded-3xl border border-black/10 overflow-hidden", className)}>
      {children}
    </div>
  );
}
