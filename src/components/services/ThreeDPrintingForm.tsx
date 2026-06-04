import { useState, useRef, useEffect } from 'react';
import { Send, CheckCircle, Upload, X } from 'lucide-react';

type FormState = 'idle' | 'sending' | 'success';

const MATERIALS = ['PLA+', 'PETG', 'TPU'];
const HEAR_OPTIONS = ['Google Search', 'Instagram', 'LinkedIn', 'Friend / Referral', 'Direct / Already knew', 'Other'];

const API = 'http://localhost:4000';

interface ThreeDPrintingFormProps {
  /** Pass the name/email/phone if already filled in parent contact form */
  prefill?: { name?: string; email?: string; phone?: string };
}

export const ThreeDPrintingForm = ({ prefill }: ThreeDPrintingFormProps) => {
  const [status, setStatus] = useState<FormState>('idle');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [infill, setInfill] = useState(20);
  const [material, setMaterial] = useState('');
  const [colorOptions, setColorOptions] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [hearAbout, setHearAbout] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingColors, setLoadingColors] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: prefill?.name || '',
    email: prefill?.email || '',
    phone: prefill?.phone || '',
    details: '',
    extraInfo: '',
  });

  // Sync prefill when it changes (contact page scenario)
  useEffect(() => {
    if (prefill) {
      setForm(f => ({
        ...f,
        name: prefill.name || f.name,
        email: prefill.email || f.email,
        phone: prefill.phone || f.phone,
      }));
    }
  }, [prefill?.name, prefill?.email, prefill?.phone]);

  // Fetch colour options when material changes
  useEffect(() => {
    if (!material) {
      setColorOptions([]);
      setSelectedColor('');
      return;
    }
    setLoadingColors(true);
    setSelectedColor('');
    fetch(`${API}/api/settings/3dprint-colors`)
      .then(r => r.json())
      .then(data => {
        setColorOptions(data[material] || []);
      })
      .catch(() => setColorOptions([]))
      .finally(() => setLoadingColors(false));
  }, [material]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Valid email is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!material) newErrors.material = 'Please select a material';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');

    try {
      // Upload file first if provided
      let fileUrl: string | undefined;
      let filename: string | undefined;
      if (uploadedFile) {
        const formData = new FormData();
        formData.append('file', uploadedFile);
        try {
          const uploadRes = await fetch(`${API}/api/upload`, { method: 'POST', body: formData });
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            fileUrl = uploadData.url;
            filename = uploadData.filename;
          }
        } catch {
          // File upload failure is non-blocking
        }
      }

      // Submit service order
      await fetch(`${API}/api/service-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: '3d-printing',
          name: form.name,
          email: form.email,
          phone: form.phone,
          service: '3D Printing',
          details: form.details,
          material,
          color: selectedColor,
          infill,
          extraInfo: form.extraInfo,
          hearAbout,
          modelFile: fileUrl,
          modelFilename: filename,
        })
      });

      setStatus('success');
    } catch {
      // Still show success if network issue (graceful degradation)
      setStatus('success');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const resetForm = () => {
    setStatus('idle');
    setUploadedFile(null);
    setMaterial('');
    setSelectedColor('');
    setColorOptions([]);
    setInfill(20);
    setHearAbout('');
    setForm(f => ({ ...f, details: '', extraInfo: '' }));
  };

  const inputClass = 'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-montserrat text-sm focus:outline-none focus:border-cosmic-gold transition-all placeholder:text-white/30';
  const labelClass = 'block text-[10px] font-black uppercase tracking-widest text-white/50 mb-2 ml-1';

  if (status === 'success') {
    return (
      <div className="text-center py-16 space-y-6">
        <div className="w-20 h-20 bg-cosmic-gold rounded-full flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle size={40} className="text-cosmic-black" />
        </div>
        <h3 className="text-2xl font-black text-white font-montserrat">Order Sent!</h3>
        <p className="text-white/60 font-montserrat text-sm leading-relaxed max-w-sm mx-auto">
          We will respond within 24 hours. For any query contact:
          <br />
          <a href="mailto:contactkaranaagency@gmail.com" className="text-cosmic-gold hover:underline">
            contactkaranaagency@gmail.com
          </a>
          <br />
          <a href="tel:+917569274373" className="text-cosmic-gold hover:underline">
            +91 75692 74373
          </a>
        </p>
        <button onClick={resetForm} className="px-8 py-3 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all text-sm">
          Send another order
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Full Name *</label>
          <input type="text" placeholder="Your full name" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputClass} />
          {errors.name && <p className="text-red-400 text-[10px] mt-1 ml-1 font-bold">{errors.name}</p>}
        </div>
        <div>
          <label className={labelClass}>Email *</label>
          <input type="email" placeholder="you@example.com" value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputClass} />
          {errors.email && <p className="text-red-400 text-[10px] mt-1 ml-1 font-bold">{errors.email}</p>}
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className={labelClass}>Phone Number *</label>
        <input type="tel" placeholder="+91 98765 43210" value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputClass} />
        {errors.phone && <p className="text-red-400 text-[10px] mt-1 ml-1 font-bold">{errors.phone}</p>}
      </div>

      {/* Service locked */}
      <div>
        <label className={labelClass}>Service Interested In</label>
        <div className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cosmic-gold font-bold font-montserrat text-sm select-none">
          3D Printing
        </div>
      </div>

      {/* Project Details */}
      <div>
        <label className={labelClass}>Project Details</label>
        <textarea rows={3} placeholder="Describe your project, dimensions, quantity, use-case..."
          value={form.details} onChange={e => setForm(f => ({ ...f, details: e.target.value }))} className={inputClass} />
      </div>

      {/* Upload Model */}
      <div>
        <label className={labelClass}>Upload Model <span className="text-white/30 normal-case">(STL, OBJ, STEP, IGES)</span></label>
        <div
          className="relative w-full px-4 py-6 bg-white/5 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-cosmic-gold/60 transition-all group"
          onClick={() => fileInputRef.current?.click()}
        >
          {uploadedFile ? (
            <div className="flex items-center gap-3">
              <span className="text-white/80 text-sm font-montserrat">{uploadedFile.name}</span>
              <button type="button"
                onClick={e => { e.stopPropagation(); setUploadedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                className="text-white/40 hover:text-red-400 transition-colors">
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <Upload size={24} className="text-white/30 group-hover:text-cosmic-gold transition-colors" />
              <span className="text-white/40 text-xs font-montserrat">Click to upload or drag & drop</span>
            </>
          )}
          <input type="file" ref={fileInputRef} accept=".stl,.obj,.step,.stp,.iges,.igs" onChange={handleFileChange} className="hidden" />
        </div>
      </div>

      {/* Material */}
      <div>
        <label className={labelClass}>Choose Material *</label>
        <div className="flex gap-3">
          {MATERIALS.map(m => (
            <button key={m} type="button" onClick={() => setMaterial(m)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all duration-200 ${
                material === m
                  ? 'bg-cosmic-gold text-cosmic-black border-cosmic-gold'
                  : 'bg-white/5 text-white/60 border-white/10 hover:border-cosmic-gold/50'
              }`}>
              {m}
            </button>
          ))}
        </div>
        {errors.material && <p className="text-red-400 text-[10px] mt-1 ml-1 font-bold">{errors.material}</p>}
      </div>

      {/* Colour options — shown after material selected */}
      {material && (
        <div>
          <label className={labelClass}>Choose Colour</label>
          {loadingColors ? (
            <div className="flex gap-2 items-center text-white/30 text-xs font-montserrat">
              <div className="w-4 h-4 border-2 border-white/20 border-t-cosmic-gold rounded-full animate-spin" />
              Loading colours...
            </div>
          ) : colorOptions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {colorOptions.map(color => (
                <button key={color} type="button" onClick={() => setSelectedColor(color === selectedColor ? '' : color)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 ${
                    selectedColor === color
                      ? 'bg-cosmic-gold/20 text-cosmic-gold border-cosmic-gold/60'
                      : 'bg-white/5 text-white/50 border-white/10 hover:border-white/30'
                  }`}>
                  {color}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-white/30 text-xs font-montserrat ml-1">No colour options configured for {material}</p>
          )}
        </div>
      )}

      {/* Infill slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className={labelClass + ' mb-0'}>Infill Density</label>
          <span className="text-cosmic-gold font-black text-sm">{infill}%</span>
        </div>
        <input type="range" min={0} max={100} step={5} value={infill}
          onChange={e => setInfill(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #9CA6B7 ${infill}%, rgba(245,247,250,0.1) ${infill}%)` }}
        />
        <div className="flex justify-between text-[9px] text-white/30 mt-1 font-montserrat">
          <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
        </div>
      </div>

      {/* Extra info */}
      <div>
        <label className={labelClass}>Any Extra / Important Info</label>
        <textarea rows={2} placeholder="Layer height preferences, color requests, urgency notes..."
          value={form.extraInfo} onChange={e => setForm(f => ({ ...f, extraInfo: e.target.value }))} className={inputClass} />
      </div>

      {/* How did you hear */}
      <div>
        <label className={labelClass}>How Did You Hear About Us?</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {HEAR_OPTIONS.map(opt => (
            <button key={opt} type="button" onClick={() => setHearAbout(opt)}
              className={`py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all duration-200 ${
                hearAbout === opt
                  ? 'bg-cosmic-gold/20 text-cosmic-gold border-cosmic-gold/60'
                  : 'bg-white/5 text-white/40 border-white/10 hover:border-white/30'
              }`}>
              {opt}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" disabled={status === 'sending'}
        className="w-full py-4 bg-cosmic-gold text-cosmic-black font-black uppercase tracking-widest rounded-xl hover:bg-cosmic-gold-light transition-all duration-300 flex items-center justify-center gap-3 group shadow-lg disabled:opacity-60">
        {status === 'sending' ? (
          <>
            <div className="w-5 h-5 border-2 border-cosmic-black/30 border-t-cosmic-black rounded-full animate-spin" />
            Sending Order...
          </>
        ) : (
          <>
            Send Order
            <Send size={18} className="group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
};
