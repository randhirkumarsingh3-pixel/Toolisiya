import React, {
  useState, useEffect, useRef, useCallback, useMemo
} from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MousePointer2, Type, Square, Highlighter, Pencil,
  Image as ImageIcon, PenTool, Link2, MessageSquare, Clock,
  Download, ZoomIn, ZoomOut, Undo2, Redo2, ChevronLeft,
  ChevronRight, Search, Trash2, X, Upload, FileText,
  Shield, CheckCircle, ArrowUp, ArrowDown, Bold, Italic,
  Underline, Circle, Minus, Tag, Move, Maximize2,
  Layers, RotateCcw, ChevronDown, ChevronUp, AlignLeft,
  Settings2, Palette, Eye, Plus, SidebarOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

// ─── PDF.JS WORKER ────────────────────────────────────────────────────────────
pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const TOOLS = {
  SELECT: 'select', TEXT: 'text', WHITEOUT: 'whiteout',
  HIGHLIGHT: 'highlight', DRAW: 'draw', RECT: 'rect',
  CIRCLE: 'circle', LINE: 'line', ARROW: 'arrow',
  IMAGE: 'image', SIGNATURE: 'signature', LINK: 'link',
  COMMENT: 'comment', DATE_STAMP: 'date_stamp', STAMP: 'stamp',
};

const STAMP_TYPES = [
  { key: 'APPROVED',     label: 'APPROVED',     color: '#16a34a', bg: 'rgba(22,163,74,0.08)' },
  { key: 'DRAFT',        label: 'DRAFT',         color: '#d97706', bg: 'rgba(217,119,6,0.08)' },
  { key: 'PAID',         label: 'PAID',          color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
  { key: 'CONFIDENTIAL', label: 'CONFIDENTIAL',  color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
  { key: 'RECEIVED',     label: 'RECEIVED',      color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
];

const HIGHLIGHT_COLORS = [
  '#facc15', '#4ade80', '#60a5fa', '#f87171', '#c084fc', '#fb923c',
];

const DRAW_COLORS = [
  '#000000', '#dc2626', '#2563eb', '#16a34a', '#d97706', '#7c3aed', '#db2777',
];

const FONT_FAMILIES = ['Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Helvetica'];
const FONT_SIZES    = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48];
const ZOOM_STEPS    = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

const MAX_WARN_BYTES = 50  * 1024 * 1024;
const MAX_HARD_BYTES = 150 * 1024 * 1024;
const PAGE_GAP       = 20; // px between pages

// ─── UTILITIES ────────────────────────────────────────────────────────────────
let _uid = 0;
const genId = () => `a${Date.now()}_${_uid++}`;

const hex2rgb01 = (hex) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
};

const dataUrlToBytes = (url) => {
  const b64 = url.split(',')[1];
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
};

const fmtDate = () => {
  const d = new Date();
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

// Draw paths to an offscreen canvas → PNG data URL
const pathsToPng = (paths, W, H) => {
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  paths.forEach(({ points, color, sw }) => {
    if (points.length < 2) return;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = sw;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.stroke();
  });
  return c.toDataURL('image/png');
};

// ─── SIGNATURE MODAL ──────────────────────────────────────────────────────────
const SignatureModal = ({ onClose, onConfirm }) => {
  const [mode, setMode] = useState('draw');
  const [typed, setTyped] = useState('');
  const [uploadUrl, setUploadUrl] = useState(null);
  const cvs = useRef(null);
  const drawing = useRef(false);
  const last = useRef(null);

  const clear = () => {
    const c = cvs.current; if (!c) return;
    c.getContext('2d').clearRect(0, 0, c.width, c.height);
  };

  const onPD = (e) => {
    drawing.current = true;
    const r = cvs.current.getBoundingClientRect();
    const touches = e.touches?.[0];
    const cx = touches ? touches.clientX : e.clientX;
    const cy = touches ? touches.clientY : e.clientY;
    last.current = {
      x: (cx - r.left) * (cvs.current.width / r.width),
      y: (cy - r.top)  * (cvs.current.height / r.height),
    };
  };

  const onPM = (e) => {
    if (!drawing.current) return;
    const r = cvs.current.getBoundingClientRect();
    const touches = e.touches?.[0];
    const cx = touches ? touches.clientX : e.clientX;
    const cy = touches ? touches.clientY : e.clientY;
    const x = (cx - r.left) * (cvs.current.width / r.width);
    const y = (cy - r.top)  * (cvs.current.height / r.height);
    const ctx = cvs.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2.5;
    ctx.lineCap = 'round'; ctx.stroke();
    last.current = { x, y };
  };

  const onPU = () => { drawing.current = false; };

  const confirm = () => {
    if (mode === 'draw') {
      onConfirm(cvs.current.toDataURL('image/png'));
    } else if (mode === 'type') {
      if (!typed.trim()) { toast.error('Type your name first'); return; }
      const c = document.createElement('canvas');
      c.width = 400; c.height = 120;
      const ctx = c.getContext('2d');
      ctx.font = 'italic 52px Georgia, serif';
      ctx.fillStyle = '#1e293b';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(typed, 200, 60);
      onConfirm(c.toDataURL('image/png'));
    } else if (mode === 'upload') {
      if (!uploadUrl) { toast.error('Upload a signature image first'); return; }
      onConfirm(uploadUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-bold">Create Signature</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X size={16} /></button>
        </div>
        <div className="flex border-b border-border">
          {[['draw','✏️ Draw'],['type','⌨️ Type'],['upload','🖼️ Upload']].map(([m, label]) => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${mode===m ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
            >{label}</button>
          ))}
        </div>
        <div className="p-5 min-h-[200px]">
          {mode === 'draw' && (
            <div>
              <canvas ref={cvs} width={480} height={180}
                className="w-full border-2 border-dashed border-border rounded-xl bg-slate-50 dark:bg-slate-800 cursor-crosshair touch-none"
                onMouseDown={onPD} onMouseMove={onPM} onMouseUp={onPU} onMouseLeave={onPU}
                onTouchStart={onPD} onTouchMove={onPM} onTouchEnd={onPU}
              />
              <button onClick={clear} className="mt-2 text-xs text-blue-500 hover:underline flex items-center gap-1"><RotateCcw size={11}/>Clear</button>
            </div>
          )}
          {mode === 'type' && (
            <div className="space-y-3">
              <Input placeholder="Type your full name…" value={typed} onChange={e=>setTyped(e.target.value)} className="text-base"/>
              {typed && (
                <div className="p-4 border border-border rounded-xl text-center bg-slate-50 dark:bg-slate-800"
                  style={{fontFamily:'Georgia,serif',fontStyle:'italic',fontSize:'2rem',color:'#1e293b',letterSpacing:1}}>
                  {typed}
                </div>
              )}
            </div>
          )}
          {mode === 'upload' && (
            <label className="cursor-pointer block">
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                {uploadUrl
                  ? <img src={uploadUrl} alt="sig" className="max-h-28 mx-auto object-contain"/>
                  : <><Upload size={28} className="mx-auto mb-2 text-muted-foreground"/><p className="text-sm text-muted-foreground">Click to upload PNG/JPG</p></>
                }
              </div>
              <input type="file" className="hidden" accept="image/*"
                onChange={e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=ev=>setUploadUrl(ev.target.result);r.readAsDataURL(f);}}
              />
            </label>
          )}
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={confirm} className="flex-1 bg-primary">Place Signature</Button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── LINK DIALOG ──────────────────────────────────────────────────────────────
const LinkDialog = ({ onClose, onConfirm }) => {
  const [url, setUrl] = useState('https://');
  const [text, setText] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-bold">Add Link</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X size={16}/></button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">URL</label>
            <Input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://example.com"/>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Display Text (optional)</label>
            <Input value={text} onChange={e=>setText(e.target.value)} placeholder="Click here"/>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={()=>onConfirm(url,text||url)} className="flex-1">Add Link</Button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── COMMENT DIALOG ───────────────────────────────────────────────────────────
const CommentDialog = ({ onClose, onConfirm }) => {
  const [text, setText] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-bold">Add Comment</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X size={16}/></button>
        </div>
        <div className="p-5">
          <textarea
            autoFocus value={text} onChange={e=>setText(e.target.value)}
            placeholder="Type your comment…"
            className="w-full h-24 resize-none border border-border rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-primary bg-transparent"
          />
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={()=>{if(!text.trim()){toast.error('Enter a comment');return;}onConfirm(text);}} className="flex-1">Add</Button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── STAMP PICKER ─────────────────────────────────────────────────────────────
const StampPicker = ({ onPick }) => (
  <div className="p-3 space-y-2">
    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Select Stamp</p>
    {STAMP_TYPES.map(s => (
      <button key={s.key} onClick={()=>onPick(s.key)}
        className="w-full px-3 py-1.5 rounded border-2 font-bold text-sm tracking-widest transition-all hover:opacity-80"
        style={{borderColor:s.color,color:s.color,background:s.bg}}>
        {s.label}
      </button>
    ))}
  </div>
);

// ─── ANNOTATION OVERLAY ITEM ──────────────────────────────────────────────────
const AnnItem = ({ ann, zoom, pageW, pageH, isSelected, onSelect, onUpdate, onDelete, onBringFwd, onSendBwd }) => {
  const dx = ann.xPt * zoom;
  const dy = ann.yPt * zoom;
  const dw = ann.wPt * zoom;
  const dh = ann.hPt * zoom;

  const dragging = useRef(false);
  const resizing = useRef(false);
  const startRef = useRef({});
  const [editingText, setEditingText] = useState(false);

  const onPD = (e) => {
    e.stopPropagation();
    if (!isSelected) { onSelect(ann.id); return; }
    dragging.current = true;
    startRef.current = { mx: e.clientX, my: e.clientY, ox: ann.xPt, oy: ann.yPt };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPM = (e) => {
    if (!dragging.current) return;
    const dx2 = (e.clientX - startRef.current.mx) / zoom;
    const dy2 = (e.clientY - startRef.current.my) / zoom;
    onUpdate(ann.id, ann.page, {
      xPt: Math.max(0, startRef.current.ox + dx2),
      yPt: Math.max(0, startRef.current.oy + dy2),
    });
  };
  const onPU = () => { dragging.current = false; resizing.current = false; };

  const onRD = (e) => {
    e.stopPropagation();
    resizing.current = true;
    startRef.current = { mx: e.clientX, my: e.clientY, ow: ann.wPt, oh: ann.hPt };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onRM = (e) => {
    if (!resizing.current) return;
    const dw2 = (e.clientX - startRef.current.mx) / zoom;
    const dh2 = (e.clientY - startRef.current.my) / zoom;
    onUpdate(ann.id, ann.page, {
      wPt: Math.max(20 / zoom, startRef.current.ow + dw2),
      hPt: Math.max(10 / zoom, startRef.current.oh + dh2),
    });
  };

  const base = {
    position: 'absolute', left: dx, top: dy, width: dw, height: dh,
    boxSizing: 'border-box', cursor: isSelected ? 'move' : 'pointer',
  };

  // ── Render per type ──
  const renderAnn = () => {
    const { type } = ann;

    if (type === 'whiteout')
      return <div style={{ ...base, background: '#fff', border: isSelected ? '2px solid #3b82f6' : '1px solid #cbd5e1', borderRadius: 2 }}
        onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU} />;

    if (type === 'highlight')
      return <div style={{ ...base, background: ann.color || '#facc15', opacity: ann.opacity ?? 0.4, border: isSelected ? '2px solid #3b82f6' : 'none', borderRadius: 2 }}
        onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU} />;

    if (type === 'text')
      return (
        <div style={{ ...base, border: isSelected ? '2px solid #3b82f6' : '1px dashed #94a3b8', background: ann.bgColor || 'transparent', borderRadius: 2, padding: '2px 4px', overflow: 'hidden' }}
          onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU}
          onDoubleClick={() => setEditingText(true)}>
          {editingText
            ? <textarea autoFocus style={{ width:'100%', height:'100%', border:'none', outline:'none', resize:'none', background:'transparent', fontSize:(ann.fontSize||14)*zoom, color:ann.color||'#000', fontFamily:ann.fontFamily||'Arial', fontWeight:ann.bold?'bold':'normal', fontStyle:ann.italic?'italic':'normal' }}
                value={ann.text||''} onChange={e=>onUpdate(ann.id,ann.page,{text:e.target.value})}
                onBlur={()=>setEditingText(false)} onClick={e=>e.stopPropagation()} />
            : <span style={{ fontSize:(ann.fontSize||14)*zoom, color:ann.color||'#000', fontFamily:ann.fontFamily||'Arial', fontWeight:ann.bold?'bold':'normal', fontStyle:ann.italic?'italic':'normal', textDecoration:ann.underline?'underline':'none', whiteSpace:'pre-wrap', wordBreak:'break-word', pointerEvents:'none' }}>
                {ann.text || <span style={{opacity:0.4,fontStyle:'italic'}}>Double-click to edit…</span>}
              </span>
          }
        </div>
      );

    if (type === 'image' || type === 'signature')
      return <div style={{ ...base, border: isSelected ? '2px solid #3b82f6' : 'none' }}
        onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU}>
        <img src={ann.dataUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'contain', pointerEvents:'none', display:'block' }} draggable={false}/>
      </div>;

    if (type === 'draw')
      return <div style={{ ...base, border: isSelected ? '2px dashed #3b82f6' : 'none', background:'transparent' }}
        onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU}>
        <img src={ann.dataUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'fill', pointerEvents:'none', display:'block' }} draggable={false}/>
      </div>;

    if (type === 'rect')
      return <div style={{ ...base, border:`${(ann.strokeWidth||2)*zoom}px solid ${ann.stroke||'#000'}`, background:ann.fill||'transparent', borderRadius:2, opacity:ann.opacity??1 }}
        onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU} />;

    if (type === 'circle')
      return <div style={{ ...base, border:`${(ann.strokeWidth||2)*zoom}px solid ${ann.stroke||'#000'}`, background:ann.fill||'transparent', borderRadius:'50%', opacity:ann.opacity??1 }}
        onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU} />;

    if (type === 'line' || type === 'arrow') {
      const W = dw; const H = dh;
      return (
        <div style={{ ...base, overflow:'visible', background:'transparent', border:'none' }}
          onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU}>
          <svg width={Math.max(W,4)} height={Math.max(H,4)} style={{ position:'absolute', top:0, left:0, overflow:'visible' }}>
            <defs>
              {type==='arrow' && <marker id={`arr-${ann.id}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill={ann.stroke||'#000'}/>
              </marker>}
            </defs>
            <line x1="0" y1="0" x2={W} y2={H}
              stroke={ann.stroke||'#000'} strokeWidth={(ann.strokeWidth||2)*zoom}
              markerEnd={type==='arrow'?`url(#arr-${ann.id})`:'none'}
            />
          </svg>
        </div>
      );
    }

    if (type === 'link')
      return <div style={{ ...base, border: isSelected ? '2px solid #3b82f6' : '1px dashed #60a5fa', background:'rgba(96,165,250,0.05)', borderRadius:2, padding:'2px 4px', overflow:'hidden' }}
        onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU}>
        <span style={{ fontSize:(ann.fontSize||13)*zoom, color:'#2563eb', textDecoration:'underline', fontFamily:'Arial', pointerEvents:'none', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', display:'block' }}>
          {ann.displayText||ann.url||'Link'}
        </span>
      </div>;

    if (type === 'comment')
      return (
        <div style={{ position:'absolute', left:dx, top:dy, width:28*zoom, height:28*zoom, zIndex:5 }}
          onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU}>
          <div style={{ width:'100%', height:'100%', background:ann.color||'#facc15', borderRadius:'50% 50% 50% 0', transform:'rotate(-45deg)', border: isSelected ? '2px solid #3b82f6' : '1.5px solid rgba(0,0,0,0.2)', cursor:'pointer' }}/>
          {isSelected && (
            <div style={{ position:'absolute', top:32*zoom, left:0, zIndex:20, background:'#fffde7', border:'1px solid #e9c46a', borderRadius:8, padding:'8px 10px', minWidth:180, maxWidth:260, boxShadow:'0 4px 16px rgba(0,0,0,0.12)', pointerEvents:'none' }}>
              <p style={{ fontSize:10, color:'#888', marginBottom:3, fontWeight:600 }}>Comment</p>
              <p style={{ fontSize:12, color:'#333', lineHeight:1.5 }}>{ann.text||''}</p>
            </div>
          )}
        </div>
      );

    if (type === 'stamp') {
      const si = STAMP_TYPES.find(s=>s.key===ann.stampType)||STAMP_TYPES[0];
      return <div style={{ ...base, border:`2.5px solid ${si.color}`, background:si.bg, borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', outline: isSelected ? '2px solid #3b82f6' : 'none', outlineOffset:3 }}
        onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU}>
        <span style={{ fontSize:Math.max(8,(ann.fontSize||14)*zoom), fontWeight:700, color:si.color, letterSpacing:2, textTransform:'uppercase', fontFamily:'Arial', pointerEvents:'none', lineHeight:1 }}>
          {si.label}
        </span>
      </div>;
    }

    if (type === 'date_stamp')
      return <div style={{ ...base, background:'transparent', border: isSelected?'1px dashed #3b82f6':'none', padding:'1px 3px' }}
        onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU}>
        <span style={{ fontSize:(ann.fontSize||11)*zoom, color:ann.color||'#000', fontFamily:'monospace', pointerEvents:'none', whiteSpace:'nowrap' }}>
          {ann.text}
        </span>
      </div>;

    return null;
  };

  const isAbsolute = ann.type === 'comment';

  return (
    <>
      {renderAnn()}
      {/* Resize handle */}
      {isSelected && ann.type !== 'comment' && ann.type !== 'line' && ann.type !== 'arrow' && (
        <div
          style={{ position:'absolute', left:dx+dw-7, top:dy+dh-7, width:14, height:14, background:'#3b82f6', border:'2px solid white', borderRadius:3, cursor:'se-resize', zIndex:15 }}
          onPointerDown={onRD} onPointerMove={onRM} onPointerUp={onPU}
        />
      )}
      {/* Controls row */}
      {isSelected && (
        <div style={{ position:'absolute', left:dx, top:dy-26, display:'flex', gap:3, zIndex:16, background:'#1e293b', borderRadius:6, padding:'2px 4px', boxShadow:'0 2px 8px rgba(0,0,0,0.3)' }}>
          <button title="Bring Forward" onClick={e=>{e.stopPropagation();onBringFwd(ann.id,ann.page);}} style={{ color:'#94a3b8', background:'none', border:'none', cursor:'pointer', padding:'2px', display:'flex', alignItems:'center' }}>
            <ArrowUp size={11}/>
          </button>
          <button title="Send Backward" onClick={e=>{e.stopPropagation();onSendBwd(ann.id,ann.page);}} style={{ color:'#94a3b8', background:'none', border:'none', cursor:'pointer', padding:'2px', display:'flex', alignItems:'center' }}>
            <ArrowDown size={11}/>
          </button>
          <button title="Delete" onClick={e=>{e.stopPropagation();onDelete(ann.id,ann.page);}} style={{ color:'#f87171', background:'none', border:'none', cursor:'pointer', padding:'2px', display:'flex', alignItems:'center' }}>
            <Trash2 size={11}/>
          </button>
        </div>
      )}
    </>
  );
};

// ─── PAGE CANVAS ──────────────────────────────────────────────────────────────
const PageCanvas = React.memo(({
  pageIdx, pdfJsDoc, zoom, annotations, activeTool,
  selectedId, onSelect, onAnnUpdate, onAnnDelete, onBringFwd, onSendBwd,
  onPageClick, onDrawPath, drawColor, drawWidth, isVisible,
  onDimsLoaded, dims, activeStampType, onDeselect,
}) => {
  const canvasRef  = useRef(null);
  const drawCvsRef = useRef(null);
  const taskRef    = useRef(null);
  const drawing    = useRef(false);
  const path       = useRef([]);
  const [rendered, setRendered] = useState(false);

  // Render page when visible
  useEffect(() => {
    if (!isVisible || !pdfJsDoc || !canvasRef.current) return;
    let cancelled = false;
    const run = async () => {
      try {
        if (taskRef.current) taskRef.current.cancel();
        const page = await pdfJsDoc.getPage(pageIdx + 1);
        const dpr = Math.min(window.devicePixelRatio, 2);
        const vp  = page.getViewport({ scale: zoom * dpr });
        const css = page.getViewport({ scale: zoom });
        const c   = canvasRef.current;
        if (!c || cancelled) return;
        c.width = vp.width; c.height = vp.height;
        c.style.width = `${css.width}px`; c.style.height = `${css.height}px`;
        if (!dims) onDimsLoaded(pageIdx, { w: css.width, h: css.height, pdfW: css.width / zoom, pdfH: css.height / zoom });
        const task = page.render({ canvasContext: c.getContext('2d'), viewport: vp });
        taskRef.current = task;
        await task.promise;
        if (!cancelled) setRendered(true);
      } catch(e) { if (e.name !== 'RenderingCancelledException') console.error(e); }
    };
    run();
    return () => { cancelled = true; taskRef.current?.cancel(); };
  }, [isVisible, pdfJsDoc, pageIdx, zoom]);

  const W = dims?.w ?? 595 * zoom;
  const H = dims?.h ?? 842 * zoom;

  const onPD = (e) => {
    e.preventDefault();
    if (activeTool === TOOLS.SELECT) { onDeselect(); return; }
    if (activeTool === TOOLS.DRAW) {
      drawing.current = true;
      const r = e.currentTarget.getBoundingClientRect();
      const touches = e.touches?.[0];
      const cx = touches ? touches.clientX : e.clientX;
      const cy = touches ? touches.clientY : e.clientY;
      path.current = [{ x: cx - r.left, y: cy - r.top }];
      e.currentTarget.setPointerCapture?.(e.pointerId);
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    const touches = e.touches?.[0];
    const cx = touches ? touches.clientX : e.clientX;
    const cy = touches ? touches.clientY : e.clientY;
    const xPt = (cx - r.left) / zoom;
    const yPt = (cy - r.top) / zoom;
    onPageClick(pageIdx, xPt, yPt, activeTool, activeStampType);
  };

  const onPM = (e) => {
    if (!drawing.current || activeTool !== TOOLS.DRAW) return;
    const r = e.currentTarget.getBoundingClientRect();
    const touches = e.touches?.[0];
    const cx = touches ? touches.clientX : e.clientX;
    const cy = touches ? touches.clientY : e.clientY;
    const pt = { x: cx - r.left, y: cy - r.top };
    path.current.push(pt);
    const ctx = drawCvsRef.current?.getContext('2d');
    if (!ctx || path.current.length < 2) return;
    const pts = path.current;
    ctx.beginPath();
    ctx.moveTo(pts[pts.length-2].x, pts[pts.length-2].y);
    ctx.lineTo(pt.x, pt.y);
    ctx.strokeStyle = drawColor; ctx.lineWidth = drawWidth;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
  };

  const onPU = () => {
    if (!drawing.current || activeTool !== TOOLS.DRAW) return;
    drawing.current = false;
    if (path.current.length > 1) {
      const pts = path.current;
      const xs = pts.map(p=>p.x), ys = pts.map(p=>p.y);
      const x0=Math.min(...xs), y0=Math.min(...ys), x1=Math.max(...xs), y1=Math.max(...ys);
      const pad = drawWidth + 4;
      const bx=x0-pad, by=y0-pad, bw=x1-x0+pad*2, bh=y1-y0+pad*2;
      // Crop draw to bounding box
      const tmp = document.createElement('canvas');
      tmp.width = Math.max(1, bw); tmp.height = Math.max(1, bh);
      const tctx = tmp.getContext('2d');
      tctx.drawImage(drawCvsRef.current, bx, by, bw, bh, 0, 0, bw, bh);
      const dataUrl = tmp.toDataURL('image/png');
      // clear preview
      const ctx = drawCvsRef.current?.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, W, H);
      onDrawPath(pageIdx, dataUrl, bx/zoom, by/zoom, bw/zoom, bh/zoom);
    }
    path.current = [];
  };

  const pageAnns = annotations[pageIdx] || [];

  return (
    <div
      className="relative select-none"
      style={{ width: W, height: H, background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.18)', borderRadius: 2 }}
      onPointerDown={activeTool === TOOLS.DRAW ? onPD : undefined}
      onPointerMove={activeTool === TOOLS.DRAW ? onPM : undefined}
      onPointerUp={activeTool === TOOLS.DRAW ? onPU : undefined}
      onTouchStart={activeTool === TOOLS.DRAW ? onPD : undefined}
      onTouchMove={activeTool === TOOLS.DRAW ? onPM : undefined}
      onTouchEnd={activeTool === TOOLS.DRAW ? onPU : undefined}
    >
      {/* PDF render canvas */}
      <canvas ref={canvasRef} style={{ position:'absolute', top:0, left:0 }} />

      {/* Draw preview canvas */}
      {activeTool === TOOLS.DRAW && (
        <canvas ref={drawCvsRef} width={W} height={H}
          style={{ position:'absolute', top:0, left:0, pointerEvents:'none', width:W, height:H }} />
      )}

      {/* Annotation overlay — click passthrough for non-draw tools */}
      <div
        style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', pointerEvents: activeTool === TOOLS.DRAW ? 'none' : 'auto' }}
        onPointerDown={activeTool !== TOOLS.DRAW ? onPD : undefined}
      >
        {pageAnns.map(ann => (
          <AnnItem
            key={ann.id} ann={ann} zoom={zoom} pageW={W} pageH={H}
            isSelected={selectedId === ann.id}
            onSelect={onSelect} onUpdate={onAnnUpdate}
            onDelete={onAnnDelete} onBringFwd={onBringFwd} onSendBwd={onSendBwd}
          />
        ))}
      </div>

      {/* Loading shimmer */}
      {!rendered && isVisible && (
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.5s infinite' }} />
      )}
    </div>
  );
});

// ─── THUMBNAIL PANEL ──────────────────────────────────────────────────────────
const ThumbnailPanel = ({ pageCount, currentPage, onJump }) => {
  const refs = useRef({});
  const canvasRefs = useRef({});
  const pdfDocRef = useRef(null);

  // We load our own pdfJsDoc for thumbnails — passed via context later
  // For now, just render page numbers as placeholders until doc is available
  return (
    <div className="flex flex-col gap-2 p-2 overflow-y-auto" style={{ maxHeight:'100%' }}>
      {Array.from({ length: pageCount }, (_, i) => (
        <button key={i} onClick={() => onJump(i)}
          className={`w-full text-xs font-medium rounded-lg py-2 px-1 transition-all ${i === currentPage ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-700'}`}
        >
          <div className="w-full aspect-[210/297] bg-white dark:bg-slate-700 rounded mb-1 flex items-center justify-center border border-slate-200 dark:border-slate-600">
            <FileText size={16} className="opacity-30" />
          </div>
          <span>Page {i + 1}</span>
        </button>
      ))}
    </div>
  );
};

// ─── PROPERTIES PANEL ─────────────────────────────────────────────────────────
const PropertiesPanel = ({ selected, onUpdate }) => {
  if (!selected) return (
    <div className="p-4 text-center text-muted-foreground">
      <Settings2 size={24} className="mx-auto mb-2 opacity-30" />
      <p className="text-xs">Select an element to edit its properties</p>
    </div>
  );

  const u = (patch) => onUpdate(selected.id, selected.page, patch);
  const { type } = selected;

  return (
    <div className="p-3 space-y-3 overflow-y-auto text-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Properties — {type}</p>

      {/* Text properties */}
      {(type === 'text') && (
        <>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Font Size</label>
            <select value={selected.fontSize||14} onChange={e=>u({fontSize:+e.target.value})}
              className="w-full border border-border rounded px-2 py-1 text-sm bg-background">
              {FONT_SIZES.map(s=><option key={s} value={s}>{s}px</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Font Family</label>
            <select value={selected.fontFamily||'Arial'} onChange={e=>u({fontFamily:e.target.value})}
              className="w-full border border-border rounded px-2 py-1 text-sm bg-background">
              {FONT_FAMILIES.map(f=><option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={()=>u({bold:!selected.bold})}
              className={`flex-1 border rounded py-1 text-xs font-bold transition-colors ${selected.bold?'bg-primary text-white border-primary':'border-border hover:bg-muted'}`}>B</button>
            <button onClick={()=>u({italic:!selected.italic})}
              className={`flex-1 border rounded py-1 text-xs italic transition-colors ${selected.italic?'bg-primary text-white border-primary':'border-border hover:bg-muted'}`}>I</button>
            <button onClick={()=>u({underline:!selected.underline})}
              className={`flex-1 border rounded py-1 text-xs underline transition-colors ${selected.underline?'bg-primary text-white border-primary':'border-border hover:bg-muted'}`}>U</button>
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Text Color</label>
            <input type="color" value={selected.color||'#000000'} onChange={e=>u({color:e.target.value})}
              className="w-full h-8 rounded border border-border cursor-pointer" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Background</label>
            <input type="color" value={selected.bgColor||'#ffffff'} onChange={e=>u({bgColor:e.target.value})}
              className="w-full h-8 rounded border border-border cursor-pointer" />
          </div>
        </>
      )}

      {/* Shape properties */}
      {(type === 'rect' || type === 'circle') && (
        <>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Stroke Color</label>
            <input type="color" value={selected.stroke||'#000000'} onChange={e=>u({stroke:e.target.value})}
              className="w-full h-8 rounded border border-border cursor-pointer" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Fill Color</label>
            <input type="color" value={selected.fill||'#ffffff'} onChange={e=>u({fill:e.target.value})}
              className="w-full h-8 rounded border border-border cursor-pointer" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Stroke Width: {selected.strokeWidth||2}px</label>
            <input type="range" min="1" max="10" value={selected.strokeWidth||2} onChange={e=>u({strokeWidth:+e.target.value})}
              className="w-full" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Opacity: {Math.round((selected.opacity??1)*100)}%</label>
            <input type="range" min="0.1" max="1" step="0.05" value={selected.opacity??1} onChange={e=>u({opacity:+e.target.value})}
              className="w-full" />
          </div>
        </>
      )}

      {/* Line/Arrow */}
      {(type === 'line' || type === 'arrow') && (
        <>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Color</label>
            <input type="color" value={selected.stroke||'#000000'} onChange={e=>u({stroke:e.target.value})}
              className="w-full h-8 rounded border border-border cursor-pointer" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Width: {selected.strokeWidth||2}px</label>
            <input type="range" min="1" max="12" value={selected.strokeWidth||2} onChange={e=>u({strokeWidth:+e.target.value})}
              className="w-full" />
          </div>
        </>
      )}

      {/* Highlight */}
      {type === 'highlight' && (
        <>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Color</label>
            <div className="flex flex-wrap gap-2">
              {HIGHLIGHT_COLORS.map(c=>(
                <button key={c} onClick={()=>u({color:c})}
                  style={{ width:24, height:24, background:c, borderRadius:4, border: selected.color===c?'3px solid #3b82f6':'2px solid transparent' }} />
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Opacity: {Math.round((selected.opacity??0.4)*100)}%</label>
            <input type="range" min="0.1" max="0.9" step="0.05" value={selected.opacity??0.4} onChange={e=>u({opacity:+e.target.value})}
              className="w-full" />
          </div>
        </>
      )}

      {/* Stamp */}
      {type === 'stamp' && (
        <div>
          <label className="text-xs text-muted-foreground block mb-2">Stamp Type</label>
          <div className="space-y-1">
            {STAMP_TYPES.map(s=>(
              <button key={s.key} onClick={()=>u({stampType:s.key})}
                className={`w-full px-2 py-1 rounded border-2 font-bold text-xs tracking-widest ${selected.stampType===s.key?'ring-2 ring-primary ring-offset-1':''}`}
                style={{ borderColor:s.color, color:s.color, background:s.bg }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Comment */}
      {type === 'comment' && (
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Comment Text</label>
          <textarea value={selected.text||''} onChange={e=>u({text:e.target.value})}
            className="w-full h-20 resize-none border border-border rounded p-2 text-xs bg-transparent outline-none focus:ring-1 focus:ring-primary" />
          <label className="text-xs text-muted-foreground block mb-1 mt-2">Pin Color</label>
          <div className="flex gap-2 flex-wrap">
            {['#facc15','#f87171','#60a5fa','#4ade80','#c084fc'].map(c=>(
              <button key={c} onClick={()=>u({color:c})}
                style={{ width:22, height:22, background:c, borderRadius:'50% 50% 50% 0', transform:'rotate(-45deg)', border: selected.color===c?'2px solid #3b82f6':'1.5px solid rgba(0,0,0,0.15)' }} />
            ))}
          </div>
        </div>
      )}

      {/* Common: delete */}
      <button onClick={()=>onUpdate(selected.id, selected.page, null, true)}
        className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs font-medium transition-colors mt-2">
        <Trash2 size={12}/> Delete Element
      </button>
    </div>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function EditPdfOnlinePage() {
  // ── State ──
  const [pdfFile, setPdfFile]       = useState(null);       // original File object
  const [pdfBytes, setPdfBytes]     = useState(null);       // Uint8Array of original
  const [pdfJsDoc, setPdfJsDoc]     = useState(null);
  const [pageCount, setPageCount]   = useState(0);
  const [zoom, setZoom]             = useState(1.0);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTool, setActiveTool] = useState(TOOLS.SELECT);
  const [activeStamp, setActiveStamp] = useState('APPROVED');
  const [activeHighlight, setActiveHighlight] = useState(HIGHLIGHT_COLORS[0]);
  const [drawColor, setDrawColor]   = useState('#000000');
  const [drawWidth, setDrawWidth]   = useState(3);
  const [shapeFill, setShapeFill]   = useState('transparent');
  const [shapeStroke, setShapeStroke] = useState('#000000');
  const [shapeStrokeW, setShapeStrokeW] = useState(2);

  const [annotations, setAnnotations]   = useState({}); // {pageIdx: Annotation[]}
  const [selectedId, setSelectedId]     = useState(null);
  const [history, setHistory]           = useState([{}]);
  const [histIdx, setHistIdx]           = useState(0);
  const [dims, setDims]                 = useState({}); // {pageIdx: {w,h,pdfW,pdfH}}
  const [visiblePages, setVisiblePages] = useState(new Set([0, 1]));
  const [leftOpen, setLeftOpen]         = useState(true);
  const [rightOpen, setRightOpen]       = useState(true);
  const [exporting, setExporting]       = useState(false);
  const [searchText, setSearchText]     = useState('');
  const [showSearch, setShowSearch]     = useState(false);
  const [showSigModal, setShowSigModal] = useState(false);
  const [pendingSigPlace, setPendingSigPlace] = useState(false);
  const [sigDataUrl, setSigDataUrl]     = useState(null);
  const [showLinkDlg, setShowLinkDlg]   = useState(false);
  const [pendingLinkPos, setPendingLinkPos] = useState(null);
  const [showCommentDlg, setShowCommentDlg] = useState(false);
  const [pendingCommentPos, setPendingCommentPos] = useState(null);

  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // ── Derived ──
  const selectedAnn = useMemo(() => {
    if (!selectedId) return null;
    for (const pg of Object.values(annotations)) {
      const f = pg.find(a => a.id === selectedId);
      if (f) return f;
    }
    return null;
  }, [selectedId, annotations]);

  // ── History helpers ──
  const pushHistory = useCallback((newAnns) => {
    setHistory(prev => {
      const sliced = prev.slice(0, histIdx + 1);
      sliced.push(newAnns);
      return sliced.slice(-50);
    });
    setHistIdx(prev => Math.min(49, prev + 1));
  }, [histIdx]);

  const undo = useCallback(() => {
    if (histIdx === 0) return;
    const newIdx = histIdx - 1;
    setHistIdx(newIdx);
    setAnnotations(history[newIdx]);
    setSelectedId(null);
  }, [histIdx, history]);

  const redo = useCallback(() => {
    if (histIdx >= history.length - 1) return;
    const newIdx = histIdx + 1;
    setHistIdx(newIdx);
    setAnnotations(history[newIdx]);
    setSelectedId(null);
  }, [histIdx, history]);

  // ── Annotation mutators ──
  const addAnn = useCallback((pageIdx, ann) => {
    setAnnotations(prev => {
      const next = { ...prev, [pageIdx]: [...(prev[pageIdx] || []), ann] };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const updateAnn = useCallback((id, pageIdx, patch, del = false) => {
    setAnnotations(prev => {
      const list = prev[pageIdx] || [];
      const next = del
        ? { ...prev, [pageIdx]: list.filter(a => a.id !== id) }
        : { ...prev, [pageIdx]: list.map(a => a.id === id ? { ...a, ...patch } : a) };
      pushHistory(next);
      if (del) setSelectedId(null);
      return next;
    });
  }, [pushHistory]);

  const deleteAnn = useCallback((id, pageIdx) => updateAnn(id, pageIdx, null, true), [updateAnn]);

  const bringFwd = useCallback((id, pageIdx) => {
    setAnnotations(prev => {
      const list = [...(prev[pageIdx] || [])];
      const i = list.findIndex(a => a.id === id);
      if (i < list.length - 1) [list[i], list[i+1]] = [list[i+1], list[i]];
      const next = { ...prev, [pageIdx]: list };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const sendBwd = useCallback((id, pageIdx) => {
    setAnnotations(prev => {
      const list = [...(prev[pageIdx] || [])];
      const i = list.findIndex(a => a.id === id);
      if (i > 0) [list[i], list[i-1]] = [list[i-1], list[i]];
      const next = { ...prev, [pageIdx]: list };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  // ── Page dimensions ──
  const onDimsLoaded = useCallback((pageIdx, d) => {
    setDims(prev => ({ ...prev, [pageIdx]: d }));
  }, []);

  // ── Virtual scroll ──
  const handleScroll = useCallback(() => {
    const el = scrollRef.current; if (!el) return;
    const { scrollTop, clientHeight } = el;
    const visible = new Set();
    let y = 0;
    for (let i = 0; i < pageCount; i++) {
      const ph = (dims[i]?.h || 842 * zoom) + PAGE_GAP;
      if (y + ph > scrollTop - 300 && y < scrollTop + clientHeight + 300) {
        visible.add(i);
        if (y + ph / 2 > scrollTop && y + ph / 2 < scrollTop + clientHeight) {
          setCurrentPage(i);
        }
      }
      y += ph;
    }
    setVisiblePages(visible);
  }, [pageCount, dims, zoom]);

  useEffect(() => {
    handleScroll();
  }, [zoom, dims]);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const h = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') { e.preventDefault(); undo(); }
        if (e.key === 'y' || (e.shiftKey && e.key === 'Z')) { e.preventDefault(); redo(); }
      }
      if (e.key === 'Escape') { setSelectedId(null); setActiveTool(TOOLS.SELECT); }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedAnn && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
          deleteAnn(selectedAnn.id, selectedAnn.page);
        }
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [undo, redo, selectedAnn, deleteAnn]);

  // ── File upload ──
  const loadPdf = useCallback(async (file) => {
    if (!file) return;
    if (file.size > MAX_HARD_BYTES) {
      toast.error('File exceeds 150MB limit.'); return;
    }
    if (file.size > MAX_WARN_BYTES) {
      toast.warning('Large file — rendering may be slow for 50MB+ PDFs.');
    }
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const doc   = await pdfjsLib.getDocument({ data: bytes }).promise;
      setPdfFile(file);
      setPdfBytes(bytes);
      setPdfJsDoc(doc);
      setPageCount(doc.numPages);
      setAnnotations({});
      setHistory([{}]);
      setHistIdx(0);
      setSelectedId(null);
      setZoom(1.0);
      setCurrentPage(0);
      setVisiblePages(new Set([0, 1, 2]));
      setTimeout(() => scrollRef.current?.scrollTo(0, 0), 50);
      toast.success(`Loaded: ${file.name} (${doc.numPages} pages)`);
    } catch (err) {
      if (err.message?.includes('password')) toast.error('This PDF is password-protected.');
      else toast.error('Failed to load PDF. File may be corrupted.');
      console.error(err);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    onDrop: (files) => loadPdf(files[0]),
    noClick: !!pdfJsDoc,
    multiple: false,
  });

  // ── Page click handler ──
  const onPageClick = useCallback((pageIdx, xPt, yPt, tool, stampType) => {
    const W = dims[pageIdx]?.pdfW || 595;
    const H = dims[pageIdx]?.pdfH || 842;
    const defaultW = W * 0.25;
    const defaultH = 40;

    if (tool === TOOLS.TEXT) {
      addAnn(pageIdx, { id: genId(), type:'text', page:pageIdx, xPt, yPt, wPt: defaultW, hPt: defaultH, text:'', fontSize:14, fontFamily:'Arial', color:'#000000', bold:false, italic:false, underline:false });
    } else if (tool === TOOLS.WHITEOUT) {
      addAnn(pageIdx, { id: genId(), type:'whiteout', page:pageIdx, xPt, yPt, wPt:defaultW, hPt:defaultH });
    } else if (tool === TOOLS.HIGHLIGHT) {
      addAnn(pageIdx, { id: genId(), type:'highlight', page:pageIdx, xPt, yPt, wPt:defaultW, hPt:24, color:activeHighlight, opacity:0.4 });
    } else if (tool === TOOLS.RECT) {
      addAnn(pageIdx, { id: genId(), type:'rect', page:pageIdx, xPt, yPt, wPt:defaultW, hPt:defaultH, stroke:shapeStroke, fill:shapeFill, strokeWidth:shapeStrokeW, opacity:1 });
    } else if (tool === TOOLS.CIRCLE) {
      addAnn(pageIdx, { id: genId(), type:'circle', page:pageIdx, xPt, yPt, wPt:defaultW, hPt:defaultH, stroke:shapeStroke, fill:shapeFill, strokeWidth:shapeStrokeW, opacity:1 });
    } else if (tool === TOOLS.LINE) {
      addAnn(pageIdx, { id: genId(), type:'line', page:pageIdx, xPt, yPt, wPt:defaultW, hPt:4, stroke:shapeStroke, strokeWidth:shapeStrokeW });
    } else if (tool === TOOLS.ARROW) {
      addAnn(pageIdx, { id: genId(), type:'arrow', page:pageIdx, xPt, yPt, wPt:defaultW, hPt:4, stroke:shapeStroke, strokeWidth:shapeStrokeW });
    } else if (tool === TOOLS.SIGNATURE) {
      if (sigDataUrl) {
        addAnn(pageIdx, { id: genId(), type:'signature', page:pageIdx, xPt, yPt, wPt:defaultW, hPt:defaultW*0.3, dataUrl:sigDataUrl });
        setPendingSigPlace(false);
      }
    } else if (tool === TOOLS.LINK) {
      setPendingLinkPos({ pageIdx, xPt, yPt, wPt:defaultW, hPt:24 });
      setShowLinkDlg(true);
    } else if (tool === TOOLS.COMMENT) {
      setPendingCommentPos({ pageIdx, xPt, yPt });
      setShowCommentDlg(true);
    } else if (tool === TOOLS.DATE_STAMP) {
      addAnn(pageIdx, { id: genId(), type:'date_stamp', page:pageIdx, xPt, yPt, wPt:W*0.3, hPt:20, text:fmtDate(), fontSize:11, color:'#1e293b' });
    } else if (tool === TOOLS.STAMP) {
      addAnn(pageIdx, { id: genId(), type:'stamp', page:pageIdx, xPt, yPt, wPt:W*0.3, hPt:50, stampType:stampType||'APPROVED', fontSize:16 });
    }
  }, [dims, addAnn, activeHighlight, shapeStroke, shapeFill, shapeStrokeW, sigDataUrl]);

  const onDrawPath = useCallback((pageIdx, dataUrl, xPt, yPt, wPt, hPt) => {
    addAnn(pageIdx, { id: genId(), type:'draw', page:pageIdx, xPt, yPt, wPt, hPt, dataUrl });
  }, [addAnn]);

  // ── Image insert ──
  const insertImage = useCallback((e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const r = new FileReader();
    r.onload = (ev) => {
      const dataUrl = ev.target.result;
      const d = dims[currentPage];
      const W = d?.pdfW || 595;
      const H = d?.pdfH || 842;
      addAnn(currentPage, { id: genId(), type:'image', page:currentPage, xPt: W*0.1, yPt: H*0.1, wPt: W*0.4, hPt: W*0.3, dataUrl });
    };
    r.readAsDataURL(file);
    e.target.value = '';
  }, [addAnn, currentPage, dims]);

  // ── Export ──
  const exportPdf = useCallback(async () => {
    if (!pdfBytes) return;
    setExporting(true);
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      const pages  = pdfDoc.getPages();
      const font   = await pdfDoc.embedFont(StandardFonts.Helvetica);

      for (const [pidxStr, anns] of Object.entries(annotations)) {
        const pidx = parseInt(pidxStr);
        const page = pages[pidx];
        if (!page) continue;
        const pH = page.getHeight();
        const pW = page.getWidth();
        const d  = dims[pidx];

        for (const ann of anns) {
          // Convert from pt coords (top-left origin) to pdf-lib (bottom-left origin)
          const x  = ann.xPt;
          const y  = pH - ann.yPt - ann.hPt;
          const w  = ann.wPt;
          const h  = ann.hPt;

          try {
            if (ann.type === 'whiteout') {
              page.drawRectangle({ x, y, width: Math.max(1,w), height: Math.max(1,h), color: rgb(1,1,1), borderColor: rgb(1,1,1) });
            } else if (ann.type === 'highlight') {
              const c = hex2rgb01(ann.color || '#facc15');
              page.drawRectangle({ x, y, width: Math.max(1,w), height: Math.max(1,h), color: rgb(c.r, c.g, c.b), opacity: ann.opacity ?? 0.4 });
            } else if (ann.type === 'text') {
              if (ann.text?.trim()) {
                const c = hex2rgb01(ann.color || '#000000');
                const fontSize = Math.max(4, ann.fontSize || 14);
                // Draw background if set and not transparent
                if (ann.bgColor && ann.bgColor !== 'transparent' && ann.bgColor !== '#ffffff00') {
                  const bg = hex2rgb01(ann.bgColor);
                  page.drawRectangle({ x, y, width: Math.max(1,w), height: Math.max(1,h), color: rgb(bg.r, bg.g, bg.b) });
                }
                const lines = (ann.text || '').split('\n');
                lines.forEach((line, li) => {
                  if (!line.trim()) return;
                  const lineY = y + h - fontSize * 1.3 * (li + 1);
                  page.drawText(line, { x: x + 2, y: Math.max(0, lineY), size: fontSize, font, color: rgb(c.r, c.g, c.b), maxWidth: Math.max(10, w) });
                });
              }
            } else if (ann.type === 'signature' || ann.type === 'image') {
              const bytes2 = dataUrlToBytes(ann.dataUrl);
              let embedded;
              if (ann.dataUrl.startsWith('data:image/png')) embedded = await pdfDoc.embedPng(bytes2);
              else embedded = await pdfDoc.embedJpg(bytes2);
              page.drawImage(embedded, { x, y, width: Math.max(1,w), height: Math.max(1,h) });
            } else if (ann.type === 'draw') {
              const bytes2 = dataUrlToBytes(ann.dataUrl);
              const embedded = await pdfDoc.embedPng(bytes2);
              page.drawImage(embedded, { x, y, width: Math.max(1,w), height: Math.max(1,h) });
            } else if (ann.type === 'rect') {
              const sc = hex2rgb01(ann.stroke || '#000000');
              const bc = ann.fill && ann.fill !== 'transparent' ? hex2rgb01(ann.fill) : null;
              page.drawRectangle({ x, y, width: Math.max(1,w), height: Math.max(1,h), borderColor: rgb(sc.r,sc.g,sc.b), borderWidth: ann.strokeWidth||2, color: bc ? rgb(bc.r,bc.g,bc.b) : undefined, opacity: ann.opacity??1 });
            } else if (ann.type === 'circle') {
              const sc = hex2rgb01(ann.stroke || '#000000');
              const bc = ann.fill && ann.fill !== 'transparent' ? hex2rgb01(ann.fill) : null;
              page.drawEllipse({ x: x + w/2, y: y + h/2, xScale: w/2, yScale: h/2, borderColor: rgb(sc.r,sc.g,sc.b), borderWidth: ann.strokeWidth||2, color: bc ? rgb(bc.r,bc.g,bc.b) : undefined, opacity: ann.opacity??1 });
            } else if (ann.type === 'line' || ann.type === 'arrow') {
              const sc = hex2rgb01(ann.stroke || '#000000');
              page.drawLine({ start: { x, y }, end: { x: x+w, y: y+h }, thickness: ann.strokeWidth||2, color: rgb(sc.r,sc.g,sc.b) });
            } else if (ann.type === 'link') {
              page.drawText(ann.displayText || ann.url || 'Link', { x: x+2, y: y+2, size: ann.fontSize||13, font, color: rgb(0.15,0.39,0.92) });
            } else if (ann.type === 'comment') {
              // Draw a yellow dot + text
              page.drawCircle({ x: x+10, y: pH - ann.yPt - 10, size: 8, color: rgb(0.98,0.8,0.08), borderColor: rgb(0.6,0.4,0), borderWidth: 1 });
            } else if (ann.type === 'stamp') {
              const si = STAMP_TYPES.find(s=>s.key===ann.stampType)||STAMP_TYPES[0];
              const c  = hex2rgb01(si.color);
              const bg = hex2rgb01(si.bg.replace('rgba(','').split(',')[0]+'000000'.slice(0, 6-si.bg.replace('rgba(','').split(',')[0].length));
              page.drawRectangle({ x, y, width: Math.max(1,w), height: Math.max(1,h), borderColor: rgb(c.r,c.g,c.b), borderWidth: 2.5, opacity: 0.9 });
              const textW = si.label.length * (ann.fontSize||14) * 0.55;
              page.drawText(si.label, { x: x + (w - textW)/2, y: y + (h - (ann.fontSize||14))/2, size: ann.fontSize||14, font, color: rgb(c.r,c.g,c.b) });
            } else if (ann.type === 'date_stamp') {
              const c = hex2rgb01(ann.color||'#1e293b');
              page.drawText(ann.text||'', { x: x+2, y: y+2, size: ann.fontSize||11, font, color: rgb(c.r,c.g,c.b) });
            }
          } catch(annErr) {
            console.warn('Annotation export error:', annErr);
          }
        }
      }

      const outBytes = await pdfDoc.save();
      const blob = new Blob([outBytes], { type: 'application/pdf' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url;
      a.download = (pdfFile?.name?.replace('.pdf','') || 'edited') + '_edited.pdf';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      toast.success('PDF exported successfully!');
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Export failed: ' + err.message);
    } finally {
      setExporting(false);
    }
  }, [pdfBytes, annotations, dims, pdfFile]);

  // ── Jump to page ──
  const jumpToPage = useCallback((idx) => {
    const el = scrollRef.current; if (!el) return;
    let y = 0;
    for (let i = 0; i < idx; i++) y += (dims[i]?.h || 842 * zoom) + PAGE_GAP;
    el.scrollTo({ top: y, behavior: 'smooth' });
  }, [dims, zoom]);

  // ── Zoom ──
  const zoomIn  = () => setZoom(z => Math.min(2, +(z + 0.25).toFixed(2)));
  const zoomOut = () => setZoom(z => Math.max(0.25, +(z - 0.25).toFixed(2)));
  const zoomFit = () => {
    const el = scrollRef.current; if (!el) return;
    const d = dims[currentPage]; if (!d) return;
    setZoom(+(el.clientWidth / d.pdfW - 0.05).toFixed(2));
  };

  // ── Tool icon map ──
  const TOOL_ICONS = [
    { tool: TOOLS.SELECT,    icon: <MousePointer2 size={16}/>, label:'Select' },
    { tool: TOOLS.TEXT,      icon: <Type size={16}/>,          label:'Text' },
    { tool: TOOLS.WHITEOUT,  icon: <Square size={16}/>,        label:'Whiteout' },
    { tool: TOOLS.HIGHLIGHT, icon: <Highlighter size={16}/>,   label:'Highlight' },
    { tool: TOOLS.DRAW,      icon: <Pencil size={16}/>,        label:'Draw' },
    { tool: TOOLS.RECT,      icon: <Square size={16}/>,        label:'Rectangle' },
    { tool: TOOLS.CIRCLE,    icon: <Circle size={16}/>,        label:'Circle' },
    { tool: TOOLS.LINE,      icon: <Minus size={16}/>,         label:'Line' },
    { tool: TOOLS.ARROW,     icon: <ChevronRight size={16}/>,  label:'Arrow' },
    { tool: TOOLS.IMAGE,     icon: <ImageIcon size={16}/>,     label:'Image' },
    { tool: TOOLS.SIGNATURE, icon: <PenTool size={16}/>,       label:'Signature' },
    { tool: TOOLS.LINK,      icon: <Link2 size={16}/>,         label:'Link' },
    { tool: TOOLS.COMMENT,   icon: <MessageSquare size={16}/>, label:'Comment' },
    { tool: TOOLS.DATE_STAMP,icon: <Clock size={16}/>,         label:'Date & Time' },
    { tool: TOOLS.STAMP,     icon: <Tag size={16}/>,           label:'Stamps' },
  ];

  const MOBILE_TOOLS = TOOL_ICONS.slice(0, 7);

  // ─── Upload Screen ───────────────────────────────────────────────────────────
  if (!pdfJsDoc) {
    return (
      <ToolPageTemplate toolData={toolPageData['edit-pdf-online']}>
        <div
          {...getRootProps()}
          className={`relative flex flex-col items-center justify-center min-h-[400px] rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer ${isDragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border hover:border-primary/50 hover:bg-primary/3'}`}
          style={{ background: isDragActive ? 'rgba(var(--primary),0.04)' : undefined }}
        >
          <input {...getInputProps()} />
          <motion.div
            animate={isDragActive ? { scale: 1.08 } : { scale: 1 }}
            className="flex flex-col items-center gap-5 py-12 px-8 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Upload size={36} className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">{isDragActive ? 'Drop your PDF here!' : 'Upload PDF to Edit'}</h2>
              <p className="text-muted-foreground text-sm max-w-sm">Drag & drop your PDF or click to browse. Edit text, add signatures, highlights, stamps and more — all in your browser.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground font-medium">
              {[['🔒','100% Secure'],['⚡','Fast & Free'],['📱','Mobile Friendly'],['🌐','Browser-Based']].map(([e,t])=>(
                <span key={t} className="flex items-center gap-1 bg-muted/50 px-3 py-1 rounded-full">{e} {t}</span>
              ))}
            </div>
            <Button size="lg" className="px-8 mt-2">
              <FileText size={16} className="mr-2" /> Select PDF File
            </Button>
            <p className="text-xs text-muted-foreground">Warning shown at 50MB · Hard limit 150MB</p>
          </motion.div>
        </div>

        {/* SEO Content */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title:'✏️ Edit PDF Text', desc:'Add new text boxes, choose font, size, color. Whiteout existing content and overlay corrected text — no need for Adobe.' },
            { title:'✍️ Add Signatures', desc:'Draw your signature with a mouse or touch, type it, or upload a signature image. Drag, resize and place it anywhere.' },
            { title:'🖊️ Highlight & Annotate', desc:'Highlight text in yellow, green, blue or red. Add comments, arrows, shapes and freehand drawings.' },
            { title:'📋 PDF Stamps', desc:'Place professional stamps: APPROVED, DRAFT, PAID, CONFIDENTIAL, RECEIVED. Resize and reposition freely.' },
            { title:'🖼️ Insert Images', desc:'Upload PNG or JPG files to embed into your PDF. Resize and position images on any page.' },
            { title:'💾 Download Edited PDF', desc:'Click Download to generate a flattened PDF with all edits baked in permanently. No registration required.' },
          ].map(({ title, desc }) => (
            <div key={title} className="p-5 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
              <h3 className="font-bold mb-2 text-sm">{title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </ToolPageTemplate>
    );
  }

  // ─── Editor Workspace ─────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .pdf-editor-toolbar button { transition: all 0.15s ease; }
        .pdf-editor-toolbar button:hover { transform: scale(1.05); }
      `}</style>

      {/* Signature/Link/Comment Modals */}
      <AnimatePresence>
        {showSigModal && (
          <SignatureModal
            onClose={() => setShowSigModal(false)}
            onConfirm={(url) => {
              setSigDataUrl(url);
              setPendingSigPlace(true);
              setActiveTool(TOOLS.SIGNATURE);
              setShowSigModal(false);
              toast.info('Click on the PDF to place your signature');
            }}
          />
        )}
        {showLinkDlg && (
          <LinkDialog
            onClose={() => { setShowLinkDlg(false); setPendingLinkPos(null); }}
            onConfirm={(url, text) => {
              if (pendingLinkPos) {
                addAnn(pendingLinkPos.pageIdx, { id:genId(), type:'link', page:pendingLinkPos.pageIdx, xPt:pendingLinkPos.xPt, yPt:pendingLinkPos.yPt, wPt:pendingLinkPos.wPt, hPt:pendingLinkPos.hPt, url, displayText:text, fontSize:13 });
              }
              setShowLinkDlg(false); setPendingLinkPos(null);
            }}
          />
        )}
        {showCommentDlg && (
          <CommentDialog
            onClose={() => { setShowCommentDlg(false); setPendingCommentPos(null); }}
            onConfirm={(text) => {
              if (pendingCommentPos) {
                addAnn(pendingCommentPos.pageIdx, { id:genId(), type:'comment', page:pendingCommentPos.pageIdx, xPt:pendingCommentPos.xPt, yPt:pendingCommentPos.yPt, wPt:28, hPt:28, text, color:'#facc15' });
              }
              setShowCommentDlg(false); setPendingCommentPos(null);
            }}
          />
        )}
        {exporting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center shadow-2xl">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="font-bold text-lg">Generating PDF…</p>
              <p className="text-sm text-muted-foreground mt-1">Flattening all edits, please wait</p>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden file inputs */}
      <input ref={imageInputRef} type="file" className="hidden" accept="image/*" onChange={insertImage} />

      {/* ── EDITOR SHELL ── */}
      <div className="fixed inset-0 flex flex-col bg-slate-900 text-white z-40" style={{ top: 0 }}>

        {/* ── TOP TOOLBAR ── */}
        <div className="pdf-editor-toolbar flex items-center gap-1 px-3 py-2 bg-slate-800 border-b border-slate-700 shrink-0 overflow-x-auto">
          {/* File name + close */}
          <div className="flex items-center gap-2 mr-2 shrink-0">
            <button onClick={() => { setPdfJsDoc(null); setPdfFile(null); setPdfBytes(null); }} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white">
              <X size={14}/>
            </button>
            <span className="text-xs font-medium text-slate-300 max-w-[120px] truncate hidden sm:block">{pdfFile?.name}</span>
          </div>
          <div className="w-px h-5 bg-slate-700 mx-1 shrink-0"/>

          {/* Tool buttons */}
          {TOOL_ICONS.map(({ tool, icon, label }) => (
            <button key={tool}
              title={label}
              onClick={() => {
                if (tool === TOOLS.IMAGE) { imageInputRef.current?.click(); return; }
                if (tool === TOOLS.SIGNATURE) { setShowSigModal(true); return; }
                setActiveTool(tool);
              }}
              className={`p-1.5 rounded-lg text-xs flex flex-col items-center gap-0.5 min-w-[36px] shrink-0 ${activeTool===tool ? 'bg-primary text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
            >
              {icon}
            </button>
          ))}

          <div className="w-px h-5 bg-slate-700 mx-1 shrink-0"/>

          {/* Draw color picker (show when draw active) */}
          {activeTool === TOOLS.DRAW && (
            <div className="flex items-center gap-1 shrink-0">
              {DRAW_COLORS.map(c=>(
                <button key={c} onClick={()=>setDrawColor(c)}
                  style={{ width:18, height:18, background:c, borderRadius:3, border: drawColor===c?'2px solid white':'1.5px solid rgba(255,255,255,0.2)' }} />
              ))}
              <input type="range" min="1" max="12" value={drawWidth} onChange={e=>setDrawWidth(+e.target.value)}
                className="w-16 ml-1" title="Pen width" />
              <div className="w-px h-5 bg-slate-700 mx-1"/>
            </div>
          )}

          {/* Highlight colors (show when highlight active) */}
          {activeTool === TOOLS.HIGHLIGHT && (
            <div className="flex items-center gap-1 shrink-0">
              {HIGHLIGHT_COLORS.map(c=>(
                <button key={c} onClick={()=>setActiveHighlight(c)}
                  style={{ width:18, height:18, background:c, borderRadius:3, border: activeHighlight===c?'2px solid white':'1.5px solid rgba(255,255,255,0.2)' }} />
              ))}
              <div className="w-px h-5 bg-slate-700 mx-1"/>
            </div>
          )}

          {/* Stamp picker (show when stamp active) */}
          {activeTool === TOOLS.STAMP && (
            <div className="flex items-center gap-1 shrink-0">
              {STAMP_TYPES.map(s=>(
                <button key={s.key} onClick={()=>setActiveStamp(s.key)}
                  className={`px-2 py-0.5 text-xs font-bold rounded border-2 transition-all ${activeStamp===s.key?'bg-opacity-20':'opacity-60'}`}
                  style={{ borderColor:s.color, color:s.color, background: activeStamp===s.key ? s.bg : 'transparent' }}>
                  {s.label.slice(0,4)}
                </button>
              ))}
              <div className="w-px h-5 bg-slate-700 mx-1"/>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1"/>

          {/* Undo/Redo */}
          <button onClick={undo} disabled={histIdx===0} title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30 shrink-0"><Undo2 size={15}/></button>
          <button onClick={redo} disabled={histIdx>=history.length-1} title="Redo (Ctrl+Y)"
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30 shrink-0"><Redo2 size={15}/></button>

          <div className="w-px h-5 bg-slate-700 mx-1 shrink-0"/>

          {/* Zoom */}
          <button onClick={zoomOut} title="Zoom Out" className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white shrink-0"><ZoomOut size={15}/></button>
          <span className="text-xs text-slate-400 min-w-[40px] text-center shrink-0">{Math.round(zoom*100)}%</span>
          <button onClick={zoomIn} title="Zoom In" className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white shrink-0"><ZoomIn size={15}/></button>
          <button onClick={zoomFit} title="Fit Width" className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white shrink-0 text-[10px]">Fit</button>

          <div className="w-px h-5 bg-slate-700 mx-1 shrink-0"/>

          {/* Download */}
          <Button size="sm" onClick={exportPdf} disabled={exporting}
            className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 shrink-0 h-7 gap-1">
            <Download size={13}/> <span className="hidden sm:inline">Download</span>
          </Button>
        </div>

        {/* ── MAIN BODY ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT: Thumbnail panel */}
          <div className={`shrink-0 border-r border-slate-700 bg-slate-850 transition-all duration-300 overflow-hidden ${leftOpen ? 'w-[110px]' : 'w-0'}`}>
            {leftOpen && (
              <div className="h-full overflow-y-auto py-2">
                <ThumbnailPanel pageCount={pageCount} currentPage={currentPage} onJump={jumpToPage} />
              </div>
            )}
          </div>
          <button onClick={()=>setLeftOpen(v=>!v)}
            className="absolute left-0 bottom-20 md:bottom-1/2 z-10 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-r-lg px-1 py-2 transition-colors"
            style={{ left: leftOpen ? 110 : 0, transition: 'left 0.3s' }}>
            {leftOpen ? <ChevronLeft size={12}/> : <ChevronRight size={12}/>}
          </button>

          {/* CENTER: Canvas scroll area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-auto bg-slate-900 relative"
            onScroll={handleScroll}
            onClick={() => setSelectedId(null)}
          >
            <div className="flex flex-col items-center py-6 gap-0" style={{ minHeight:'100%' }}>
              {Array.from({ length: pageCount }, (_, i) => (
                <div key={i} style={{ marginBottom: PAGE_GAP }}>
                  <PageCanvas
                    pageIdx={i}
                    pdfJsDoc={pdfJsDoc}
                    zoom={zoom}
                    annotations={annotations}
                    activeTool={activeTool}
                    selectedId={selectedId}
                    onSelect={(id) => { setSelectedId(id); setRightOpen(true); }}
                    onAnnUpdate={updateAnn}
                    onAnnDelete={deleteAnn}
                    onBringFwd={bringFwd}
                    onSendBwd={sendBwd}
                    onPageClick={onPageClick}
                    onDrawPath={onDrawPath}
                    drawColor={drawColor}
                    drawWidth={drawWidth}
                    isVisible={visiblePages.has(i)}
                    onDimsLoaded={onDimsLoaded}
                    dims={dims[i]}
                    activeStampType={activeStamp}
                    onDeselect={() => setSelectedId(null)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Properties panel */}
          <div className={`shrink-0 border-l border-slate-700 bg-slate-850 overflow-y-auto transition-all duration-300 ${rightOpen && (selectedAnn || activeTool === TOOLS.STAMP) ? 'w-[200px]' : 'w-0'}`}>
            {rightOpen && (
              <div className="text-sm text-slate-200">
                {activeTool === TOOLS.STAMP && !selectedAnn ? (
                  <StampPicker onPick={(k) => setActiveStamp(k)} />
                ) : (
                  <PropertiesPanel
                    selected={selectedAnn}
                    onUpdate={(id, pg, patch, del) => {
                      if (del) deleteAnn(id, pg);
                      else updateAnn(id, pg, patch);
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── PAGE INDICATOR (desktop) ── */}
        <div className="hidden md:flex items-center justify-center gap-3 py-1.5 bg-slate-800 border-t border-slate-700 text-xs text-slate-400 shrink-0">
          <button onClick={()=>jumpToPage(Math.max(0,currentPage-1))} className="hover:text-white"><ChevronLeft size={14}/></button>
          <span>Page {currentPage+1} / {pageCount}</span>
          <button onClick={()=>jumpToPage(Math.min(pageCount-1,currentPage+1))} className="hover:text-white"><ChevronRight size={14}/></button>
          <div className="w-px h-3 bg-slate-600"/>
          <span className="text-slate-500">{Object.values(annotations).flat().length} edits</span>
        </div>

        {/* ── MOBILE BOTTOM DOCK ── */}
        <div className="md:hidden flex items-center justify-around px-2 py-1.5 bg-slate-800 border-t border-slate-700 shrink-0">
          {MOBILE_TOOLS.map(({ tool, icon, label }) => (
            <button key={tool}
              onClick={() => {
                if (tool === TOOLS.IMAGE) { imageInputRef.current?.click(); return; }
                if (tool === TOOLS.SIGNATURE) { setShowSigModal(true); return; }
                setActiveTool(tool);
              }}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] ${activeTool===tool ? 'text-primary' : 'text-slate-400'}`}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
          <button onClick={exportPdf}
            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] text-green-400">
            <Download size={16}/><span>Save</span>
          </button>
        </div>
      </div>
    </>
  );
}
