"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Sparkles,
  Settings,
  Radio,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Play,
  Pause,
  ArrowLeft,
  ExternalLink,
  Code,
  Smartphone,
  Globe,
} from "lucide-react";
import Link from "next/link";

// Voice AI Agent Configuration
const VOICE_AGENT_ID = "agent_8701kq0tt9n2e3ws82wj83y3smfg";
const VOICE_AGENT_NAME = "Outbound Sales Representative";

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
    id: "react",
    name: "React SDK",
    icon: Code,
    description: "Full-featured React component with WebRTC streaming",
    code: `import { useConversation } from "@advit/voice-ai";

function Agent() {
  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message) => console.log("Message:", message),
    onError: (error) => console.error("Error:", error),
  });

  const startConversation = async () => {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    await conversation.startSession({
      agentId: "${VOICE_AGENT_ID}",
      connectionType: "webrtc", // or "websocket"
    });
  };

  return (
    <div>
      <button onClick={startConversation}>Start</button>
      <button onClick={() => conversation.endSession()}>Stop</button>
      <p>Status: {conversation.status}</p>
      <p>Agent is {conversation.isSpeaking ? "speaking" : "listening"}</p>
    </div>
  );
}`,
  },
  {
    id: "react-native",
    name: "React Native",
    icon: Smartphone,
    description: "Native mobile integration for iOS & Android",
    code: `import { VoiceAIProvider, useConversation } from "@advit/voice-ai-native";

function App() {
  return (
    <VoiceAIProvider>
      <ConversationScreen />
    </VoiceAIProvider>
  );
}

function ConversationScreen() {
  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message) => console.log("Message:", message),
  });

  const start = async () => {
    await conversation.startSession({
      agentId: "${VOICE_AGENT_ID}"
    });
  };

  return (
    <View>
      <Button title={conversation.status === "connected" ? "Stop" : "Start"}
        onPress={conversation.status === "connected" ?
          () => conversation.endSession() : start}
      />
      <Text>Agent is {conversation.isSpeaking ? "speaking" : "listening"}</Text>
    </View>
  );
}`,
  },
  {
    id: "widget",
    name: "Embeddable Widget",
    icon: Globe,
    description: "Drop-in widget for any website",
    code: `<advit-voice-ai agent-id="${VOICE_AGENT_ID}"></advit-voice-ai>

<script
  src="https://cdn.advitlabs.ai/voice-widget/v1/index.js"
  async
  type="text/javascript">
</script>`,
  },
  {
    id: "python",
    name: "Python SDK",
    icon: Code,
    description: "Server-side Python integration",
    code: `import os
from advit.voice_ai import VoiceAIClient, Conversation, AudioInterface

client = VoiceAIClient(api_key=os.getenv("ADVIT_API_KEY"))

conversation = Conversation(
    client,
    agent_id="${VOICE_AGENT_ID}",
    requires_auth=False,
    audio_interface=AudioInterface(),
    callback_agent_response=lambda response: print(f"Agent: {response}"),
    callback_user_transcript=lambda transcript: print(f"User: {transcript}"),
)

conversation.start_session()
conversation_id = conversation.wait_for_session_end()
print(f"Conversation ID: {conversation_id}")`,
  },
  {
    id: "websocket",
    name: "WebSocket",
    icon: Code,
    description: "Direct WebSocket connection for custom implementations",
    code: `const ws = new WebSocket(
  "wss://api.advitlabs.ai/v1/voice/conversation?agent_id=${VOICE_AGENT_ID}"
);

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: "conversation_initiation_client_data",
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  switch (data.type) {
    case "user_transcript":
      console.log("User:", data.user_transcription_event.user_transcript);
      break;
    case "agent_response":
      console.log("Agent:", data.agent_response_event.agent_response);
      break;
    case "audio":
      // data.audio_event.audio_base_64 contains the audio chunk
      break;
    case "ping":
      setTimeout(() => {
        ws.send(JSON.stringify({
          type: "pong",
          event_id: data.ping_event.event_id,
        }));
      }, data.ping_event.ping_ms);
      break;
  }
};`,
  },
];

export default function ConversationalAIStudio() {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(sampleVoices[0]);
  const [selectedIntegration, setSelectedIntegration] = useState(integrationMethods[0]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [conversationActive, setConversationActive] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedIntegration.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const toggleConnection = () => {
    setIsConnected(!isConnected);
    setConversationActive(!isConnected);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-32 pb-20 px-6">
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
                  <h2 className="font-bold text-2xl">Live Conversation Tester</h2>
                  <Badge variant={conversationActive ? "default" : "outline"}>
                    {conversationActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {/* Voice Visualizer */}
                <div className="relative mb-8">
                  <div className="aspect-video bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-rose-500/10 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
                    {conversationActive ? (
                      <div className="flex items-center gap-3">
                        {[...Array(20)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full animate-pulse"
                            style={{
                              height: `${Math.random() * 100 + 20}px`,
                              animationDelay: `${i * 0.1}s`,
                            }}
                          ></div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center">
                        <Mic className="w-16 h-16 mx-auto mb-4 text-foreground/20" />
                        <p className="text-foreground/40">Click "Start Conversation" to begin</p>
                      </div>
                    )}
                  </div>

                  {/* Status Indicator */}
                  {conversationActive && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-white text-sm font-medium">
                        {isConnected ? "Connected" : "Connecting..."}
                      </span>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={toggleConnection}
                    size="lg"
                    className={`${
                      conversationActive
                        ? "bg-gradient-to-r from-red-500 to-rose-500"
                        : "bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"
                    } hover:opacity-90 transition-opacity border-0 text-white font-bold px-8`}
                  >
                    {conversationActive ? (
                      <>
                        <PhoneOff className="w-5 h-5 mr-2" />
                        End Conversation
                      </>
                    ) : (
                      <>
                        <Phone className="w-5 h-5 mr-2" />
                        Start Conversation
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsMuted(!isMuted)}
                    disabled={!conversationActive}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                </div>

                {/* Info */}
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-400 mb-1">Pro Tip</p>
                      <p className="text-foreground/70">
                        This is a live connection to ADVIT's conversational AI platform. The agent will respond
                        with ultra-realistic voice and can handle interruptions naturally.
                      </p>
                    </div>
                  </div>
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
                    window.open("https://docs.advitlabs.ai/voice-ai", "_blank")
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
