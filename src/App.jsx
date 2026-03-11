import { useState, useEffect, useRef } from "react";

const useInView = (t = 0.1) => {
  const r = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => { const el = r.current; if (!el) return; const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.unobserve(el); } }, { threshold: t }); o.observe(el); return () => o.disconnect(); }, [t]);
  return [r, v];
};
const R = ({ children, delay = 0, y = 60, className = "" }) => {
  const [r, v] = useInView(0.08);
  return <div ref={r} className={className} style={{ opacity: v?1:0, transform: v?"none":`translateY(${y}px)`, transition:`opacity 1s cubic-bezier(.22,1,.36,1) ${delay}s, transform 1s cubic-bezier(.22,1,.36,1) ${delay}s` }}>{children}</div>;
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
  exitusLogo: "/assets/exitusLogo.jpg",
  diagram: "/assets/diagram.jpg",
  oQueE: "/assets/oQueE.jpg",
  appMockup: "/assets/appMockup.png",
  roteiro: "/assets/roteiro.jpg",
  revisao: "/assets/revisao.jpg",
  bloom: "/assets/bloom.jpg",
  tioBento: "/assets/tioBento.png",
  questoes: "/assets/questoes.jpg",
  logo: "/assets/logo.png",
  g_dashboard_full: "/assets/g_dashboard_full.png",
  g_roteiro: "/assets/g_roteiro.png",
  g_revisao_conteudo: "/assets/g_revisao_conteudo.png",
  g_questoes: "/assets/g_questoes.png",
  g_quiz: "/assets/g_quiz.png",
  g_tia_chris: "/assets/g_tia_chris.png",
  g_tio_bento: "/assets/g_tio_bento.png",
  g_provas: "/assets/g_provas.png",
  g_materiais: "/assets/g_materiais.png",
  g_revisao_aula: "/assets/g_revisao_aula.png",
  dashboard: "/assets/dashboard.jpg",
  christus: "/assets/christus.jpg",
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
.ff{font-family:'Sora',sans-serif}

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
  .hero-t{font-size:clamp(26px,7vw,38px) !important;line-height:1.25 !important;text-align:center !important}
  .big-t{font-size:clamp(24px,6vw,34px) !important;line-height:1.25 !important}
  .sp{padding:80px 20px !important}
  .hero-inner{padding:40px 20px 60px !important;gap:36px !important}
  .quote-b{padding:36px 24px !important;border-radius:20px !important}
  .nav-pad{padding:0 20px !important}
  .btn-m{padding:14px 28px !important;font-size:14px !important}
  .btn-g{padding:14px 28px !important;font-size:14px !important}
  .nc{padding:24px !important;text-align:center !important}
  .ft-pad{padding:28px 20px 20px !important}
  .contact-glass{padding:36px 24px !important}
  .glass-panel{padding:36px 24px !important}
  .feat-inner{padding:28px 24px !important;text-align:center !important}
  .hero-btns{flex-direction:column !important;width:100%}
  .hero-btns .btn-m,.hero-btns .btn-g{width:100%;justify-content:center;text-align:center}
  .hero-badge{padding:12px 16px !important;justify-content:center !important}
  .mq{gap:32px}
  .demo-modal-inner{width:95vw !important;max-width:none !important;border-radius:16px !important}
  .demo-modal-inner video{max-height:60vh !important}
  /* ── Mobile centering ── */
  .mc{text-align:center !important}
  .mc .tag{display:block !important}
  .mc p{margin-left:auto !important;margin-right:auto !important}
  .mc .hero-badge{justify-content:center}
  .sec-center{text-align:center !important}
  .sec-center .tag{display:block !important}
  .sec-center p{margin-left:auto !important;margin-right:auto !important}
  .ft-inner{flex-direction:column !important;align-items:center !important;text-align:center !important}
  .seg-inner{text-align:center !important}
  .seg-inner>div{margin:0 auto !important}
  .nc .nc-bar{margin:0 auto 14px !important}
  .sol-t{white-space:normal !important}
  .cf-row{grid-template-columns:1fr !important;gap:28px !important;text-align:center !important}
  .cf-row img{margin:0 auto !important}
  .cf-row p{margin-left:auto !important;margin-right:auto !important}
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
  const links=[{l:"Solução",id:"solucao"},{l:"Como Funciona",id:"como-funciona"},{l:"Ciência",id:"neurociencia"},{l:"Segurança",id:"seguranca"},{l:"Plataforma",id:"galeria"},{l:"Resultados",id:"prova-social"},{l:"Contato",id:"contato"}];
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
            <img src={IMGS.logo} alt="Exitus" style={{height:32}} />
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
        <R delay={.08}>
          <h1 className="ff hero-t" style={{fontSize:"clamp(36px,4.5vw,58px)",color:C.white,lineHeight:1.22,marginBottom:32,fontWeight:700}}>
            O Ensino Pedagógico<br/>
            <span style={{color:C.mag}}>Potencializado com IA e Neurociência.</span>
          </h1>
        </R>
        <R delay={.18}>
          <p style={{fontSize:17,color:"#fffc",lineHeight:1.85,marginBottom:44,maxWidth:520,fontWeight:300}}>
            A ferramenta que ajuda professores a ensinar melhor e potencializa o aprendizado de cada aluno individualmente a partir do plano pedagógico da escola.
          </p>
        </R>
        <R delay={.26}>
          <div className="hero-btns" style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:40}}>
            <button className="btn-m" onClick={()=>scroll("contato")}>Agendar Demonstração <span style={{fontSize:16}}>→</span></button>
            <button className="btn-g" onClick={()=>scroll("como-funciona")}>Como Funciona</button>
          </div>
        </R>
        <R delay={.34}>
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
  const items = ["Neurociência Aplicada","IA Pedagógica","Revisão Espaçada","Taxonomia de Bloom","Tecnologia Calma","Tutoria 24/7","Estudo Personalizado","Letramento Digital","Escola no Comando"];
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
   2. PROBLEMA — Layout 2 colunas, escaneável
   ══════════════════════════════════════════════════ */
const Problema = () => (
  <section id="problema" className="sp" style={{background:C.off,padding:"140px 48px",position:"relative",overflow:"hidden"}}>
    <div className="orb" style={{width:300,height:300,background:C.mag,top:"10%",right:"-8%",opacity:.03}} />
    <div className="sec-center" style={{maxWidth:1200,margin:"0 auto",position:"relative",zIndex:1}}>
      <R><div className="tag">O Problema</div></R>

      {/* 2 colunas: texto esquerda, desafios direita */}
      <div style={{display:"grid",gridTemplateColumns:"1.1fr 0.9fr",gap:72,marginBottom:64,alignItems:"start"}} className="g2">

        {/* Esquerda */}
        <div>
          <R delay={.06}>
            <h2 className="ff big-t" style={{fontSize:"clamp(34px,4.8vw,52px)",color:C.navy,lineHeight:1.2,marginBottom:32,fontWeight:700}}>
              Cada aluno aprende de um jeito.{" "}
              <span style={{color:C.faint,fontWeight:400}}>Mas a escola ainda precisa ensinar todos da mesma forma.</span>
            </h2>
          </R>
        </div>

        {/* Direita — Lista de desafios */}
        <R delay={.14}>
          <div style={{display:"grid",gap:14,paddingTop:8}}>
            {[
              "Alunos aprendem em ritmos e formas diferentes",
              "Professores não conseguem acompanhar cada aluno individualmente",
              "Excesso de tecnologia sem intenção pedagógica",
              "Dificuldade de desenvolver hábitos consistentes de estudo",
            ].map((t,i)=>(
              <div key={i} style={{padding:"22px 28px",background:C.white,borderRadius:16,border:`1.5px solid ${C.mag}15`,display:"flex",gap:16,alignItems:"center",transition:"all .4s cubic-bezier(.22,1,.36,1)",boxShadow:"0 2px 12px rgba(5,8,32,0.04)"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.mag+"55";e.currentTarget.style.transform="translateX(6px)";e.currentTarget.style.boxShadow=`0 8px 28px ${C.mag}12`}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.mag+"15";e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 2px 12px rgba(5,8,32,0.04)"}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:`linear-gradient(135deg,${C.mag},${C.acc})`,flexShrink:0,boxShadow:`0 0 8px ${C.mag}44`}} />
                <span style={{fontSize:16,color:C.navy,lineHeight:1.5,fontWeight:600}}>{t}</span>
              </div>
            ))}
          </div>
        </R>
      </div>

      {/* Frase forte */}
      <R delay={.2}>
        <div style={{textAlign:"center",paddingTop:8}}>
          <p className="ff" style={{fontSize:"clamp(22px,2.8vw,30px)",color:C.navy,fontWeight:700,lineHeight:1.35}}>
            A educação precisa ser personalizada —{" "}
            <span style={{color:C.mag}}>sem perder a pedagogia no centro.</span>
          </p>
        </div>
      </R>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════
   3. PROVOCAÇÃO + SOLUÇÃO — Uma única seção
   O insight forte vem primeiro. Depois a resposta.
   ══════════════════════════════════════════════════ */
const Solucao = () => (
  <section id="solucao" className="sp" style={{background:C.white,padding:"140px 48px 80px",position:"relative"}}>
    <div style={{maxWidth:1320,margin:"0 auto"}}>

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
          <p style={{fontSize:17,color:C.text,lineHeight:1.9}}>O coração do sistema é o <strong>plano pedagógico da escola</strong>. Não impõe um método — potencializa o que a família já escolheu.</p>
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

      {/* Features */}
      <R><h3 className="ff" style={{fontSize:28,color:C.navy,marginBottom:48,fontWeight:600}}>O que a plataforma entrega</h3></R>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}} className="g2">
        {[
          {n:"01",title:"Roteiro personalizado e diário",desc:"Espaçamento ideal para memórias de longo prazo, gerado para cada aluno individualmente.",c:C.mag,bg:`linear-gradient(135deg,${C.navy},#0e1235)`},
          {n:"02",title:"Revisão estruturada das aulas",desc:"Conteúdo reexplicado usando os interesses pessoais do aluno para aumentar retenção.",c:C.acc,bg:`linear-gradient(135deg,${C.navy},#081030)`},
          {n:"03",title:"Questões adaptativas + Flashcards",desc:"Calibradas pela Taxonomia de Bloom. Princípio MECE nos flashcards: todos os conceitos, sem repetição.",c:C.gold,bg:`linear-gradient(135deg,${C.navy},#0c1028)`},
          {n:"04",title:"Tutor virtual pedagógico 24/7",desc:"Tia Chris e Tio Bento. Mediação socrática que guia o raciocínio sem entregar respostas prontas.",c:"#2b8a6e",bg:`linear-gradient(135deg,${C.navy},#081525)`},
        ].map((f,i)=>(
          <R key={i} delay={.04*i}>
            <GlowCard color={f.c} bg={f.bg}>
              <div style={{position:"absolute",top:0,left:0,width:"100%",height:3,background:`linear-gradient(90deg,${f.c},${f.c}44)`}} />
              <div style={{position:"absolute",top:20,right:24}}>
                <span className="ff" style={{fontSize:48,fontWeight:800,color:f.c,opacity:.15,lineHeight:1}}>{f.n}</span>
              </div>
              <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:44,height:44,borderRadius:12,background:f.c+"20",marginBottom:20}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:f.c}} />
              </div>
              <h4 style={{fontSize:18,fontWeight:700,color:"#fff",marginBottom:10}}>{f.title}</h4>
              <p style={{fontSize:14,color:"#fff9",lineHeight:1.75}}>{f.desc}</p>
            </GlowCard>
          </R>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════
   3. COMO FUNCIONA — Alternating 2-column zigzag
   ══════════════════════════════════════════════════ */
const ComoFunciona = () => {
  const steps = [
    {n:"01",t:"A escola compartilha seu plano pedagógico",d:"Currículo, materiais e metodologia. O Exitus começa a partir do que a escola já construiu.",img:IMGS.diagram},
    {n:"02",t:"A IA enriquece com neurociência",d:"Algoritmos de recomendação — como Netflix e Amazon, mas para educação — criam uma agenda otimizada para cada aluno.",img:IMGS.roteiro},
    {n:"03",t:"O aluno estuda com roteiro personalizado",d:"Flashcards, questões adaptativas, revisões espaçadas. Cada atividade na hora e no formato certo para o nível cognitivo.",img:IMGS.revisao},
    {n:"04",t:"Os Tutores virtuais te acompanham 24/7",d:"Mediação socrática na dúvida. Feedback evolutivo após cada resolução. O erro vira oportunidade de aprendizado.",img:IMGS.tioBento},
    {n:"05",t:"O professor recebe dados de cada aluno",d:"Progresso, dificuldades, evolução ao longo do tempo. A escola mantém o controle pedagógico — sempre.",img:IMGS.questoes},
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
                <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
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
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:72,marginBottom:72,alignItems:"center"}} className="g2">
          <div className="sec-center">
            <R><div className="tag">Base Científica</div></R>
            <R delay={.06}>
              <h2 className="ff big-t" style={{fontSize:"clamp(34px,4.8vw,48px)",color:C.navy,lineHeight:1.2,marginBottom:28,fontWeight:700}}>
                Cada funcionalidade é fundamentada em{" "}
                <span className="gt" style={{}}>pesquisas publicadas.</span>
              </h2>
            </R>
            <R delay={.1}><p style={{fontSize:17,color:C.muted,lineHeight:1.9}}>
              Não usamos IA por modismo. O Exitus aplica princípios consolidados de neurociência educacional: revisão espaçada, efeito teste, Taxonomia de Bloom e técnicas de formação de hábito.
            </p></R>
          </div>
          <R delay={.15}><img src={IMGS.bloom} alt="Taxonomia de Bloom" className="img-f" /></R>
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
   5. SEGURANÇA — Enxuto
   ══════════════════════════════════════════════════ */
const Seguranca = () => (
    <section id="seguranca" className="sp" style={{background:C.off,padding:"140px 48px"}}>
    <div style={{maxWidth:1080,margin:"0 auto"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:72,alignItems:"center"}} className="g2">
        <div className="sec-center">
          <R><div className="tag">Segurança</div></R>
          <R delay={.06}><h2 className="ff big-t" style={{fontSize:"clamp(34px,4.8vw,48px)",color:C.navy,marginBottom:28,fontWeight:700}}>
            Tecnologia que educa — <span style={{color:C.mag}}>não que distrai.</span>
          </h2></R>
          <R delay={.1}>
            <p style={{fontSize:17,color:C.muted,lineHeight:1.9,marginBottom:20}}>
              Acreditamos em <strong style={{color:C.navy}}>tecnologia calma</strong>. Cada interação tem intencionalidade pedagógica. Os agentes de IA são treinados para letramento digital responsável.
            </p>
          </R>
        </div>
        <R delay={.12}>
          <div className="seg-inner" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {[
              {t:"Ambiente controlado",d:"Sem conteúdo inadequado",c:C.mag},
              {t:"IA treinada",d:"Pedagógica, não genérica",c:C.acc},
              {t:"A partir de 10 anos",d:"Adequada ao desenvolvimento",c:C.gold},
              {t:"Letramento digital",d:"Uso responsável de telas",c:"#2b8a6e"},
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
   GALERIA — Interactive feature showcase
   ══════════════════════════════════════════════════ */
const Gallery = () => {
  const [active, setActive] = useState(0);
  const touchRef = useRef(null);
  const tabsRef = useRef(null);
  const screens = [
    { img: IMGS.g_dashboard_full, title: "Dashboard Principal", desc: "Visão geral do progresso, próximas missões e avaliações" },
    { img: IMGS.g_roteiro, title: "Roteiro de Estudos", desc: "Assuntos sugeridos para o dia, personalizados por aluno" },
    { img: IMGS.g_revisao_conteudo, title: "Revisão de Conteúdos", desc: "Revisão interativa com IA baseada no material da aula" },
    { img: IMGS.g_questoes, title: "Resolver Questões", desc: "Questões adaptativas com tutor virtual integrado" },
    { img: IMGS.g_quiz, title: "Quiz Interativo", desc: "Modo dinâmico com questões geradas por IA" },
    { img: IMGS.g_tia_chris, title: "Tia Chris", desc: "Tutora virtual para tirar dúvidas e auxiliar nos estudos" },
    { img: IMGS.g_provas, title: "Revisão para Provas", desc: "Preparação direcionada com prioridade automática" },
    { img: IMGS.g_materiais, title: "Materiais", desc: "Conteúdos compartilhados pelos professores" },
    { img: IMGS.g_revisao_aula, title: "Revisão de Aula", desc: "Explicação detalhada dos conteúdos com contexto da aula" },
    { img: IMGS.g_tio_bento, title: "Tio Bento", desc: "Tutor que guia o raciocínio na resolução de questões" },
  ];

  /* Touch swipe for mobile */
  useEffect(() => {
    const el = touchRef.current;
    if (!el) return;
    let startX = 0;
    let startY = 0;
    const onStart = (e) => { startX = e.touches[0].clientX; startY = e.touches[0].clientY; };
    const onEnd = (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx < 0) setActive(p => Math.min(p + 1, screens.length - 1));
        else setActive(p => Math.max(p - 1, 0));
      }
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => { el.removeEventListener("touchstart", onStart); el.removeEventListener("touchend", onEnd); };
  }, [screens.length]);

  /* Auto-scroll active tab into view on mobile */
  useEffect(() => {
    const container = tabsRef.current;
    if (!container) return;
    const activeTab = container.children[active];
    if (!activeTab) return;
    const scrollLeft = activeTab.offsetLeft - container.offsetWidth / 2 + activeTab.offsetWidth / 2;
    container.scrollTo({ left: Math.max(0, scrollLeft), behavior: "smooth" });
  }, [active]);

  return (
    <section id="galeria" className="sp gal-section" style={{background:C.navy,padding:"120px 48px",position:"relative",overflow:"hidden"}}>
      <div className="orb" style={{width:400,height:400,background:C.mag,top:"-10%",right:"-5%",opacity:.04}} />
      <div className="sec-center" style={{maxWidth:1320,margin:"0 auto",position:"relative",zIndex:1}}>
        <R>
          <div className="tag tag-d">A Plataforma</div>
          <h2 className="ff big-t" style={{fontSize:"clamp(34px,4.8vw,48px)",color:C.white,lineHeight:1.25,marginBottom:56,fontWeight:700}}>
            Conheça cada funcionalidade <span style={{color:C.mag}}>por dentro.</span>
          </h2>
        </R>

        <div style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:32,alignItems:"start"}} className="g2 gal-grid">
          {/* Left: selectors */}
          <R delay={.1} className="gal-tabs-wrap">
            <div className="gal-tabs" ref={tabsRef}>
              {screens.map((s,i)=>(
                <div key={i} className="gal-tab" onClick={()=>setActive(i)} style={{
                  padding:"14px 20px",borderRadius:14,cursor:"pointer",
                  transition:"all .35s cubic-bezier(.22,1,.36,1)",
                  background: active===i ? `linear-gradient(135deg,${C.mag}22,${C.acc}15)` : "transparent",
                  border: active===i ? `1px solid ${C.mag}44` : "1px solid transparent",
                  transform: active===i ? "translateX(6px)" : "none",
                }}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div className="gal-dot" style={{
                      width:8,height:8,borderRadius:"50%",flexShrink:0,transition:"all .3s",
                      background: active===i ? C.mag : "#fff2",
                      boxShadow: active===i ? `0 0 10px ${C.mag}66` : "none"
                    }} />
                    <span style={{
                      fontSize:14,fontWeight: active===i ? 700 : 500,
                      color: active===i ? "#fff" : "#fff6",
                      transition:"all .3s"
                    }}>{s.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </R>

          {/* Right: active screenshot */}
          <R delay={.15}>
            <div ref={touchRef} style={{position:"relative",touchAction:"pan-y"}}>
              <div style={{background:"#181c3a",borderRadius:20,padding:8,boxShadow:`0 32px 80px rgba(5,8,32,0.5), 0 0 0 1px ${C.mag}15`,transition:"box-shadow .4s ease"}}>
                <div style={{position:"relative",borderRadius:14,overflow:"hidden",background:"#f0f1f5"}}>
                  {screens.map((s,i)=>(
                    <img key={i} src={s.img} alt={s.title} style={{
                      width:"100%",display:"block",borderRadius:14,
                      position: i===0 ? "relative" : "absolute",
                      top:0,left:0,
                      opacity: active===i ? 1 : 0,
                      transition:"opacity .5s ease",
                    }} />
                  ))}
                </div>
              </div>
              {/* Caption + mobile nav */}
              <div style={{marginTop:20,paddingLeft:8}}>
                <h4 className="ff" style={{fontSize:20,color:C.white,fontWeight:700,marginBottom:6}}>{screens[active].title}</h4>
                <p style={{fontSize:15,color:"#fff7",marginBottom:16}}>{screens[active].desc}</p>
                {/* Dot indicators + arrows — visible only on mobile */}
                <div className="gal-nav" style={{display:"none",alignItems:"center",justifyContent:"center",gap:16,marginTop:4}}>
                  <button onClick={()=>setActive(p=>Math.max(p-1,0))} style={{background:"none",border:"none",color:active===0?"#fff2":"#fffa",fontSize:20,cursor:"pointer",padding:"4px 8px",transition:"color .2s"}} aria-label="Anterior">‹</button>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    {screens.map((_,i)=>(
                      <div key={i} onClick={()=>setActive(i)} style={{width:active===i?20:6,height:6,borderRadius:3,background:active===i?C.mag:"#fff3",transition:"all .3s",cursor:"pointer"}} />
                    ))}
                  </div>
                  <button onClick={()=>setActive(p=>Math.min(p+1,screens.length-1))} style={{background:"none",border:"none",color:active===screens.length-1?"#fff2":"#fffa",fontSize:20,cursor:"pointer",padding:"4px 8px",transition:"color .2s"}} aria-label="Próximo">›</button>
                </div>
                <div className="gal-swipe-hint" style={{display:"none",justifyContent:"center",marginTop:8}}>
                  <span style={{fontSize:11,color:"#fff3",letterSpacing:".04em"}}>← deslize para navegar →</span>
                </div>
              </div>
            </div>
          </R>
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════
   6. PROVA SOCIAL — Christus com dados concretos
   ══════════════════════════════════════════════════ */
const ProvaSocial = () => (
    <section id="prova-social" className="grain sp" style={{background:`linear-gradient(160deg,${C.navy},${C.deep})`,padding:"140px 48px",position:"relative",overflow:"hidden"}}>
    <div className="orb" style={{width:500,height:500,background:C.mag,bottom:"-15%",left:"-10%",opacity:.04}} />
    <div className="sec-center" style={{maxWidth:1240,margin:"0 auto",position:"relative",zIndex:2}}>
      <R><div className="tag tag-d">Resultados</div></R>
      <R delay={.06}><h2 className="ff big-t" style={{fontSize:"clamp(34px,4.8vw,52px)",color:C.white,marginBottom:64,fontWeight:700}}>
        Desenvolvido com quem entende de educação.
      </h2></R>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:56,alignItems:"center"}} className="g2">
        <R delay={.1}><img src={IMGS.christus} alt="Christus" className="img-f" /></R>
        <R delay={.18}>
          <div className="glass glass-panel" style={{padding:48}}>
            <h3 className="ff" style={{fontSize:26,fontWeight:700,color:C.white,marginBottom:12}}>Colégio Christus</h3>
            <p style={{fontSize:14,color:"#fff5",marginBottom:32,lineHeight:1.6}}>75 anos de história educacional em Fortaleza. Uma das instituições mais tradicionais e inovadoras do Brasil.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:32}}>
              {[{n:"1º",l:"lugar ENEM 2024*"},{n:"2º",l:"geral do Brasil"},{n:"79%",l:"estudam há +10 anos"},{n:"1ª",l:"do CE com tutoria IA"}].map((s,i)=>(
                <div key={i} style={{textAlign:"center"}}>
                  <div className="ff" style={{fontSize:40,color:C.mag,fontWeight:800,lineHeight:1}}>{s.n}</div>
                  <div style={{fontSize:12,color:"#fff5",marginTop:8}}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{borderTop:"1px solid #fff0c",paddingTop:20}}>
              <p style={{fontSize:14,color:"#fff8",lineHeight:1.6}}>Melhor universidade do Brasil segundo o MEC (UniChristus). Uma das primeiras escolas trilíngues do país.</p>
            </div>
            <p style={{fontSize:10,color:"#fff2",marginTop:16}}>*Escolas 40+ alunos. MEC 08/07/2025. INEP: 23246880.</p>
          </div>
        </R>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════
   7. DEMO — Screenshots reais
   ══════════════════════════════════════════════════ */
const demoVideos = [
  {vid:"/assets/videos/plataforma geral.mp4",l:"Plataforma Geral",icon:"🖥️"},
  {vid:"/assets/videos/revisando a aula do dia.mp4",l:"Revisando a Aula do Dia",icon:"📖"},
  {vid:"/assets/videos/quizz por assunto.mp4",l:"Quiz por Assunto",icon:"🧩"},
  {vid:"/assets/videos/flahscards.mp4",l:"Flashcards",icon:"🃏"}
];

const Demo = () => {
  const [modal, setModal] = useState(null);

  useEffect(() => {
    if (modal !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [modal]);

  return (
  <section id="demo" className="sp" style={{padding:"140px 48px",background:C.light,overflowX:"hidden"}}>
    <div style={{maxWidth:1180,margin:"0 auto",overflow:"hidden"}}>
      <R><div className="sec-center" style={{textAlign:"center",marginBottom:64}}>
        <div className="tag">Plataforma</div>
        <h2 className="ff big-t" style={{fontSize:"clamp(34px,4.8vw,48px)",color:C.navy,marginTop:16,fontWeight:700}}>
          Veja o Exitus <span className="gt" style={{}}>em ação.</span>
        </h2>
      </div></R>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:28,marginBottom:64}} className="g2">
        {demoVideos.map((s,i)=>(
          <R key={i} delay={.08*i}>
            <div style={{position:"relative",borderRadius:24,overflow:"hidden",cursor:"pointer",transition:"all .5s ease"}}
              onClick={()=>setModal(i)}
              onMouseEnter={e=>e.currentTarget.style.transform="scale(1.02)"}
              onMouseLeave={e=>e.currentTarget.style.transform="none"}>
              <video src={s.vid} muted preload="metadata" playsInline
                style={{width:"100%",display:"block",borderRadius:24,pointerEvents:"none"}} />
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{width:68,height:68,borderRadius:"50%",background:"rgba(255,255,255,0.92)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 32px rgba(0,0,0,0.18)",backdropFilter:"blur(8px)",transition:"transform .3s ease"}}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill={C.navy}><polygon points="6,3 20,12 6,21"/></svg>
                </div>
              </div>
              <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"28px 28px 24px",background:`linear-gradient(transparent,${C.navy}dd)`,pointerEvents:"none"}}>
                <span style={{fontSize:15,color:C.white,fontWeight:600}}>{s.icon} {s.l}</span>
              </div>
            </div>
          </R>
        ))}
      </div>
    </div>

    {/* ── Modal de vídeo ── */}
    {modal !== null && (
      <div onClick={()=>setModal(null)} style={{
        position:"fixed",inset:0,zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",
        background:"rgba(0,0,0,0.82)",backdropFilter:"blur(12px)",
        animation:"fadeIn .25s ease"
      }}>
        <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes scaleIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}`}</style>
        <div onClick={e=>e.stopPropagation()} className="demo-modal-inner" style={{
          position:"relative",width:"90vw",maxWidth:960,
          background:C.navy,borderRadius:24,overflow:"hidden",
          boxShadow:"0 32px 80px rgba(0,0,0,0.5)",
          animation:"scaleIn .3s cubic-bezier(.22,1,.36,1)"
        }}>
          {/* Header */}
          <div className="demo-modal-header" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 28px",borderBottom:`1px solid rgba(255,255,255,0.08)`}}>
            <span style={{fontSize:17,fontWeight:700,color:C.white}}>{demoVideos[modal].icon} {demoVideos[modal].l}</span>
            <button onClick={()=>setModal(null)} style={{
              width:40,height:40,borderRadius:12,border:"none",cursor:"pointer",
              background:"rgba(255,255,255,0.08)",color:C.white,fontSize:22,
              display:"flex",alignItems:"center",justifyContent:"center",transition:"background .2s"
            }} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.18)"}
               onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.08)"}>✕</button>
          </div>
          {/* Video */}
          <video src={demoVideos[modal].vid} controls autoPlay
            style={{width:"100%",display:"block",maxHeight:"75vh",background:"#000"}} />
        </div>
      </div>
    )}
  </section>
  );
};

/* ══════════════════════════════════════════════════
   8. CTA + FORMULÁRIO — Conversão real
   ══════════════════════════════════════════════════ */
const Contato = () => {
  const [form, setForm] = useState({ nome:"", escola:"", email:"", telefone:"", perfil:"escola" });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => { if(form.nome && form.email) setSent(true); };

  return (
    <section id="contato" className="grain sp" style={{background:`linear-gradient(160deg,${C.navy},${C.ink})`,padding:"140px 48px",position:"relative",overflow:"hidden"}}>
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
                <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
                  <div style={{width:44,height:44,borderRadius:12,background:`${C.mag}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>👩‍🏫</div>
                  <div>
                    <h4 style={{fontSize:16,fontWeight:700,color:C.white,marginBottom:4}}>Auxiliar os Professores</h4>
                    <p style={{fontSize:14,color:"#fff7",lineHeight:1.6}}>Ferramentas que reduzem sobrecarga e devolvem ao professor o que é mais valioso: tempo para ensinar.</p>
                  </div>
                </div>
                <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
                  <div style={{width:44,height:44,borderRadius:12,background:`${C.acc}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🚀</div>
                  <div>
                    <h4 style={{fontSize:16,fontWeight:700,color:C.white,marginBottom:4}}>Potencializar o Aprendizado</h4>
                    <p style={{fontSize:14,color:"#fff7",lineHeight:1.6}}>Neurociência e IA exponencializando a capacidade de cada aluno, respeitando seu ritmo e interesses.</p>
                  </div>
                </div>
                <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
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
                  <div style={{fontSize:48,marginBottom:16}}>✅</div>
                  <h3 className="ff" style={{fontSize:24,color:C.white,fontWeight:700,marginBottom:8}}>Recebemos seu contato!</h3>
                  <p style={{fontSize:15,color:"#fffa"}}>Nosso time pedagógico entrará em contato em até 24 horas.</p>
                </div>
              ) : (
                <>
                  <h3 className="ff" style={{fontSize:22,color:C.white,fontWeight:700,marginBottom:8}}>Agendar demonstração</h3>
                  <p style={{fontSize:14,color:"#fff6",marginBottom:28}}>Preencha e nosso time pedagógico entrará em contato.</p>

                  {/* Profile selector */}
                  <div style={{display:"flex",gap:8,marginBottom:24}}>
                    {[{v:"escola",l:"Sou Escola"},{v:"professor",l:"Sou Professor"},{v:"pai",l:"Sou Pai/Mãe"}].map(p=>(
                      <div key={p.v} onClick={()=>setForm({...form,perfil:p.v})} style={{
                        flex:1,padding:"10px 12px",borderRadius:12,textAlign:"center",cursor:"pointer",fontSize:13,fontWeight:600,transition:"all .2s",
                        background:form.perfil===p.v?C.mag+"33":"#fff08",
                        border:`1.5px solid ${form.perfil===p.v?C.mag:"#fff15"}`,
                        color:form.perfil===p.v?"#fff":"#fff8"
                      }}>{p.l}</div>
                    ))}
                  </div>

                  {[{k:"nome",p:"Seu nome",t:"text"},{k:"escola",p:"Nome da escola",t:"text"},{k:"email",p:"E-mail",t:"email"},{k:"telefone",p:"WhatsApp com DDD",t:"tel"}].map(f=>(
                    <input key={f.k} type={f.t} placeholder={f.p} value={form[f.k]}
                      onChange={e=>setForm({...form,[f.k]:e.target.value})}
                      style={{
                        width:"100%",padding:"14px 18px",borderRadius:14,border:"1.5px solid #fff15",
                        background:"#fff08",color:"#fff",fontSize:15,fontFamily:"'Poppins'",
                        marginBottom:12,outline:"none",transition:"border .2s"}}
                      onFocus={e=>e.target.style.borderColor=C.mag}
                      onBlur={e=>e.target.style.borderColor="#fff15"}
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
  );
};

/* ══ FOOTER ══ */
const Ft = () => (
  <footer className="ft-pad" style={{background:C.navy,padding:"36px 48px 28px",borderTop:`2px solid ${C.mag}22`}}>
    <div className="ft-inner" style={{maxWidth:1320,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <img src={IMGS.logo} alt="Exitus" style={{height:28}} />
        <span style={{fontSize:12,color:"#fff2"}}>Aprenda aprendendo.</span>
      </div>
      <p style={{fontSize:11,color:"#fff1"}}>© 2026 Exitus Educacional</p>
    </div>
  </footer>
);

export default function App() {
  return (<><style>{css}</style><Nav /><Hero /><Marquee /><Problema /><Solucao /><ComoFunciona /><Neurociencia /><Seguranca /><Gallery /><ProvaSocial /><Demo /><Contato /><Ft /></>);
}
