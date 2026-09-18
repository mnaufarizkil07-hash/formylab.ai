"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Logo from "../components/Logo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Data alur masalah hingga solusi formylab.ai dalam Bahasa Inggris
  const steps = [
    {
      id: 1,
      title: "1. Tropical Climate",
      image: "/iklim.jpg",
      heading: "The Tropical Climate Challenge",
      caption: "Indonesia's unique geographical conditions and high humidity accelerate Transepidermal Water Loss (TEWL) and disrupt the skin barrier, demanding advanced adaptive cosmetic formulations.",
      badge: "🌐 Environmental Factor"
    },
    {
      id: 2,
      title: "2. Sensitive Skin",
      image: "/kulitsensitif.jpg",
      heading: "Sensitive Skin Vulnerability",
      caption: "As a direct consequence of tropical exposure, sensitive skin exhibits a narrow tolerance threshold, making it highly prone to irritation and requiring precise formulation standards.",
      badge: "🛡️ Skin Condition"
    },
    {
      id: 3,
      title: "3. Trial & Error",
      image: "/trialanderor.jpg",
      heading: "The Burden of R&D Trial & Error",
      caption: "To address sensitive skin challenges in tropical climates, conventional laboratory research is trapped in lengthy trial-and-error cycles—wasting valuable time, budget, and resources.",
      badge: "⚠️ R&D Bottleneck"
    },
    {
      id: 4,
      title: "4. formylab.ai Solution",
      image: "/solusi-ai.jpg",
      heading: "AI-Powered Cosmetic Formulation",
      caption: "formylab.ai revolutionizes research efficiency through predictive AI intelligence, modeling stability, compatibility, and safety instantly without endless physical experimentation.",
      badge: "💡 formylab.ai Solution"
    }
  ];

  // Efek Molekul Kimia: Kursor sebagai medan magnet, garis antar atom muncul saat berdekatan
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, radius: 200 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const particlesCount = Math.floor((width * height) / 11000);
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      neonColor: string;
    }> = [];

    const neonColors = ["#00F5D4", "#70E000", "#38BDF8", "#CCFF00"];

    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 3 + 2.2,
        neonColor: neonColors[Math.floor(Math.random() * neonColors.length)]
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Lerp posisi kursor agar tarikan magnetnya sangat halus
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const dxMouse = mouse.x - p.x;
        const dyMouse = mouse.y - p.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        // Efek medan magnet: titik atom tertarik perlahan ke arah kursor
        if (distMouse < mouse.radius) {
          const force = (mouse.radius - distMouse) / mouse.radius;
          p.x += (dxMouse / distMouse) * force * 1.5;
          p.y += (dyMouse / distMouse) * force * 1.5;
        }

        // Gambar titik atom
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.neonColor;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.neonColor;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Ikatan antar atom: Garis hanya muncul saat titik-titik saling mendekat
        for (let j = i + 1; j < particles.length; j++) {
          let p2 = particles[j];
          let dx = p.x - p2.x;
          let dy = p.y - p2.y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            let alpha = (1 - dist / 130) * 0.8;
            
            if (distMouse < mouse.radius) alpha *= 1.3;

            ctx.strokeStyle = `rgba(0, 245, 212, ${alpha})`;
            ctx.lineWidth = 1.6;
            ctx.shadowBlur = 6;
            ctx.shadowColor = "#00F5D4";
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Auto-slide setiap 5 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % steps.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [steps.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? steps.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % steps.length);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const allowedEmails = [
      "naufalrizki@gmail.com", "raisa@gmail.com", 
      "humaidah@gmail.com", "dewi@gmail.com", "jauja@gmail.com"
    ];

    if (allowedEmails.includes(email.toLowerCase()) && password === "12345") {
      const rawName = email.split("@")[0];
      const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      localStorage.setItem("formylabUser", formattedName);
      router.push("/dashboard");
    } else {
      alert("Failed to login: Email not registered or incorrect password.");
    }
  };

  const currentData = steps[currentIndex];

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-[var(--color-base)] relative overflow-x-hidden">
      
      {/* Canvas Interaktif Ikatan Senyawa Kimia */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none z-20 w-full h-full"
      />

      {/* SVG Noise Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-3 mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
        </svg>
      </div>

      {/* Sisi Kiri: Carousel Slide & Headline Penutup */}
      <div className="relative hidden md:flex flex-col justify-between w-full md:w-3/5 lg:w-2/3 p-8 lg:p-12 bg-gradasi-animasi overflow-hidden">
        
        <div className="absolute top-[-20%] left-[-20%] w-[70vw] h-[70vw] bg-[var(--color-brume)] rounded-full mix-blend-soft-light filter blur-[180px] opacity-15 pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[70vw] h-[70vw] bg-[var(--color-verveine)] rounded-full mix-blend-soft-light filter blur-[190px] opacity-15 pointer-events-none"></div>

        {/* Header Kiri */}
        <div className="relative z-30 w-full flex justify-between items-center">
          <div className="relative bg-white/40 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/60 shadow-[0_8px_24px_rgba(53,200,180,0.12)] flex items-center gap-3">
            <div className="absolute inset-0 bg-[var(--color-limonade)] opacity-30 blur-md rounded-2xl -z-10"></div>
            
            <span className="font-extrabold text-xs text-[var(--color-navy)] uppercase tracking-wider">
              {currentData.badge}
            </span>
            <div className="flex gap-1.5 items-center">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-500 cursor-pointer overflow-hidden bg-white/60 ${
                    currentIndex === idx ? "w-8 bg-[var(--color-navy)]" : "w-2 hover:bg-white"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  {currentIndex === idx && (
                    <div className="h-full bg-[var(--color-menthe)] animate-progress-fill"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
          <span className="text-xs font-bold text-[var(--color-navy)] bg-white/40 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/60 shadow-[0_4px_16px_rgba(53,200,180,0.08)]">
            Slide {currentIndex + 1} / {steps.length}
          </span>
        </div>

        {/* TENGAH: CAROUSEL CARD */}
        <div className="relative z-30 w-full max-w-3xl mx-auto my-auto">
          <div className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden bg-white/20 backdrop-blur-xl border border-white/70 shadow-[0_8px_32px_rgba(53,200,180,0.15),0_40px_80px_rgba(27,42,74,0.12)] group">
            
            <button 
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/80 hover:bg-white text-[var(--color-navy)] font-extrabold flex items-center justify-center shadow-[0_8px_20px_rgba(53,200,180,0.25)] backdrop-blur-md transition-all duration-300 transform hover:scale-105 opacity-80 group-hover:opacity-100 cursor-pointer text-lg"
              aria-label="Previous slide"
            >
              ❮
            </button>

            <button 
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/80 hover:bg-white text-[var(--color-navy)] font-extrabold flex items-center justify-center shadow-[0_8px_20px_rgba(53,200,180,0.25)] backdrop-blur-md transition-all duration-300 transform hover:scale-105 opacity-80 group-hover:opacity-100 cursor-pointer text-lg"
              aria-label="Next slide"
            >
              ❯
            </button>

            {currentData.image ? (
              <img 
                src={currentData.image} 
                alt={currentData.heading}
                className="w-full h-full object-cover transition-all duration-700"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-white/30 backdrop-blur-md">
                <div className="text-4xl mb-3">🚀</div>
                <h4 className="font-extrabold text-lg text-[var(--color-navy)] mb-1">formylab.ai Solution Slot</h4>
                <p className="text-sm text-[var(--color-navy)]/70 max-w-md">AI research visual assets will be placed here.</p>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy)]/90 via-[var(--color-navy)]/40 to-transparent flex flex-col justify-end p-6 lg:p-8 text-white pointer-events-none">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-brume)] mb-1.5 drop-shadow-sm">
                {currentData.title}
              </span>
              <h3 className="font-extrabold text-xl lg:text-2xl text-white mb-2 drop-shadow-md">
                {currentData.heading}
              </h3>
              <p className="text-xs lg:text-sm font-medium text-white/95 leading-relaxed max-w-2xl drop-shadow-sm">
                {currentData.caption}
              </p>
            </div>

          </div>
        </div>

        {/* BAWAH KIRI: HEADLINE PENUTUP */}
        <div className="relative z-30 w-full text-[var(--color-navy)] mt-12 pt-6 border-t border-white/30">
          <div className="w-10 h-[3px] bg-[var(--color-menthe)] rounded-full mb-3 shadow-[0_2px_8px_rgba(53,200,180,0.5)]"></div>
          
          <div className="max-w-[560px]">
            <h1 className="font-extrabold text-2xl lg:text-3xl tracking-tight mb-2 leading-tight">
              The Future of <span className="text-[var(--color-navy)]/70">AI Cosmetic Formulation</span>
            </h1>
            <p className="font-medium text-xs lg:text-sm text-[var(--color-navy)]/80 leading-relaxed">
              Delivering maximum efficiency for research and development of beauty products.
            </p>
          </div>
        </div>

      </div>

      {/* Sisi Kanan: Form Login */}
      <div className="relative flex items-center justify-center w-full md:w-2/5 lg:w-1/3 p-8 overflow-hidden">
        
        <div className="absolute bottom-[-20px] left-[-20px] w-48 h-48 bg-[var(--color-menthe)]/40 rounded-full blur-[60px] pointer-events-none"></div>
        <div className="absolute top-[-30px] right-[-30px] w-56 h-56 bg-[var(--color-limonade)]/60 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-30 w-full max-w-md p-10 bg-white/70 backdrop-blur-2xl border border-white/90 rounded-[24px] shadow-[0_12px_40px_rgba(53,200,180,0.18),0_40px_80px_rgba(27,42,74,0.1)]">
          
          <div className="flex justify-center mb-6">
             <Logo size="lg" />
          </div>
          
          <p className="mb-8 font-medium text-sm text-[var(--color-navy)]/60 text-center">
            Sign in to your formulation workspace
          </p>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="font-bold text-sm text-[var(--color-navy)]">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1.5 p-3 text-[var(--color-navy)] bg-white/90 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-menthe)] shadow-sm transition-all" 
                placeholder="name@yourlab.com"
                required
              />
            </div>
            <div>
              <label className="font-bold text-sm text-[var(--color-navy)]">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1.5 p-3 text-[var(--color-navy)] bg-white/90 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-menthe)] shadow-sm transition-all" 
                placeholder="••••••••"
                required
              />
            </div>
            <button 
              type="submit" 
              className="mt-4 py-3.5 font-extrabold text-white bg-[var(--color-menthe)] rounded-xl transition-all duration-300 hover:bg-[var(--color-verveine)] hover:text-[var(--color-navy)] shadow-[0_8px_24px_rgba(53,200,180,0.3)] cursor-pointer"
            >
              Log in
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center justify-center gap-2 text-[var(--color-navy)]/60 text-xs font-semibold">
            <svg className="w-3.5 h-3.5 text-[var(--color-menthe)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            <span>Secure formulation workspace</span>
          </div>

        </div>
      </div>

      <style jsx global>{`
        @keyframes progressFill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress-fill {
          animation: progressFill 5s linear infinite;
        }
      `}</style>
    </main>
  );
}