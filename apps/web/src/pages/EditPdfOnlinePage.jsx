import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MousePointer2, Type, Square, Highlighter, Pencil,
  Image as ImageIcon, PenTool, Link2, MessageSquare, Clock,
  Download, ZoomIn, ZoomOut, Undo2, Redo2, ChevronLeft,
  ChevronRight, Trash2, X, Upload, FileText,
  ArrowUp, ArrowDown, Bold, Italic, Underline,
  Circle, Minus, Tag, RotateCcw, RotateCw,
  Settings2, Search, AlignLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// ── Custom SVG icons not in current lucide version ──────────────────────────
const StrikethroughIcon = ({size=16}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/>
    <line x1="4" y1="12" x2="20" y2="12"/>
  </svg>
);
const EraserIcon = ({size=16}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/>
    <path d="M22 21H7"/><path d="m5 11 9 9"/>
  </svg>
);

// ── Constants ────────────────────────────────────────────────────────────────
const TOOLS = {
  SELECT:'select', TEXT:'text', WHITEOUT:'whiteout',
  STRIKETHROUGH:'strikethrough', HIGHLIGHT:'highlight',
  DRAW:'draw', ERASER:'eraser',
  RECT:'rect', CIRCLE:'circle', LINE:'line', ARROW:'arrow',
  IMAGE:'image', SIGNATURE:'signature', LINK:'link',
  COMMENT:'comment', DATE_STAMP:'date_stamp', STAMP:'stamp',
};

const STAMP_TYPES = [
  { key:'APPROVED',     label:'APPROVED',     color:'#16a34a', bg:'rgba(22,163,74,0.08)' },
  { key:'DRAFT',        label:'DRAFT',        color:'#d97706', bg:'rgba(217,119,6,0.08)' },
  { key:'PAID',         label:'PAID',         color:'#2563eb', bg:'rgba(37,99,235,0.08)' },
  { key:'CONFIDENTIAL', label:'CONFIDENTIAL', color:'#dc2626', bg:'rgba(220,38,38,0.08)' },
  { key:'RECEIVED',     label:'RECEIVED',     color:'#7c3aed', bg:'rgba(124,58,237,0.08)' },
];

const HIGHLIGHT_COLORS = ['#fef08a','#bbf7d0','#bfdbfe','#fecaca','#e9d5ff','#fed7aa'];
const DRAW_COLORS = ['#000000','#dc2626','#2563eb','#16a34a','#d97706','#7c3aed','#ffffff'];
const FONT_FAMILIES = ['Arial','Georgia','Times New Roman','Courier New','Helvetica','Verdana'];
const FONT_SIZES = [8,9,10,11,12,14,16,18,20,24,28,32,36,48,72];

const TOOL_CATEGORIES = [
  { id:'edit', label:'Edit', items:[
    { tool:TOOLS.SELECT,       label:'Select',        Icon:MousePointer2 },
    { tool:TOOLS.TEXT,         label:'Add Text',      Icon:Type },
    { tool:TOOLS.WHITEOUT,     label:'Whiteout',      Icon:Square },
  ]},
  { id:'annotate', label:'Annotate', items:[
    { tool:TOOLS.HIGHLIGHT,    label:'Highlight',     Icon:Highlighter },
    { tool:TOOLS.STRIKETHROUGH,label:'Strikethrough', IconEl:StrikethroughIcon },
    { tool:TOOLS.DRAW,         label:'Draw',          Icon:Pencil },
    { tool:TOOLS.ERASER,       label:'Eraser',        IconEl:EraserIcon },
    { tool:TOOLS.RECT,         label:'Rectangle',     Icon:Square },
    { tool:TOOLS.CIRCLE,       label:'Circle',        Icon:Circle },
    { tool:TOOLS.LINE,         label:'Line',          Icon:Minus },
    { tool:TOOLS.ARROW,        label:'Arrow',         Icon:ChevronRight },
    { tool:TOOLS.LINK,         label:'Link',          Icon:Link2 },
    { tool:TOOLS.COMMENT,      label:'Comment',       Icon:MessageSquare },
  ]},
  { id:'stamp', label:'Stamp', items:[
    { tool:TOOLS.DATE_STAMP,   label:'Date & Time',   Icon:Clock },
    { tool:TOOLS.STAMP,        label:'Stamps',        Icon:Tag },
  ]},
  { id:'insert', label:'Insert', items:[
    { tool:TOOLS.IMAGE,        label:'Image',         Icon:ImageIcon, special:'image' },
    { tool:TOOLS.SIGNATURE,    label:'Signature',     Icon:PenTool,   special:'signature' },
  ]},
];

const MAX_WARN_BYTES = 50  * 1024 * 1024;
const MAX_HARD_BYTES = 150 * 1024 * 1024;
const PAGE_GAP = 20;

// ── Utilities ────────────────────────────────────────────────────────────────
let _uid = 0;
const genId = () => `a${Date.now()}_${_uid++}`;
const hex2rgb01 = hex => { const n=parseInt(hex.replace('#',''),16); return {r:((n>>16)&255)/255,g:((n>>8)&255)/255,b:(n&255)/255}; };
const dataUrlToBytes = url => { const b64=url.split(',')[1],raw=atob(b64),arr=new Uint8Array(raw.length); for(let i=0;i<raw.length;i++) arr[i]=raw.charCodeAt(i); return arr; };
const fmtDate = () => new Date().toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});

// ── Signature Modal ──────────────────────────────────────────────────────────
const SignatureModal = ({ onClose, onConfirm }) => {
  const [mode, setMode] = useState('draw');
  const [typed, setTyped] = useState('');
  const [penColor, setPenColor] = useState('#1e293b');
  const [uploadUrl, setUploadUrl] = useState(null);
  const cvs = useRef(null);
  const drawing = useRef(false);
  const last = useRef(null);
  const clear = () => { const c=cvs.current; if(c) c.getContext('2d').clearRect(0,0,c.width,c.height); };
  const evPos = (e) => { const r=cvs.current.getBoundingClientRect(),t=e.touches?.[0]; return { x:((t?t.clientX:e.clientX)-r.left)*(cvs.current.width/r.width), y:((t?t.clientY:e.clientY)-r.top)*(cvs.current.height/r.height) }; };
  const onPD = e => { drawing.current=true; last.current=evPos(e); };
  const onPM = e => { if(!drawing.current) return; const {x,y}=evPos(e),ctx=cvs.current.getContext('2d'); ctx.beginPath(); ctx.moveTo(last.current.x,last.current.y); ctx.lineTo(x,y); ctx.strokeStyle=penColor; ctx.lineWidth=2.5; ctx.lineCap='round'; ctx.stroke(); last.current={x,y}; };
  const onPU = () => { drawing.current=false; };
  const confirm = () => {
    if(mode==='draw') { onConfirm(cvs.current.toDataURL('image/png')); return; }
    if(mode==='type') { if(!typed.trim()){toast.error('Type your name first');return;} const c=document.createElement('canvas'); c.width=400;c.height=120; const ctx=c.getContext('2d'); ctx.font=`italic 52px Georgia,serif`; ctx.fillStyle=penColor; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(typed,200,60); onConfirm(c.toDataURL('image/png')); return; }
    if(mode==='upload') { if(!uploadUrl){toast.error('Upload an image first');return;} onConfirm(uploadUrl); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-bold">Create Signature</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X size={16}/></button>
        </div>
        <div className="flex border-b border-border">
          {[['draw','✏️ Draw'],['type','⌨️ Type'],['upload','🖼️ Upload']].map(([m,l])=>(
            <button key={m} onClick={()=>setMode(m)} className={`flex-1 py-2.5 text-sm font-medium transition-colors ${mode===m?'text-primary border-b-2 border-primary':'text-muted-foreground'}`}>{l}</button>
          ))}
        </div>
        <div className="p-5 min-h-[180px]">
          {mode==='draw' && (<div>
            <div className="flex items-center gap-2 mb-2">
              {['#1e293b','#1e40af','#dc2626'].map(c=>(<button key={c} onClick={()=>setPenColor(c)} style={{width:18,height:18,background:c,borderRadius:'50%',border:penColor===c?'3px solid #3b82f6':'2px solid transparent'}}/>))}
              <button onClick={clear} className="ml-auto text-xs text-blue-500 hover:underline flex items-center gap-1"><RotateCcw size={10}/>Clear</button>
            </div>
            <canvas ref={cvs} width={480} height={160} className="w-full border-2 border-dashed border-border rounded-xl bg-slate-50 dark:bg-slate-800 cursor-crosshair touch-none"
              onMouseDown={onPD} onMouseMove={onPM} onMouseUp={onPU} onMouseLeave={onPU}
              onTouchStart={onPD} onTouchMove={onPM} onTouchEnd={onPU}/>
          </div>)}
          {mode==='type' && (<div className="space-y-3">
            <Input placeholder="Type your full name…" value={typed} onChange={e=>setTyped(e.target.value)}/>
            {typed && <div className="p-4 border border-border rounded-xl text-center bg-slate-50" style={{fontFamily:'Georgia,serif',fontStyle:'italic',fontSize:'1.8rem',color:penColor}}>{typed}</div>}
          </div>)}
          {mode==='upload' && (<label className="cursor-pointer block">
            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              {uploadUrl ? <img src={uploadUrl} alt="sig" className="max-h-24 mx-auto object-contain"/> : <><Upload size={24} className="mx-auto mb-2 text-muted-foreground"/><p className="text-sm text-muted-foreground">Click to upload PNG/JPG</p></>}
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=ev=>setUploadUrl(ev.target.result);r.readAsDataURL(f);}}/>
          </label>)}
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={confirm} className="flex-1">Place Signature</Button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Link / Comment Dialogs ───────────────────────────────────────────────────
const LinkDialog = ({ onClose, onConfirm }) => {
  const [url, setUrl] = useState('https://');
  const [text, setText] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border"><h2 className="text-base font-bold">Add Link</h2><button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100"><X size={16}/></button></div>
        <div className="p-5 space-y-3">
          <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">URL</label><Input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://example.com"/></div>
          <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Display Text (optional)</label><Input value={text} onChange={e=>setText(e.target.value)} placeholder="Click here"/></div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={()=>onConfirm(url,text||url)} className="flex-1">Add Link</Button>
        </div>
      </motion.div>
    </div>
  );
};

const CommentDialog = ({ onClose, onConfirm }) => {
  const [text, setText] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border"><h2 className="text-base font-bold">Add Comment</h2><button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100"><X size={16}/></button></div>
        <div className="p-5"><textarea autoFocus value={text} onChange={e=>setText(e.target.value)} placeholder="Type your comment…" className="w-full h-24 resize-none border border-border rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-primary bg-transparent"/></div>
        <div className="flex gap-3 px-5 pb-5">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={()=>{if(!text.trim()){toast.error('Enter a comment');return;}onConfirm(text);}} className="flex-1">Add</Button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Floating Format Bar (above selected text elements) ───────────────────────
const FloatingFormatBar = ({ ann, zoom, onUpdate, onDelete }) => {
  if (!ann || ann.type !== 'text') return null;
  const u = patch => onUpdate(ann.id, ann.page, patch);
  const barY = Math.max(2, ann.yPt * zoom - 44);
  return (
    <div style={{position:'absolute',left:ann.xPt*zoom,top:barY,zIndex:30,whiteSpace:'nowrap'}} onPointerDown={e=>e.stopPropagation()}>
      <div className="flex items-center gap-0.5 bg-slate-900 border border-slate-600 rounded-lg shadow-2xl px-1.5 py-1">
        <select value={ann.fontFamily||'Arial'} onChange={e=>u({fontFamily:e.target.value})}
          className="bg-transparent text-white border-none outline-none cursor-pointer text-[11px] max-w-[80px]">
          {FONT_FAMILIES.map(f=><option key={f} value={f} style={{color:'#000'}}>{f.split(' ')[0]}</option>)}
        </select>
        <div className="w-px h-4 bg-slate-600 mx-0.5"/>
        <select value={ann.fontSize||14} onChange={e=>u({fontSize:+e.target.value})}
          className="bg-transparent text-white border-none outline-none cursor-pointer text-[11px] w-10">
          {FONT_SIZES.map(s=><option key={s} value={s} style={{color:'#000'}}>{s}</option>)}
        </select>
        <div className="w-px h-4 bg-slate-600 mx-0.5"/>
        {[['bold','B','font-bold'],['italic','I','italic'],['underline','U','underline']].map(([k,lbl,cls])=>(
          <button key={k} onClick={()=>u({[k]:!ann[k]})}
            className={`w-6 h-6 rounded text-xs flex items-center justify-center transition-colors ${ann[k]?'bg-primary text-white':'text-slate-300 hover:bg-slate-700'}`}>
            <span className={cls}>{lbl}</span>
          </button>
        ))}
        <div className="w-px h-4 bg-slate-600 mx-0.5"/>
        <div className="relative" title="Text Color">
          <input type="color" value={ann.color||'#000000'} onChange={e=>u({color:e.target.value})}
            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"/>
          <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold pointer-events-none" style={{color:ann.color||'#000',textShadow:'0 0 2px rgba(255,255,255,0.8)'}}>A</div>
        </div>
        <div className="w-px h-4 bg-slate-600 mx-0.5"/>
        <button onClick={()=>onDelete(ann.id,ann.page)} className="w-6 h-6 rounded text-red-400 hover:bg-red-900/40 flex items-center justify-center"><Trash2 size={11}/></button>
      </div>
    </div>
  );
};

// ── Annotation Item ──────────────────────────────────────────────────────────
const AnnItem = ({ ann, zoom, isSelected, onSelect, onUpdate, onDelete, onBringFwd, onSendBwd }) => {
  const dx=ann.xPt*zoom, dy=ann.yPt*zoom, dw=ann.wPt*zoom, dh=ann.hPt*zoom;
  const dragging = useRef(false);
  const resDir = useRef('');
  const startRef = useRef({});
  const [editing, setEditing] = useState(false);

  const startDrag = (e) => {
    dragging.current = true;
    startRef.current = { mx:e.clientX, my:e.clientY, ox:ann.xPt, oy:ann.yPt };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const startResize = (e, dir) => {
    e.stopPropagation(); resDir.current = dir;
    startRef.current = { mx:e.clientX, my:e.clientY, ow:ann.wPt, oh:ann.hPt, ox:ann.xPt, oy:ann.yPt };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPM = (e) => {
    if (dragging.current) {
      onUpdate(ann.id,ann.page,{ xPt:Math.max(0,startRef.current.ox+(e.clientX-startRef.current.mx)/zoom), yPt:Math.max(0,startRef.current.oy+(e.clientY-startRef.current.my)/zoom) });
    } else if (resDir.current) {
      const {mx,my,ow,oh,ox,oy}=startRef.current, ddx=(e.clientX-mx)/zoom, ddy=(e.clientY-my)/zoom, d=resDir.current, p={};
      if(d.includes('e')) p.wPt=Math.max(20/zoom,ow+ddx);
      if(d.includes('s')) p.hPt=Math.max(10/zoom,oh+ddy);
      if(d.includes('w')) { p.xPt=Math.max(0,ox+ddx); p.wPt=Math.max(20/zoom,ow-ddx); }
      if(d.includes('n')) { p.yPt=Math.max(0,oy+ddy); p.hPt=Math.max(10/zoom,oh-ddy); }
      onUpdate(ann.id,ann.page,p);
    }
  };
  const onPU = () => { dragging.current=false; resDir.current=''; };

  const base = { position:'absolute', left:dx, top:dy, width:dw, height:dh, boxSizing:'border-box', cursor:isSelected?(editing?'text':'move'):'pointer' };

  const onItemPD = (e) => {
    e.stopPropagation();
    if (!isSelected) { onSelect(ann.id); return; }
    if (ann.type === 'text') { setEditing(true); return; }
    startDrag(e);
  };

  const renderContent = () => {
    const {type}=ann;
    if (type==='whiteout') return <div style={{...base,background:'#fff',border:isSelected?'2px solid #3b82f6':'1px solid #cbd5e1',borderRadius:2}} onPointerDown={onItemPD} onPointerMove={onPM} onPointerUp={onPU}/>;
    if (type==='highlight') return <div style={{...base,background:ann.color||'#fef08a',opacity:ann.opacity??0.4,border:isSelected?'2px solid #3b82f6':'none',borderRadius:2}} onPointerDown={onItemPD} onPointerMove={onPM} onPointerUp={onPU}/>;
    if (type==='strikethrough') return (
      <div style={{...base,background:'transparent',border:isSelected?'1px dashed #3b82f6':'none'}} onPointerDown={onItemPD} onPointerMove={onPM} onPointerUp={onPU}>
        <div style={{position:'absolute',top:'50%',left:0,width:'100%',height:Math.max(1.5,(ann.strokeWidth||2)*zoom),background:ann.color||'#dc2626',transform:'translateY(-50%)',pointerEvents:'none'}}/>
      </div>
    );
    if (type==='text') return (
      <div style={{...base,border:isSelected?'2px solid #3b82f6':'1px dashed rgba(148,163,184,0.5)',background:ann.bgColor||'transparent',borderRadius:2,padding:'2px 4px',overflow:'hidden'}}
        onPointerDown={(e)=>{e.stopPropagation();if(!isSelected){onSelect(ann.id);return;}startDrag(e);}}
        onPointerMove={onPM} onPointerUp={onPU}
        onClick={e=>{if(isSelected){e.stopPropagation();setEditing(true);}}}>
        {editing
          ? <textarea autoFocus style={{width:'100%',height:'100%',border:'none',outline:'none',resize:'none',background:'transparent',fontSize:(ann.fontSize||14)*zoom,color:ann.color||'#000',fontFamily:ann.fontFamily||'Arial',fontWeight:ann.bold?'bold':'normal',fontStyle:ann.italic?'italic':'normal',textDecoration:ann.underline?'underline':'none',lineHeight:1.4,padding:0}}
              value={ann.text||''} onChange={e=>onUpdate(ann.id,ann.page,{text:e.target.value})} onBlur={()=>setEditing(false)} onClick={e=>e.stopPropagation()}/>
          : <span style={{fontSize:(ann.fontSize||14)*zoom,color:ann.color||'#000',fontFamily:ann.fontFamily||'Arial',fontWeight:ann.bold?'bold':'normal',fontStyle:ann.italic?'italic':'normal',textDecoration:ann.underline?'underline':'none',whiteSpace:'pre-wrap',wordBreak:'break-word',pointerEvents:'none',display:'block',lineHeight:1.4}}>
              {ann.text||<span style={{opacity:0.35,fontStyle:'italic'}}>Click to type…</span>}
            </span>
        }
      </div>
    );
    if (type==='image'||type==='signature') return <div style={{...base,border:isSelected?'2px solid #3b82f6':'1px solid rgba(0,0,0,0.08)'}} onPointerDown={onItemPD} onPointerMove={onPM} onPointerUp={onPU}><img src={ann.dataUrl} alt="" style={{width:'100%',height:'100%',objectFit:'contain',pointerEvents:'none',display:'block'}} draggable={false}/></div>;
    if (type==='draw') return <div style={{...base,border:isSelected?'2px dashed #3b82f6':'none',background:'transparent'}} onPointerDown={onItemPD} onPointerMove={onPM} onPointerUp={onPU}><img src={ann.dataUrl} alt="" style={{width:'100%',height:'100%',objectFit:'fill',pointerEvents:'none',display:'block'}} draggable={false}/></div>;
    if (type==='rect') return <div style={{...base,border:`${(ann.strokeWidth||2)*zoom}px solid ${ann.stroke||'#000'}`,background:ann.fill||'transparent',borderRadius:2,opacity:ann.opacity??1}} onPointerDown={onItemPD} onPointerMove={onPM} onPointerUp={onPU}/>;
    if (type==='circle') return <div style={{...base,border:`${(ann.strokeWidth||2)*zoom}px solid ${ann.stroke||'#000'}`,background:ann.fill||'transparent',borderRadius:'50%',opacity:ann.opacity??1}} onPointerDown={onItemPD} onPointerMove={onPM} onPointerUp={onPU}/>;
    if (type==='line'||type==='arrow') return (
      <div style={{...base,overflow:'visible',background:'transparent',border:'none'}} onPointerDown={onItemPD} onPointerMove={onPM} onPointerUp={onPU}>
        <svg width={Math.max(dw,4)} height={Math.max(Math.abs(dh),4)} style={{position:'absolute',top:0,left:0,overflow:'visible'}}>
          <defs>{type==='arrow'&&<marker id={`arr-${ann.id}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill={ann.stroke||'#000'}/></marker>}</defs>
          <line x1="0" y1="0" x2={dw} y2={dh} stroke={ann.stroke||'#000'} strokeWidth={(ann.strokeWidth||2)*zoom} markerEnd={type==='arrow'?`url(#arr-${ann.id})`:'none'}/>
        </svg>
      </div>
    );
    if (type==='link') return <div style={{...base,border:isSelected?'2px solid #3b82f6':'1px dashed #60a5fa',background:'rgba(96,165,250,0.05)',borderRadius:2,padding:'2px 4px'}} onPointerDown={onItemPD} onPointerMove={onPM} onPointerUp={onPU}><span style={{fontSize:(ann.fontSize||13)*zoom,color:'#2563eb',textDecoration:'underline',fontFamily:'Arial',pointerEvents:'none',display:'block',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{ann.displayText||ann.url||'Link'}</span></div>;
    if (type==='comment') return (
      <div style={{position:'absolute',left:dx,top:dy,width:28*zoom,height:28*zoom,zIndex:5}} onPointerDown={onItemPD} onPointerMove={onPM} onPointerUp={onPU}>
        <div style={{width:'100%',height:'100%',background:ann.color||'#facc15',borderRadius:'50% 50% 50% 0',transform:'rotate(-45deg)',border:isSelected?'2px solid #3b82f6':'1.5px solid rgba(0,0,0,0.2)'}}/>
        {isSelected&&<div style={{position:'absolute',top:32*zoom,left:0,zIndex:20,background:'#fffde7',border:'1px solid #e9c46a',borderRadius:8,padding:'8px 10px',minWidth:180,maxWidth:260,boxShadow:'0 4px 16px rgba(0,0,0,0.12)',pointerEvents:'none'}}><p style={{fontSize:10,color:'#888',marginBottom:3,fontWeight:600}}>Comment</p><p style={{fontSize:12,color:'#333',lineHeight:1.5}}>{ann.text||''}</p></div>}
      </div>
    );
    if (type==='stamp') { const si=STAMP_TYPES.find(s=>s.key===ann.stampType)||STAMP_TYPES[0]; return <div style={{...base,border:`2.5px solid ${si.color}`,background:si.bg,borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',outline:isSelected?'2px solid #3b82f6':'none',outlineOffset:3}} onPointerDown={onItemPD} onPointerMove={onPM} onPointerUp={onPU}><span style={{fontSize:Math.max(8,(ann.fontSize||14)*zoom),fontWeight:700,color:si.color,letterSpacing:2,textTransform:'uppercase',fontFamily:'Arial',pointerEvents:'none'}}>{si.label}</span></div>; }
    if (type==='date_stamp') return <div style={{...base,background:'transparent',border:isSelected?'1px dashed #3b82f6':'none',padding:'1px 3px'}} onPointerDown={onItemPD} onPointerMove={onPM} onPointerUp={onPU}><span style={{fontSize:(ann.fontSize||11)*zoom,color:ann.color||'#000',fontFamily:'monospace',pointerEvents:'none',whiteSpace:'nowrap'}}>{ann.text}</span></div>;
    return null;
  };

  // 4-corner resize handles
  const handles = isSelected && ann.type !== 'comment' && ann.type !== 'line' && ann.type !== 'arrow'
    ? [['nw',dx-5,dy-5],['ne',dx+dw-5,dy-5],['sw',dx-5,dy+dh-5],['se',dx+dw-5,dy+dh-5]]
    : [];

  return (
    <>
      {renderContent()}
      {handles.map(([dir,l,t])=>(
        <div key={dir} style={{position:'absolute',left:l,top:t,width:10,height:10,background:'#fff',border:'2px solid #3b82f6',borderRadius:2,cursor:`${dir}-resize`,zIndex:20,touchAction:'none'}}
          onPointerDown={e=>startResize(e,dir)} onPointerMove={onPM} onPointerUp={onPU}/>
      ))}
      {isSelected && ann.type !== 'text' && (
        <div style={{position:'absolute',left:dx,top:Math.max(0,dy-30),display:'flex',gap:3,zIndex:25,background:'#1e293b',borderRadius:6,padding:'2px 4px',boxShadow:'0 2px 8px rgba(0,0,0,0.3)'}}>
          <button onClick={e=>{e.stopPropagation();onBringFwd(ann.id,ann.page);}} style={{color:'#94a3b8',background:'none',border:'none',cursor:'pointer',padding:'2px',display:'flex'}}><ArrowUp size={11}/></button>
          <button onClick={e=>{e.stopPropagation();onSendBwd(ann.id,ann.page);}} style={{color:'#94a3b8',background:'none',border:'none',cursor:'pointer',padding:'2px',display:'flex'}}><ArrowDown size={11}/></button>
          <button onClick={e=>{e.stopPropagation();onDelete(ann.id,ann.page);}} style={{color:'#f87171',background:'none',border:'none',cursor:'pointer',padding:'2px',display:'flex'}}><Trash2 size={11}/></button>
        </div>
      )}
    </>
  );
};

// ── Editable PDF Text Item ───────────────────────────────────────────────────
// Renders an invisible overlay over real PDF text; click to edit in-place
const EditableTextItem = ({ item, pageIdx, existingEdit, onCommit, zoom }) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(existingEdit ?? item.str);
  const [hovered, setHovered] = useState(false);
  const inputRef = useRef(null);

  // sync if edit cleared externally
  useEffect(() => { if (!existingEdit) setVal(item.str); }, [existingEdit, item.str]);

  const open = (e) => {
    e.stopPropagation();
    setEditing(true);
    setTimeout(() => { inputRef.current?.focus(); inputRef.current?.select(); }, 30);
  };

  const commit = () => {
    setEditing(false);
    onCommit(pageIdx, item, val);
  };

  const fontSize = Math.max(8, item.fontHeight);
  const changed = val !== item.str;

  return (
    <div
      style={{
        position: 'absolute',
        left: item.x,
        top: item.y,
        width: Math.max(item.width + 4, 20),
        height: Math.max(item.fontHeight * 1.35, 12),
        zIndex: editing ? 18 : 8,
        cursor: 'text',
        borderRadius: 2,
        background: editing ? 'rgba(255,255,255,0.95)'
          : changed ? '#ffffff' // Solid white to act as whiteout over original PDF text
          : hovered ? 'rgba(59,130,246,0.12)'
          : 'transparent',
        border: editing ? '2px solid #3b82f6'
          : hovered ? '1px solid rgba(59,130,246,0.5)'
          : changed ? '1px dashed #ca8a04' // Subtle border to indicate it's been edited
          : 'none',
        boxSizing: 'border-box',
        transition: 'background 0.1s, border 0.1s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={open}
    >
      {editing ? (
        <input
          ref={inputRef}
          value={val}
          onChange={e => setVal(e.target.value)}
          onBlur={commit}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); commit(); } if (e.key === 'Escape') { setVal(existingEdit ?? item.str); setEditing(false); } }}
          style={{
            position: 'absolute', inset: 0, width: '100%', minWidth: 40,
            fontSize, fontFamily: 'Arial, sans-serif',
            color: '#000', background: 'transparent',
            border: 'none', outline: 'none', padding: '0 2px',
            lineHeight: 1, whiteSpace: 'nowrap',
          }}
          onClick={e => e.stopPropagation()}
        />
      ) : (
        <>
          {changed && (
            <div style={{
              position: 'absolute', inset: 0, width: '100%',
              fontSize, fontFamily: 'Arial, sans-serif',
              color: '#000', padding: '0 2px',
              lineHeight: 1, whiteSpace: 'nowrap',
              overflow: 'hidden', pointerEvents: 'none'
            }}>
              {val}
            </div>
          )}
          {hovered && (
            <div style={{ position: 'absolute', top: -20, left: 0, background: '#1e293b', color: '#94a3b8', fontSize: 9, borderRadius: 3, padding: '1px 5px', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 30 }}>
              {changed ? '✏️ Edited — click to change' : 'Click to edit text'}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ── Page Canvas ──────────────────────────────────────────────────────────────
const CURSOR_MAP = { [TOOLS.TEXT]:'text', [TOOLS.DRAW]:'crosshair', [TOOLS.ERASER]:'cell', [TOOLS.HIGHLIGHT]:'crosshair', [TOOLS.STRIKETHROUGH]:'crosshair', [TOOLS.SELECT]:'default' };

const PageCanvas = React.memo(({
  pageIdx, pdfJsDoc, zoom, annotations, activeTool,
  selectedId, onSelect, onAnnUpdate, onAnnDelete, onBringFwd, onSendBwd,
  onPageClick, onDrawPath, onErase, drawColor, drawWidth,
  isVisible, onDimsLoaded, dims, activeStampType, onDeselect,
  textEdits, onTextEdit,
}) => {
  const canvasRef = useRef(null);
  const drawCvsRef = useRef(null);
  const taskRef = useRef(null);
  const drawing = useRef(false);
  const path = useRef([]);
  const [rendered, setRendered] = useState(false);
  const [pdfTextItems, setPdfTextItems] = useState([]);

  useEffect(() => {
    if (!isVisible || !pdfJsDoc || !canvasRef.current) return;
    let cancelled = false;
    const run = async () => {
      try {
        if (taskRef.current) taskRef.current.cancel();
        const page = await pdfJsDoc.getPage(pageIdx+1);
        const dpr = Math.min(window.devicePixelRatio,2);
        const vp = page.getViewport({scale:zoom*dpr}), css = page.getViewport({scale:zoom});
        const c = canvasRef.current; if (!c||cancelled) return;
        c.width=vp.width; c.height=vp.height; c.style.width=`${css.width}px`; c.style.height=`${css.height}px`;
        if (!dims) onDimsLoaded(pageIdx,{w:css.width,h:css.height,pdfW:css.width/zoom,pdfH:css.height/zoom});
        const task = page.render({canvasContext:c.getContext('2d'),viewport:vp});
        taskRef.current = task; await task.promise;
        if (cancelled) return;
        setRendered(true);
        // ── Extract PDF text items for direct editing ──
        try {
          const cssVp = page.getViewport({ scale: zoom }); // CSS-scale viewport for position math
          const content = await page.getTextContent({ includeMarkedContent: false });
          const items = content.items
            .filter(it => it.str && it.str.trim())
            .map((it, idx) => {
              // Apply viewport transform to get CSS pixel coords
              const tx = pdfjsLib.Util.transform(cssVp.transform, it.transform);
              const fontHeight = Math.abs(tx[3]);  // height in CSS px
              return {
                id: `${pageIdx}_${idx}`,
                str: it.str,
                x: tx[4],
                y: tx[5] - fontHeight,             // baseline → top-left
                width: Math.max((it.width || 0) * zoom, 8),
                fontHeight: Math.max(fontHeight, 6),
                // Store PDF-space coords for export (divide by zoom)
                xPdf: tx[4] / zoom,
                yPdf: (tx[5] - fontHeight) / zoom,
                wPdf: Math.max((it.width || 0), 4),
                hPdf: Math.max(fontHeight / zoom, 4),
                fontSizePdf: Math.max(fontHeight / zoom, 4),
              };
            });
          if (!cancelled) setPdfTextItems(items);
        } catch(te) { console.warn('Text extract failed:', te); }
      } catch(e) { if(e.name!=='RenderingCancelledException') console.error(e); }
    };
    run();
    return () => { cancelled=true; taskRef.current?.cancel(); };
  }, [isVisible, pdfJsDoc, pageIdx, zoom]);

  const W = dims?.w??595*zoom, H = dims?.h??842*zoom;
  const isDrawLike = activeTool===TOOLS.DRAW||activeTool===TOOLS.ERASER;

  const evPt = (e) => {
    const r=e.currentTarget.getBoundingClientRect(), t=e.touches?.[0];
    return { x:((t?t.clientX:e.clientX)-r.left), y:((t?t.clientY:e.clientY)-r.top) };
  };

  const onPD = (e) => {
    e.preventDefault();
    if (activeTool===TOOLS.SELECT) { onDeselect(); return; }
    if (activeTool===TOOLS.DRAW) {
      drawing.current=true; const {x,y}=evPt(e); path.current=[{x,y}];
      e.currentTarget.setPointerCapture?.(e.pointerId); return;
    }
    if (activeTool===TOOLS.ERASER) {
      drawing.current=true; const {x,y}=evPt(e); onErase(pageIdx,x/zoom,y/zoom);
      e.currentTarget.setPointerCapture?.(e.pointerId); return;
    }
    const {x,y}=evPt(e);
    onPageClick(pageIdx,x/zoom,y/zoom,activeTool,activeStampType);
  };

  const onPM = (e) => {
    if (!drawing.current) return;
    const {x,y}=evPt(e);
    if (activeTool===TOOLS.ERASER) { onErase(pageIdx,x/zoom,y/zoom); return; }
    if (activeTool===TOOLS.DRAW) {
      path.current.push({x,y});
      const ctx=drawCvsRef.current?.getContext('2d'); if(!ctx||path.current.length<2) return;
      const pts=path.current; ctx.beginPath(); ctx.moveTo(pts[pts.length-2].x,pts[pts.length-2].y);
      ctx.lineTo(x,y); ctx.strokeStyle=drawColor; ctx.lineWidth=drawWidth; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.stroke();
    }
  };

  const onPU = () => {
    if (!drawing.current) return; drawing.current=false;
    if (activeTool===TOOLS.DRAW && path.current.length>1) {
      const pts=path.current, xs=pts.map(p=>p.x), ys=pts.map(p=>p.y);
      const x0=Math.min(...xs),y0=Math.min(...ys),x1=Math.max(...xs),y1=Math.max(...ys);
      const pad=drawWidth+4, bx=x0-pad, by=y0-pad, bw=x1-x0+pad*2, bh=y1-y0+pad*2;
      const tmp=document.createElement('canvas'); tmp.width=Math.max(1,bw); tmp.height=Math.max(1,bh);
      tmp.getContext('2d').drawImage(drawCvsRef.current,bx,by,bw,bh,0,0,bw,bh);
      const dataUrl=tmp.toDataURL('image/png');
      drawCvsRef.current?.getContext('2d').clearRect(0,0,W,H);
      onDrawPath(pageIdx,dataUrl,bx/zoom,by/zoom,bw/zoom,bh/zoom);
    }
    path.current=[];
  };

  const pageAnns = annotations[pageIdx]||[];
  const selAnn = selectedId ? pageAnns.find(a=>a.id===selectedId) : null;
  const cursor = CURSOR_MAP[activeTool] || 'crosshair';

  return (
    <div style={{position:'relative'}}>
      <div className="relative select-none"
        style={{width:W,height:H,background:'#fff',boxShadow:'0 4px 24px rgba(0,0,0,0.18)',borderRadius:2}}
        onPointerDown={isDrawLike?onPD:undefined} onPointerMove={isDrawLike?onPM:undefined} onPointerUp={isDrawLike?onPU:undefined}
        onTouchStart={isDrawLike?onPD:undefined} onTouchMove={isDrawLike?onPM:undefined} onTouchEnd={isDrawLike?onPU:undefined}>
        <canvas ref={canvasRef} style={{position:'absolute',top:0,left:0}}/>
        {isDrawLike && <canvas ref={drawCvsRef} width={W} height={H} style={{position:'absolute',top:0,left:0,pointerEvents:'none',width:W,height:H}}/>}
        <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',pointerEvents:isDrawLike?'none':'auto',cursor}}
          onPointerDown={!isDrawLike?onPD:undefined}>
          {/* Editable PDF text overlay — always shown, click to edit existing text */}
          {pdfTextItems.map(item => (
            <EditableTextItem
              key={item.id}
              item={item}
              pageIdx={pageIdx}
              existingEdit={textEdits?.[item.id]}
              onCommit={onTextEdit}
              zoom={zoom}
            />
          ))}
          {pageAnns.map(ann=>(
            <AnnItem key={ann.id} ann={ann} zoom={zoom} isSelected={selectedId===ann.id}
              onSelect={onSelect} onUpdate={onAnnUpdate} onDelete={onAnnDelete} onBringFwd={onBringFwd} onSendBwd={onSendBwd}/>
          ))}
          {selAnn && <FloatingFormatBar ann={selAnn} zoom={zoom} onUpdate={onAnnUpdate} onDelete={onAnnDelete}/>}
        </div>
        {!rendered&&isVisible&&<div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)',backgroundSize:'200% 100%',animation:'shimmer 1.5s infinite'}}/>}
      </div>
      <div className="text-center text-xs text-slate-500 mt-1.5">Page {pageIdx+1}</div>
    </div>
  );
});

// ── Thumbnail Panel (real rendered previews) ─────────────────────────────────
const ThumbnailPanel = ({ pdfJsDoc, pageCount, currentPage, onJump }) => {
  const [thumbs, setThumbs] = useState({});
  useEffect(() => {
    if (!pdfJsDoc || !pageCount) return;
    const renderThumb = async (i) => {
      try {
        const page=await pdfJsDoc.getPage(i+1), vp=page.getViewport({scale:0.18});
        const c=document.createElement('canvas'); c.width=vp.width; c.height=vp.height;
        await page.render({canvasContext:c.getContext('2d'),viewport:vp}).promise;
        setThumbs(prev=>({...prev,[i]:c.toDataURL('image/jpeg',0.65)}));
      } catch(e){}
    };
    for (let i=0;i<pageCount;i++) setTimeout(()=>renderThumb(i),i*80);
  }, [pdfJsDoc, pageCount]);

  return (
    <div className="flex flex-col gap-2 p-2 overflow-y-auto" style={{maxHeight:'100%'}}>
      {Array.from({length:pageCount},(_,i)=>(
        <button key={i} onClick={()=>onJump(i)}
          className={`w-full rounded-lg py-1 px-1 transition-all ${i===currentPage?'ring-2 ring-primary':'hover:ring-1 hover:ring-primary/40'}`}>
          <div className="w-full bg-white rounded mb-1 overflow-hidden border border-slate-200 dark:border-slate-600" style={{aspectRatio:'210/297'}}>
            {thumbs[i] ? <img src={thumbs[i]} alt={`Page ${i+1}`} className="w-full h-full object-contain" draggable={false}/>
              : <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-700"><FileText size={12} className="opacity-30"/></div>}
          </div>
          <span className={`text-[10px] block text-center ${i===currentPage?'text-primary font-bold':'text-slate-500'}`}>{i+1}</span>
        </button>
      ))}
    </div>
  );
};

// ── Left Sidebar ─────────────────────────────────────────────────────────────
const LeftSidebar = ({ activeTool, onToolSelect, isOpen, onToggle, onRotateCW, onRotateCCW }) => (
  <div className={`shrink-0 bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 overflow-hidden ${isOpen?'w-[196px]':'w-[52px]'}`}>
    <div className={`flex items-center border-b border-slate-700 px-2 py-2 ${isOpen?'justify-between':'justify-center'}`}>
      {isOpen && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tools</span>}
      <button onClick={onToggle} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors" title="Toggle sidebar"><AlignLeft size={14}/></button>
    </div>
    <div className="flex-1 overflow-y-auto py-2 space-y-3">
      {TOOL_CATEGORIES.map(cat=>(
        <div key={cat.id}>
          {isOpen && <div className="px-3 mb-1"><span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{cat.label}</span></div>}
          <div className="space-y-0.5 px-1.5">
            {cat.items.map(({tool,label,Icon,IconEl,special})=>{
              const active = activeTool===tool;
              return (
                <button key={tool} title={label} onClick={()=>onToolSelect(tool,special)}
                  className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left transition-all ${active?'bg-primary text-white shadow-sm':'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                  <span className="shrink-0 w-4 h-4 flex items-center justify-center">
                    {IconEl ? <IconEl size={16}/> : Icon ? <Icon size={16}/> : null}
                  </span>
                  {isOpen && <span className="text-xs font-medium truncate">{label}</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div>
        {isOpen && <div className="px-3 mb-1"><span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Pages</span></div>}
        <div className="space-y-0.5 px-1.5">
          {[{label:'Rotate CCW',Icon:RotateCcw,fn:onRotateCCW},{label:'Rotate CW',Icon:RotateCw,fn:onRotateCW}].map(({label,Icon,fn})=>(
            <button key={label} onClick={fn} title={label}
              className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
              <span className="shrink-0 w-4 h-4 flex items-center justify-center"><Icon size={16}/></span>
              {isOpen && <span className="text-xs font-medium">{label}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ── Right Panel ──────────────────────────────────────────────────────────────
const Sec = ({label,children}) => <div><label className="text-xs font-semibold text-slate-400 block mb-1.5">{label}</label>{children}</div>;

const RightPanel = ({ selected, onUpdate, activeTool, activeHighlight, setActiveHighlight, activeStamp, setActiveStamp, drawColor, setDrawColor, drawWidth, setDrawWidth, shapeStroke, setShapeStroke, shapeFill, setShapeFill, shapeStrokeW, setShapeStrokeW }) => {
  const u = (patch,del) => { if(selected) onUpdate(selected.id,selected.page,patch,del); };

  return (
    <div className="w-[220px] shrink-0 bg-slate-800 border-l border-slate-700 overflow-y-auto">
      <div className="px-3 py-2.5 border-b border-slate-700">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {selected ? `${selected.type} properties` : 'Tool Options'}
        </span>
      </div>
      <div className="p-3 space-y-4 text-sm">

        {/* ── Element properties ── */}
        {selected && <>
          {selected.type==='text' && <>
            <Sec label="Font Family">
              <select value={selected.fontFamily||'Arial'} onChange={e=>u({fontFamily:e.target.value})}
                className="w-full bg-slate-700 text-slate-200 text-xs rounded px-2 py-1.5 border border-slate-600 outline-none">
                {FONT_FAMILIES.map(f=><option key={f} value={f}>{f}</option>)}
              </select>
            </Sec>
            <Sec label="Font Size">
              <select value={selected.fontSize||14} onChange={e=>u({fontSize:+e.target.value})}
                className="w-full bg-slate-700 text-slate-200 text-xs rounded px-2 py-1.5 border border-slate-600 outline-none">
                {FONT_SIZES.map(s=><option key={s} value={s}>{s}px</option>)}
              </select>
            </Sec>
            <Sec label="Style">
              <div className="flex gap-1.5">
                {[['bold','B','font-bold'],['italic','I','italic'],['underline','U','underline']].map(([k,lbl,cls])=>(
                  <button key={k} onClick={()=>u({[k]:!selected[k]})}
                    className={`flex-1 h-7 rounded border text-xs transition-colors ${selected[k]?'bg-primary border-primary text-white':'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'}`}>
                    <span className={cls}>{lbl}</span>
                  </button>
                ))}
              </div>
            </Sec>
            <Sec label="Text Color"><input type="color" value={selected.color||'#000000'} onChange={e=>u({color:e.target.value})} className="w-full h-8 rounded border border-slate-600 cursor-pointer bg-transparent"/></Sec>
            <Sec label="Background"><input type="color" value={selected.bgColor||'#ffffff'} onChange={e=>u({bgColor:e.target.value})} className="w-full h-8 rounded border border-slate-600 cursor-pointer bg-transparent"/></Sec>
          </>}

          {selected.type==='highlight' && <>
            <Sec label="Color"><div className="flex flex-wrap gap-2">{HIGHLIGHT_COLORS.map(c=><button key={c} onClick={()=>u({color:c})} style={{width:24,height:24,background:c,borderRadius:4,border:selected.color===c?'3px solid #3b82f6':'2px solid transparent'}}/>)}</div></Sec>
            <Sec label={`Opacity ${Math.round((selected.opacity??0.4)*100)}%`}><input type="range" min="0.1" max="0.9" step="0.05" value={selected.opacity??0.4} onChange={e=>u({opacity:+e.target.value})} className="w-full"/></Sec>
          </>}

          {selected.type==='strikethrough' && <>
            <Sec label="Color"><input type="color" value={selected.color||'#dc2626'} onChange={e=>u({color:e.target.value})} className="w-full h-8 rounded border border-slate-600 cursor-pointer bg-transparent"/></Sec>
            <Sec label={`Thickness ${selected.strokeWidth||2}px`}><input type="range" min="1" max="10" value={selected.strokeWidth||2} onChange={e=>u({strokeWidth:+e.target.value})} className="w-full"/></Sec>
          </>}

          {(selected.type==='rect'||selected.type==='circle') && <>
            <Sec label="Stroke"><input type="color" value={selected.stroke||'#000000'} onChange={e=>u({stroke:e.target.value})} className="w-full h-8 rounded border border-slate-600 cursor-pointer bg-transparent"/></Sec>
            <Sec label="Fill"><input type="color" value={selected.fill==='transparent'?'#ffffff':selected.fill||'#ffffff'} onChange={e=>u({fill:e.target.value})} className="w-full h-8 rounded border border-slate-600 cursor-pointer bg-transparent"/></Sec>
            <Sec label={`Stroke Width ${selected.strokeWidth||2}px`}><input type="range" min="1" max="10" value={selected.strokeWidth||2} onChange={e=>u({strokeWidth:+e.target.value})} className="w-full"/></Sec>
            <Sec label={`Opacity ${Math.round((selected.opacity??1)*100)}%`}><input type="range" min="0.1" max="1" step="0.05" value={selected.opacity??1} onChange={e=>u({opacity:+e.target.value})} className="w-full"/></Sec>
          </>}

          {(selected.type==='line'||selected.type==='arrow') && <>
            <Sec label="Color"><input type="color" value={selected.stroke||'#000000'} onChange={e=>u({stroke:e.target.value})} className="w-full h-8 rounded border border-slate-600 cursor-pointer bg-transparent"/></Sec>
            <Sec label={`Width ${selected.strokeWidth||2}px`}><input type="range" min="1" max="12" value={selected.strokeWidth||2} onChange={e=>u({strokeWidth:+e.target.value})} className="w-full"/></Sec>
          </>}

          {selected.type==='stamp' && <Sec label="Stamp Type"><div className="space-y-1.5">{STAMP_TYPES.map(s=><button key={s.key} onClick={()=>u({stampType:s.key})} className={`w-full px-2 py-1.5 rounded border-2 font-bold text-xs tracking-widest transition-all ${selected.stampType===s.key?'ring-1 ring-white/30':''}`} style={{borderColor:s.color,color:s.color,background:selected.stampType===s.key?s.bg:'transparent'}}>{s.label}</button>)}</div></Sec>}

          <button onClick={()=>u(null,true)} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-red-800 text-red-400 hover:bg-red-900/20 text-xs font-medium transition-colors mt-1">
            <Trash2 size={12}/> Delete Element
          </button>
        </>}

        {/* ── Tool options (no element selected) ── */}
        {!selected && <>
          {(activeTool===TOOLS.HIGHLIGHT||activeTool===TOOLS.STRIKETHROUGH) && <Sec label="Color"><div className="flex flex-wrap gap-2">{HIGHLIGHT_COLORS.map(c=><button key={c} onClick={()=>setActiveHighlight(c)} style={{width:26,height:26,background:c,borderRadius:4,border:activeHighlight===c?'3px solid #3b82f6':'2px solid transparent'}}/>)}</div></Sec>}
          {activeTool===TOOLS.DRAW && <>
            <Sec label="Pen Color"><div className="flex flex-wrap gap-2">{DRAW_COLORS.map(c=><button key={c} onClick={()=>setDrawColor(c)} style={{width:22,height:22,background:c,borderRadius:3,border:drawColor===c?'3px solid #3b82f6':'2px solid transparent',boxShadow:c==='#ffffff'?'inset 0 0 0 1px #94a3b8':''}}/>)}</div></Sec>
            <Sec label={`Size: ${drawWidth}px`}><input type="range" min="1" max="20" value={drawWidth} onChange={e=>setDrawWidth(+e.target.value)} className="w-full"/></Sec>
          </>}
          {(activeTool===TOOLS.RECT||activeTool===TOOLS.CIRCLE) && <>
            <Sec label="Stroke"><input type="color" value={shapeStroke} onChange={e=>setShapeStroke(e.target.value)} className="w-full h-8 rounded border border-slate-600 cursor-pointer bg-transparent"/></Sec>
            <Sec label="Fill"><input type="color" value={shapeFill==='transparent'?'#ffffff':shapeFill} onChange={e=>setShapeFill(e.target.value)} className="w-full h-8 rounded border border-slate-600 cursor-pointer bg-transparent"/></Sec>
            <Sec label={`Stroke: ${shapeStrokeW}px`}><input type="range" min="1" max="10" value={shapeStrokeW} onChange={e=>setShapeStrokeW(+e.target.value)} className="w-full"/></Sec>
          </>}
          {activeTool===TOOLS.STAMP && <Sec label="Select Stamp"><div className="space-y-1.5">{STAMP_TYPES.map(s=><button key={s.key} onClick={()=>setActiveStamp(s.key)} className={`w-full px-2 py-1.5 rounded border-2 font-bold text-xs tracking-widest transition-all`} style={{borderColor:s.color,color:s.color,background:activeStamp===s.key?s.bg:'transparent'}}>{s.label}</button>)}</div></Sec>}
          {(activeTool===TOOLS.SELECT||!activeTool) && <div className="text-center text-slate-500 py-8"><Settings2 size={22} className="mx-auto mb-2 opacity-30"/><p className="text-xs">Select a tool to see options</p></div>}
        </>}
      </div>
    </div>
  );
};

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function EditPdfOnlinePage() {
  const [pdfFile, setPdfFile]         = useState(null);
  const [pdfBytes, setPdfBytes]       = useState(null);
  const [pdfJsDoc, setPdfJsDoc]       = useState(null);
  const [pageCount, setPageCount]     = useState(0);
  const [zoom, setZoom]               = useState(1.0);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTool, setActiveTool]   = useState(TOOLS.SELECT);
  const [activeStamp, setActiveStamp] = useState('APPROVED');
  const [activeHighlight, setActiveHighlight] = useState(HIGHLIGHT_COLORS[0]);
  const [drawColor, setDrawColor]     = useState('#000000');
  const [drawWidth, setDrawWidth]     = useState(3);
  const [shapeFill, setShapeFill]     = useState('transparent');
  const [shapeStroke, setShapeStroke] = useState('#000000');
  const [shapeStrokeW, setShapeStrokeW] = useState(2);
  const [annotations, setAnnotations] = useState({});
  const [textEdits, setTextEdits]     = useState({});
  const [selectedId, setSelectedId]   = useState(null);
  const [history, setHistory]         = useState([{}]);
  const [histIdx, setHistIdx]         = useState(0);
  const [dims, setDims]               = useState({});
  const [visiblePages, setVisiblePages] = useState(new Set([0,1]));
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [thumbsOpen, setThumbsOpen]   = useState(true);
  const [exporting, setExporting]     = useState(false);
  const [showSigModal, setShowSigModal] = useState(false);
  const [sigDataUrl, setSigDataUrl]   = useState(null);
  const [showLinkDlg, setShowLinkDlg] = useState(false);
  const [pendingLinkPos, setPendingLinkPos] = useState(null);
  const [showCommentDlg, setShowCommentDlg] = useState(false);
  const [pendingCommentPos, setPendingCommentPos] = useState(null);
  const [pageRotations, setPageRotations] = useState({});
  const [showFind, setShowFind]       = useState(false);
  const [findText, setFindText]       = useState('');

  const scrollRef    = useRef(null);
  const imageInputRef = useRef(null);

  const selectedAnn = useMemo(() => {
    if (!selectedId) return null;
    for (const pg of Object.values(annotations)) { const f=pg.find(a=>a.id===selectedId); if(f) return f; }
    return null;
  }, [selectedId, annotations]);

  // ── History ──
  const pushHistory = useCallback((next) => {
    setHistory(prev=>{const s=prev.slice(0,histIdx+1);s.push(next);return s.slice(-50);});
    setHistIdx(prev=>Math.min(49,prev+1));
  }, [histIdx]);

  const undo = useCallback(() => { if(histIdx===0) return; const i=histIdx-1; setHistIdx(i); setAnnotations(history[i]); setSelectedId(null); }, [histIdx,history]);
  const redo = useCallback(() => { if(histIdx>=history.length-1) return; const i=histIdx+1; setHistIdx(i); setAnnotations(history[i]); setSelectedId(null); }, [histIdx,history]);

  const handleTextEdit = useCallback((pageIdx, item, newVal) => {
    setTextEdits(prev => {
      const next = { ...prev };
      if (newVal === item.str) delete next[item.id];
      else next[item.id] = { val: newVal, item };
      return next;
    });
  }, []);

  const addAnn = useCallback((pageIdx,ann) => {
    setAnnotations(prev=>{const next={...prev,[pageIdx]:[...(prev[pageIdx]||[]),ann]};pushHistory(next);return next;});
  }, [pushHistory]);

  const updateAnn = useCallback((id,pageIdx,patch,del=false) => {
    setAnnotations(prev=>{
      const list=prev[pageIdx]||[];
      const next=del?{...prev,[pageIdx]:list.filter(a=>a.id!==id)}:{...prev,[pageIdx]:list.map(a=>a.id===id?{...a,...patch}:a)};
      pushHistory(next); if(del) setSelectedId(null); return next;
    });
  }, [pushHistory]);

  const deleteAnn = useCallback((id,pageIdx)=>updateAnn(id,pageIdx,null,true),[updateAnn]);
  const bringFwd  = useCallback((id,pageIdx)=>{ setAnnotations(prev=>{ const l=[...(prev[pageIdx]||[])],i=l.findIndex(a=>a.id===id); if(i<l.length-1)[l[i],l[i+1]]=[l[i+1],l[i]]; const n={...prev,[pageIdx]:l};pushHistory(n);return n; }); },[pushHistory]);
  const sendBwd   = useCallback((id,pageIdx)=>{ setAnnotations(prev=>{ const l=[...(prev[pageIdx]||[])],i=l.findIndex(a=>a.id===id); if(i>0)[l[i],l[i-1]]=[l[i-1],l[i]]; const n={...prev,[pageIdx]:l};pushHistory(n);return n; }); },[pushHistory]);

  const eraseAt = useCallback((pageIdx,xPt,yPt) => {
    const R=25;
    setAnnotations(prev=>{
      const list=prev[pageIdx]||[];
      const next={...prev,[pageIdx]:list.filter(a=>{
        if(a.type==='draw'){return Math.hypot(a.xPt+a.wPt/2-xPt,a.yPt+a.hPt/2-yPt)>R;}
        return true;
      })};
      pushHistory(next);return next;
    });
  },[pushHistory]);

  const rotatePage = useCallback((idx,delta)=>setPageRotations(prev=>({...prev,[idx]:((prev[idx]||0)+delta+360)%360})),[]);
  const onDimsLoaded = useCallback((idx,d)=>setDims(prev=>({...prev,[idx]:d})),[]);

  // ── Virtual scroll ──
  const handleScroll = useCallback(()=>{
    const el=scrollRef.current; if(!el) return;
    const {scrollTop,clientHeight}=el, visible=new Set(); let y=0;
    for(let i=0;i<pageCount;i++){
      const ph=(dims[i]?.h||842*zoom)+PAGE_GAP;
      if(y+ph>scrollTop-300&&y<scrollTop+clientHeight+300){ visible.add(i); if(y+ph/2>scrollTop&&y+ph/2<scrollTop+clientHeight) setCurrentPage(i); }
      y+=ph;
    }
    setVisiblePages(visible);
  },[pageCount,dims,zoom]);

  useEffect(()=>{ handleScroll(); },[zoom,dims]);

  // ── Keyboard shortcuts ──
  useEffect(()=>{
    const h=(e)=>{
      if(e.ctrlKey||e.metaKey){
        if(e.key==='z'){e.preventDefault();undo();} if(e.key==='y'||(e.shiftKey&&e.key==='Z')){e.preventDefault();redo();}
        if(e.key==='f'){e.preventDefault();setShowFind(v=>!v);}
      }
      if(e.key==='Escape'){setSelectedId(null);setActiveTool(TOOLS.SELECT);setShowFind(false);}
      if((e.key==='Delete'||e.key==='Backspace')&&selectedAnn&&document.activeElement.tagName!=='INPUT'&&document.activeElement.tagName!=='TEXTAREA') deleteAnn(selectedAnn.id,selectedAnn.page);
    };
    window.addEventListener('keydown',h); return ()=>window.removeEventListener('keydown',h);
  },[undo,redo,selectedAnn,deleteAnn]);

  // ── Load PDF ──
  const loadPdf = useCallback(async(file)=>{
    if(!file) return;
    if(file.size>MAX_HARD_BYTES){toast.error('File exceeds 150MB limit.');return;}
    if(file.size>MAX_WARN_BYTES) toast.warning('Large file — rendering may be slow.');
    try {
      const bytes=new Uint8Array(await file.arrayBuffer());
      const doc=await pdfjsLib.getDocument({data:bytes}).promise;
      setPdfFile(file); setPdfBytes(bytes); setPdfJsDoc(doc); setPageCount(doc.numPages);
      setAnnotations({}); setTextEdits({}); setHistory([{}]); setHistIdx(0); setSelectedId(null);
      setZoom(1.0); setCurrentPage(0); setPageRotations({}); setVisiblePages(new Set([0,1,2]));
      setTimeout(()=>scrollRef.current?.scrollTo(0,0),50);
      toast.success(`Loaded: ${file.name} (${doc.numPages} pages)`);
    } catch(err){ if(err.message?.includes('password')) toast.error('PDF is password-protected.'); else toast.error('Failed to load PDF.'); }
  },[]);

  const {getRootProps,getInputProps,isDragActive} = useDropzone({accept:{'application/pdf':['.pdf']},onDrop:files=>loadPdf(files[0]),noClick:!!pdfJsDoc,multiple:false});

  // ── Tool select ──
  const handleToolSelect = useCallback((tool,special)=>{
    if(special==='image'){imageInputRef.current?.click();return;}
    if(special==='signature'){setShowSigModal(true);return;}
    setActiveTool(tool); setSelectedId(null);
  },[]);

  // ── Page click ──
  const onPageClick = useCallback((pageIdx,xPt,yPt,tool,stampType)=>{
    const W=dims[pageIdx]?.pdfW||595, dW=W*0.25, dH=40;
    if(tool===TOOLS.TEXT) addAnn(pageIdx,{id:genId(),type:'text',page:pageIdx,xPt,yPt,wPt:dW,hPt:dH,text:'',fontSize:14,fontFamily:'Arial',color:'#000000',bold:false,italic:false,underline:false});
    else if(tool===TOOLS.WHITEOUT) addAnn(pageIdx,{id:genId(),type:'whiteout',page:pageIdx,xPt,yPt,wPt:dW,hPt:dH});
    else if(tool===TOOLS.HIGHLIGHT) addAnn(pageIdx,{id:genId(),type:'highlight',page:pageIdx,xPt,yPt,wPt:dW,hPt:22,color:activeHighlight,opacity:0.4});
    else if(tool===TOOLS.STRIKETHROUGH) addAnn(pageIdx,{id:genId(),type:'strikethrough',page:pageIdx,xPt,yPt,wPt:dW,hPt:16,color:'#dc2626',strokeWidth:2});
    else if(tool===TOOLS.RECT) addAnn(pageIdx,{id:genId(),type:'rect',page:pageIdx,xPt,yPt,wPt:dW,hPt:dH,stroke:shapeStroke,fill:shapeFill,strokeWidth:shapeStrokeW,opacity:1});
    else if(tool===TOOLS.CIRCLE) addAnn(pageIdx,{id:genId(),type:'circle',page:pageIdx,xPt,yPt,wPt:dW,hPt:dH,stroke:shapeStroke,fill:shapeFill,strokeWidth:shapeStrokeW,opacity:1});
    else if(tool===TOOLS.LINE) addAnn(pageIdx,{id:genId(),type:'line',page:pageIdx,xPt,yPt,wPt:dW,hPt:4,stroke:shapeStroke,strokeWidth:shapeStrokeW});
    else if(tool===TOOLS.ARROW) addAnn(pageIdx,{id:genId(),type:'arrow',page:pageIdx,xPt,yPt,wPt:dW,hPt:4,stroke:shapeStroke,strokeWidth:shapeStrokeW});
    else if(tool===TOOLS.SIGNATURE&&sigDataUrl) { addAnn(pageIdx,{id:genId(),type:'signature',page:pageIdx,xPt,yPt,wPt:dW,hPt:dW*0.3,dataUrl:sigDataUrl}); }
    else if(tool===TOOLS.LINK) { setPendingLinkPos({pageIdx,xPt,yPt,wPt:dW,hPt:24}); setShowLinkDlg(true); }
    else if(tool===TOOLS.COMMENT) { setPendingCommentPos({pageIdx,xPt,yPt}); setShowCommentDlg(true); }
    else if(tool===TOOLS.DATE_STAMP) addAnn(pageIdx,{id:genId(),type:'date_stamp',page:pageIdx,xPt,yPt,wPt:W*0.35,hPt:20,text:fmtDate(),fontSize:11,color:'#1e293b'});
    else if(tool===TOOLS.STAMP) addAnn(pageIdx,{id:genId(),type:'stamp',page:pageIdx,xPt,yPt,wPt:W*0.3,hPt:50,stampType:stampType||'APPROVED',fontSize:16});
  },[dims,addAnn,activeHighlight,shapeStroke,shapeFill,shapeStrokeW,sigDataUrl]);

  const onDrawPath = useCallback((pageIdx,dataUrl,xPt,yPt,wPt,hPt)=>addAnn(pageIdx,{id:genId(),type:'draw',page:pageIdx,xPt,yPt,wPt,hPt,dataUrl}),[addAnn]);

  const insertImage = useCallback((e)=>{
    const file=e.target.files?.[0]; if(!file) return;
    const r=new FileReader(); r.onload=(ev)=>{ const d=dims[currentPage],W=d?.pdfW||595,H=d?.pdfH||842; addAnn(currentPage,{id:genId(),type:'image',page:currentPage,xPt:W*0.1,yPt:H*0.1,wPt:W*0.4,hPt:W*0.3,dataUrl:ev.target.result}); };
    r.readAsDataURL(file); e.target.value='';
  },[addAnn,currentPage,dims]);

  const jumpToPage = useCallback((idx)=>{ const el=scrollRef.current; if(!el) return; let y=0; for(let i=0;i<idx;i++) y+=(dims[i]?.h||842*zoom)+PAGE_GAP; el.scrollTo({top:y,behavior:'smooth'}); },[dims,zoom]);

  const zoomIn  = ()=>setZoom(z=>Math.min(2,+(z+0.25).toFixed(2)));
  const zoomOut = ()=>setZoom(z=>Math.max(0.25,+(z-0.25).toFixed(2)));
  const zoomFit = ()=>{ const el=scrollRef.current,d=dims[currentPage]; if(el&&d) setZoom(+(el.clientWidth/d.pdfW-0.05).toFixed(2)); };

  // ── Export ──
  const exportPdf = useCallback(async()=>{
    if(!pdfBytes) return; setExporting(true);
    try {
      const pdfDoc=await PDFDocument.load(pdfBytes,{ignoreEncryption:true});
      const pages=pdfDoc.getPages(), font=await pdfDoc.embedFont(StandardFonts.Helvetica);
      pages.forEach((page,i)=>{ const rot=pageRotations[i]||0; if(rot) page.setRotation(degrees(rot)); });
      for(const [pidxStr,anns] of Object.entries(annotations)){
        const pidx=parseInt(pidxStr), page=pages[pidx]; if(!page) continue;
        const pH=page.getHeight();

        // ── Process text edits for this page ──
        for (const [id, edit] of Object.entries(textEdits)) {
          if (!id.startsWith(`${pidx}_`)) continue;
          const { val, item } = edit;
          const x = item.xPdf, y = pH - item.yPdf - item.hPdf;
          page.drawRectangle({ x: x - 1, y: y - 1, width: item.wPdf + 2, height: item.hPdf + 2, color: rgb(1,1,1) });
          // approximate y-baseline for pdf-lib which uses bottom-left origin
          page.drawText(val, { x, y: y + (item.hPdf - item.fontSizePdf)*0.5, size: item.fontSizePdf, font, color: rgb(0,0,0) });
        }

        for(const ann of anns){
          const x=ann.xPt,y=pH-ann.yPt-ann.hPt,w=ann.wPt,h=ann.hPt;
          try{
            if(ann.type==='whiteout') page.drawRectangle({x,y,width:Math.max(1,w),height:Math.max(1,h),color:rgb(1,1,1),borderColor:rgb(1,1,1)});
            else if(ann.type==='highlight'){const c=hex2rgb01(ann.color||'#fef08a');page.drawRectangle({x,y,width:Math.max(1,w),height:Math.max(1,h),color:rgb(c.r,c.g,c.b),opacity:ann.opacity??0.4});}
            else if(ann.type==='strikethrough'){const c=hex2rgb01(ann.color||'#dc2626');page.drawLine({start:{x,y:y+h/2},end:{x:x+w,y:y+h/2},thickness:ann.strokeWidth||2,color:rgb(c.r,c.g,c.b)});}
            else if(ann.type==='text'&&ann.text?.trim()){
              const c=hex2rgb01(ann.color||'#000000'),fs=Math.max(4,ann.fontSize||14);
              if(ann.bgColor&&ann.bgColor!=='transparent'){const bg=hex2rgb01(ann.bgColor);page.drawRectangle({x,y,width:Math.max(1,w),height:Math.max(1,h),color:rgb(bg.r,bg.g,bg.b)});}
              (ann.text||'').split('\n').forEach((line,li)=>{ if(!line.trim()) return; page.drawText(line,{x:x+2,y:Math.max(0,y+h-fs*1.3*(li+1)),size:fs,font,color:rgb(c.r,c.g,c.b),maxWidth:Math.max(10,w)}); });
            }
            else if(ann.type==='signature'||ann.type==='image'){const b=dataUrlToBytes(ann.dataUrl),emb=ann.dataUrl.startsWith('data:image/png')?await pdfDoc.embedPng(b):await pdfDoc.embedJpg(b);page.drawImage(emb,{x,y,width:Math.max(1,w),height:Math.max(1,h)});}
            else if(ann.type==='draw'){const b=dataUrlToBytes(ann.dataUrl),emb=await pdfDoc.embedPng(b);page.drawImage(emb,{x,y,width:Math.max(1,w),height:Math.max(1,h)});}
            else if(ann.type==='rect'){const sc=hex2rgb01(ann.stroke||'#000'),bc=ann.fill&&ann.fill!=='transparent'?hex2rgb01(ann.fill):null;page.drawRectangle({x,y,width:Math.max(1,w),height:Math.max(1,h),borderColor:rgb(sc.r,sc.g,sc.b),borderWidth:ann.strokeWidth||2,color:bc?rgb(bc.r,bc.g,bc.b):undefined,opacity:ann.opacity??1});}
            else if(ann.type==='circle'){const sc=hex2rgb01(ann.stroke||'#000'),bc=ann.fill&&ann.fill!=='transparent'?hex2rgb01(ann.fill):null;page.drawEllipse({x:x+w/2,y:y+h/2,xScale:w/2,yScale:h/2,borderColor:rgb(sc.r,sc.g,sc.b),borderWidth:ann.strokeWidth||2,color:bc?rgb(bc.r,bc.g,bc.b):undefined,opacity:ann.opacity??1});}
            else if(ann.type==='line'||ann.type==='arrow'){const sc=hex2rgb01(ann.stroke||'#000');page.drawLine({start:{x,y},end:{x:x+w,y:y+h},thickness:ann.strokeWidth||2,color:rgb(sc.r,sc.g,sc.b)});}
            else if(ann.type==='link'){page.drawText(ann.displayText||ann.url||'Link',{x:x+2,y:y+2,size:ann.fontSize||13,font,color:rgb(0.15,0.39,0.92)});}
            else if(ann.type==='comment'){page.drawCircle({x:x+10,y:pH-ann.yPt-10,size:8,color:rgb(0.98,0.8,0.08),borderColor:rgb(0.6,0.4,0),borderWidth:1});}
            else if(ann.type==='stamp'){const si=STAMP_TYPES.find(s=>s.key===ann.stampType)||STAMP_TYPES[0],c=hex2rgb01(si.color);page.drawRectangle({x,y,width:Math.max(1,w),height:Math.max(1,h),borderColor:rgb(c.r,c.g,c.b),borderWidth:2.5,opacity:0.9});page.drawText(si.label,{x:x+(w-si.label.length*(ann.fontSize||14)*0.55)/2,y:y+(h-(ann.fontSize||14))/2,size:ann.fontSize||14,font,color:rgb(c.r,c.g,c.b)});}
            else if(ann.type==='date_stamp'){const c=hex2rgb01(ann.color||'#1e293b');page.drawText(ann.text||'',{x:x+2,y:y+2,size:ann.fontSize||11,font,color:rgb(c.r,c.g,c.b)});}
          }catch(e){console.warn('Ann export error:',e);}
        }
      }
      const blob=new Blob([await pdfDoc.save()],{type:'application/pdf'});
      const url=URL.createObjectURL(blob),a=document.createElement('a');
      a.href=url; a.download=(pdfFile?.name?.replace('.pdf','')||'edited')+'_edited.pdf'; a.click();
      setTimeout(()=>URL.revokeObjectURL(url),5000);
      toast.success('PDF exported successfully!');
    }catch(err){console.error(err);toast.error('Export failed: '+err.message);}
    finally{setExporting(false);}
  },[pdfBytes,annotations,textEdits,dims,pdfFile,pageRotations]);

  // ── Upload screen ──
  if (!pdfJsDoc) return (
    <ToolPageTemplate toolData={toolPageData['edit-pdf-online']}>
      <div {...getRootProps()} className={`relative flex flex-col items-center justify-center min-h-[420px] rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer ${isDragActive?'border-primary bg-primary/5 scale-[1.02]':'border-border hover:border-primary/50 hover:bg-primary/5'}`}>
        <input {...getInputProps()}/>
        <motion.div animate={isDragActive?{scale:1.08}:{scale:1}} className="flex flex-col items-center gap-5 py-14 px-8 text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center"><Upload size={36} className="text-primary"/></div>
          <div>
            <h2 className="text-2xl font-bold mb-2">{isDragActive?'Drop your PDF here!':'Edit PDF Online'}</h2>
            <p className="text-muted-foreground text-sm max-w-sm">Advanced PDF editor — add text, highlights, signatures, stamps, shapes and more, directly in your browser. No upload to server.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground font-medium">
            {[['🔒','100% Secure'],['⚡','Fast & Free'],['📱','Mobile Ready'],['🌐','Browser-Based']].map(([e,t])=>(
              <span key={t} className="flex items-center gap-1 bg-muted/50 px-3 py-1 rounded-full">{e} {t}</span>
            ))}
          </div>
          <Button size="lg" className="px-8 mt-2"><FileText size={16} className="mr-2"/>Select PDF File</Button>
          <p className="text-xs text-muted-foreground">Warning at 50MB · Hard limit 150MB</p>
        </motion.div>
      </div>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[{t:'✏️ Text & Whiteout',d:'Add text boxes with full font control. Whiteout existing content to overlay corrected text.'},{t:'✍️ Signatures',d:'Draw, type or upload a signature. Drag and resize on any page.'},{t:'🖊️ Highlight & Strikethrough',d:'Highlight in 6 colors, add strikethrough, comments, shapes and freehand drawings.'},{t:'📋 Stamps',d:'APPROVED, DRAFT, PAID, CONFIDENTIAL and RECEIVED stamps with one click.'},{t:'🖼️ Images',d:'Insert PNG/JPG images, resize and reposition freely on any page.'},{t:'🔄 Rotate Pages',d:'Rotate individual pages clockwise or counter-clockwise before downloading.'}].map(({t,d})=>(
          <div key={t} className="p-5 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"><h3 className="font-bold mb-2 text-sm">{t}</h3><p className="text-muted-foreground text-xs leading-relaxed">{d}</p></div>
        ))}
      </div>
    </ToolPageTemplate>
  );

  // ── Editor workspace ──
  return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`}</style>

      <AnimatePresence>
        {showSigModal && <SignatureModal onClose={()=>setShowSigModal(false)} onConfirm={(url)=>{setSigDataUrl(url);setActiveTool(TOOLS.SIGNATURE);setShowSigModal(false);toast.info('Click on the PDF to place your signature');}}/>}
        {showLinkDlg && <LinkDialog onClose={()=>{setShowLinkDlg(false);setPendingLinkPos(null);}} onConfirm={(url,text)=>{if(pendingLinkPos)addAnn(pendingLinkPos.pageIdx,{id:genId(),type:'link',page:pendingLinkPos.pageIdx,xPt:pendingLinkPos.xPt,yPt:pendingLinkPos.yPt,wPt:pendingLinkPos.wPt,hPt:pendingLinkPos.hPt,url,displayText:text,fontSize:13});setShowLinkDlg(false);setPendingLinkPos(null);}}/>}
        {showCommentDlg && <CommentDialog onClose={()=>{setShowCommentDlg(false);setPendingCommentPos(null);}} onConfirm={(text)=>{if(pendingCommentPos)addAnn(pendingCommentPos.pageIdx,{id:genId(),type:'comment',page:pendingCommentPos.pageIdx,xPt:pendingCommentPos.xPt,yPt:pendingCommentPos.yPt,wPt:28,hPt:28,text,color:'#facc15'});setShowCommentDlg(false);setPendingCommentPos(null);}}/>}
        {exporting && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"><div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center shadow-2xl"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"/><p className="font-bold text-lg">Generating PDF…</p><p className="text-sm text-muted-foreground mt-1">Flattening all edits</p></div></div>}
      </AnimatePresence>

      <input ref={imageInputRef} type="file" className="hidden" accept="image/*" onChange={insertImage}/>

      {/* EDITOR SHELL */}
      <div className="fixed inset-0 top-16 md:top-20 flex flex-col bg-slate-900 text-white z-40">

        {/* TOP BAR */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border-b border-slate-700 shrink-0">
          <button onClick={()=>{setPdfJsDoc(null);setPdfFile(null);setPdfBytes(null);}} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white shrink-0"><X size={13}/></button>
          <span className="text-xs font-medium text-slate-300 max-w-[140px] truncate hidden sm:block">{pdfFile?.name}</span>
          <span className="text-xs text-slate-500 hidden sm:block">· {pageCount}p</span>
          <div className="flex-1"/>
          <button onClick={()=>setShowFind(v=>!v)} title="Find (Ctrl+F)" className={`p-1.5 rounded-lg transition-colors shrink-0 ${showFind?'bg-primary text-white':'text-slate-400 hover:text-white hover:bg-slate-700'}`}><Search size={13}/></button>
          <div className="w-px h-4 bg-slate-700 mx-0.5 shrink-0"/>
          <button onClick={undo} disabled={histIdx===0} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30 shrink-0" title="Undo"><Undo2 size={13}/></button>
          <button onClick={redo} disabled={histIdx>=history.length-1} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30 shrink-0" title="Redo"><Redo2 size={13}/></button>
          <div className="w-px h-4 bg-slate-700 mx-0.5 shrink-0"/>
          <button onClick={zoomOut} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white shrink-0"><ZoomOut size={13}/></button>
          <button onClick={zoomFit} className="px-2 py-1 text-xs text-slate-400 hover:text-white hover:bg-slate-700 rounded shrink-0 min-w-[42px] text-center">{Math.round(zoom*100)}%</button>
          <button onClick={zoomIn} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white shrink-0"><ZoomIn size={13}/></button>
          <div className="w-px h-4 bg-slate-700 mx-0.5 shrink-0"/>
          <span className="text-xs text-slate-500 shrink-0 hidden md:block">{Object.values(annotations).flat().length} edits</span>
          <Button size="sm" onClick={exportPdf} disabled={exporting} className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 shrink-0 h-7 gap-1 ml-1">
            <Download size={12}/><span className="hidden sm:inline">Download</span>
          </Button>
        </div>

        {/* Find bar */}
        {showFind && (
          <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-700 shrink-0" style={{background:'#1a2a3a'}}>
            <Search size={13} className="text-slate-400 shrink-0"/>
            <Input value={findText} onChange={e=>setFindText(e.target.value)} placeholder="Find text on page…" className="h-7 text-xs bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 flex-1 max-w-xs"/>
            <span className="text-xs text-slate-500 hidden sm:block">Type to search annotations</span>
            <button onClick={()=>{setShowFind(false);setFindText('');}} className="p-1 rounded hover:bg-slate-700 text-slate-400"><X size={12}/></button>
          </div>
        )}

        {/* MAIN BODY */}
        <div className="flex flex-1 overflow-hidden">

          {/* DESKTOP LAYOUT */}
          <div className="hidden md:flex shrink-0">
            {/* Thumbnails */}
            {thumbsOpen ? (
              <div className="w-[88px] shrink-0 border-r border-slate-700 overflow-hidden flex flex-col" style={{background:'#1a2030'}}>
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-700">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Pages</span>
                  <button onClick={()=>setThumbsOpen(false)} className="text-slate-600 hover:text-slate-400"><X size={9}/></button>
                </div>
                <div className="flex-1 overflow-y-auto pb-16">
                  <ThumbnailPanel pdfJsDoc={pdfJsDoc} pageCount={pageCount} currentPage={currentPage} onJump={jumpToPage}/>
                </div>
              </div>
            ) : (
              <button onClick={()=>setThumbsOpen(true)} className="w-5 bg-slate-800 border-r border-slate-700 flex items-center justify-center text-slate-600 hover:text-white hover:bg-slate-700 transition-colors shrink-0">
                <ChevronRight size={10}/>
              </button>
            )}
            <LeftSidebar activeTool={activeTool} onToolSelect={handleToolSelect}
              isOpen={sidebarOpen} onToggle={()=>setSidebarOpen(v=>!v)}
              onRotateCW={()=>rotatePage(currentPage,90)} onRotateCCW={()=>rotatePage(currentPage,-90)}/>
          </div>

          {/* CANVAS */}
          <div ref={scrollRef} className="flex-1 overflow-auto bg-slate-900 relative" onScroll={handleScroll} onClick={()=>setSelectedId(null)}>
            <div className="flex flex-col items-center py-6 gap-0" style={{minHeight:'100%'}}>
              {Array.from({length:pageCount},(_,i)=>(
                <div key={i} style={{marginBottom:PAGE_GAP,transform:`rotate(${pageRotations[i]||0}deg)`,transformOrigin:'center center'}}>
                  <PageCanvas pageIdx={i} pdfJsDoc={pdfJsDoc} zoom={zoom}
                    annotations={annotations} activeTool={activeTool} selectedId={selectedId}
                    onSelect={id=>{setSelectedId(id);}} onAnnUpdate={updateAnn} onAnnDelete={deleteAnn}
                    onBringFwd={bringFwd} onSendBwd={sendBwd}
                    onPageClick={onPageClick} onDrawPath={onDrawPath} onErase={eraseAt}
                    drawColor={drawColor} drawWidth={drawWidth}
                    isVisible={visiblePages.has(i)} onDimsLoaded={onDimsLoaded} dims={dims[i]}
                    activeStampType={activeStamp} onDeselect={()=>setSelectedId(null)}
                    textEdits={textEdits} onTextEdit={handleTextEdit}/>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL (desktop) */}
          <div className="hidden md:block">
            <RightPanel selected={selectedAnn}
              onUpdate={(id,pg,patch,del)=>{if(del)deleteAnn(id,pg);else updateAnn(id,pg,patch);}}
              activeTool={activeTool}
              activeHighlight={activeHighlight} setActiveHighlight={setActiveHighlight}
              activeStamp={activeStamp} setActiveStamp={setActiveStamp}
              drawColor={drawColor} setDrawColor={setDrawColor}
              drawWidth={drawWidth} setDrawWidth={setDrawWidth}
              shapeStroke={shapeStroke} setShapeStroke={setShapeStroke}
              shapeFill={shapeFill} setShapeFill={setShapeFill}
              shapeStrokeW={shapeStrokeW} setShapeStrokeW={setShapeStrokeW}/>
          </div>
        </div>

        {/* MOBILE BOTTOM DOCK */}
        <div className="md:hidden flex items-center justify-around px-2 py-1.5 bg-slate-800 border-t border-slate-700 shrink-0 overflow-x-auto gap-1">
          {[{tool:TOOLS.SELECT,Icon:MousePointer2,label:'Select'},{tool:TOOLS.TEXT,Icon:Type,label:'Text'},{tool:TOOLS.HIGHLIGHT,Icon:Highlighter,label:'Mark'},{tool:TOOLS.WHITEOUT,Icon:Square,label:'White'},{tool:TOOLS.DRAW,Icon:Pencil,label:'Draw'},{tool:TOOLS.STAMP,Icon:Tag,label:'Stamp'}].map(({tool,Icon,label})=>(
            <button key={tool} onClick={()=>handleToolSelect(tool,null)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] shrink-0 ${activeTool===tool?'text-primary':'text-slate-400'}`}>
              <Icon size={15}/><span>{label}</span>
            </button>
          ))}
          <button onClick={()=>setShowSigModal(true)} className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] text-slate-400 shrink-0"><PenTool size={15}/><span>Sign</span></button>
          <button onClick={exportPdf} className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] text-green-400 shrink-0"><Download size={15}/><span>Save</span></button>
        </div>
      </div>
    </>
  );
}
