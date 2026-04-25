"use client";

import { createElement, useState, type HTMLAttributes } from "react";
import Script from "next/script";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Sparkles,
  Settings,
  Radio,
  Copy,
  Check,
  ArrowLeft,
  ExternalLink,
  Code,
  Globe,
} from "lucide-react";
import Link from "next/link";

// ElevenLabs Conversational AI Agent Configuration
const VOICE_AGENT_ID = "agent_8701kq0tt9n2e3ws82wj83y3smfg";
const VOICE_AGENT_NAME = "Outbound Sales Representative";
const ELEVENLABS_WIDGET_SRC = "https://unpkg.com/@elevenlabs/convai-widget-embed";

type ElevenLabsConvaiProps = HTMLAttributes<HTMLElement> & {
  agentId: string;
  serverLocation?: string;
  variant?: string;
  dismissible?: string;
  avatarOrbColor1?: string;
  avatarOrbColor2?: string;
  actionText?: string;
  startCallText?: string;
  endCallText?: string;
  expandText?: string;
  listeningText?: string;
  speakingText?: string;
  overrideFirstMessage?: string;
};

function ElevenLabsConvai({
  agentId,
  serverLocation,
  variant,
  dismissible,
  avatarOrbColor1,
  avatarOrbColor2,
  actionText,
  startCallText,
  endCallText,
  expandText,
  listeningText,
  speakingText,
  overrideFirstMessage,
  ...props
}: ElevenLabsConvaiProps) {
  return createElement("elevenlabs-convai", {
    ...props,
    "agent-id": agentId,
    "server-location": serverLocation,
    variant,
    dismissible,
    "avatar-orb-color-1": avatarOrbColor1,
    "avatar-orb-color-2": avatarOrbColor2,
    "action-text": actionText,
    "start-call-text": startCallText,
    "end-call-text": endCallText,
    "expand-text": expandText,
    "listening-text": listeningText,
    "speaking-text": speakingText,
    "override-first-message": overrideFirstMessage,
  });
}

const sampleVoices = [
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel - Calm & Professional" },
  { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi - Confident & Strong" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella - Friendly & Warm" },
  { id: "ErXwobaYiN019PkySvjV", name: "Antoni - Well-rounded & Versatile" },
  { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli - Young & Energetic" },
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh - Deep & Authoritative" },
];

const integrationMethods = [
  {
    id: "widget",
    name: "Orb Widget",
    icon: Globe,
    description: "Official ElevenLabs orb widget for voice-first conversations",
    code: `<elevenlabs-convai agent-id="${VOICE_AGENT_ID}"></elevenlabs-convai>

<script
  src="https://unpkg.com/@elevenlabs/convai-widget-embed"
  async
  type="text/javascript">
</script>`,
  },
  {
    id: "expanded-widget",
    name: "Text Embed",
    icon: Globe,
    description: "Expanded ElevenLabs widget. Enable Voice + text or Chat Mode in the ElevenLabs Widget tab.",
    code: `<elevenlabs-convai
  agent-id="${VOICE_AGENT_ID}"
  variant="expanded"
  dismissible="false"
  action-text="Chat with our AI sales agent"
  start-call-text="Start voice call"
  expand-text="Open text chat">
</elevenlabs-convai>

<script
  src="https://unpkg.com/@elevenlabs/convai-widget-embed"
  async
  type="text/javascript">
</script>`,
  },
  {
    id: "react",
    name: "React Voice",
    icon: Code,
    description: "Official ElevenLabs React SDK for a custom voice UI",
    code: `import { ConversationProvider, useConversationControls, useConversationStatus } from "@elevenlabs/react";

export default function App() {
  return (
    <ConversationProvider>
      <Agent />
    </ConversationProvider>
  );
}

function Agent() {
  const { startSession, endSession } = useConversationControls();
  const { status, isSpeaking } = useConversationStatus();

  const start = async () => {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    await startSession({ agentId: "${VOICE_AGENT_ID}" });
  };

  return (
    <>
      <button onClick={status === "connected" ? endSession : start}>
        {status === "connected" ? "End" : "Start"}
      </button>
      <p>{isSpeaking ? "Agent speaking" : "Agent listening"}</p>
    </>
  );
}`,
  },
  {
    id: "text-sdk",
    name: "Text SDK",
    icon: Code,
    description: "Official ElevenLabs React SDK in text-only mode",
    code: `import { useConversation } from "@elevenlabs/react";
import { useState } from "react";

function TextAgent() {
  const [value, setValue] = useState("");
  const conversation = useConversation({
    textOnly: true,
    overrides: {
      conversation: { textOnly: true },
    },
  });

  const start = () => conversation.startSession({
    agentId: "${VOICE_AGENT_ID}",
  });

  const send = () => {
    conversation.sendUserMessage(value);
    setValue("");
  };

  return (
    <>
      <button onClick={start}>Start chat</button>
      <input
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          conversation.sendUserActivity();
        }}
      />
      <button onClick={send}>Send</button>
    </>
  );
}`,
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: Code,
    description: "Official ElevenLabs JavaScript client package",
    code: `import { Conversation } from "@elevenlabs/client";

const conversation = await Conversation.startSession({
  agentId: "${VOICE_AGENT_ID}",
  connectionType: "webrtc",
  onConnect: () => console.log("Connected"),
  onDisconnect: () => console.log("Disconnected"),
  onMessage: (message) => console.log(message),
  onError: (error) => console.error(error),
});`,
  },
];

export default function ConversationalAIStudio() {
  const [selectedVoice, setSelectedVoice] = useState(sampleVoices[0]);
  const [selectedIntegration, setSelectedIntegration] = useState(integrationMethods[0]);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedIntegration.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-32 pb-20 px-6">
      <Script src={ELEVENLABS_WIDGET_SRC} strategy="afterInteractive" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/business/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#3F51B5] to-[#1A237E] rounded-2xl blur-xl opacity-60 animate-pulse"></div>
              <div className="relative bg-[#3F51B5]/20 backdrop-blur-xl border border-[#3F51B5]/30 rounded-2xl p-4">
                <img
                  src="/advit-labs-logo.png"
                  alt="ADVIT AI Labs"
                  className="w-12 h-12 object-contain"
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-outfit font-black text-4xl">Conversational AI Studio</h1>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                  <Radio className="w-3 h-3 mr-1 animate-pulse" />
                  Live
                </Badge>
              </div>
              <p className="text-foreground/60">{VOICE_AGENT_NAME} - Ultra-realistic voice AI</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left: Live Conversation Tester */}
          <div className="lg:col-span-2 space-y-6">
            {/* Conversation Interface */}
            <Card className="glass shadow-premium border-black/5">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-2xl">Live ElevenLabs Agent</h2>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                    <Radio className="w-3 h-3 mr-1 animate-pulse" />
                    Embedded
                  </Badge>
                </div>

                <div className="relative mb-8 overflow-hidden rounded-3xl border border-black/10 bg-[radial-gradient(circle_at_30%_20%,rgba(244,63,94,0.14),transparent_32%),radial-gradient(circle_at_70%_30%,rgba(99,102,241,0.14),transparent_34%),linear-gradient(135deg,#ffffff,#f8fafc)] p-6 md:p-8">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" />
                  <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-center">
                    <div>
                      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-widest text-black/50">
                        <Sparkles className="h-3.5 w-3.5 text-rose-500" />
                        ElevenLabs ConvAI
                      </div>
                      <h3 className="mb-4 text-3xl font-black tracking-tight md:text-5xl">
                        Talk to the live sales agent.
                      </h3>
                      <p className="max-w-2xl text-sm leading-relaxed text-foreground/60 md:text-base">
                        This is the official ElevenLabs conversational AI widget connected to the
                        agent ID below. The orb handles microphone permission, WebRTC audio,
                        interruptions, and the conversation lifecycle.
                      </p>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {["Voice orb", "Public agent", "WebRTC", "Widget embed"].map((item) => (
                          <Badge key={item} variant="outline" className="bg-white/60">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[2rem] border border-black/10 bg-[linear-gradient(145deg,#111111,#2a2a2a)] p-4 shadow-2xl shadow-black/20">
                      <div className="rounded-[1.65rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-5">
                        <div className="flex min-h-[240px] items-center justify-center overflow-visible rounded-[1.4rem] bg-white px-6 py-8 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
                          <div className="w-full scale-[1.14] transform overflow-visible md:scale-[1.2]">
                            <ElevenLabsConvai
                              agentId={VOICE_AGENT_ID}
                              serverLocation="us"
                              avatarOrbColor1="#111827"
                              avatarOrbColor2="#f43f5e"
                              actionText="Talk to ADVIT AI"
                              startCallText="Start voice conversation"
                              endCallText="End conversation"
                              listeningText="Listening..."
                              speakingText="Agent speaking"
                              style={{ display: "block", width: "100%" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-400 mb-1">Setup note</p>
                      <p className="text-foreground/70">
                        ElevenLabs widgets require the agent to be public with authentication disabled.
                        For production, add your Vercel domain to the ElevenLabs allowlist.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Text-Based Embed */}
            <Card className="glass shadow-premium border-black/5">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-bold text-2xl">Text-Based ElevenLabs Embed</h2>
                    <p className="mt-2 text-sm text-foreground/60">
                      Expanded widget for chat-first usage. Turn on Voice + text or Chat Mode in the
                      ElevenLabs Widget settings for this agent.
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-white/60">
                    Chat mode
                  </Badge>
                </div>

                <div className="min-h-[520px] overflow-hidden rounded-3xl border border-black/10 bg-white p-4 shadow-inner">
                  <ElevenLabsConvai
                    agentId={VOICE_AGENT_ID}
                    serverLocation="us"
                    variant="expanded"
                    dismissible="false"
                    actionText="Chat with our AI sales agent"
                    startCallText="Start voice call"
                    expandText="Open text chat"
                    overrideFirstMessage="Hi, I am ADVIT AI's sales assistant. How can I help you today?"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Integration Code */}
            <Card className="glass shadow-premium border-black/5">
              <CardContent className="p-8">
                <h2 className="font-bold text-2xl mb-6">Integration Methods</h2>

                {/* Method Selector */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                  {integrationMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setSelectedIntegration(method)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedIntegration.id === method.id
                            ? "bg-primary/10 border-primary"
                            : "bg-background/50 border-white/10 hover:border-white/20"
                        }`}
                      >
                        <Icon className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-xs font-medium">{method.name}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Code Block */}
                <div className="relative">
                  <div className="absolute top-4 right-4 z-10">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyCode}
                      className="bg-background/80 backdrop-blur-sm"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Code
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 overflow-x-auto">
                    <code className="text-sm text-green-400 font-mono">
                      {selectedIntegration.code}
                    </code>
                  </pre>
                </div>

                <p className="mt-4 text-sm text-foreground/60">{selectedIntegration.description}</p>
              </CardContent>
            </Card>
          </div>

          {/* Right: Configuration */}
          <div className="space-y-6">
            {/* Voice Settings */}
            <Card className="glass shadow-premium border-black/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-5 h-5" />
                  <h3 className="font-bold text-lg">Voice Settings</h3>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground/70">Select Voice</label>
                  {sampleVoices.map((voice) => (
                    <button
                      key={voice.id}
                      onClick={() => setSelectedVoice(voice)}
                      className={`w-full p-3 rounded-lg border transition-all text-left ${
                        selectedVoice.id === voice.id
                          ? "bg-primary/10 border-primary"
                          : "bg-background/50 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{voice.name}</span>
                        {selectedVoice.id === voice.id && <Check className="w-4 h-4 text-primary" />}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Agent Info */}
            <Card className="glass shadow-premium border-black/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-bold text-lg">Agent Details</h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-foreground/60 mb-1">Agent ID</div>
                    <div className="font-mono text-xs bg-background/50 p-2 rounded border border-white/10 break-all">
                      {VOICE_AGENT_ID}
                    </div>
                  </div>

                  <div>
                    <div className="text-foreground/60 mb-1">Response Time</div>
                    <div className="font-medium">&lt; 200ms average</div>
                  </div>

                  <div>
                    <div className="text-foreground/60 mb-1">Languages</div>
                    <div className="font-medium">30+ supported</div>
                  </div>

                  <div>
                    <div className="text-foreground/60 mb-1">Capabilities</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">
                        Outbound Sales
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Lead Qualification
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        WebRTC & WebSocket
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Emotion Detection
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Contextual Updates
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Client Tools
                      </Badge>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() =>
                    window.open("https://elevenlabs.io/docs/eleven-agents/customization/widget", "_blank")
                  }
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Documentation
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="glass shadow-premium border-black/5">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Usage Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground/60">Conversations Today</span>
                    <span className="font-bold">247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground/60">Avg Duration</span>
                    <span className="font-bold">3m 24s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground/60">Satisfaction</span>
                    <span className="font-bold text-green-500">94%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
