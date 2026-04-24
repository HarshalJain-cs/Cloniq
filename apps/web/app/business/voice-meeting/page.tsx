"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Phone, PhoneOff, Mic, MicOff, Loader2, Radio } from "lucide-react";
import Script from "next/script";

const AGENT_ID = "agent_8701kq0tt9n2e3ws82wj83y3smfg";

export default function VoiceMeetingRoom() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    return () => {
      // Cleanup
      if (isConnected && (window as any).elevenLabsConversation) {
        try {
          (window as any).elevenLabsConversation.endSession();
        } catch (e) {
          console.error("Cleanup error:", e);
        }
      }
    };
  }, [isConnected]);

  const startCall = async () => {
    setIsConnecting(true);

    try {
      // Request microphone permission first
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Initialize ElevenLabs widget
      if (typeof window !== 'undefined' && (window as any).ElevenLabs) {
        const widget = (window as any).ElevenLabs.widget({
          agentId: AGENT_ID,
          onConnect: () => {
            console.log("Connected to voice agent");
            setIsConnected(true);
            setIsConnecting(false);
          },
          onDisconnect: () => {
            console.log("Disconnected");
            setIsConnected(false);
            setIsConnecting(false);
          },
          onError: (error: any) => {
            console.error("Voice error:", error);
            setIsConnecting(false);
            alert("Failed to connect to voice agent. Please try again.");
          }
        });

        (window as any).elevenLabsConversation = widget;

        // Auto-start the conversation
        setTimeout(() => {
          const startBtn = document.querySelector('[data-elevenlabs-action="start"]') as HTMLButtonElement;
          if (startBtn) {
            startBtn.click();
          }
        }, 500);
      } else {
        throw new Error("ElevenLabs SDK not loaded");
      }
    } catch (error) {
      console.error("Failed to start call:", error);
      setIsConnecting(false);
      alert("Please allow microphone access to start the call.");
    }
  };

  const endCall = () => {
    if ((window as any).elevenLabsConversation) {
      try {
        const endBtn = document.querySelector('[data-elevenlabs-action="end"]') as HTMLButtonElement;
        if (endBtn) {
          endBtn.click();
        }
        (window as any).elevenLabsConversation = null;
      } catch (e) {
        console.error("End call error:", e);
      }
    }
    setIsConnected(false);
  };

  const toggleMute = () => {
    const muteBtn = document.querySelector('[data-elevenlabs-action="mute"]') as HTMLButtonElement;
    if (muteBtn) {
      muteBtn.click();
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {/* Load ElevenLabs Script */}
      <Script
        src="https://elevenlabs.io/convai-widget/index.js"
        onLoad={() => {
          console.log("ElevenLabs SDK loaded");
          setScriptLoaded(true);
        }}
        onError={() => {
          console.error("Failed to load ElevenLabs SDK");
        }}
      />

      {/* Hidden widget container */}
      <div id="elevenlabs-widget" style={{ display: 'none' }}></div>

      <Card className="glass shadow-premium border-black/5 max-w-lg w-full">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-accent/10 rounded-full p-4 w-fit mx-auto mb-4">
              <Phone className="w-8 h-8 text-accent" />
            </div>
            <h1 className="font-outfit font-black text-3xl mb-2">Voice Call</h1>
            <p className="text-foreground/60 mb-4">
              ADVIT AI Labs - Outbound Sales Representative
            </p>
            <Badge
              className={
                isConnected
                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                  : isConnecting
                  ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                  : "bg-foreground/10 text-foreground/60 border-foreground/20"
              }
            >
              <Radio className="w-3 h-3 mr-1 animate-pulse" />
              {isConnected ? "Connected" : isConnecting ? "Connecting..." : "Ready"}
            </Badge>
          </div>

          {/* Status & Controls */}
          {!isConnected && !isConnecting && (
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-xl p-6 text-center">
                <Mic className="w-12 h-12 mx-auto text-foreground/40 mb-3" />
                <h2 className="font-bold text-lg mb-2">Start Voice Call</h2>
                <p className="text-foreground/60 text-sm mb-4">
                  Click below to connect and start talking to our AI agent.
                  Make sure your microphone is enabled.
                </p>
                <div className="flex flex-col gap-2 text-xs text-foreground/60">
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span>Ultra-low latency (&lt;200ms)</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span>Natural conversation</span>
                  </div>
                </div>
              </div>
              <Button
                size="lg"
                onClick={startCall}
                disabled={!scriptLoaded}
                className="bg-accent text-white hover:bg-accent/90 font-bold w-full"
              >
                <Phone className="w-5 h-5 mr-2" />
                {scriptLoaded ? "Start Call" : "Loading..."}
              </Button>
            </div>
          )}

          {isConnecting && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 mx-auto text-accent animate-spin mb-4" />
              <h2 className="font-bold text-lg mb-2">Connecting...</h2>
              <p className="text-foreground/60 text-sm">
                Please allow microphone access when prompted
              </p>
            </div>
          )}

          {isConnected && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-8 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-accent/20 flex items-center justify-center mb-4 animate-pulse">
                  <Mic className="w-10 h-10 text-accent" />
                </div>
                <h2 className="font-bold text-xl mb-2">Call in Progress</h2>
                <p className="text-foreground/60 text-sm">
                  You're now connected. Speak naturally with the AI agent.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={toggleMute}
                  className="flex-1 crisp-border"
                >
                  {isMuted ? (
                    <>
                      <MicOff className="w-5 h-5 mr-2" />
                      Unmute
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5 mr-2" />
                      Mute
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={endCall}
                  className="flex-1 border-red-500/20 text-red-500 hover:bg-red-500/10"
                >
                  <PhoneOff className="w-5 h-5 mr-2" />
                  End Call
                </Button>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-black/5">
            <div className="flex items-center gap-2 text-xs text-foreground/60 justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span>Secure connection</span>
              <span className="mx-2">•</span>
              <span>WebRTC encrypted</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
