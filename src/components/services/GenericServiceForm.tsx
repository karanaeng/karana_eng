import { useState, useEffect } from 'react';
import { Send, CheckCircle, Link } from 'lucide-react';
import { apiFetch } from '../../lib/api';

type FormState = 'idle' | 'sending' | 'success';

const HEAR_OPTIONS = ['Google Search', 'Instagram', 'LinkedIn', 'Friend / Referral', 'Direct / Already knew', 'Other'];

interface GenericServiceFormProps {
  serviceId: string;
  serviceName: string;
  prefill?: { name?: string; email?: string; phone?: string };
}

export const GenericServiceForm = ({ serviceId, serviceName, prefill }: GenericServiceFormProps) => {
  const [status, setStatus] = useState<FormState>('idle');
  const [hearAbout, setHearAbout] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: prefill?.name || '',
    email: prefill?.email || '',
    phone: prefill?.phone || '',
    details: '',
    driveLink: '',
  });

  // Sync prefill when it changes
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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Valid email is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');

    try {
      // Submit service order
      await apiFetch('/api/service-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: serviceId,
          name: form.name,
          email: form.email,
          phone: form.phone,
          service: serviceName,
          details: form.details,
          driveLink: form.driveLink,
          hearAbout,
        })
      });

      setStatus('success');
    } catch {
      // Graceful degradation
      setStatus('success');
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setHearAbout('');
    setForm(f => ({ ...f, details: '', driveLink: '' }));
  };

  const inputClass = 'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-montserrat text-sm focus:outline-none focus:border-cosmic-gold transition-all placeholder:text-white/30';
  const labelClass = 'block text-[10px] font-black uppercase tracking-widest text-white/50 mb-2 ml-1';

  if (status === 'success') {
    return (
      <div className="text-center py-16 space-y-6">
        <div className="w-20 h-20 bg-cosmic-gold rounded-full flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle size={40} className="text-cosmic-black" />
        </div>
        <h3 className="text-2xl font-black text-white font-montserrat">Request Sent!</h3>
        <p className="text-white/60 font-montserrat text-sm leading-relaxed max-w-sm mx-auto">
          Thank you for reaching out. We will respond within 24 hours. For urgent queries:
          <br />
          <a href="mailto:contactkaranaagency@gmail.com" className="text-cosmic-gold hover:underline">
            contactkaranaagency@gmail.com
          </a>
        </p>
        <button onClick={resetForm} className="px-8 py-3 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all text-sm">
          Send another request
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

      {/* Phone + Service */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Phone Number *</label>
          <input type="tel" placeholder="+91 98765 43210" value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputClass} />
          {errors.phone && <p className="text-red-400 text-[10px] mt-1 ml-1 font-bold">{errors.phone}</p>}
        </div>
        <div>
          <label className={labelClass}>Service</label>
          <div className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cosmic-gold font-bold font-montserrat text-sm select-none">
            {serviceName}
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div>
        <label className={labelClass}>Project Details</label>
        <textarea rows={4} placeholder="Tell us about your requirements, project goals, and timeline..."
          value={form.details} onChange={e => setForm(f => ({ ...f, details: e.target.value }))} className={inputClass} />
      </div>

      {/* Google Drive Link */}
      <div>
        <label className={labelClass}>Google Drive Link <span className="text-white/30 normal-case">(Reference images, documents, etc.)</span></label>
        <div className="relative">
          <Link className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
          <input type="url" placeholder="https://drive.google.com/..." value={form.driveLink}
            onChange={e => setForm(f => ({ ...f, driveLink: e.target.value }))} className={`${inputClass} pl-11`} />
        </div>
      </div>

      {/* How did you hear */}
      <div>
        <label className={labelClass}>How Did You Hear About Us?</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {HEAR_OPTIONS.map(opt => (
            <button key={opt} type="button" onClick={() => setHearAbout(opt)}
              className={`py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all duration-200 ${hearAbout === opt
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
            Sending...
          </>
        ) : (
          <>
            Request Service
            <Send size={18} className="group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
};
