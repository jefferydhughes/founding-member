import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
  Sequence,
} from "remotion";

const agents = [
  { name: "Nova", role: "Strategy & Vision", color: "#E8441A" },
  { name: "Cipher", role: "Code & Systems", color: "#00C2FF" },
  { name: "Lyra", role: "Content & Copy", color: "#B44FFF" },
  { name: "Vex", role: "Data & Analytics", color: "#00E5A0" },
  { name: "Sage", role: "Training & Coaching", color: "#FFB800" },
];

const GlowOrb: React.FC<{
  color: string;
  x: number;
  y: number;
  delay: number;
  size: number;
}> = ({ color, x, y, delay, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 80, stiffness: 40, mass: 1 },
  });

  const pulse = Math.sin((frame - delay) * 0.03) * 0.15 + 1;
  const drift = Math.sin((frame - delay) * 0.015) * 20;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + drift,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}44 0%, ${color}11 40%, transparent 70%)`,
        transform: `scale(${scale * pulse})`,
        filter: "blur(30px)",
      }}
    />
  );
};

const AgentPill: React.FC<{
  agent: (typeof agents)[0];
  index: number;
  startFrame: number;
}> = ({ agent, index, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - startFrame - index * 6,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const opacity = interpolate(
    frame - startFrame - index * 6,
    [0, 10],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  const glow = Math.sin((frame - startFrame) * 0.05 + index * 1.2) * 0.3 + 0.7;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 24px",
        borderRadius: 50,
        background: `${agent.color}15`,
        border: `1px solid ${agent.color}40`,
        transform: `translateY(${(1 - entrance) * 40}px)`,
        opacity,
        boxShadow: `0 0 ${20 * glow}px ${agent.color}22`,
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: agent.color,
          boxShadow: `0 0 10px ${agent.color}`,
        }}
      />
      <span
        style={{
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          fontSize: 18,
          fontWeight: 600,
          color: agent.color,
          letterSpacing: "0.02em",
        }}
      >
        {agent.name}
      </span>
      <span
        style={{
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          fontSize: 14,
          color: "#ffffff88",
          letterSpacing: "0.02em",
        }}
      >
        {agent.role}
      </span>
    </div>
  );
};

export const ComingSoon: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Background grain movement
  const grainOffset = frame * 0.5;

  // "COMING SOON" entrance
  const titleSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15, stiffness: 60, mass: 1.2 },
  });

  const titleOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // "AGENT OS" entrance
  const logoSpring = spring({
    frame: frame - 40,
    fps,
    config: { damping: 12, stiffness: 50, mass: 1 },
  });

  const logoOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Tagline
  const taglineOpacity = interpolate(frame, [70, 90], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const taglineY = interpolate(frame, [70, 90], [20, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Subtle scan line
  const scanY = interpolate(frame, [0, durationInFrames], [-100, 820], {
    extrapolateRight: "clamp",
  });

  // Global fade out at the end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: "#0A0A0A",
        overflow: "hidden",
        opacity: fadeOut,
      }}
    >
      {/* Subtle grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          transform: `translateY(${grainOffset % 60}px)`,
        }}
      />

      {/* Scan line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: scanY,
          height: 2,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
          filter: "blur(1px)",
        }}
      />

      {/* Ambient orbs */}
      <GlowOrb color="#E8441A" x={100} y={80} delay={0} size={300} />
      <GlowOrb color="#00C2FF" x={900} y={100} delay={10} size={250} />
      <GlowOrb color="#B44FFF" x={500} y={400} delay={20} size={280} />
      <GlowOrb color="#00E5A0" x={150} y={500} delay={30} size={220} />
      <GlowOrb color="#FFB800" x={1000} y={450} delay={15} size={240} />

      {/* Center content */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        {/* COMING SOON label */}
        <div
          style={{
            fontFamily:
              'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
            fontSize: 16,
            fontWeight: 500,
            color: "#ffffff55",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            marginBottom: 20,
            opacity: titleOpacity,
            transform: `translateY(${(1 - titleSpring) * -30}px)`,
          }}
        >
          Coming Soon
        </div>

        {/* AGENT OS */}
        <div
          style={{
            fontFamily:
              'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
            fontSize: 96,
            fontWeight: 800,
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            opacity: logoOpacity,
            transform: `scale(${logoSpring})`,
            textShadow: "0 0 80px rgba(255,255,255,0.1)",
          }}
        >
          Agent OS
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily:
              'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
            fontSize: 22,
            fontWeight: 400,
            color: "#ffffff88",
            marginTop: 24,
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            letterSpacing: "0.01em",
          }}
        >
          The AI that knows your business — activated anywhere you already are.
        </div>

        {/* Agent pills */}
        <Sequence from={100}>
          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 60,
              flexWrap: "wrap",
              justifyContent: "center",
              maxWidth: 1000,
            }}
          >
            {agents.map((agent, i) => (
              <AgentPill
                key={agent.name}
                agent={agent}
                index={i}
                startFrame={0}
              />
            ))}
          </div>
        </Sequence>

        {/* Founding Member CTA */}
        <Sequence from={160}>
          {(() => {
            const localFrame = frame - 160;
            const ctaOpacity = interpolate(localFrame, [0, 20], [0, 1], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            });
            const ctaY = interpolate(localFrame, [0, 20], [20, 0], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            });
            const borderGlow =
              Math.sin(localFrame * 0.04) * 0.4 + 0.6;

            return (
              <div
                style={{
                  marginTop: 50,
                  padding: "16px 40px",
                  borderRadius: 50,
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
                  border: `1px solid rgba(255,255,255,${0.15 * borderGlow})`,
                  opacity: ctaOpacity,
                  transform: `translateY(${ctaY}px)`,
                  backdropFilter: "blur(10px)",
                  boxShadow: `0 0 30px rgba(255,255,255,${0.05 * borderGlow})`,
                }}
              >
                <span
                  style={{
                    fontFamily:
                      'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#ffffffcc",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  Founding Members — Early Access
                </span>
              </div>
            );
          })()}
        </Sequence>
      </AbsoluteFill>

      {/* Bottom gradient */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background:
            "linear-gradient(to top, #0A0A0A, transparent)",
        }}
      />
    </AbsoluteFill>
  );
};
