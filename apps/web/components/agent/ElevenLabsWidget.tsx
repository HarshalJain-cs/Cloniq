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
    <div className="w-full h-full flex flex-col items-center justify-center p-12">
      {/* Header */}
      <div className="text-center mb-12 max-w-3xl pointer-events-none select-none">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-bold mb-6">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          ELEVENLABS CONVA·I
        </div>

        <h2 className="text-5xl font-black mb-6 tracking-tight leading-tight">
          Talk to the<br />live sales agent.
        </h2>

        <p className="text-foreground/60 leading-relaxed text-base">
          This is the official ElevenLabs conversational AI widget connected to the
          agent ID below. The orb handles microphone permission, WebRTC audio,
          interruptions, and the conversation lifecycle.
        </p>
      </div>

      {/* ElevenLabs Widget Container - LARGER & STABLE */}
      <div
        ref={containerRef}
        id="elevenlabs-convai-widget"
        className="relative w-full max-w-4xl h-[600px] bg-gradient-to-br from-gray-50 to-white rounded-[2rem] shadow-2xl border border-black/5 flex items-center justify-center"
        style={{
          pointerEvents: 'auto',
          transform: 'translateZ(0)', // Hardware acceleration for stability
          willChange: 'auto' // Prevent hover jank
        }}
      >
        {/* Placeholder before widget loads */}
        <div className="flex flex-col items-center gap-6 text-foreground/40 pointer-events-none">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center animate-pulse">
              <Mic className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-green-500 border-4 border-white animate-pulse" />
          </div>
          <p className="text-base font-medium">Loading voice agent...</p>
          <p className="text-sm">Powered by ElevenLabs</p>
        </div>
      </div>

      {/* Info Footer */}
      <div className="mt-10 flex items-center gap-8 text-sm text-foreground/40 pointer-events-none select-none">
        <div className="flex items-center gap-2.5">
          <Volume2 className="w-4 h-4" />
          <span>Voice-enabled</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-2.5">
          <Mic className="w-4 h-4" />
          <span>WebRTC Audio</span>
        </div>
        <span>•</span>
        <span>Real-time AI</span>
      </div>
    </div>
  );
}
