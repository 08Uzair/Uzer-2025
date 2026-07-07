// A fixed, full-viewport animated glow background.
// Render this ONCE at the top of App.js so it sits behind every page.
export default function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <div
        className="absolute rounded-full opacity-[0.07]"
        style={{
          width: "600px",
          height: "600px",
          top: "-100px",
          left: "-150px",
          background: "radial-gradient(circle, #ffffff 0%, transparent 70%)",
          animation: "orbFloat1 12s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full opacity-[0.05]"
        style={{
          width: "700px",
          height: "700px",
          bottom: "-200px",
          right: "-200px",
          background: "radial-gradient(circle, #ffffff 0%, transparent 70%)",
          animation: "orbFloat2 16s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full opacity-[0.04]"
        style={{
          width: "400px",
          height: "400px",
          top: "30%",
          left: "40%",
          background: "radial-gradient(circle, #aaaaaa 0%, transparent 70%)",
          animation: "orbFloat3 20s ease-in-out infinite",
        }}
      />
      {/* faint grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <style>{`
        @keyframes orbFloat1 {
          0%,100%{transform:translate(0,0) scale(1)}
          33%{transform:translate(60px,40px) scale(1.05)}
          66%{transform:translate(-30px,70px) scale(0.97)}
        }
        @keyframes orbFloat2 {
          0%,100%{transform:translate(0,0) scale(1)}
          33%{transform:translate(-80px,-50px) scale(1.08)}
          66%{transform:translate(40px,-80px) scale(0.95)}
        }
        @keyframes orbFloat3 {
          0%,100%{transform:translate(0,0) scale(1)}
          50%{transform:translate(-60px,60px) scale(1.1)}
        }
      `}</style>
    </div>
  );
}