import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Contact = () => {
  const canvasRef = useRef(null);

  const [formData, setFormData] = useState({ name:'', phone:'', email:'', service:'', requirement:'' });
  const [status, setStatus]   = useState({ type:'', message:'' });
  const [loading, setLoading] = useState(false);

  const handle = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true); setStatus({ type:'', message:'' });
    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      setStatus({ type:'success', message:'Thank you! Your message has been sent successfully.' });
      setFormData({ name:'', phone:'', email:'', service:'', requirement:'' });
    } catch {
      setStatus({ type:'error', message:'Something went wrong. Please try again.' });
    } finally { setLoading(false); }
  };

  /* ── Canvas animation ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const resize = () => { canvas.width=window.innerWidth; canvas.height=window.innerHeight; };
    resize(); window.addEventListener('resize', resize);

    class Node {
      constructor() { this.x=Math.random()*canvas.width; this.y=Math.random()*canvas.height; this.vx=(Math.random()-0.5)*0.8; this.vy=(Math.random()-0.5)*0.8; this.r=Math.random()*2.5+1; this.phase=Math.random()*Math.PI*2; }
      tick() { this.x+=this.vx; this.y+=this.vy; this.phase+=0.03; if(this.x<0)this.x=canvas.width; if(this.x>canvas.width)this.x=0; if(this.y<0)this.y=canvas.height; if(this.y>canvas.height)this.y=0; }
      draw() {
        const p=Math.sin(this.phase)*0.5+0.5, s=this.r+p*1.5;
        ctx.shadowBlur=8+p*4; ctx.shadowColor='#00a8c0'; ctx.beginPath(); ctx.arc(this.x,this.y,s,0,Math.PI*2);
        const g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,s);
        g.addColorStop(0,`rgba(0,210,230,${0.6+p*0.15})`); g.addColorStop(0.5,`rgba(0,180,200,${0.4+p*0.15})`); g.addColorStop(1,'rgba(0,150,180,0)');
        ctx.fillStyle=g; ctx.fill(); ctx.shadowBlur=0;
      }
    }
    class Line {
      constructor() { this.reset(); }
      reset() { this.x=Math.random()*canvas.width; this.y=Math.random()*canvas.height; this.len=Math.random()*100+50; this.angle=Math.random()*Math.PI*2; this.speed=Math.random()*2+1; this.life=0; this.max=Math.random()*60+40; }
      tick() { this.x+=Math.cos(this.angle)*this.speed; this.y+=Math.sin(this.angle)*this.speed; this.life++; if(this.life>this.max||this.x<-100||this.x>canvas.width+100||this.y<-100||this.y>canvas.height+100)this.reset(); }
      draw() {
        const op=Math.sin((this.life/this.max)*Math.PI)*0.25;
        ctx.beginPath(); ctx.moveTo(this.x,this.y); ctx.lineTo(this.x-Math.cos(this.angle)*this.len,this.y-Math.sin(this.angle)*this.len);
        const g=ctx.createLinearGradient(this.x,this.y,this.x-Math.cos(this.angle)*this.len,this.y-Math.sin(this.angle)*this.len);
        g.addColorStop(0,`rgba(0,200,220,${op})`); g.addColorStop(1,'rgba(0,200,220,0)');
        ctx.strokeStyle=g; ctx.lineWidth=1.5; ctx.shadowBlur=5; ctx.shadowColor='rgba(0,180,200,0.2)'; ctx.stroke(); ctx.shadowBlur=0;
      }
    }
    const nodes=Array.from({length:60},()=>new Node()), lines=Array.from({length:12},()=>new Line());
    const conns=()=>{ for(let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++){ const dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y,d=Math.sqrt(dx*dx+dy*dy); if(d<180){ const op=(1-d/180)*0.2; ctx.beginPath(); ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y); const g=ctx.createLinearGradient(nodes[i].x,nodes[i].y,nodes[j].x,nodes[j].y); g.addColorStop(0,`rgba(0,200,180,${op})`); g.addColorStop(1,`rgba(0,180,200,${op})`); ctx.strokeStyle=g; ctx.lineWidth=1; ctx.shadowBlur=3; ctx.shadowColor='rgba(0,180,200,0.1)'; ctx.stroke(); ctx.shadowBlur=0; }} };
    const animate=()=>{ ctx.fillStyle='rgba(10,37,64,0.12)'; ctx.fillRect(0,0,canvas.width,canvas.height); lines.forEach(l=>{l.tick();l.draw();}); nodes.forEach(n=>{n.tick();n.draw();}); conns(); raf=requestAnimationFrame(animate); };
    animate();
    return ()=>{ window.removeEventListener('resize',resize); cancelAnimationFrame(raf); };
  }, []);

  /* ── Shared input style — solid bg, high z-index, always interactive ── */
  const INP = {
    display: 'block', width: '100%', boxSizing: 'border-box',
    padding: '12px 16px', borderRadius: 8,
    background: '#061c36',                         /* solid — never transparent */
    border: '1.5px solid rgba(0,212,255,0.4)',
    color: '#ffffff',
    fontFamily: 'Poppins,sans-serif', fontSize: 15,
    outline: 'none',
    position: 'relative', zIndex: 100,            /* always on top */
  };
  const onFocus = e => { e.target.style.borderColor='#00d4ff'; e.target.style.boxShadow='0 0 0 3px rgba(0,212,255,0.2)'; };
  const onBlur  = e => { e.target.style.borderColor='rgba(0,212,255,0.4)'; e.target.style.boxShadow='none'; };

  const fadeUp = { hidden:{opacity:0,y:50}, visible:{opacity:1,y:0,transition:{duration:0.6}} };

  return (
    <div style={{ position:'relative', minHeight:'100vh', background:'linear-gradient(135deg,#0a2540 0%,#0d3a5c 35%,#115073 65%,#0d3a5c 100%)' }}>

      {/* Canvas: fixed, zIndex:-1 → permanently behind all content */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed', top:0, left:0, width:'100vw', height:'100vh',
          pointerEvents: 'none',
          zIndex: -1,
          display: 'block',
        }}
      />

      {/* Page content: isolation:isolate = own stacking context above canvas */}
      <div style={{ position:'relative', zIndex:1, isolation:'isolate', paddingTop:80 }}>

        {/* Header */}
        <section style={{ padding:'80px 0', textAlign:'center' }}>
          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8}}>
            <h1 style={{ color:'#fff', fontFamily:'Rajdhani,sans-serif', fontSize:'clamp(2.5rem,6vw,4rem)', fontWeight:700, margin:'0 0 16px' }}>Contact Us</h1>
            <p style={{ color:'#cbd5e1', fontFamily:'Poppins,sans-serif', fontSize:18 }}>Get in touch with our cybersecurity experts</p>
          </motion.div>
        </section>

        {/* Content */}
        <section style={{ padding:'0 0 80px' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:40 }}>

            {/* ═══ FORM ═══ */}
            <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeUp} className="cyber-card">
              <h3 style={{ color:'#fff', fontFamily:'Rajdhani,sans-serif', fontSize:28, fontWeight:700, marginBottom:24 }}>Message Us</h3>

              {status.message && (
                <div style={{ marginBottom:20, padding:'12px 16px', borderRadius:8, background:status.type==='success'?'rgba(34,197,94,0.15)':'rgba(239,68,68,0.15)', border:`1px solid ${status.type==='success'?'#22c55e':'#ef4444'}`, color:status.type==='success'?'#4ade80':'#f87171', fontFamily:'Poppins,sans-serif', fontSize:14 }}>
                  {status.message}
                </div>
              )}

              {[
                { name:'name',    label:'Full Name',           type:'text',  ph:'Enter Your Name',       req:true  },
                { name:'phone',   label:'Phone No.',           type:'tel',   ph:'Enter Your Phone No.',   req:true  },
                { name:'email',   label:'Email ID',            type:'email', ph:'Enter Email ID',         req:true  },
                { name:'service', label:'Service You Require', type:'text',  ph:'Service You Require',    req:false },
              ].map(f => (
                <div key={f.name} style={{ marginBottom:20 }}>
                  <label style={{ display:'block', color:'#d1d5db', fontFamily:'Poppins,sans-serif', fontSize:14, marginBottom:8 }}>
                    {f.label} {f.req && <span style={{ color:'#00d4ff' }}>*</span>}
                  </label>
                  <input type={f.type} name={f.name} value={formData[f.name]} onChange={handle} onFocus={onFocus} onBlur={onBlur} placeholder={f.ph} required={f.req} autoComplete="off" style={INP} />
                </div>
              ))}

              <div style={{ marginBottom:24 }}>
                <label style={{ display:'block', color:'#d1d5db', fontFamily:'Poppins,sans-serif', fontSize:14, marginBottom:8 }}>Your Requirement</label>
                <textarea name="requirement" value={formData.requirement} onChange={handle} onFocus={onFocus} onBlur={onBlur} placeholder="Details Of Requirement..." rows={4} style={{ ...INP, resize:'none' }} />
              </div>

              <button type="button" onClick={submit} disabled={loading} className="cyber-button"
                style={{ width:'100%', fontSize:17, padding:'14px 0', opacity:loading?0.6:1, cursor:loading?'not-allowed':'pointer', position:'relative', zIndex:100 }}>
                {loading ? 'Sending…' : 'Send Message'}
              </button>
            </motion.div>

            {/* ═══ INFO ═══ */}
            <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeUp} className="cyber-card" style={{ alignSelf:'start' }}>
              <h3 style={{ color:'#fff', fontFamily:'Rajdhani,sans-serif', fontSize:28, fontWeight:700, marginBottom:24 }}>Contact Information</h3>
              {[
                { title:'Email',        body:'admin@martianbluecyberdefense.in' },
                { title:'Office Hours', body:'Monday – Friday: 9:00 AM – 6:00 PM\nSaturday: 10:00 AM – 4:00 PM' },
                { title:'Follow Us',    body:'Connect with us on social media for updates and insights' },
              ].map(({ title, body }) => (
                <div key={title} style={{ marginBottom:24 }}>
                  <h4 style={{ color:'#00b4d8', fontFamily:'Rajdhani,sans-serif', fontSize:20, fontWeight:700, marginBottom:8 }}>{title}</h4>
                  {body.split('\n').map((line,i) => <p key={i} style={{ color:'#cbd5e1', fontFamily:'Poppins,sans-serif', fontSize:15, margin:'0 0 4px' }}>{line}</p>)}
                </div>
              ))}
            </motion.div>

          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;