import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const WEBINAR_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSexRd5BFC2XlUPDPdpx2opT0AVMwz8vkxVUQ33ss_4B1x6fow/formResponse';
const API_BASE = 'http://localhost:5000';

/* ─────────────────────────────────────────────────────────────
   MATH CAPTCHA  — generates NEW numbers on every mount/reset
───────────────────────────────────────────────────────────── */
const genNums = () => ({
  n1: Math.floor(Math.random() * 10) + 1,
  n2: Math.floor(Math.random() * 10) + 1,
});

const MathCaptcha = ({ onVerified, verified, resetKey }) => {
  const [nums, setNums]     = useState(genNums);
  const [answer, setAnswer] = useState('');
  const [error, setErr]     = useState('');

  // Regenerate numbers whenever resetKey changes (after each form submit)
  useEffect(() => {
    setNums(genNums());
    setAnswer('');
    setErr('');
  }, [resetKey]);

  const verify = () => {
    if (parseInt(answer) === nums.n1 + nums.n2) {
      onVerified(true);
      setErr('');
    } else {
      setErr('Incorrect. Try again.');
      setAnswer('');
      // Refresh numbers on wrong answer too
      setNums(genNums());
      onVerified(false);
    }
  };

  return (
    <div style={{ borderRadius: 12, padding: 20, background: 'rgba(0,212,255,0.05)', border: `2px solid ${verified ? 'rgba(0,255,100,0.5)' : 'rgba(0,212,255,0.3)'}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span>🔐</span>
        <span style={{ color: '#fff', fontFamily: 'Rajdhani,sans-serif', fontWeight: 600, fontSize: 16 }}>Security Verification</span>
      </div>
      {verified ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>✅</span>
          <span style={{ color: '#00ff64', fontFamily: 'Poppins,sans-serif', fontSize: 14 }}>Verification successful!</span>
        </div>
      ) : (
        <>
          <p style={{ color: '#d1d5db', fontFamily: 'Poppins,sans-serif', fontSize: 14, marginBottom: 12 }}>
            Solve this to confirm you're human:
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: 20, padding: '8px 16px', borderRadius: 8, color: '#00d4ff', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', fontFamily: 'Rajdhani,sans-serif', letterSpacing: 2 }}>
              {nums.n1} + {nums.n2} = ?
            </span>
            <input
              type="number"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && verify()}
              placeholder="Answer"
              style={{ width: 90, padding: '8px 12px', borderRadius: 8, textAlign: 'center', background: '#061c36', border: '1px solid rgba(0,212,255,0.4)', color: '#fff', fontFamily: 'Poppins,sans-serif', fontSize: 15, outline: 'none', boxSizing: 'border-box', position: 'relative', zIndex: 100 }}
            />
            <button
              onClick={verify}
              type="button"
              style={{ padding: '8px 16px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', background: 'linear-gradient(135deg,#00d4ff,#00b4d8)', color: '#000', fontFamily: 'Rajdhani,sans-serif', fontSize: 14, border: 'none' }}
            >
              Verify
            </button>
            {/* Refresh button — get a new question */}
            <button
              onClick={() => { setNums(genNums()); setAnswer(''); setErr(''); onVerified(false); }}
              type="button"
              title="Get a new question"
              style={{ padding: '8px 10px', borderRadius: 8, cursor: 'pointer', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff', fontSize: 16, lineHeight: 1 }}
            >
              🔄
            </button>
          </div>
          {error && <p style={{ color: '#ff6b6b', fontFamily: 'Poppins,sans-serif', fontSize: 13, marginTop: 8 }}>{error}</p>}
        </>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
const CyberEducation = () => {
  const canvasRef = useRef(null);

  const emptyForm = { fullName:'', email:'', mobile:'', currentStatus:'', collegeName:'', priorKnowledge:'', interestedInSummer:'', attendLive:'', agreeToReceive:'' };

  const [formData, setFormData]           = useState(emptyForm);
  const [status, setStatus]               = useState({ type:'', message:'' });
  const [loading, setLoading]             = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaResetKey, setCaptchaResetKey] = useState(0); // increment to force new CAPTCHA

  const handle = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const submitToGoogleForms = useCallback((data) => {
    const gf = new FormData();
    gf.append('entry.13855836',  data.fullName);
    gf.append('entry.290039720', data.email);
    gf.append('entry.1970329280',data.mobile);
    gf.append('entry.329569057', data.currentStatus);
    gf.append('entry.1684355964',data.collegeName);
    gf.append('entry.472674535', data.priorKnowledge);
    gf.append('entry.46240306',  data.interestedInSummer);
    gf.append('entry.1886053848',data.attendLive);
    gf.append('entry.1985837981',data.agreeToReceive);
    return fetch(WEBINAR_FORM_URL, { method:'POST', body:gf, mode:'no-cors' });
  }, []);

  const resetForm = useCallback(() => {
    setFormData(emptyForm);
    setCaptchaVerified(false);
    setCaptchaResetKey(k => k + 1); // triggers new CAPTCHA numbers
  }, []);

  const submit = async () => {
    if (!captchaVerified) {
      setStatus({ type:'error', message:'Please complete the security verification.' });
      return;
    }
    const required = ['currentStatus','priorKnowledge','interestedInSummer','attendLive','agreeToReceive'];
    if (required.some(f => !formData[f])) {
      setStatus({ type:'error', message:'Please fill in all required fields.' });
      return;
    }

    setLoading(true);
    setStatus({ type:'', message:'' });

    try {
      const res = await axios.post(`${API_BASE}/api/webinar`, formData, {
        timeout: 8000,
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.data.success) {
        submitToGoogleForms(formData).catch(() => {});
        setStatus({ type:'success', message:'🎉 Registration successful! You will receive webinar details on your email/WhatsApp soon.' });
        resetForm();
      } else {
        setStatus({ type:'error', message: res.data.message || 'Registration failed. Please try again.' });
      }

    } catch (err) {
      if (err.response?.status === 409) {
        setStatus({ type:'error', message:'⚠️ This email is already registered for the webinar.' });
      } else if (err.response?.status === 500) {
        setStatus({ type:'error', message:`Server error: ${err.response.data?.message || 'Database issue. Please try again.'}` });
      } else if (!err.response) {
        // Network error — backend offline — fall back to Google Forms
        try {
          await submitToGoogleForms(formData);
          setStatus({ type:'success', message:'✅ Registration submitted! (Backend offline — saved to Google Forms.)' });
          resetForm();
        } catch {
          setStatus({ type:'error', message:'❌ Cannot reach server. Make sure your backend is running: cd server && npm run dev' });
        }
      } else {
        setStatus({ type:'error', message:`Error: ${err.message}` });
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── Canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const resize = () => { canvas.width=window.innerWidth; canvas.height=window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    class Node { constructor(){this.x=Math.random()*canvas.width;this.y=Math.random()*canvas.height;this.vx=(Math.random()-0.5)*0.8;this.vy=(Math.random()-0.5)*0.8;this.r=Math.random()*2.5+1;this.phase=Math.random()*Math.PI*2;} tick(){this.x+=this.vx;this.y+=this.vy;this.phase+=0.03;if(this.x<0)this.x=canvas.width;if(this.x>canvas.width)this.x=0;if(this.y<0)this.y=canvas.height;if(this.y>canvas.height)this.y=0;} draw(){const p=Math.sin(this.phase)*0.5+0.5,s=this.r+p*1.5;ctx.shadowBlur=8+p*4;ctx.shadowColor='#00a8c0';ctx.beginPath();ctx.arc(this.x,this.y,s,0,Math.PI*2);const g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,s);g.addColorStop(0,`rgba(0,210,230,${0.6+p*0.15})`);g.addColorStop(0.5,`rgba(0,180,200,${0.4+p*0.15})`);g.addColorStop(1,'rgba(0,150,180,0)');ctx.fillStyle=g;ctx.fill();ctx.shadowBlur=0;} }
    class Line { constructor(){this.reset();} reset(){this.x=Math.random()*canvas.width;this.y=Math.random()*canvas.height;this.len=Math.random()*100+50;this.angle=Math.random()*Math.PI*2;this.speed=Math.random()*2+1;this.life=0;this.max=Math.random()*60+40;} tick(){this.x+=Math.cos(this.angle)*this.speed;this.y+=Math.sin(this.angle)*this.speed;this.life++;if(this.life>this.max||this.x<-100||this.x>canvas.width+100||this.y<-100||this.y>canvas.height+100)this.reset();} draw(){const op=Math.sin((this.life/this.max)*Math.PI)*0.25;ctx.beginPath();ctx.moveTo(this.x,this.y);ctx.lineTo(this.x-Math.cos(this.angle)*this.len,this.y-Math.sin(this.angle)*this.len);const g=ctx.createLinearGradient(this.x,this.y,this.x-Math.cos(this.angle)*this.len,this.y-Math.sin(this.angle)*this.len);g.addColorStop(0,`rgba(0,200,220,${op})`);g.addColorStop(1,'rgba(0,200,220,0)');ctx.strokeStyle=g;ctx.lineWidth=1.5;ctx.shadowBlur=5;ctx.shadowColor='rgba(0,180,200,0.2)';ctx.stroke();ctx.shadowBlur=0;} }
    const nodes=Array.from({length:60},()=>new Node()),lines=Array.from({length:12},()=>new Line());
    const conns=()=>{for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<180){const op=(1-d/180)*0.2;ctx.beginPath();ctx.moveTo(nodes[i].x,nodes[i].y);ctx.lineTo(nodes[j].x,nodes[j].y);const g=ctx.createLinearGradient(nodes[i].x,nodes[i].y,nodes[j].x,nodes[j].y);g.addColorStop(0,`rgba(0,200,180,${op})`);g.addColorStop(1,`rgba(0,180,200,${op})`);ctx.strokeStyle=g;ctx.lineWidth=1;ctx.shadowBlur=3;ctx.shadowColor='rgba(0,180,200,0.1)';ctx.stroke();ctx.shadowBlur=0;}}};
    const animate=()=>{ctx.fillStyle='rgba(10,37,64,0.12)';ctx.fillRect(0,0,canvas.width,canvas.height);lines.forEach(l=>{l.tick();l.draw();});nodes.forEach(n=>{n.tick();n.draw();});conns();raf=requestAnimationFrame(animate);};
    animate();
    return ()=>{window.removeEventListener('resize',resize);cancelAnimationFrame(raf);};
  }, []);

  const INP = { display:'block', width:'100%', boxSizing:'border-box', padding:'12px 16px', borderRadius:8, background:'#061c36', border:'1.5px solid rgba(0,212,255,0.4)', color:'#ffffff', fontFamily:'Poppins,sans-serif', fontSize:15, outline:'none', position:'relative', zIndex:100 };
  const onFocus = e => { e.target.style.borderColor='#00d4ff'; e.target.style.boxShadow='0 0 0 3px rgba(0,212,255,0.2)'; };
  const onBlur  = e => { e.target.style.borderColor='rgba(0,212,255,0.4)'; e.target.style.boxShadow='none'; };

  const radioGroups = [
    { field:'currentStatus',      label:'Current Status',                                                       options:['Student','Working Professional','Job Seeker','Other'] },
    { field:'priorKnowledge',     label:'Do you have prior knowledge of Cybersecurity?',                        options:['Beginner','Intermediate','Advanced'] },
    { field:'interestedInSummer', label:'Are you interested in a Summer School Program on CyberSecurity?',      options:['Yes','No','Maybe'] },
    { field:'attendLive',         label:'Will you be able to attend the live session at the scheduled time?',    options:['Yes','No','Maybe'] },
    { field:'agreeToReceive',     label:'I agree to receive webinar details on Email / WhatsApp',               options:['Yes','No','Maybe'] },
  ];

  const fadeUp = { hidden:{opacity:0,y:50}, visible:{opacity:1,y:0,transition:{duration:0.6}} };

  return (
    <div style={{ position:'relative', minHeight:'100vh', background:'linear-gradient(135deg,#0a2540 0%,#0d3a5c 35%,#115073 65%,#0d3a5c 100%)' }}>
      <canvas ref={canvasRef} style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', pointerEvents:'none', zIndex:-1, display:'block' }} />

      <div style={{ position:'relative', zIndex:1, isolation:'isolate', paddingTop:80 }}>

        <section style={{ padding:'80px 0', textAlign:'center' }}>
          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8}}>
            <span style={{ color:'#00b4d8', fontFamily:'Poppins,sans-serif', fontSize:12, fontWeight:700, letterSpacing:3, textTransform:'uppercase', display:'block', marginBottom:12 }}>LIVE WEBINAR</span>
            <h1 style={{ color:'#fff', fontFamily:'Rajdhani,sans-serif', fontSize:'clamp(2.5rem,6vw,4rem)', fontWeight:700, margin:'0 0 16px' }}>Cyber Education</h1>
            <p style={{ color:'#cbd5e1', fontFamily:'Poppins,sans-serif', fontSize:18, maxWidth:520, margin:'0 auto' }}>Webinar on The Fundamentals of Cyber Kill Chain</p>
          </motion.div>
        </section>

        <section style={{ padding:'0 0 80px' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))', gap:40 }}>

            {/* FORM */}
            <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeUp} className="cyber-card">
              <h3 style={{ color:'#fff', fontFamily:'Rajdhani,sans-serif', fontSize:28, fontWeight:700, marginBottom:4 }}>Register for Webinar</h3>
              <p style={{ color:'#9ca3af', fontFamily:'Poppins,sans-serif', fontSize:13, marginBottom:24 }}>* Indicates required question</p>

              {status.message && (
                <div style={{ marginBottom:20, padding:'14px 16px', borderRadius:8, background:status.type==='success'?'rgba(34,197,94,0.15)':'rgba(239,68,68,0.15)', border:`1px solid ${status.type==='success'?'#22c55e':'#ef4444'}`, color:status.type==='success'?'#4ade80':'#f87171', fontFamily:'Poppins,sans-serif', fontSize:14, lineHeight:1.5 }}>
                  {status.message}
                </div>
              )}

              {[
                { name:'fullName',    label:'Full Name',              type:'text',  ph:'Enter your full name' },
                { name:'email',       label:'Email Address',          type:'email', ph:'Enter your email address' },
                { name:'mobile',      label:'Mobile Number',          type:'tel',   ph:'Enter your mobile number' },
                { name:'collegeName', label:'College / Company Name', type:'text',  ph:'Enter your college or company name' },
              ].map(f => (
                <div key={f.name} style={{ marginBottom:20 }}>
                  <label style={{ display:'block', color:'#d1d5db', fontFamily:'Poppins,sans-serif', fontSize:14, marginBottom:8 }}>
                    {f.label} <span style={{ color:'#00d4ff' }}>*</span>
                  </label>
                  <input type={f.type} name={f.name} value={formData[f.name]} onChange={handle} onFocus={onFocus} onBlur={onBlur} placeholder={f.ph} required autoComplete="off" style={INP} />
                </div>
              ))}

              {radioGroups.map(({ field, label, options }) => (
                <div key={field} style={{ marginBottom:20 }}>
                  <label style={{ display:'block', color:'#d1d5db', fontFamily:'Poppins,sans-serif', fontSize:14, marginBottom:10 }}>
                    {label} <span style={{ color:'#00d4ff' }}>*</span>
                  </label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
                    {options.map(opt => {
                      const active = formData[field] === opt;
                      return (
                        <label key={opt} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', padding:'8px 16px', borderRadius:8, border:`1.5px solid ${active?'#00d4ff':'rgba(0,212,255,0.3)'}`, background:active?'rgba(0,212,255,0.15)':'rgba(5,20,40,0.8)', color:active?'#00d4ff':'#d1d5db', fontFamily:'Poppins,sans-serif', fontSize:14, userSelect:'none', position:'relative', zIndex:100 }}>
                          <input type="radio" name={field} value={opt} checked={active} onChange={handle} style={{ display:'none' }} />
                          <span style={{ width:16, height:16, borderRadius:'50%', border:`2px solid ${active?'#00d4ff':'rgba(0,212,255,0.4)'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            {active && <span style={{ width:8, height:8, borderRadius:'50%', background:'#00d4ff' }} />}
                          </span>
                          {opt}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div style={{ marginBottom:24, position:'relative', zIndex:100 }}>
                <MathCaptcha
                  onVerified={setCaptchaVerified}
                  verified={captchaVerified}
                  resetKey={captchaResetKey}
                />
              </div>

              <button
                type="button"
                onClick={submit}
                disabled={loading}
                className="cyber-button"
                style={{ width:'100%', fontSize:17, padding:'14px 0', opacity:loading?0.6:1, cursor:loading?'not-allowed':'pointer', position:'relative', zIndex:100 }}
              >
                {loading ? '⏳ Registering…' : 'Register Now'}
              </button>
            </motion.div>

            {/* INFO */}
            <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeUp} style={{ display:'flex', flexDirection:'column', gap:24 }}>
              <div className="cyber-card">
                <h3 style={{ color:'#fff', fontFamily:'Rajdhani,sans-serif', fontSize:26, fontWeight:700, marginBottom:20 }}>About the Webinar</h3>
                {[
                  { icon:'🎯', title:'Topic', body:'The Fundamentals of Cyber Kill Chain — understand how real-world cyberattacks happen and how to detect, analyze, and prevent them.' },
                  { icon:'🏢', title:'Organized By', custom:<p style={{ color:'#cbd5e1', fontFamily:'Poppins,sans-serif', fontSize:14, margin:0 }}><strong style={{ color:'#fff' }}>Martian Blue Cyber Defense</strong> — a cybersecurity solutions and training provider committed to building a cyber-safe digital ecosystem.</p> },
                  { icon:'👥', title:'Who Should Attend', list:['Students pursuing cybersecurity or IT','Working professionals in tech/security','Job seekers looking to enter cybersecurity','Anyone interested in cyber defense'] },
                  { icon:'✅', title:"What You'll Learn", list:['How real-world cyberattacks are structured','The 7 stages of the Cyber Kill Chain','Detection and prevention strategies','Practical threat analysis techniques'] },
                ].map(({ icon, title, body, custom, list }) => (
                  <div key={title} style={{ marginBottom:16, padding:16, borderRadius:12, background:'rgba(0,212,255,0.07)', border:'1px solid rgba(0,212,255,0.18)' }}>
                    <h4 style={{ color:'#00b4d8', fontFamily:'Rajdhani,sans-serif', fontSize:17, fontWeight:700, marginBottom:8 }}>{icon} {title}</h4>
                    {body && <p style={{ color:'#cbd5e1', fontFamily:'Poppins,sans-serif', fontSize:14, lineHeight:1.6, margin:0 }}>{body}</p>}
                    {custom}
                    {list && <ul style={{ listStyle:'none', padding:0, margin:0 }}>{list.map(i=><li key={i} style={{ color:'#cbd5e1', fontFamily:'Poppins,sans-serif', fontSize:14, marginBottom:4 }}>• {i}</li>)}</ul>}
                  </div>
                ))}
              </div>
              <div className="cyber-card">
                <h3 style={{ color:'#fff', fontFamily:'Rajdhani,sans-serif', fontSize:22, fontWeight:700, marginBottom:12 }}>About Martian Blue Cyber Defense</h3>
                <p style={{ color:'#cbd5e1', fontFamily:'Poppins,sans-serif', fontSize:14, lineHeight:1.7, marginBottom:12 }}>With experienced security professionals and advanced tools, we help organizations strengthen their security posture while empowering students and working professionals to build successful careers in cybersecurity.</p>
                <p style={{ color:'#cbd5e1', fontFamily:'Poppins,sans-serif', fontSize:14, lineHeight:1.7 }}>Through awareness sessions, hands-on workshops, and certification programs, we bridge the gap between academic knowledge and industry requirements.</p>
              </div>
            </motion.div>

          </div>
        </section>
      </div>
    </div>
  );
};

export default CyberEducation;