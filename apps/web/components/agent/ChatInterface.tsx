"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot, Sparkles, AlertCircle, DollarSign, X, ExternalLink, CheckCircle, Loader2 } from "lucide-react";
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
    { id: "1", role: "assistant", content: `Hello! I am ${agentName}. ${
      agentName === 'yield-aggregator'
        ? 'I can help you invest in DeFi yields. Try asking: "I want to deposit $10 into highest yield"'
        : agentName === 'options-trader'
        ? 'I can help you trade options. Try asking: "I want to buy ETH call option with $20"'
        : 'How can I assist you today?'
    }` }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState(10);
  const [isExecutingTrade, setIsExecutingTrade] = useState(false);
  const [tradeResult, setTradeResult] = useState<any>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const account = useActiveAccount();

  const handleDeposit = async () => {
    if (!account?.address) {
      alert("Please connect your wallet first!");
      return;
    }

    setIsExecutingTrade(true);
    try {
      const response = await fetch(`/api/agents/${agentName}/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: depositAmount,
          userWallet: account.address,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Deposit failed");
      }

      setTradeResult(result);

      // Add success message to chat based on agent type
      let successContent = "";
      if (agentName === 'yield-aggregator') {
        successContent = `✅ SUCCESS! I've invested $${depositAmount} USDC for you!\n\n` +
          `Protocol: ${result.protocol}\n` +
          `Transaction: ${result.transactions?.deposit || result.transactions?.buy}\n` +
          `View on explorer: ${result.explorer}\n\n` +
          `Your funds are now earning ~${result.estimatedAPY} APY!`;
      } else if (agentName === 'options-trader') {
        successContent = `✅ SUCCESS! I've bought options for $${depositAmount} USDC!\n\n` +
          `Protocol: ${result.protocol}\n` +
          `Asset: ${result.asset} ${result.optionType}\n` +
          `Strike: ${result.strikePrice} | Expiry: ${result.expiry}\n` +
          `Contracts: ${result.contracts}\n` +
          `Transaction: ${result.transactions?.buy}\n` +
          `View on explorer: ${result.explorer}\n\n` +
          `Potential Profit: ${result.estimatedProfitPotential}`;
      } else {
        successContent = `✅ SUCCESS! Transaction completed for $${depositAmount} USDC!`;
      }

      const successMsg = {
        id: Date.now().toString(),
        role: "assistant",
        content: successContent,
      };
      setMessages(prev => [...prev, successMsg]);

    } catch (error: any) {
      setTradeResult({ error: error.message });
      const errorMsg = {
        id: Date.now().toString(),
        role: "assistant",
        content: `❌ Error: ${error.message}. Please try again or contact support.`,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsExecutingTrade(false);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    });
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

  // Detect if message is asking to deposit/trade
  const isDepositIntent = (msg: string) => {
    const lower = msg.toLowerCase();
    return lower.includes("deposit") || lower.includes("invest") || lower.includes("buy") ||
           lower.includes("trade") || lower.includes("$") || lower.includes("usd");
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || isPaymentPending) return;

    const userMessage = { id: Date.now().toString(), role: "user", content: input };

    // Check if trading agent and user wants to deposit/trade
    if ((agentName === 'yield-aggregator' || agentName === 'options-trader') && isDepositIntent(input)) {
      setMessages(prev => [...prev, userMessage]);
      setInput("");
      setShowDepositModal(true);
      return;
    }

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
    <Card className="h-full min-h-0 flex flex-col glass border-0 border-l border-black/5 shadow-none rounded-none bg-gradient-to-br from-white to-gray-50/50">
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
      <div
        ref={messagesContainerRef}
        data-lenis-prevent=""
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain p-8 flex flex-col gap-8 scroll-smooth bg-gradient-to-b from-transparent to-gray-50/30"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0,0,0,0.1) transparent'
        }}
      >
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

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isExecutingTrade && setShowDepositModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 z-10"
          >
            {!tradeResult ? (
              <>
                <button
                  onClick={() => setShowDepositModal(false)}
                  className="absolute top-5 right-5 text-foreground/30 hover:text-foreground/60"
                  disabled={isExecutingTrade}
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Deposit Funds</h3>
                    <p className="text-sm text-foreground/60">How much do you want to invest?</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-foreground/70 mb-2 block">
                      Amount (USDC)
                    </label>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(Number(e.target.value))}
                      min={1}
                      step={1}
                      className="w-full px-4 py-3 rounded-xl border-2 border-primary/20 text-lg font-bold focus:outline-none focus:border-primary/40"
                      disabled={isExecutingTrade}
                    />
                  </div>

                  <div className="p-4 bg-primary/5 rounded-xl">
                    <p className="text-xs text-foreground/60">
                      💡 <strong>Testnet Mode:</strong> This will execute on Base Sepolia testnet. No real money!
                    </p>
                  </div>

                  <Button
                    onClick={handleDeposit}
                    disabled={isExecutingTrade || depositAmount <= 0}
                    className="w-full py-6 text-base font-bold"
                  >
                    {isExecutingTrade ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Executing Trade...
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-5 h-5 mr-2" />
                        Deposit ${depositAmount} USDC
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                {tradeResult.error ? (
                  <>
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="font-bold text-xl mb-2">Transaction Failed</h3>
                    <p className="text-sm text-red-600 mb-4">{tradeResult.error}</p>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="font-bold text-xl mb-2">Trade Executed!</h3>
                    <p className="text-sm text-foreground/60 mb-4">
                      Successfully invested ${tradeResult.amount} USDC
                    </p>
                    <div className="space-y-2 text-left bg-gray-50 rounded-xl p-4 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-foreground/60">Protocol:</span>
                        <span className="font-bold">{tradeResult.protocol}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-foreground/60">APY:</span>
                        <span className="font-bold text-green-600">{tradeResult.estimatedAPY}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-foreground/60">Network:</span>
                        <span className="font-bold">{tradeResult.chain}</span>
                      </div>
                    </div>
                    <a
                      href={tradeResult.explorer}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-4"
                    >
                      View on Explorer <ExternalLink className="w-4 h-4" />
                    </a>
                  </>
                )}
                <Button
                  onClick={() => {
                    setShowDepositModal(false);
                    setTradeResult(null);
                  }}
                  className="w-full mt-4"
                >
                  Close
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </Card>
  );
}

// Internal Card component to avoid import issues
function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("rounded-3xl border border-black/10", className)}>
      {children}
    </div>
  );
}
