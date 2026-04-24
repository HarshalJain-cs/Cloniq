"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Loader2,
  CheckCircle2,
  Radio,
} from "lucide-react";

const VOICE_AGENT_ID = "agent_8701kq0tt9n2e3ws82wj83y3smfg";
const VOICE_AGENT_NAME = "Outbound Sales Representative";

// Extend Window type for ElevenLabs
declare global {
  interface Window {
    ElevenLabs?: any;
  }
}

export default function VoiceMeetingRoom() {
  const [conversationStatus, setConversationStatus] = useState<
    "idle" | "connecting" | "connected" | "disconnected"
  >("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(1);
  const conversationRef = useRef<any>(null);

  useEffect(() => {
    // Load ElevenLabs script
    const script = document.createElement("script");
    script.src = "https://elevenlabs.io/convai-widget/index.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (conversationRef.current) {
        try {
          conversationRef.current.endSession();
        } catch (e) {
          console.error("Cleanup error:", e);
        }
      }
      document.body.removeChild(script);
    };
  }, []);

  const startConversation = async () => {
    setConversationStatus("connecting");

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Initialize ElevenLabs conversation
      if (window.ElevenLabs) {
        const conversation = await window.ElevenLabs.Conversation.startSession({
          agentId: VOICE_AGENT_ID,
          onConnect: () => {
            console.log("Connected to voice agent");
            setConversationStatus("connected");
          },
          onDisconnect: () => {
            console.log("Disconnected from voice agent");
            setConversationStatus("disconnected");
          },
          onMessage: (message: any) => {
            console.log("Message:", message);
          },
          onError: (error: any) => {
            console.error("Voice error:", error);
            setConversationStatus("disconnected");
          },
          onModeChange: (mode: any) => {
            setIsSpeaking(mode.mode === "speaking");
          },
        });

        conversationRef.current = conversation;
      } else {
        console.error("ElevenLabs SDK not loaded");
        setConversationStatus("disconnected");
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
      setConversationStatus("disconnected");
      alert("Failed to access microphone. Please allow microphone access and try again.");
    }
  };

  const endConversation = () => {
    if (conversationRef.current) {
      conversationRef.current.endSession();
      conversationRef.current = null;
    }
    setConversationStatus("idle");
  };

  const toggleMute = () => {
    if (conversationRef.current) {
      conversationRef.current.setVolume(isMuted ? volume : 0);
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (conversationRef.current && !isMuted) {
      conversationRef.current.setVolume(newVolume);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-6">
      <Card className="glass shadow-premium border-black/5 max-w-2xl w-full">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-accent/10 rounded-full p-4">
                <Phone className="w-8 h-8 text-accent" />
              </div>
            </div>
            <h1 className="font-outfit font-black text-3xl mb-2">Voice Meeting Room</h1>
            <p className="text-foreground/60 mb-4">
              {VOICE_AGENT_NAME} - ADVIT AI Labs
            </p>
            <Badge
              className={
                conversationStatus === "connected"
                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                  : conversationStatus === "connecting"
                  ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                  : "bg-foreground/10 text-foreground/60 border-foreground/20"
              }
            >
              <Radio className="w-3 h-3 mr-1 animate-pulse" />
              {conversationStatus === "connected"
                ? "Connected"
                : conversationStatus === "connecting"
                ? "Connecting..."
                : conversationStatus === "disconnected"
                ? "Disconnected"
                : "Ready"}
            </Badge>
          </div>

          {/* Call Status */}
          {conversationStatus === "idle" && (
            <div className="text-center mb-8">
              <div className="bg-muted/50 rounded-xl p-8 mb-6">
                <Mic className="w-16 h-16 mx-auto text-foreground/40 mb-4" />
                <h2 className="font-bold text-xl mb-2">Ready to Connect</h2>
                <p className="text-foreground/60 text-sm">
                  Click the button below to start your voice conversation with our AI agent.
                  Make sure your microphone is enabled.
                </p>
              </div>
              <Button
                size="lg"
                onClick={startConversation}
                className="bg-accent text-white hover:bg-accent/90 font-bold shadow-premium w-full"
              >
                <Phone className="w-5 h-5 mr-2" />
                Start Call
              </Button>
            </div>
          )}

          {conversationStatus === "connecting" && (
            <div className="text-center py-12">
              <Loader2 className="w-16 h-16 mx-auto text-accent animate-spin mb-4" />
              <h2 className="font-bold text-xl mb-2">Connecting...</h2>
              <p className="text-foreground/60 text-sm">
                Please allow microphone access when prompted
              </p>
            </div>
          )}

          {conversationStatus === "connected" && (
            <div>
              {/* Voice Visualization */}
              <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-8 mb-6 text-center">
                <div className="relative mb-6">
                  <div
                    className={`w-24 h-24 mx-auto rounded-full bg-accent/20 flex items-center justify-center ${
                      isSpeaking ? "animate-pulse" : ""
                    }`}
                  >
                    <Mic
                      className={`w-12 h-12 ${
                        isSpeaking ? "text-accent" : "text-accent/60"
                      }`}
                    />
                  </div>
                  {isSpeaking && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full border-4 border-accent/30 animate-ping"></div>
                    </div>
                  )}
                </div>
                <h2 className="font-bold text-xl mb-2">
                  {isSpeaking ? "Agent is speaking..." : "Listening..."}
                </h2>
                <p className="text-foreground/60 text-sm">
                  {isSpeaking
                    ? "The AI agent is responding to your query"
                    : "Speak now - the agent is listening"}
                </p>
              </div>

              {/* Controls */}
              <div className="space-y-4">
                {/* Mute Button */}
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

                  {/* Volume Control */}
                  <div className="flex-1 flex items-center gap-3 px-4 py-2 border border-black/10 rounded-xl">
                    {volume === 0 ? (
                      <VolumeX className="w-5 h-5 text-foreground/40" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-foreground/60" />
                    )}
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm text-foreground/60 w-8">
                      {Math.round(volume * 100)}%
                    </span>
                  </div>
                </div>

                {/* End Call */}
                <Button
                  variant="outline"
                  onClick={endConversation}
                  className="w-full border-red-500/20 text-red-500 hover:bg-red-500/10"
                >
                  <PhoneOff className="w-5 h-5 mr-2" />
                  End Call
                </Button>
              </div>
            </div>
          )}

          {conversationStatus === "disconnected" && (
            <div className="text-center py-8">
              <div className="bg-muted/50 rounded-xl p-8 mb-6">
                <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
                <h2 className="font-bold text-xl mb-2">Call Ended</h2>
                <p className="text-foreground/60 text-sm">
                  Thank you for your time. You can start a new call anytime.
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => setConversationStatus("idle")}
                className="bg-accent text-white hover:bg-accent/90 font-bold shadow-premium w-full"
              >
                <Phone className="w-5 h-5 mr-2" />
                Start New Call
              </Button>
            </div>
          )}

          {/* Info */}
          <div className="mt-8 pt-6 border-t border-black/5">
            <div className="flex items-center gap-2 text-sm text-foreground/60">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Ultra-low latency (&lt;200ms)</span>
              <span className="mx-2">•</span>
              <span>End-to-end encrypted</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
