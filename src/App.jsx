import { useState, useEffect, useRef } from "react";

const useInView = (t = 0.1) => {
  const r = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => { const el = r.current; if (!el) return; const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.unobserve(el); } }, { threshold: t }); o.observe(el); return () => o.disconnect(); }, [t]);
  return [r, v];
};
const R = ({ children, delay = 0, y = 60, className = "", style: extraStyle }) => {
  const [r, v] = useInView(0.08);
  return <div ref={r} className={className} style={{ opacity: v?1:0, transform: v?"none":`translateY(${y}px)`, transition:`opacity 1s cubic-bezier(.22,1,.36,1) ${delay}s, transform 1s cubic-bezier(.22,1,.36,1) ${delay}s`, ...extraStyle }}>{children}</div>;
};

/* ── Scroll-animated card (ContainerScroll effect) ── */
const ScrollCard = ({ children }) => {
  const ref = useRef(null);
  const [style, setStyle] = useState({ transform: "perspective(1200px) rotateX(16deg) scale(0.92)", opacity: 0.7 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handle = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = rect.top + rect.height / 2;
      // progress: 0 = element entering bottom, 1 = element at/past center
      const raw = 1 - (center - vh * 0.4) / (vh * 0.8);
      const p = Math.max(0, Math.min(1, raw));
      const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // easeInOutQuad
      const rotX = 16 * (1 - ease);
      const sc = 0.92 + 0.08 * ease;
      const op = 0.7 + 0.3 * ease;
      setStyle({ transform: `perspective(1200px) rotateX(${rotX}deg) scale(${sc})`, opacity: op });
    };
    handle();
    window.addEventListener("scroll", handle, { passive: true });
    window.addEventListener("resize", handle, { passive: true });
    return () => { window.removeEventListener("scroll", handle); window.removeEventListener("resize", handle); };
  }, []);

  return (
    <div ref={ref} style={{ ...style, transition: "transform 0.1s linear, opacity 0.1s linear", transformOrigin: "center top", willChange: "transform" }}>
      {children}
    </div>
  );
};


const ScrollFrame = ({ children }) => {
  const frameRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh;
      const end = vh * 0.3;
      const raw = 1 - (rect.top - end) / (start - end);
      setProgress(Math.max(0, Math.min(1, raw)));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const rotateX = 20 * (1 - progress);
  const sc = 0.85 + 0.15 * progress;
  const ty = 60 * (1 - progress);

  return (
    <div ref={frameRef} style={{ perspective: 1200, perspectiveOrigin: "center top" }}>
      <div style={{
        transform: `rotateX(${rotateX}deg) scale(${sc}) translateY(${ty}px)`,
        transformOrigin: "center top",
        transition: "transform 0.05s linear",
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: `0 ${20 + 40 * (1 - progress)}px ${60 + 40 * (1 - progress)}px rgba(9,13,31,${0.15 + 0.15 * (1 - progress)})`}}>
        <div style={{ background: "#222", borderRadius: 24, padding: 8, border: "3px solid #444" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px 10px" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
            <div style={{ flex: 1, height: 22, background: "#333", borderRadius: 6, marginLeft: 12 }} />
          </div>
          <div style={{ borderRadius: 16, overflow: "hidden" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};


const IMGS = {
  exitusLogo: "./assets/exitusLogo.jpg",
  diagram: "./assets/diagram.jpg",
  oQueE: "./assets/oQueE.jpg",
  appMockup: "./assets/appMockup.png",
  roteiro: "./assets/roteiro.jpg?v=2",
  revisao: "./assets/revisao.jpg?v=2",
  bloom: "./assets/bloom.png?v=3",
  alunoIaSozinho: "./assets/aluno_ia_sozinho.png?v=1",
  tioBento: "./assets/tioBento.png",
  questoes: "./assets/questoes.jpg?v=2",
  logo: "./assets/logo_branco.png",
  logoBranco: "./assets/logo_branco.png",
  logoEscuro: "./assets/logo_escuro.png",
  g_dashboard_full: "./assets/g_dashboard_full.png",
  g_roteiro: "./assets/g_roteiro.png",
  g_revisao_conteudo: "./assets/g_revisao_conteudo.png",
  g_questoes: "./assets/g_questoes.png",
  g_quiz: "./assets/g_quiz.png",
  g_tia_chris: "./assets/g_tia_chris.png",
  g_tio_bento: "./assets/g_tio_bento.png",
  g_provas: "./assets/g_provas.png",
  g_materiais: "./assets/g_materiais.png",
  g_revisao_aula: "./assets/g_revisao_aula.png",
  dashboard: "./assets/dashboard.png",
  christus: "./assets/christus.jpg",
  christusColor: "./assets/Logo-Christus-Colorida.png",
};

const C = { navy:"#050820", deep:"#0a0e2a", ink:"#121640", mag:"#7696DA", magL:"#8AABF0",
  acc:"#5B7FCC", gold:"#d4a030", light:"#f4f5f9", off:"#fafafd", white:"#fff",
  text:"#1e2035", muted:"#5d6185", faint:"#8d92b0" };

const scroll = id => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });

const css = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:'Poppins',sans-serif;color:${C.text};background:${C.white};overflow-x:hidden;-webkit-font-smoothing:antialiased}
#root{overflow-x:hidden;width:100%;max-width:100vw}
section{overflow-x:hidden}
input:-webkit-autofill,input:-webkit-autofill:hover,input:-webkit-autofill:focus{-webkit-box-shadow:0 0 0 30px #0a0e2a inset !important;-webkit-text-fill-color:#ffffff !important;caret-color:#ffffff !important;transition:background-color 5000s ease-in-out 0s}
input::placeholder{color:rgba(255,255,255,0.35)}
.ff{font-family:'Sora',sans-serif}

@keyframes profilePop{0%{transform:scale(0);opacity:0}60%{transform:scale(1.25);opacity:1}100%{transform:scale(1);opacity:1}}

.grain{position:relative}
.grain::after{content:'';position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");background-repeat:repeat;background-size:256px;pointer-events:none;opacity:0.5;z-index:1;mix-blend-mode:overlay}

.btn-m{background:linear-gradient(135deg,${C.mag},${C.magL});color:#fff;border:none;padding:18px 44px;border-radius:60px;font-family:'Poppins';font-weight:600;font-size:15px;cursor:pointer;transition:all .4s cubic-bezier(.22,1,.36,1);display:inline-flex;align-items:center;gap:10px;box-shadow:0 6px 28px ${C.mag}44;letter-spacing:.04em;text-transform:uppercase}
.btn-m:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 14px 44px ${C.mag}55}
.btn-g{background:transparent;color:#fff;border:1.5px solid #fff3;padding:16px 40px;border-radius:60px;font-family:'Poppins';font-weight:500;font-size:15px;cursor:pointer;transition:all .35s ease;display:inline-flex;align-items:center;gap:10px;letter-spacing:.04em;text-transform:uppercase}
.btn-g:hover{border-color:#fff8;background:#fff08}
.btn-n{background:${C.navy};color:#fff;border:none;padding:18px 44px;border-radius:60px;font-family:'Poppins';font-weight:600;font-size:15px;cursor:pointer;transition:all .35s ease;display:inline-flex;align-items:center;gap:10px;box-shadow:0 4px 20px #090d1f33;letter-spacing:.04em;text-transform:uppercase}
.btn-n:hover{transform:translateY(-2px);box-shadow:0 10px 32px #090d1f44}

.tag{font-size:11px;font-weight:700;letter-spacing:5px;text-transform:uppercase;color:${C.mag};display:inline-block;margin-bottom:20px}
.tag-d{color:#fff6}
.gt{background:linear-gradient(135deg,${C.mag},${C.acc});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.orb{position:absolute;border-radius:50%;filter:blur(120px);pointer-events:none}
.img-f{width:100%;border-radius:16px;display:block}
.img-s{width:100%;max-width:640px;border-radius:12px;display:block}
.glass{background:#fff06;backdrop-filter:blur(24px);border:1px solid #fff12;border-radius:24px}

.nl{color:#fff7;text-decoration:none;font-size:13px;font-weight:500;letter-spacing:.04em;transition:color .25s;text-transform:uppercase}
.nl:hover{color:#fff}

@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.mq{display:flex;gap:48px;animation:marquee 35s linear infinite;white-space:nowrap;will-change:transform}

.nc{position:relative;padding:32px;background:${C.white};border-radius:20px;overflow:hidden;box-shadow:0 2px 20px #0001;transition:all .5s cubic-bezier(.22,1,.36,1)}
.nc:hover{transform:translateY(-6px);box-shadow:0 20px 56px #090d1f11}

/* Gradient bg animation */
@keyframes moveVertical{0%{transform:translateY(-50%)}50%{transform:translateY(50%)}100%{transform:translateY(-50%)}}
@keyframes moveInCircle{0%{transform:rotate(0deg)}50%{transform:rotate(180deg)}100%{transform:rotate(360deg)}}
@keyframes moveHorizontal{0%{transform:translateX(-50%) translateY(-10%)}50%{transform:translateX(50%) translateY(10%)}100%{transform:translateX(-50%) translateY(-10%)}}
.grad-blob{position:absolute;mix-blend-mode:hard-light;border-radius:50%;filter:blur(40px);opacity:.85;will-change:transform}
@supports (-webkit-backdrop-filter:none){.grad-blob{filter:blur(60px)}}

/* ── Mobile nav ── */
.ham{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:8px;z-index:200;background:none;border:none}
.ham span{display:block;width:22px;height:2px;background:#fff;border-radius:2px;transition:all .3s ease}
.ham.open span:nth-child(1){transform:rotate(45deg) translate(5px,5px)}
.ham.open span:nth-child(2){opacity:0}
.ham.open span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px)}
.mob-nav{position:fixed;inset:0;background:rgba(5,8,32,0.98);backdrop-filter:blur(20px);z-index:150;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;opacity:0;pointer-events:none;transition:opacity .35s ease}
.mob-nav.open{opacity:1;pointer-events:auto}
.mob-nav a{color:#fffc;text-decoration:none;font-size:18px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;font-family:'Sora',sans-serif;padding:8px 0;transition:color .25s}
.mob-nav a:hover{color:${C.mag}}

/* ── Gallery responsive ── */
.gal-tabs{display:flex;flex-direction:column;gap:6px}
.gal-grid{}
.step-img{margin-left:104px;margin-bottom:48px}

/* ══ ≤1024px — Tablets / small laptops ══ */
@media(max-width:1024px){
  .g2{grid-template-columns:1fr !important;gap:40px !important}
  .cf-row{grid-template-columns:1fr !important;gap:36px !important}
  .gal-tabs{flex-direction:row !important;overflow-x:auto !important;overflow-y:hidden !important;gap:8px !important;padding-bottom:12px !important;-webkit-overflow-scrolling:touch;scrollbar-width:none;touch-action:pan-x !important}
  .gal-tabs::-webkit-scrollbar{display:none}
  .gal-grid{display:flex !important;flex-direction:column-reverse !important;gap:24px !important}
  .gal-section{overflow-x:hidden !important;overflow-y:visible !important}
  .gal-tabs-wrap{overflow:visible !important;transform:none !important;opacity:1 !important}
  .step-img{margin-left:0 !important}
  .sp{padding:100px 28px !important}
  .hero-inner{padding:48px 28px 80px !important;gap:48px !important}
}

/* ══ ≤768px — Mobile landscape / small tablets ══ */
@media(max-width:768px){
  .mhide{display:none !important}
  .ham{display:flex !important}
  .nav-logo{height:56px !important}
  .hero-t{font-size:clamp(26px,7vw,36px) !important;line-height:1.25 !important;text-align:center !important;margin-left:auto !important;margin-right:auto !important}
  .hero-sub{font-size:0.58em !important;line-height:1.4 !important;display:block !important;margin-top:10px !important;font-weight:400 !important}
  .big-t{font-size:clamp(24px,6vw,32px) !important;line-height:1.25 !important;text-align:center !important;margin-left:auto !important;margin-right:auto !important;max-width:100% !important}
  .sp{padding:80px 20px !important}
  .hero-inner{padding:40px 20px 60px !important;gap:36px !important;text-align:center !important}
  .quote-b{padding:36px 24px !important;border-radius:20px !important;text-align:center !important}
  .quote-b p{margin-left:auto !important;margin-right:auto !important;text-align:center !important}
  .quote-b > span{left:50% !important;transform:translateX(-50%) !important}
  .nav-pad{padding:0 20px !important}
  .btn-m{padding:14px 28px !important;font-size:14px !important}
  .btn-g{padding:14px 28px !important;font-size:14px !important}
  .nc{padding:24px !important;text-align:center !important}
  .ft-pad{padding:28px 20px 20px !important}
  .contact-glass{padding:36px 24px !important}
  .glass-panel{padding:36px 24px !important}
  .feat-inner{padding:28px 24px !important;text-align:center !important}
  .hero-btns{flex-direction:column !important;width:100%;justify-content:center !important;align-items:center !important}
  .hero-btns .btn-m,.hero-btns .btn-g{width:100%;justify-content:center;text-align:center}
  .hero-badge{padding:12px 16px !important;justify-content:center !important;text-align:center !important}
  .mq{gap:32px}
  .demo-modal-inner{width:95vw !important;max-width:none !important;border-radius:16px !important}
  .demo-modal-inner video{max-height:60vh !important}

  /* ── Mobile global centering ── */
  .mc, .mc *:not(input):not(button):not(.btn-m):not(.btn-g){text-align:center !important}
  .mc{text-align:center !important;display:flex !important;flex-direction:column !important;align-items:center !important}
  .mc .tag{display:block !important;margin-left:auto !important;margin-right:auto !important}
  .mc p{margin-left:auto !important;margin-right:auto !important;max-width:100% !important}
  .mc .hero-badge{justify-content:center}
  .mc h1, .mc h2, .mc h3, .mc h4{text-align:center !important;width:100%;max-width:100% !important}

  .sec-center{text-align:center !important;display:flex !important;flex-direction:column !important;align-items:center !important}
  .sec-center .tag{display:block !important;margin-left:auto !important;margin-right:auto !important}
  .sec-center p{margin-left:auto !important;margin-right:auto !important;max-width:100% !important;text-align:center !important}
  .sec-center h1, .sec-center h2, .sec-center h3, .sec-center h4{text-align:center !important;width:100%;max-width:100% !important;margin-left:auto !important;margin-right:auto !important}

  .ft-inner{flex-direction:column !important;align-items:center !important;text-align:center !important}
  .seg-inner{text-align:center !important}
  .seg-inner>div{margin:0 auto !important}
  .nc .nc-bar{margin:0 auto 14px !important}
  .nc-bar{margin-left:auto !important;margin-right:auto !important}
  .sol-t{white-space:normal !important}

  /* Como Funciona — steps row */
  .cf-row{grid-template-columns:1fr !important;gap:28px !important;text-align:center !important}
  .cf-row img{margin:0 auto !important}
  .cf-row p{margin-left:auto !important;margin-right:auto !important;text-align:center !important}
  .cf-row h4{text-align:center !important}
  .cf-step-head{justify-content:center !important;flex-direction:column !important;gap:14px !important;align-items:center !important}

  /* Cards de bullets (Problema) — centralizar conteúdo dentro */
  .bullet-card{flex-direction:column !important;align-items:center !important;text-align:center !important;gap:12px !important}
  .bullet-card > div:first-child{margin-top:0 !important}

  /* Lista bullets verticais (Problema-IA "Sem mediação") — centralizar */
  .bullet-row{justify-content:center !important;text-align:center !important}

  /* Stats grid 4 colunas — vira 2x2 */
  .stats-4{grid-template-columns:1fr 1fr !important;gap:24px !important}

  /* Cards Solução 2 colunas — vira coluna */
  .sol-cards{grid-template-columns:1fr !important;gap:16px !important}
  .sol-cards > div{text-align:center !important}
  .sol-cards p{text-align:center !important}

  /* Plataforma tabs — wrap em coluna full width */
  .plat-tabs{flex-direction:column !important;gap:10px !important}
  .plat-tabs > div{width:100% !important;justify-content:center !important;text-align:center !important}
  .plat-card-grid{grid-template-columns:1fr !important}
  .plat-card-text{padding:32px 24px !important;text-align:center !important}
  .plat-card-text > div:first-child{flex-direction:column !important;align-items:center !important;text-align:center !important}
  .plat-card-text p{text-align:center !important;margin-left:auto !important;margin-right:auto !important}
  .plat-card-text > div[style*="36px"]{margin:0 auto !important}
  .plat-checks{padding:32px 24px !important}
  .plat-checks > div{text-align:left !important}

  /* Contato features (ícone + texto) — empilhar */
  .contact-feat{flex-direction:column !important;align-items:center !important;text-align:center !important;gap:12px !important}
  .contact-feat > div:last-child{text-align:center !important}
  .contact-feat h4{text-align:center !important}
  .contact-feat p{text-align:center !important}

  /* Segurança 4 cards 2x2 → 1 coluna */
  .seg-inner{grid-template-columns:1fr !important;gap:14px !important}
  .tech-antagonist{grid-template-columns:1fr !important;gap:12px !important}

  /* Abordagem 3 cards → 1 coluna centralizada */
  .abord-grid{grid-template-columns:1fr !important;gap:20px !important}
  .abord-grid > div{text-align:center !important}
  .abord-grid h4, .abord-grid p{text-align:center !important}

  /* Tag — centralizar */
  .tag{margin-left:auto !important;margin-right:auto !important;display:inline-block !important}

  /* Gallery mobile */
  .gal-grid{display:flex !important;flex-direction:column !important;gap:20px !important}
  .gal-section{overflow-x:hidden !important;overflow-y:visible !important}
  .gal-tabs-wrap{overflow:visible !important;transform:none !important;opacity:1 !important}
  .gal-tabs{display:flex !important;flex-direction:row !important;flex-wrap:nowrap !important;overflow-x:auto !important;overflow-y:hidden !important;gap:6px !important;padding:4px 4px 10px !important;-webkit-overflow-scrolling:touch;scrollbar-width:none;touch-action:pan-x !important;width:100% !important;position:relative !important}
  .gal-tabs::-webkit-scrollbar{display:none}
  .gal-tab{padding:8px 16px !important;border-radius:20px !important;white-space:nowrap !important;flex:0 0 auto !important;transform:none !important;min-width:max-content !important}
  .gal-tab span{font-size:12px !important}
  .gal-tab .gal-dot{display:none !important}
  .gal-swipe-hint{display:flex !important}
  .gal-nav{display:flex !important}
}

/* ══ ≤480px — Mobile portrait ══ */
@media(max-width:480px){
  .hero-t{font-size:24px !important}
  .big-t{font-size:22px !important}
  .sp{padding:64px 16px !important}
  .hero-inner{padding:32px 16px 48px !important;gap:28px !important}
  .quote-b{padding:28px 20px !important}
  .nav-pad{padding:0 16px !important}
  .ft-pad{padding:24px 16px 16px !important}
  .contact-glass{padding:28px 16px !important}
  .glass-panel{padding:28px 20px !important}
  .feat-inner{padding:24px 18px !important}
  .tag{font-size:10px;letter-spacing:4px;margin-bottom:14px}
  .nc{padding:20px !important}
  .demo-modal-inner{width:100vw !important;border-radius:0 !important;max-height:100vh !important}
  .demo-modal-header{padding:14px 16px !important}
  .demo-modal-header span{font-size:14px !important}
}
`;

/* ── Glowing border card (mouse-tracking glow) ── */
const GlowCard = ({ children, color, bg }) => {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const blurRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const angle = Math.atan2(y - rect.height/2, x - rect.width/2) * (180/Math.PI) + 90;
      if (glowRef.current) { glowRef.current.style.opacity = "1"; glowRef.current.style.background = `conic-gradient(from ${angle}deg at 50% 50%, transparent 0deg, ${color} 60deg, ${color}cc 120deg, transparent 180deg)`; }
      if (blurRef.current) { blurRef.current.style.opacity = "1"; blurRef.current.style.background = `conic-gradient(from ${angle}deg at 50% 50%, transparent 0deg, ${color}88 60deg, ${color}55 120deg, transparent 180deg)`; }
    };
    const onLeave = () => {
      if (glowRef.current) glowRef.current.style.opacity = "0";
      if (blurRef.current) blurRef.current.style.opacity = "0";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, [color]);

  return (
    <div ref={cardRef} style={{position:"relative",borderRadius:22,padding:2,cursor:"default"}}>
      <div ref={glowRef} style={{position:"absolute",inset:0,borderRadius:"inherit",pointerEvents:"none",zIndex:0,opacity:0,transition:"opacity 0.4s ease"}} />
      <div ref={blurRef} style={{position:"absolute",inset:-2,borderRadius:"inherit",pointerEvents:"none",zIndex:0,opacity:0,transition:"opacity 0.4s ease",filter:"blur(14px)"}} />
      <div className="feat-inner" style={{position:"relative",zIndex:1,borderRadius:20,background:bg,padding:"36px 40px",overflow:"hidden",transition:"transform .5s cubic-bezier(.22,1,.36,1), box-shadow .5s ease"}}
        onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 20px 48px ${color}15`}}
        onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none"}}>
        {children}
      </div>
    </div>
  );
};

/* ══ NAV ══ */
const Nav = () => {
  const [s,ss] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(()=>{const h=()=>ss(window.scrollY>60);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h)},[]);
  useEffect(()=>{document.body.style.overflow=menuOpen?"hidden":"";return()=>{document.body.style.overflow=""}},[menuOpen]);
  const links=[{l:"Solução",id:"solucao"},{l:"Como Funciona",id:"como-funciona"},{l:"Ciência",id:"neurociencia"},{l:"Segurança",id:"seguranca"},{l:"Resultados",id:"prova-social"},{l:"Contato",id:"contato"}];
  const handleNav=(id)=>{setMenuOpen(false);setTimeout(()=>scroll(id),100)};
  return (
    <>
      <div className={`mob-nav ${menuOpen?"open":""}`}>
        {links.map(n=>(<a key={n.id} href="#" onClick={e=>{e.preventDefault();handleNav(n.id)}}>{n.l}</a>))}
        <button className="btn-m" style={{marginTop:12}} onClick={()=>handleNav("contato")}>Agendar Demo</button>
      </div>
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,background:s||menuOpen?"rgba(5,8,32,0.97)":"transparent",backdropFilter:s||menuOpen?"blur(28px)":"none",transition:"all .45s ease",padding:s?"8px 0":"20px 0",borderBottom:s?"1px solid #fff08":"none"}}>
        <div className="nav-pad" style={{maxWidth:1400,margin:"0 auto",padding:"0 40px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{cursor:"pointer",flexShrink:0}} onClick={()=>{setMenuOpen(false);window.scrollTo({top:0,behavior:"smooth"})}}>
            <img src={IMGS.logo} alt="Exitus" className="nav-logo" style={{height:88}} />
          </div>
          <div className="mhide" style={{display:"flex",gap:20,alignItems:"center"}}>
            {links.map(n=>
              <a key={n.id} className="nl" href="#" onClick={e=>{e.preventDefault();scroll(n.id)}}>{n.l}</a>)}
            <button className="btn-m" style={{padding:"10px 24px",fontSize:11,marginLeft:4}} onClick={()=>scroll("contato")}>Agendar Demo</button>
          </div>
          <button className={`ham ${menuOpen?"open":""}`} onClick={()=>setMenuOpen(!menuOpen)} aria-label="Menu">
            <span/><span/><span/>
          </button>
        </div>
      </nav>
    </>
  );
};

/* ══════════════════════════════════════════════════
   1. HERO — Animated gradient background
   ══════════════════════════════════════════════════ */
const GradientBg = () => (
  <div style={{position:"absolute",inset:0,overflow:"hidden",background:"linear-gradient(40deg, rgb(5,8,32), rgb(10,14,42))"}}>
    <svg style={{display:"none"}}><defs><filter id="blurMe"><feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"/><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo"/><feBlend in="SourceGraphic" in2="goo"/></filter></defs></svg>
    <div style={{position:"absolute",inset:0,filter:"url(#blurMe) blur(40px)"}}>
      <div className="grad-blob" style={{width:"80%",height:"80%",top:"10%",left:"10%",background:"radial-gradient(circle at center, rgba(118,150,218,0.8) 0, rgba(118,150,218,0) 50%)",animation:"moveVertical 30s ease infinite"}} />
      <div className="grad-blob" style={{width:"80%",height:"80%",top:"10%",left:"10%",background:"radial-gradient(circle at center, rgba(138,171,240,0.8) 0, rgba(138,171,240,0) 50%)",animation:"moveInCircle 20s reverse infinite"}} />
      <div className="grad-blob" style={{width:"80%",height:"80%",top:"10%",left:"10%",background:"radial-gradient(circle at center, rgba(160,190,255,0.7) 0, rgba(160,190,255,0) 50%)",animation:"moveInCircle 40s linear infinite"}} />
      <div className="grad-blob" style={{width:"80%",height:"80%",top:"10%",left:"10%",background:"radial-gradient(circle at center, rgba(90,120,200,0.6) 0, rgba(90,120,200,0) 50%)",animation:"moveHorizontal 40s ease infinite",opacity:.6}} />
      <div className="grad-blob" style={{width:"80%",height:"80%",top:"10%",left:"10%",background:"radial-gradient(circle at center, rgba(70,100,180,0.7) 0, rgba(70,100,180,0) 50%)",animation:"moveInCircle 20s ease infinite"}} />
    </div>
    {/* Dark overlay for text readability */}
    <div style={{position:"absolute",inset:0,background:"rgba(5,8,32,0.3)"}} />
  </div>
);

const Hero = () => (
  <section style={{minHeight:"100vh",display:"flex",alignItems:"center",paddingTop:100,position:"relative",overflow:"hidden"}}>
    <GradientBg />

    <div className="g2 hero-inner" style={{maxWidth:1320,margin:"0 auto",padding:"60px 48px 120px",width:"100%",display:"grid",gridTemplateColumns:"1.2fr .8fr",gap:72,alignItems:"center",position:"relative",zIndex:3}}>
      <div className="mc">
        <R delay={.05}>
          <p style={{fontSize:13,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:C.mag,marginBottom:20}}>IA para ampliar alcance pedagógico</p>
        </R>
        <R delay={.12}>
          <h1 className="ff hero-t" style={{fontSize:"clamp(32px,4.5vw,54px)",color:C.white,lineHeight:1.18,marginBottom:24,fontWeight:700}}>
            Uma plataforma que maximiza o aprendizado do aluno e estende o alcance do professor.
          </h1>
        </R>
        <R delay={.18}>
          <p style={{fontSize:17,color:"#fffc",lineHeight:1.7,marginBottom:36,maxWidth:520,fontWeight:400}}>
            Utilizando a IA com segurança e controle, respeitando os valores da escola e da família.
          </p>
        </R>
        <R delay={.28}>
          <div className="hero-btns" style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:40}}>
            <button className="btn-m" onClick={()=>scroll("contato")}>Agendar Demonstração <span style={{fontSize:16}}>→</span></button>
            <button className="btn-g" onClick={()=>scroll("como-funciona")}>Como Funciona</button>
          </div>
        </R>
        <R delay={.36}>
          <div className="hero-badge" onClick={()=>scroll("prova-social")} style={{cursor:"pointer",display:"inline-flex",alignItems:"center",gap:14,padding:"14px 28px",borderRadius:60,border:"1px solid #fff15",background:"#fff08",transition:"all .3s"}}>
            <span style={{fontSize:16}}>🏆</span>
            <span style={{fontSize:13,color:"#fffa"}}>Desenvolvido com o <strong style={{color:"#ffff",fontWeight:600}}>Colégio Christus</strong> — 1º lugar ENEM 2024</span>
          </div>
        </R>
      </div>
      <R delay={.2} y={30}>
        <div style={{position:"relative"}}>
          <div className="mhide" style={{position:"absolute",top:-24,left:-24,width:100,height:100,borderTop:`2px solid ${C.mag}55`,borderLeft:`2px solid ${C.mag}55`,borderRadius:"20px 0 0 0"}} />
          <div className="mhide" style={{position:"absolute",bottom:-24,right:-24,width:100,height:100,borderBottom:`2px solid ${C.acc}44`,borderRight:`2px solid ${C.acc}44`,borderRadius:"0 0 20px 0"}} />
          <img src={IMGS.appMockup} alt="Exitus App" className="img-f" style={{position:"relative",zIndex:1}} />
        </div>
      </R>
    </div>
    <div style={{position:"absolute",bottom:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent 5%,${C.mag} 30%,${C.magL} 50%,${C.acc} 70%,transparent 95%)`,opacity:.5,zIndex:4}} />
  </section>
);

/* ══════════════════════════════════════════════════
   MARQUEE — Discreto, elegante, não agressivo
   ══════════════════════════════════════════════════ */
const Marquee = () => {
  const items = ["Aprendizagem Personalizada","IA com Segurança","Escola no Comando","Tutoria Inteligente 24/7","Estudo Adaptativo","Letramento Digital","Intencionalidade Pedagógica","Professor Potencializado","Neurociência Aplicada"];
  return (
    <div style={{background:`linear-gradient(90deg,${C.mag},${C.magL},${C.mag})`,padding:"16px 0",overflow:"hidden"}}>
      <div className="mq">
        {[...items,...items,...items].map((t,i)=>(
          <span key={i} style={{display:"flex",alignItems:"center",gap:18,flexShrink:0}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"#fff",flexShrink:0}} />
            <span style={{fontSize:13,fontWeight:700,color:"#fff",letterSpacing:".07em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{t}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════
   2a. PROBLEMA — Quebra 1: Necessidade de personalização
   ══════════════════════════════════════════════════ */
const Problema = () => (
  <>
  <section id="problema" className="sp" style={{background:C.off,padding:"140px 48px",position:"relative",overflow:"hidden"}}>
    <div className="orb" style={{width:300,height:300,background:C.mag,top:"10%",right:"-8%",opacity:.03}} />
    <div className="sec-center" style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:1}}>
      <R><div className="tag">O Problema</div></R>

      {/* Headline */}
      <R delay={.06}>
        <h2 className="ff big-t" style={{fontSize:"clamp(30px,4.8vw,48px)",color:C.navy,lineHeight:1.2,marginBottom:20,fontWeight:700,maxWidth:900}}>
          <strong>Cada aluno aprende de um jeito</strong>{" "}
          <span style={{color:C.faint,fontWeight:400}}>e as escolas que mais se destacam sabem disso há muito tempo.</span>
        </h2>
      </R>

      {/* Subheadline */}
      <R delay={.1}>
        <p style={{fontSize:17,color:C.muted,lineHeight:1.85,marginBottom:40,maxWidth:860}}>
          Por isso, criaram soluções como reforço, plantões, turmas avançadas e preparação para olimpíadas e vestibulares de alta concorrência.
        </p>
      </R>

      {/* 4 cards — grid 2x2 */}
      <R delay={.14}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:48}} className="g2">
          {[
            "Os alunos acumulam lacunas silenciosas — aprendem em ritmos e formas diferentes, mas ninguém percebe quando algo ficou para trás",
            "O professor só descobre o problema na hora da prova — sem acompanhar a progressão individual de cada aluno em tempo real",
            "A escola é responsabilizada pelo resultado, mas perdeu o controle do processo — a IA já está na mão do aluno, sem filtro pedagógico",
            "Os pais ficam no escuro até chegar a nota — sem visibilidade do progresso real do filho, a confiança na escola se desgasta",
          ].map((t,i)=>(
            <div key={i} className="bullet-card" style={{padding:"28px 28px",background:C.white,borderRadius:20,border:"1px solid #0001",display:"flex",gap:16,alignItems:"flex-start",boxShadow:"0 2px 12px rgba(5,8,32,0.04)",transition:"all .4s ease"}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 8px 28px ${C.mag}12`;e.currentTarget.style.transform="translateY(-2px)"}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 2px 12px rgba(5,8,32,0.04)";e.currentTarget.style.transform="none"}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:C.mag,flexShrink:0,marginTop:7}} />
              <span style={{fontSize:15,color:C.navy,lineHeight:1.65,fontWeight:500}}>{t}</span>
            </div>
          ))}
        </div>
      </R>

      {/* Fechamento */}
      <R delay={.2}>
        <div style={{borderTop:`2px solid ${C.mag}20`,paddingTop:32}}>
          <p style={{fontSize:17,color:C.navy,lineHeight:1.7,maxWidth:860,fontWeight:500}}>
            O custo de manter turmas olímpicas, esforço e estruturas paralelas é muito caro — e ainda assim não chega ao nível de tutoria individual.
          </p>
        </div>
      </R>
    </div>
  </section>

  {/* ══════════════════════════════════════════════════
      2b. PROBLEMA — Quebra 2: IA sem controle
      ══════════════════════════════════════════════════ */}
  <section id="problema-ia" className="sp grain" style={{background:`linear-gradient(160deg,${C.navy},${C.deep})`,padding:"120px 48px",position:"relative",overflow:"hidden"}}>
    <div className="orb" style={{width:400,height:400,background:C.mag,top:"-10%",right:"-5%",opacity:.05}} />
    <div style={{maxWidth:1240,margin:"0 auto",position:"relative",zIndex:1}}>
      <div className="g2" style={{display:"grid",gridTemplateColumns:"1.1fr .9fr",gap:64,alignItems:"center"}}>

        {/* Left column: text */}
        <div className="sec-center">
          {/* Headline */}
          <R delay={.04}>
            <h2 className="ff big-t" style={{fontSize:"clamp(28px,4vw,44px)",color:C.white,lineHeight:1.25,marginBottom:32,fontWeight:700,maxWidth:620}}>
              Hoje, o aluno já usa IA para estudar, mas esse processo acontece{" "}
              <span style={{color:C.mag}}>fora do controle da escola.</span>
            </h2>
          </R>

          {/* 3 bullets */}
          <R delay={.1}>
            <div style={{display:"flex",flexDirection:"column",gap:16,marginBottom:40}}>
              {["Sem mediação.","Sem critério pedagógico.","Sem visibilidade."].map((item,i)=>(
                <div key={i} className="bullet-row" style={{display:"flex",alignItems:"center",gap:16}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:C.mag,flexShrink:0}} />
                  <p style={{fontSize:20,color:"#fff",fontWeight:600,fontFamily:"'Sora',sans-serif"}}>{item}</p>
                </div>
              ))}
            </div>
          </R>

          {/* Fechamento */}
          <R delay={.16}>
            <p style={{fontSize:18,color:"#fff9",lineHeight:1.75,marginBottom:32,maxWidth:560,fontWeight:400}}>
              A escola continua responsável pelo resultado. Mas perdeu parte do controle do processo.
            </p>
          </R>

          {/* Stat 84% */}
          <R delay={.22}>
            <div style={{background:"#ffffff0a",border:`1px solid ${C.mag}30`,borderRadius:20,padding:"24px 28px",display:"inline-block",maxWidth:560}}>
              <p style={{fontSize:15,color:"#fff9",lineHeight:1.6}}>
                <span style={{color:C.mag,fontWeight:800,fontSize:26}}>84%</span>{" "}dos alunos já usam IA para estudar, mas apenas{" "}
                <span style={{color:C.mag,fontWeight:700}}>32%</span> receberam alguma orientação da escola.
              </p>
              <p style={{fontSize:12,color:"#fff4",marginTop:8}}>Fundação Itaú, 2025</p>
            </div>
          </R>
        </div>

        {/* Right column: conceptual image */}
        <R delay={.2} y={30}>
          <div style={{position:"relative"}}>
            <div className="mhide" style={{position:"absolute",top:-20,left:-20,width:80,height:80,borderTop:`2px solid ${C.mag}55`,borderLeft:`2px solid ${C.mag}55`,borderRadius:"20px 0 0 0"}} />
            <div className="mhide" style={{position:"absolute",bottom:-20,right:-20,width:80,height:80,borderBottom:`2px solid ${C.acc}44`,borderRight:`2px solid ${C.acc}44`,borderRadius:"0 0 20px 0"}} />
            <img src={IMGS.alunoIaSozinho} alt="Aluno usando IA sem mediação pedagógica" className="img-f" style={{position:"relative",zIndex:1,boxShadow:`0 30px 80px ${C.mag}22`}} />
          </div>
        </R>
      </div>
    </div>
  </section>
  </>
);

/* ══════════════════════════════════════════════════
   3. PROVOCAÇÃO + SOLUÇÃO — Uma única seção
   O insight forte vem primeiro. Depois a resposta.
   ══════════════════════════════════════════════════ */
const Solucao = () => (
  <section id="solucao" className="sp" style={{background:C.white,padding:"140px 48px 80px",position:"relative"}}>
    <div className="sec-center" style={{maxWidth:1320,margin:"0 auto"}}>

      {/* Top: Provocação */}
      <R>
        <div className="grain quote-b" style={{background:`linear-gradient(135deg,${C.navy},${C.deep})`,borderRadius:28,padding:"56px 64px",marginBottom:80,position:"relative",overflow:"hidden"}}>
          <div className="orb" style={{width:250,height:250,background:C.mag,top:"-40%",right:"-5%",opacity:.15}} />
          <span className="ff" style={{position:"absolute",top:12,left:28,fontSize:120,color:"#fff06",lineHeight:1,fontWeight:800,zIndex:1}}>"</span>
          <p className="ff" style={{fontSize:"clamp(24px,3.2vw,38px)",color:C.white,lineHeight:1.35,position:"relative",zIndex:2,fontWeight:600,maxWidth:700}}>
            Ferramentas de IA genéricas não têm programa, não têm vínculo com a escola e não têm intencionalidade pedagógica.{" "}
            <span style={{color:C.mag}}>É um risco.</span>
          </p>
        </div>
      </R>

      {/* Title + text */}
      <div style={{textAlign:"center",marginBottom:20,maxWidth:800,margin:"0 auto 20px"}}>
        <R><div className="tag">A Solução</div></R>
        <R delay={.06}>
          <h2 className="ff big-t sol-t" style={{fontSize:"clamp(30px,3.8vw,46px)",color:C.navy,lineHeight:1.25,marginBottom:16,fontWeight:700,textAlign:"center"}}>
            A escola no comando.<br/><span style={{color:C.acc}}>A tecnologia a serviço.</span>
          </h2>
        </R>
        <R delay={.12}>
          <p style={{fontSize:17,color:C.muted,lineHeight:1.9,marginBottom:8}}>O Exitus utiliza os conteúdos educacionais gerados pela escola e pelos professores para personalizar materiais, gerar planejamento individualizado e oferecer tutoria pedagógica 24/7.</p>
          <p style={{fontSize:17,color:C.text,lineHeight:1.9}}>O coração do sistema é o <strong>plano pedagógico da escola</strong>. Não impõe um método — potencializa o que a família do aluno já escolheu.</p>
        </R>
      </div>

      {/* Dashboard with scroll animation */}
      <div style={{maxWidth:1100,margin:"60px auto 80px",position:"relative"}}>
        <R delay={.15}>
          <ScrollCard>
            <div style={{background:"#222",borderRadius:24,padding:8,boxShadow:"0 40px 100px rgba(9,13,31,0.3), 0 0 0 1px rgba(255,255,255,0.06)"}}>
              <img src={IMGS.dashboard} alt="Exitus - Plataforma" style={{width:"100%",display:"block",borderRadius:18}} />
            </div>
          </ScrollCard>
        </R>
      </div>

      {/* Aqui — Nova camada */}
      <R delay={.2}>
        <div style={{maxWidth:900,margin:"0 auto",textAlign:"center",padding:"60px 0 20px"}}>
          <p style={{fontSize:13,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:C.mag,marginBottom:20}}>Personalização do conteúdo da sala de aula</p>
          <h2 className="ff big-t" style={{fontSize:"clamp(30px,4vw,48px)",color:C.navy,lineHeight:1.2,marginBottom:16,fontWeight:700}}>
            Não é uma ferramenta.<br/>
            <span style={{color:C.acc}}>É uma nova camada dentro da escola.</span>
          </h2>
          <p style={{fontSize:18,color:C.muted,lineHeight:1.8,marginBottom:40,maxWidth:700,margin:"0 auto 40px"}}>
            Um modelo que amplia o aprendizado além da sala de aula, sem perder o controle pedagógico.
          </p>
        </div>
      </R>
      <R delay={.26}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,maxWidth:900,margin:"0 auto"}} className="g2 sol-cards">
          <div style={{background:C.off,borderRadius:20,padding:"36px 32px",borderLeft:`4px solid ${C.mag}`}}>
            <p style={{fontSize:16,color:C.navy,lineHeight:1.8,fontWeight:500}}>
              Integrado ao que a escola já faz. Sem criar ruptura ou novas demandas para o time pedagógico.
            </p>
          </div>
          <div style={{background:C.navy,borderRadius:20,padding:"36px 32px",borderLeft:`4px solid ${C.acc}`}}>
            <p style={{fontSize:16,color:"#fff",lineHeight:1.8,fontWeight:500}}>
              Não substitui o professor. Amplia o que ele já constrói em sala.
            </p>
          </div>
        </div>
      </R>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════
   PLATAFORMA — Tabs: Revisão Diária / Prova / Alta Performance
   ══════════════════════════════════════════════════ */
const plataformaTabs = [
  {
    n:"01",title:"Revisão Diária",sub:"Para quem tem consistência",
    color:C.mag,
    desc:"Aula dada é aula estudada. A plataforma acompanha a agenda escolar e propõe revisões rápidas e inteligentes dos conteúdos mais recentes, consolidando o aprendizado enquanto ele ainda está fresco.",
    checks:["Revisões automáticas após cada aula","Conteúdo organizado pela agenda escolar","Hábito de estudo construído dia a dia","Feedback imediato a cada atividade"]
  },
  {
    n:"02",title:"Revisão para a Prova",sub:"Para quem precisa de foco",
    color:"#c4724a",
    desc:"Para quem tem prova chegando. O algoritmo agrupa os conteúdos por avaliação, prioriza o calendário e garante que o aluno revise o que realmente importa, reduzindo ansiedade e chegando preparado.",
    checks:["Conteúdos agrupados por avaliação","Prioridade automática pelo calendário","Foco no que cai na prova","Reduz ansiedade pré-prova"]
  },
  {
    n:"03",title:"Alta Performance",sub:"Para quem mira Medicina, ITA e IME",
    color:"#2b8a6e",
    desc:"Para alunos com autonomia e foco nos vestibulares mais disputados do país — Medicina, ITA, IME e afins. O Exitus entrega uma trilha adaptativa de longo prazo, com revisões espaçadas calibradas cientificamente para máxima retenção. O aluno dita o ritmo; a plataforma garante que nenhum conteúdo estratégico fique para trás.",
    checks:["Trilhas específicas para Medicina, ITA e IME","Autonomia total com estrutura científica","Revisões espaçadas para retenção máxima","Evolução cont\u00ednua e mensur\u00e1vel"]
  },
];

const Plataforma = () => {
  const [tab, setTab] = useState(0);
  const t = plataformaTabs[tab];
  return (
    <section id="plataforma" className="sp" style={{background:C.navy,padding:"120px 48px",position:"relative",overflow:"hidden"}}>
      <div className="sec-center" style={{maxWidth:1000,margin:"0 auto"}}>
        {/* Header */}
        <R><p style={{fontSize:13,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:C.mag,marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
          <span style={{width:28,height:2,background:C.mag,display:"inline-block"}} />A Plataforma
        </p></R>
        <R delay={.06}><h2 className="ff" style={{fontSize:"clamp(28px,4vw,44px)",color:C.white,lineHeight:1.2,fontWeight:700,marginBottom:12}}>
          Uma jornada para cada momento do aluno.
        </h2></R>
        <R delay={.1}><p style={{fontSize:16,color:"#fff7",lineHeight:1.7,marginBottom:48,maxWidth:620}}>
          O aluno tem autonomia para navegar entre as trilhas, dependendo do seu objetivo.
        </p></R>

        {/* Tab buttons */}
        <R delay={.14}>
          <div className="plat-tabs" style={{display:"flex",gap:10,marginBottom:40,flexWrap:"wrap",justifyContent:"center"}}>
            {plataformaTabs.map((p,i)=>(
              <div key={i} onClick={()=>setTab(i)} style={{
                padding:"12px 24px",borderRadius:60,cursor:"pointer",fontSize:14,fontWeight:700,
                transition:"all .3s ease",display:"flex",alignItems:"center",gap:8,
                background:tab===i?p.color:"transparent",
                border:`2px solid ${tab===i?p.color:"#fff2"}`,
                color:tab===i?"#fff":"#fff8",
              }}
                onMouseEnter={e=>{if(tab!==i){e.currentTarget.style.borderColor="#fff5"}}}
                onMouseLeave={e=>{if(tab!==i){e.currentTarget.style.borderColor="#fff2"}}}
              >
                <span style={{fontSize:12,opacity:.7}}>{p.n}</span> {p.title}
              </div>
            ))}
          </div>
        </R>

        {/* Tab content card */}
        <R delay={.18}>
          <div style={{
            background:C.white,borderRadius:24,padding:0,overflow:"hidden",
            boxShadow:"0 20px 60px rgba(0,0,0,0.3)",
            borderLeft:`5px solid ${t.color}`,
            transition:"border-color .3s ease"
          }}>
            <div className="g2 plat-card-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>

              {/* Left — text */}
              <div className="plat-card-text" style={{padding:"44px 40px"}}>
                <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
                  <div style={{width:44,height:44,borderRadius:"50%",background:t.color+"15",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span className="ff" style={{fontSize:16,fontWeight:800,color:t.color}}>{t.n}</span>
                  </div>
                  <div>
                    <h3 className="ff" style={{fontSize:22,fontWeight:700,color:C.navy,lineHeight:1.2}}>{t.title}</h3>
                    <p style={{fontSize:13,color:t.color,fontWeight:600,marginTop:2}}>{t.sub}</p>
                  </div>
                </div>
                <p style={{fontSize:15,color:C.muted,lineHeight:1.75,marginBottom:24}}>{t.desc}</p>
                <div style={{width:36,height:3,borderRadius:2,background:t.color}} />
              </div>

              {/* Right — checklist */}
              <div className="plat-checks" style={{padding:"44px 40px",background:t.color+"08",display:"flex",flexDirection:"column",justifyContent:"center",gap:20}}>
                {t.checks.map((c,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"flex-start",gap:14}}>
                    <div style={{width:24,height:24,borderRadius:"50%",background:t.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <span style={{fontSize:15,color:C.navy,lineHeight:1.5,fontWeight:500}}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </R>

        {/* Dots */}
        <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:28}}>
          {plataformaTabs.map((_,i)=>(
            <div key={i} onClick={()=>setTab(i)} style={{
              width:tab===i?24:8,height:8,borderRadius:4,cursor:"pointer",
              background:tab===i?plataformaTabs[tab].color:"#fff2",
              transition:"all .3s ease"
            }} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════
   3. COMO FUNCIONA — Alternating 2-column zigzag
   ══════════════════════════════════════════════════ */
const ComoFunciona = () => {
  const steps = [
    {n:"01",t:"A escola define",d:"Currículo, materiais e metodologia. O Exitus começa a partir do plano pedagógico que a escola já construiu.",img:IMGS.diagram},
    {n:"02",t:"O Exitus prepara",d:"Criamos conteúdos, aulas e atividades com base no plano da escola, seguindo rigorosos critérios de segurança e intencionalidade pedagógica.",img:IMGS.roteiro},
    {n:"03",t:"O professor enriquece",d:"O professor pode compartilhar materiais próprios, validar questões e enriquecer o conteúdo gerado pela plataforma — e ainda gerar provas e revisões automaticamente, já diagramadas. Sem obrigação, com total autonomia.",img:IMGS.revisao},
    {n:"04",t:"O aluno aprende",d:"Cada aluno recebe um roteiro de estudos diário, personalizado e adaptativo. Os tutores virtuais acompanham todo o processo, respondendo dúvidas e ajustando o ritmo em tempo real.",img:IMGS.tioBento},
    {n:"05",t:"A escola evolui",d:"A equipe pedagógica recebe insights por aluno e por assunto em tempo real. O plano do ano seguinte é reprocessado com base nas interações do ano — fechando um ciclo virtuoso e contínuo.",img:IMGS.questoes},
  ];
  return (
    <section id="como-funciona" className="grain sp" style={{background:C.light,padding:"140px 48px",position:"relative",overflow:"hidden"}}>
      <div className="orb" style={{width:400,height:400,background:C.acc,bottom:"10%",right:"-10%",opacity:.03}} />
      <div className="sec-center" style={{maxWidth:1200,margin:"0 auto",position:"relative",zIndex:2}}>
        <R><div className="tag">Passo a Passo</div></R>
        <R delay={.06}><h2 className="ff big-t" style={{fontSize:"clamp(34px,4.8vw,52px)",color:C.navy,lineHeight:1.2,marginBottom:72,fontWeight:700}}>
          Como o Exitus apoia o{" "}<span style={{color:C.mag}}>processo de aprendizagem</span>
        </h2></R>

        <div style={{display:"flex",flexDirection:"column",gap:80}}>
          {steps.map((s,i)=>{
            const isEven = i % 2 === 0;
            const textBlock = (
              <div key={"t"+i} style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
                <div className="cf-step-head" style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
                  <div style={{width:56,height:56,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:18,fontFamily:"'Sora'",
                    background:i===0?`linear-gradient(135deg,${C.mag},${C.magL})`:i===4?C.navy:C.white,
                    color:i===0||i===4?"#fff":C.navy,
                    border:i>0&&i<4?`1.5px solid ${C.acc}22`:"none",
                    boxShadow:i===0?`0 8px 28px ${C.mag}33`:"0 4px 16px #0001",
                    flexShrink:0
                  }}>{s.n}</div>
                  <h4 className="ff" style={{fontSize:"clamp(20px,2.5vw,26px)",fontWeight:700,color:C.navy,lineHeight:1.3}}>{s.t}</h4>
                </div>
                <p style={{fontSize:16,color:C.muted,lineHeight:1.85,maxWidth:460}}>{s.d}</p>
              </div>
            );
            const imgBlock = (
              <div key={"i"+i} style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                <img src={s.img} alt={s.t} className="img-s" style={{maxWidth:"100%",borderRadius:16}} />
              </div>
            );
            return (
              <R key={i} delay={.08*i}>
                <div className="cf-row" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:56,alignItems:"center"}}>
                  {isEven ? <>{textBlock}{imgBlock}</> : <>{imgBlock}{textBlock}</>}
                </div>
              </R>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════
   4. NEUROCIÊNCIA — Mais enxuto
   ══════════════════════════════════════════════════ */
const Neurociencia = () => {
  const cards=[
    {t:"Efeito Teste",d:"A cada teste, o cérebro fortalece conexões neurais. Testes são ferramenta de aprendizado, não de julgamento.",r:"Akresh-Gonzales (2023)",c:C.mag},
    {t:"Efeito Interesse",d:"Curiosidade ativa o circuito dopaminérgico do hipocampo. O Exitus usa interesses pessoais do aluno para explicar conteúdo.",r:"Gruber, Gelman & Ranganath (2014)",c:C.gold},
    {t:"Revisão Espaçada",d:"O algoritmo calcula o espaçamento ideal para cada aluno com score de personalização individual.",r:"Khajah, Lindsey & Mozer (2014)",c:"#2b8a6e"},
    {t:"Dificuldade Desejável",d:"Entre tédio e ansiedade existe o estado de Flow. O Exitus calibra a dificuldade para essa zona.",r:"Krueger (2015)",c:"#7c4dff"},
  ];
  return (
    <section id="neurociencia" className="sp" style={{background:C.white,padding:"140px 48px"}}>
      <div style={{maxWidth:1240,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"1.15fr 0.85fr",gap:56,marginBottom:72,alignItems:"center"}} className="g2">
          <div className="sec-center">
            <R><div className="tag">Base Científica</div></R>
            <R delay={.06}>
              <h2 className="ff big-t" style={{fontSize:"clamp(30px,3.6vw,42px)",color:C.navy,lineHeight:1.2,marginBottom:28,fontWeight:700}}>
                Cada funcionalidade é fundamentada em conceitos pedagógicos e{" "}
                <span className="gt">princípios de neurociência estabelecidos.</span>
              </h2>
            </R>
            <R delay={.1}><p style={{fontSize:17,color:C.muted,lineHeight:1.9}}>
              Tecnologia é ferramenta. IA precisa ser vista como um risco tolerável — o verdadeiro valor está na nossa engenharia de prompt, enriquecida por Pedagogos, Médicos e uma equipe comprometida com educação de valor formativo. Intencionalidade pedagógica e ciência guiam tudo que fazemos.
            </p></R>
          </div>
          <R delay={.15}><img src={IMGS.bloom} alt="Fundamentação Científica" className="img-f" /></R>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}} className="g2">
          {cards.map((c,i)=>(
            <R key={i} delay={.04*i}>
              <div className="nc">
                <div style={{position:"absolute",top:0,left:0,width:4,height:"100%",background:c.c}} />
                <h4 style={{fontSize:18,fontWeight:700,color:C.navy,marginBottom:12}}>{c.t}</h4>
                <p style={{fontSize:14,color:C.muted,lineHeight:1.75,marginBottom:10}}>{c.d}</p>
                <p style={{fontSize:11,color:C.faint,opacity:.7}}>{c.r}</p>
              </div>
            </R>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════
   NOVA SEÇÃO — IA com Intenção Pedagógica
   ══════════════════════════════════════════════════ */
const Abordagem = () => (
  <section id="abordagem" className="sp grain" style={{background:`linear-gradient(160deg,${C.navy},${C.deep})`,padding:"140px 48px",position:"relative",overflow:"hidden"}}>
    <div className="orb" style={{width:400,height:400,background:C.mag,top:"-10%",right:"-5%",opacity:.04}} />
    <div style={{maxWidth:1240,margin:"0 auto",position:"relative",zIndex:1}}>
      <div style={{textAlign:"center",marginBottom:72}}>
        <R><div className="tag tag-d">Nossa Abordagem</div></R>
        <R delay={.06}>
          <h2 className="ff big-t" style={{fontSize:"clamp(34px,4.8vw,52px)",color:C.white,lineHeight:1.25,marginBottom:24,fontWeight:700}}>
            IA com <span style={{color:C.mag}}>intencionalidade pedagógica.</span>
          </h2>
        </R>
        <R delay={.1}>
          <p style={{fontSize:18,color:"#fffd",lineHeight:1.85,maxWidth:780,margin:"0 auto"}}>
            Tecnologia é ferramenta, não resposta. Cada interação da nossa IA é desenhada por Pedagogos, validada por especialistas e alinhada ao plano da escola — com um único objetivo: <strong style={{color:C.white}}>formar o aluno, não substituí-lo no pensar.</strong>
          </p>
        </R>
      </div>
      <div className="g2 abord-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24,alignItems:"stretch"}} data-cols="3">
        {[
          {icon:"🎓",t:"Pedagogos no core",d:"Cada prompt, cada feedback, cada percurso foi desenhado com olhar pedagógico."},
          {icon:"🔬",t:"Base científica",d:"Neurociência educacional aplicada: revisão espaçada, efeito teste, dificuldade desejável. Não inventamos — aplicamos o que a pesquisa comprova há décadas."},
          {icon:"🛡️",t:"Risco controlado",d:"Conhecemos os limites da IA generativa. Por isso construímos guardrails, fluxos multi-agente e revisão humana em cada camada — sem atalhos, sem achismos."},
        ].map((item,i)=>(
          <R key={i} delay={.06*i} className="abord-card-wrap" style={{height:"100%"}}>
            <div style={{background:"#ffffff0a",backdropFilter:"blur(16px)",border:`1px solid ${C.mag}20`,borderRadius:24,padding:"40px 32px",transition:"all .4s ease",height:"100%",display:"flex",flexDirection:"column"}}
              onMouseEnter={e=>{e.currentTarget.style.background="#ffffff12";e.currentTarget.style.borderColor=C.mag+"44";e.currentTarget.style.transform="translateY(-4px)"}}
              onMouseLeave={e=>{e.currentTarget.style.background="#ffffff0a";e.currentTarget.style.borderColor=C.mag+"20";e.currentTarget.style.transform="none"}}>
              <div style={{fontSize:40,marginBottom:20}}>{item.icon}</div>
              <h4 className="ff" style={{fontSize:20,fontWeight:700,color:C.white,marginBottom:12}}>{item.t}</h4>
              <p style={{fontSize:15,color:"#fff8",lineHeight:1.75,flex:1}}>{item.d}</p>
            </div>
          </R>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════
   5. SEGURANÇA — Enxuto
   ══════════════════════════════════════════════════ */
const Seguranca = () => (
    <section id="seguranca" className="sp" style={{background:C.off,padding:"140px 48px"}}>
    <div style={{maxWidth:1160,margin:"0 auto"}}>
      <div style={{display:"grid",gridTemplateColumns:"1.1fr 0.9fr",gap:60,alignItems:"center"}} className="g2">
        <div className="sec-center">
          <R><div className="tag">Segurança</div></R>
          <R delay={.06}><h2 className="ff big-t" style={{fontSize:"clamp(30px,3.6vw,42px)",color:C.navy,marginBottom:28,fontWeight:700}}>
            Tecnologia que educa — <span style={{color:C.mag}}>não que distrai.</span>
          </h2></R>
          <R delay={.1}>
            <p style={{fontSize:17,color:C.muted,lineHeight:1.9,marginBottom:24}}>
              Usamos o que há de mais moderno para garantir interações seguras. Em nenhuma interação com os tutores virtuais o aluno poderá abordar temas que fujam ao conteúdo pedagógico.
            </p>
            <p style={{fontSize:17,color:C.muted,lineHeight:1.9,marginBottom:28}}>
              Também acreditamos no <strong style={{color:C.navy}}>letramento em IA</strong> como competência do futuro, e no letramento digital como requisito legal do presente.
            </p>

            {/* Dois cards antagonistas: Calma vs Indiscriminado */}
            <div className="tech-antagonist" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              {/* Card 1 — Uso calmo */}
              <div style={{position:"relative",background:`linear-gradient(150deg, #fff, ${C.mag}08)`,borderRadius:18,padding:"22px 22px 20px",border:`1.5px solid ${C.mag}35`,boxShadow:`0 8px 28px ${C.mag}12`,overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg, ${C.mag}, ${C.acc})`}} />
                <div style={{fontSize:22,marginBottom:10}}>🌿</div>
                <h4 style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:8,letterSpacing:".01em"}}>Uso de tecnologia calma</h4>
                <p style={{fontSize:12.5,color:C.muted,lineHeight:1.6}}>
                  Abordagem intencional e equilibrada do uso de tecnologia, priorizando foco, aprendizado real e bem-estar do aluno.
                </p>
              </div>

              {/* Card 2 — Uso indiscriminado */}
              <div style={{position:"relative",background:"linear-gradient(150deg, #fff, #c4724a08)",borderRadius:18,padding:"22px 22px 20px",border:"1.5px solid #c4724a40",overflow:"hidden",opacity:.88}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg, #c4724a, #8b3a1e)"}} />
                <div style={{fontSize:22,marginBottom:10,filter:"grayscale(0.3)"}}>⚠️</div>
                <h4 style={{fontSize:14,fontWeight:800,color:"#6b2f12",marginBottom:8,letterSpacing:".01em"}}>Uso indiscriminado de telas</h4>
                <p style={{fontSize:12.5,color:C.muted,lineHeight:1.6}}>
                  Exposição excessiva e sem direcionamento, que compromete atenção, aprendizagem e desenvolvimento.
                </p>
              </div>
            </div>
          </R>
        </div>
        <R delay={.12}>
          <div className="seg-inner" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {[
              {t:"Somente temas pedagógicos",d:"Os tutores não desviam para conteúdo fora da sala de aula — nunca.",c:C.acc},
              {t:"Letramento em IA",d:"Competência do futuro — ensinamos o uso crítico e responsável da IA.",c:C.gold},
              {t:"Sem gamificação",d:"Não usamos incentivos artificiais dopaminérgicos. Acreditamos que o aprendizado é fim, nunca meio.",c:C.mag},
              {t:"Letramento digital",d:"Requisito legal atual — conformidade com as tendências regulatórias.",c:"#2b8a6e"},
            ].map((item,i)=>(
              <div key={i} style={{padding:24,borderRadius:18,background:C.white,border:"1px solid #0001",transition:"all .35s ease",textAlign:"center"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=item.c+"44"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="#0001"}}>
                <div className="nc-bar" style={{width:32,height:3,borderRadius:2,background:item.c,marginBottom:14}} />
                <h4 style={{fontSize:15,fontWeight:700,color:C.navy,marginBottom:4}}>{item.t}</h4>
                <p style={{fontSize:13,color:C.muted,lineHeight:1.55}}>{item.d}</p>
              </div>
            ))}
          </div>
        </R>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════
   6. PROVA SOCIAL — Christus com dados concretos
   ══════════════════════════════════════════════════ */
const ProvaSocial = () => (
  <section id="prova-social" className="grain sp" style={{background:`linear-gradient(160deg,${C.navy},${C.deep})`,padding:"140px 48px",position:"relative",overflow:"hidden"}}>
    <div className="orb" style={{width:500,height:500,background:C.mag,bottom:"-15%",left:"-10%",opacity:.04}} />
    <div style={{maxWidth:900,margin:"0 auto",position:"relative",zIndex:2,textAlign:"center"}}>

      {/* Logo Christus destaque */}
      <R><div style={{display:"flex",justifyContent:"center",marginBottom:40}}><img src={IMGS.christusColor} alt="Colégio Christus" style={{height:140,objectFit:"contain"}} /></div></R>

      {/* Tag + Título */}
      <R delay={.06}><div className="tag tag-d" style={{margin:"0 auto 16px"}}>Resultados</div></R>
      <R delay={.1}><h2 className="ff big-t" style={{fontSize:"clamp(34px,4.8vw,52px)",color:C.white,marginBottom:16,fontWeight:700}}>
        Desenvolvido com quem entende de educação.
      </h2></R>
      <R delay={.13}><p style={{fontSize:15,color:"rgba(255,255,255,0.4)",marginBottom:64}}>75 anos de história educacional em Fortaleza.</p></R>

      {/* 4 Stats em linha */}
      <R delay={.16}>
        <div className="g2 stats-4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:32,marginBottom:56}}>
          {[
            {n:"1º",l:"lugar ENEM 2024*"},
            {n:"2º",l:"geral do Brasil"},
            {n:"79%",l:"estudam há +10 anos"},
            {n:"1ª",l:"do CE com tutoria IA"},
          ].map((s,i)=>(
            <div key={i} style={{textAlign:"center"}}>
              <div className="ff" style={{fontSize:"clamp(40px,5vw,56px)",color:C.white,fontWeight:800,lineHeight:1}}>{s.n}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.45)",marginTop:10,lineHeight:1.5}}>{s.l}</div>
            </div>
          ))}
        </div>
      </R>

      {/* Linha separadora + credenciais */}
      <R delay={.22}>
        <div style={{borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:28,maxWidth:700,margin:"0 auto"}}>
          <p style={{fontSize:15,color:"rgba(255,255,255,0.5)",lineHeight:1.7}}>
            Melhor universidade do Brasil segundo o MEC (UniChristus).<br/>Uma das primeiras escolas trilíngues do país.
          </p>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.15)",marginTop:14}}>*Escolas 40+ alunos. MEC 08/07/2025. INEP: 23246880.</p>
        </div>
      </R>

    </div>
  </section>
);



/* ══════════════════════════════════════════════════
   8. CTA + FORMULÁRIO — Conversão real
   ══════════════════════════════════════════════════ */
const Contato = () => {
  const [form, setForm] = useState({ nome:"", escola:"", email:"", telefone:"", perfil:"escola" });
  const [sent, setSent] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = () => {
    if(form.nome && form.email) {
      fetch(`https://formsubmit.co/exitus@px.com.br`, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)}).catch(()=>{});
      setSent(true);
      setShowModal(true);
    }
  };

  return (
  <>
    <section id="contato" className="grain sp" style={{background:`linear-gradient(160deg,${C.deep},#0d1138)`,padding:"140px 48px",position:"relative",overflow:"hidden",borderTop:`1px solid ${C.mag}15`}}>
      <div className="orb" style={{width:600,height:600,background:C.mag,top:"50%",left:"50%",transform:"translate(-50%,-50%)",opacity:.03}} />
      <div className="mhide orb" style={{width:300,height:300,background:C.acc,top:"10%",right:"-5%",opacity:.04}} />
      <div style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"start"}} className="g2">

          {/* Left: copy */}
          <div className="sec-center">
            <R><div className="tag tag-d">Próximo Passo</div></R>
            <R delay={.06}><h2 className="ff" style={{fontSize:"clamp(34px,4.8vw,48px)",color:C.white,lineHeight:1.2,marginBottom:32,fontWeight:700}}>
              Leve o Exitus para a sua escola.
            </h2></R>
            <R delay={.12}>
              <div style={{display:"grid",gap:20,marginBottom:40}}>
                <div className="contact-feat" style={{display:"flex",gap:16,alignItems:"flex-start"}}>
                  <div style={{width:44,height:44,borderRadius:12,background:`${C.mag}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>👩‍🏫</div>
                  <div>
                    <h4 style={{fontSize:16,fontWeight:700,color:C.white,marginBottom:4}}>Auxiliar os Professores</h4>
                    <p style={{fontSize:14,color:"#fff7",lineHeight:1.6}}>Ferramentas que reduzem sobrecarga e devolvem ao professor o que é mais valioso: tempo para ensinar.</p>
                  </div>
                </div>
                <div className="contact-feat" style={{display:"flex",gap:16,alignItems:"flex-start"}}>
                  <div style={{width:44,height:44,borderRadius:12,background:`${C.acc}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🚀</div>
                  <div>
                    <h4 style={{fontSize:16,fontWeight:700,color:C.white,marginBottom:4}}>Potencializar o Aprendizado</h4>
                    <p style={{fontSize:14,color:"#fff7",lineHeight:1.6}}>Neurociência e IA exponencializando a capacidade de cada aluno, respeitando seu ritmo e interesses.</p>
                  </div>
                </div>
                <div className="contact-feat" style={{display:"flex",gap:16,alignItems:"flex-start"}}>
                  <div style={{width:44,height:44,borderRadius:12,background:`${C.gold}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🏫</div>
                  <div>
                    <h4 style={{fontSize:16,fontWeight:700,color:C.white,marginBottom:4}}>Escola no Comando</h4>
                    <p style={{fontSize:14,color:"#fff7",lineHeight:1.6}}>Integrada ao plano pedagógico. A tecnologia a serviço — com a escola sempre no controle.</p>
                  </div>
                </div>
              </div>
            </R>
          </div>

          {/* Right: form */}
          <R delay={.1}>
            <div className="contact-glass" style={{background:"#fff08",backdropFilter:"blur(24px)",border:"1px solid #fff12",borderRadius:28,padding:"44px 40px"}}>
              {sent ? (
                <div style={{textAlign:"center",padding:"40px 0"}}>
                  <div style={{width:64,height:64,borderRadius:"50%",background:`linear-gradient(135deg,${C.mag},${C.acc})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h3 className="ff" style={{fontSize:24,color:C.white,fontWeight:700,marginBottom:8}}>Mensagem enviada!</h3>
                  <p style={{fontSize:15,color:"#fffa",marginBottom:20}}>Nosso time pedagógico entrará em contato em até 24 horas.</p>
                  <div onClick={()=>{setSent(false);setShowModal(false);setForm({nome:"",escola:"",email:"",telefone:"",perfil:"escola"})}} style={{cursor:"pointer",fontSize:14,color:C.mag,fontWeight:600}}>Enviar outro contato →</div>
                </div>
              ) : (
                <>
                  <h3 className="ff" style={{fontSize:22,color:C.white,fontWeight:700,marginBottom:8}}>Agendar demonstração</h3>
                  <p style={{fontSize:14,color:"#fff6",marginBottom:28}}>Preencha e nosso time pedagógico entrará em contato.</p>

                  {/* Profile selector */}
                  <div style={{display:"flex",gap:10,marginBottom:24}}>
                    {[{v:"escola",l:"Sou Escola",ico:"🏫"},{v:"professor",l:"Sou Professor",ico:"👩‍🏫"}].map(p=>{
                      const active = form.perfil===p.v;
                      return (
                        <div key={p.v} onClick={()=>setForm({...form,perfil:p.v})} style={{
                          flex:1,
                          position:"relative",
                          padding:"14px 12px",
                          borderRadius:14,
                          textAlign:"center",
                          cursor:"pointer",
                          fontSize:13,
                          fontWeight:active?700:500,
                          transition:"all .35s cubic-bezier(.22,1,.36,1)",
                          background:active?`linear-gradient(135deg, ${C.mag}, ${C.acc})`:"rgba(255,255,255,0.04)",
                          border:active?`1.5px solid ${C.magL}`:"1.5px solid rgba(255,255,255,0.08)",
                          color:active?"#fff":"rgba(255,255,255,0.55)",
                          boxShadow:active?`0 8px 24px ${C.mag}55, 0 0 0 3px ${C.mag}22, inset 0 1px 0 rgba(255,255,255,0.25)`:"none",
                          transform:active?"translateY(-2px)":"translateY(0)",
                          display:"flex",
                          alignItems:"center",
                          justifyContent:"center",
                          gap:8,
                          overflow:"hidden"
                        }}>
                          <span style={{fontSize:16,filter:active?"none":"grayscale(0.6) opacity(0.7)",transition:"filter .35s"}}>{p.ico}</span>
                          <span>{p.l}</span>
                          {active && (
                            <div style={{
                              position:"absolute",
                              top:6,right:8,
                              width:16,height:16,
                              borderRadius:"50%",
                              background:"#fff",
                              display:"flex",
                              alignItems:"center",
                              justifyContent:"center",
                              boxShadow:`0 2px 8px ${C.mag}88`,
                              animation:"profilePop .35s cubic-bezier(.22,1,.36,1)"
                            }}>
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={C.mag} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {[{k:"nome",p:"Seu nome",t:"text"},{k:"escola",p:"Nome da escola",t:"text"},{k:"email",p:"E-mail",t:"email"},{k:"telefone",p:"WhatsApp com DDD",t:"tel"}].map(f=>(
                    <input key={f.k} type={f.t} placeholder={f.p} value={form[f.k]}
                      onChange={e=>setForm({...form,[f.k]:e.target.value})}
                      style={{
                        width:"100%",padding:"14px 18px",borderRadius:14,border:"1.5px solid rgba(255,255,255,0.12)",
                        background:"rgba(255,255,255,0.06)",color:"#ffffff",fontSize:15,fontFamily:"'Poppins'",
                        marginBottom:12,outline:"none",transition:"border .2s",caretColor:"#fff"}}
                      onFocus={e=>e.target.style.borderColor=C.mag}
                      onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.12)"}
                    />
                  ))}

                  <div onClick={handleSubmit} className="btn-m" style={{width:"100%",justifyContent:"center",marginTop:8,cursor:form.nome&&form.email?"pointer":"not-allowed",opacity:form.nome&&form.email?1:.5}}>
                    Solicitar Demonstração <span style={{fontSize:16}}>→</span>
                  </div>
                  <p style={{fontSize:11,color:"#fff3",marginTop:12,textAlign:"center"}}>Sem compromisso. Respondemos em até 24h.</p>
                </>
              )}
            </div>
          </R>
        </div>
      </div>
    </section>

    {/* ── Modal de Sucesso ── */}
    {showModal && (
      <div onClick={()=>setShowModal(false)} style={{
        position:"fixed",inset:0,zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",
        background:"rgba(5,8,32,0.85)",backdropFilter:"blur(16px)",
        animation:"fadeIn .3s ease"
      }}>
        <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes modalPop{from{opacity:0;transform:scale(.85) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}} @keyframes checkPulse{0%{transform:scale(0)}50%{transform:scale(1.15)}100%{transform:scale(1)}} @keyframes confettiDrop{0%{opacity:1;transform:translateY(0) rotate(0deg)}100%{opacity:0;transform:translateY(120px) rotate(360deg)}}`}</style>
        <div onClick={e=>e.stopPropagation()} style={{
          position:"relative",width:"90vw",maxWidth:480,
          background:`linear-gradient(160deg,${C.navy},${C.deep})`,
          borderRadius:28,overflow:"hidden",
          boxShadow:`0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px ${C.mag}22`,
          animation:"modalPop .4s cubic-bezier(.22,1,.36,1)",
          textAlign:"center",padding:"56px 40px"
        }}>
          {/* Confetti dots */}
          {[...Array(12)].map((_,i)=>(
            <div key={i} style={{
              position:"absolute",top:0,left:`${8+i*7.5}%`,
              width:8,height:8,borderRadius:"50%",
              background:[C.mag,C.acc,C.gold,"#2b8a6e",C.magL][i%5],
              animation:`confettiDrop ${1.2+i*0.15}s ease-out ${i*0.08}s forwards`
            }} />
          ))}

          {/* Check icon */}
          <div style={{
            width:80,height:80,borderRadius:"50%",
            background:`linear-gradient(135deg,${C.mag},${C.acc})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            margin:"0 auto 28px",
            boxShadow:`0 12px 40px ${C.mag}44`,
            animation:"checkPulse .5s cubic-bezier(.22,1,.36,1) .2s both"
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>

          <h3 className="ff" style={{fontSize:28,color:C.white,fontWeight:700,marginBottom:12}}>
            Demonstração solicitada!
          </h3>
          <p style={{fontSize:16,color:"#fff9",lineHeight:1.7,marginBottom:8}}>
            Obrigado, <strong style={{color:C.white}}>{form.nome}</strong>.
          </p>
          <p style={{fontSize:15,color:"#fff6",lineHeight:1.7,marginBottom:32}}>
            Nosso time pedagógico entrará em contato em até <strong style={{color:C.mag}}>24 horas</strong> pelo e-mail ou WhatsApp informados.
          </p>

          <div onClick={()=>setShowModal(false)} className="btn-m" style={{justifyContent:"center",margin:"0 auto",cursor:"pointer"}}>
            Entendido <span style={{fontSize:16}}>✓</span>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

/* ══ FOOTER ══ */
const Ft = () => (
  <footer className="ft-pad" style={{background:C.navy,padding:"36px 48px 28px",borderTop:`2px solid ${C.mag}22`}}>
    <div className="ft-inner" style={{maxWidth:1320,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <img src={IMGS.logo} alt="Exitus" style={{height:64}} />
        <span style={{fontSize:12,color:"#fff2"}}>Aprenda aprendendo.</span>
      </div>
      <p style={{fontSize:11,color:"#fff1"}}>© 2026 Exitus Educacional</p>
    </div>
  </footer>
);

export default function App() {
  return (<><style>{css}</style><Nav /><Hero /><Marquee /><Problema /><Solucao /><Plataforma /><ComoFunciona /><Neurociencia /><Abordagem /><Seguranca /><ProvaSocial /><Contato /><Ft /></>);
}
