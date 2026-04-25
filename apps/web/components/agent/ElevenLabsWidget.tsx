"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Volume2 } from "lucide-react";

interface ElevenLabsWidgetProps {
  agentId: string;
  agentName: string;
}

export default function ElevenLabsWidget({ agentId, agentName }: ElevenLabsWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const elevenlabsAgentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || "";

  useEffect(() => {
    // Skip if no agent ID configured
    if (!elevenlabsAgentId) return;

    // Check if script already loaded
    if (document.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]')) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://elevenlabs.io/convai-widget/index.js";
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Don't remove script on unmount — the custom element registration is global
    };
  }, [elevenlabsAgentId]);

  useEffect(() => {
    if (!loaded || !containerRef.current || !elevenlabsAgentId) return;

    // Clear any previous widget
    containerRef.current.innerHTML = "";

    // Create the web component — this is the official embed method
    const widget = document.createElement("elevenlabs-convai");
    widget.setAttribute("agent-id", elevenlabsAgentId);
    widget.style.width = "100%";
    widget.style.height = "100%";
    widget.style.display = "block";

    containerRef.current.appendChild(widget);
  }, [loaded, elevenlabsAgentId]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-12">
      {/* Header */}
      <div className="text-center mb-12 max-w-3xl select-none">
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

      {/* ElevenLabs Widget Container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-4xl h-[600px] bg-gradient-to-br from-gray-50 to-white rounded-[2rem] shadow-2xl border border-black/5 flex items-center justify-center overflow-hidden"
        style={{ transform: 'translateZ(0)' }}
      >
        {/* Show placeholder only when widget hasn't loaded */}
        {(!loaded || !elevenlabsAgentId) && (
          <div className="flex flex-col items-center gap-6 text-foreground/40">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center animate-pulse">
                <Mic className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-green-500 border-4 border-white animate-pulse" />
            </div>
            <p className="text-base font-medium">
              {elevenlabsAgentId ? "Loading voice agent..." : "Set NEXT_PUBLIC_ELEVENLABS_AGENT_ID in .env.local"}
            </p>
            <p className="text-sm">Powered by ElevenLabs</p>
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="mt-10 flex items-center gap-8 text-sm text-foreground/40 select-none">
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
