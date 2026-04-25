"use client";

import { useEffect, useRef } from "react";
import { Mic, Volume2 } from "lucide-react";

interface ElevenLabsWidgetProps {
  agentId: string;
  agentName: string;
}

export default function ElevenLabsWidget({ agentId, agentName }: ElevenLabsWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load ElevenLabs Convai widget script
    const script = document.createElement("script");
    script.src = "https://elevenlabs.io/convai-widget/index.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Initialize widget when script loads
      if (containerRef.current && (window as any).elevenlabs) {
        (window as any).elevenlabs.convai.init({
          // You'll need to add your ElevenLabs agent ID here
          // Get it from: https://elevenlabs.io/app/conversational-ai
          agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || "YOUR_AGENT_ID_HERE",

          // Optional customization
          onConnect: () => console.log("ElevenLabs connected"),
          onDisconnect: () => console.log("ElevenLabs disconnected"),
          onMessage: (message: any) => console.log("Message:", message),
        });
      }
    };

    return () => {
      // Cleanup
      document.body.removeChild(script);
    };
  }, [agentId]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      {/* Header */}
      <div className="text-center mb-8 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold mb-4">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          ELEVENLABS CONVA·I
        </div>

        <h2 className="text-4xl font-black mb-4 tracking-tight">
          Talk to the<br />live sales agent.
        </h2>

        <p className="text-foreground/60 leading-relaxed">
          This is the official ElevenLabs conversational AI widget connected to the
          agent ID below. The orb handles microphone permission, WebRTC audio,
          interruptions, and the conversation lifecycle.
        </p>
      </div>

      {/* ElevenLabs Widget Container */}
      <div
        ref={containerRef}
        id="elevenlabs-convai-widget"
        className="relative w-full max-w-xl aspect-video bg-black/5 rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center"
      >
        {/* Placeholder before widget loads */}
        <div className="flex flex-col items-center gap-4 text-foreground/40">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center animate-pulse">
              <Mic className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-white animate-pulse" />
          </div>
          <p className="text-sm font-medium">Loading voice agent...</p>
          <p className="text-xs">Powered by ElevenLabs</p>
        </div>
      </div>

      {/* Info Footer */}
      <div className="mt-8 flex items-center gap-6 text-xs text-foreground/40">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4" />
          <span>Voice-enabled</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4" />
          <span>WebRTC Audio</span>
        </div>
        <span>•</span>
        <span>Real-time AI</span>
      </div>
    </div>
  );
}
