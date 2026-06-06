import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Send, CheckCircle, Mail, Phone, MapPin } from 'lucide-react';
import { Helmet } from 'react-helmet-async'; // npm i react-helmet-async
import { services } from '../data/services';
import { apiFetch } from '../lib/api';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  phone: z.string().optional(),
  service: z.string().min(1, 'Please select a service'),
  customService: z.string().optional(),
  timeline: z.string().optional(),
  details: z.string().min(10, 'Please provide more details about your project'),
  source: z.string().optional(),
  driveLink: z.string().url('Invalid URL').or(z.literal('')).optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

// JSON-LD structured data for LocalBusiness
const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Karana Agency",
  "email": "contactkaranaagency@gmail.com",
  "telephone": "+91-75692-74373",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Amaravati",
    "addressCountry": "IN"
  },
  "url": "https://karanaagency.vercel.app/contact", // update to your domain
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-75692-74373",
    "contactType": "customer service",
    "availableLanguage": ["English", "Telugu"]
  }
};

export default function Contact() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const initialService = searchParams.get('service') || '';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { service: initialService }
  });

  const selectedService = watch('service');
  const watchedName = watch('name');
  const watchedEmail = watch('email');
  const watchedPhone = watch('phone');


  useEffect(() => {
    if (initialService) setValue('service', initialService);
  }, [initialService, setValue]);

  const onSubmit = async (data: ContactFormValues) => {
    setStatus('sending');
    try {
      await apiFetch('/api/service-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          service: data.service === 'custom' ? data.customService : data.service,
          timeline: data.timeline ? `${data.timeline} days` : undefined,
          details: data.details,
          source: data.source,
          driveLink: data.driveLink,
        })
      });
    } catch {
      // Non-blocking
    }

    setStatus('success');
    setTimeout(() => setStatus('idle'), 6000);
    reset();
  };

  return (
    <>
      {/* ── SEO Head Tags ───────────────────────────────────────────────── */}
      <Helmet>
        <title>Contact Us | Karana Agency — Engineering & 3D Printing Services, Amaravati</title>
        <meta
          name="description"
          content="Get in touch with Karana Agency for engineering services, 3D printing, and custom tech solutions in Amaravati, India. We respond within 24 hours."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://karanaagency.vercel.app/contact" /> {/* update domain */}

        {/* Open Graph */}
        <meta property="og:title" content="Contact Karana Agency" />
        <meta property="og:description" content="Reach out for engineering, 3D printing, and custom tech services. Based in Amaravati, India." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://karanaagency.vercel.app/contact" />

        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* ── Page ────────────────────────────────────────────────────────── */}
      <main
        className="relative z-10 min-h-screen px-6 py-24 max-w-7xl mx-auto"
        itemScope
        itemType="https://schema.org/ContactPage"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-12">

          {/* ── Block 1: Left Header ──────────────────────────────────────── */}
          <header className="lg:col-start-1 lg:row-start-1 space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-black font-montserrat text-white tracking-tight">
                GET IN <span className="text-cosmic-gold">TOUCH</span>
              </h1>
              <p className="text-white/60 text-lg font-montserrat max-w-lg">
                Ready to bring your vision to life? Fill out the form and our engineering lead will contact you within 24 hours.
              </p>
            </motion.div>
          </header>

          {/* ── Block 2: Right Form ───────────────────────────────────────── */}
          <section
            className="lg:col-start-2 lg:row-start-1 lg:row-span-2 relative"
            aria-label="Contact form"
          >
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl"
            >
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-20 space-y-6"
                    role="alert"
                    aria-live="polite"
                  >
                    <div className="w-20 h-20 bg-cosmic-gold rounded-full flex items-center justify-center mx-auto text-cosmic-black animate-bounce">
                      <CheckCircle size={40} aria-hidden="true" />
                    </div>
                    <h2 className="text-3xl font-black text-white font-montserrat">Message Sent!</h2>
                    <p className="text-white/60 font-montserrat leading-relaxed">
                      We'll respond within 24 hours.
                      <br />For any query:
                      <br />
                      <a href="mailto:contactkaranaagency@gmail.com" className="text-cosmic-gold hover:underline">
                        contactkaranaagency@gmail.com
                      </a>
                      <br />
                      <a href="tel:+917569274373" className="text-cosmic-gold hover:underline">+91 75692 74373</a>
                    </p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="px-8 py-3 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-6"
                      aria-label="Project enquiry form"
                      noValidate
                    >
                      {/* Service selector */}
                      <div className="space-y-2">
                        <label
                          htmlFor="service"
                          className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1"
                        >
                          Service Interested In *
                        </label>
                        <select
                          id="service"
                          {...register('service')}
                          aria-required="true"
                          aria-describedby={errors.service ? 'service-error' : undefined}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-montserrat focus:outline-none focus:border-cosmic-gold transition-all appearance-none"
                        >
                          <option value="" disabled>Select a service...</option>
                          {services.map(s => (
                            <option key={s.id} value={s.id} className="bg-black">{s.name}</option>
                          ))}
                          <option value="custom" className="bg-black">Custom Service (Not Listed)</option>
                        </select>
                        {errors.service && (
                          <span id="service-error" role="alert" className="text-red-400 text-[10px] font-bold">
                            {errors.service.message}
                          </span>
                        )}
                      </div>

                      <motion.div
                        key="standard-form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                        {/* Name + Email + Company + Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {[
                            { id: 'name', label: 'Full Name *', type: 'text', required: true, key: 'name' },
                            { id: 'email', label: 'Email *', type: 'email', required: true, key: 'email' },
                            { id: 'company', label: 'Company', type: 'text', required: false, key: 'company' },
                            { id: 'phone', label: 'Phone', type: 'tel', required: false, key: 'phone' },
                          ].map(({ id, label, type, required, key }) => (
                            <div key={id} className="space-y-2">
                              <label
                                htmlFor={id}
                                className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1"
                              >
                                {label}
                              </label>
                              <input
                                id={id}
                                type={type}
                                {...register(key as keyof ContactFormValues)}
                                aria-required={required}
                                aria-describedby={errors[key as keyof typeof errors] ? `${id}-error` : undefined}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-montserrat focus:outline-none focus:border-cosmic-gold transition-all"
                              />
                              {errors[key as keyof typeof errors] && (
                                <span id={`${id}-error`} role="alert" className="text-red-400 text-[10px] font-bold">
                                  {errors[key as keyof typeof errors]?.message as string}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Custom service */}
                        {selectedService === 'custom' && (
                          <div className="space-y-2">
                            <label htmlFor="customService" className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">
                              Describe your custom needs
                            </label>
                            <textarea
                              id="customService"
                              {...register('customService')}
                              rows={3}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-montserrat focus:outline-none focus:border-cosmic-gold transition-all"
                            />
                          </div>
                        )}

                        {/* Timeline */}
                        <div className="space-y-2">
                          <label htmlFor="timeline" className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">
                            Timeline <span className="text-white/30 normal-case font-normal">(optional — number of days)</span>
                          </label>
                          <input
                            id="timeline"
                            {...register('timeline')}
                            type="number"
                            min={1}
                            placeholder="e.g. 30"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-montserrat focus:outline-none focus:border-cosmic-gold transition-all"
                          />
                        </div>

                        {/* Project Details */}
                        <div className="space-y-2">
                          <label htmlFor="details" className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">
                            Project Details *
                          </label>
                          <textarea
                            id="details"
                            {...register('details')}
                            rows={5}
                            aria-required="true"
                            aria-describedby={errors.details ? 'details-error' : undefined}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-montserrat focus:outline-none focus:border-cosmic-gold transition-all"
                          />
                          {errors.details && (
                            <span id="details-error" role="alert" className="text-red-400 text-[10px] font-bold">
                              {errors.details.message}
                            </span>
                          )}
                        </div>

                        {/* Source */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label htmlFor="driveLink" className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">
                              Google Drive Link
                            </label>
                            <input
                              id="driveLink"
                              {...register('driveLink')}
                              placeholder="https://drive.google.com/..."
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-montserrat focus:outline-none focus:border-cosmic-gold transition-all"
                            />
                            {errors.driveLink && (
                              <span role="alert" className="text-red-400 text-[10px] font-bold">
                                {errors.driveLink.message}
                              </span>
                            )}
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="source" className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">
                              How did you hear about us?
                            </label>
                            <input
                              id="source"
                              {...register('source')}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-montserrat focus:outline-none focus:border-cosmic-gold transition-all"
                            />
                          </div>
                        </div>

                        {/* Submit */}
                        <button
                          type="submit"
                          disabled={status === 'sending'}
                          aria-disabled={status === 'sending'}
                          className="w-full py-5 bg-cosmic-gold text-cosmic-black font-black uppercase tracking-widest rounded-xl hover:bg-cosmic-gold-light transition-all duration-300 flex items-center justify-center gap-3 group shadow-gold-glow disabled:opacity-60"
                        >
                          {status === 'sending' ? (
                            <>
                              <div className="w-5 h-5 border-2 border-cosmic-black/30 border-t-cosmic-black rounded-full animate-spin" aria-hidden="true" />
                              Transmitting...
                            </>
                          ) : (
                            <>
                              Send Request
                              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                            </>
                          )}
                        </button>
                      </motion.div>

                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </section>

          {/* ── Block 3: Left Cards & Steps ────────────────────────────────── */}
          <aside className="lg:col-start-1 lg:row-start-2 space-y-12" aria-label="Contact information">

            {/* Contact cards — wrapped in <address> for schema semantics */}
            <address
              className="space-y-4 not-italic"
              itemScope
              itemType="https://schema.org/Organization"
            >
              <meta itemProp="name" content="Karana Agency" />
              {[
                {
                  icon: <Mail size={24} aria-hidden="true" />,
                  label: 'Email us',
                  value: 'contactkaranaagency@gmail.com',
                  href: 'mailto:contactkaranaagency@gmail.com',
                  itemProp: 'email',
                },
                {
                  icon: <Phone size={24} aria-hidden="true" />,
                  label: 'Call us',
                  value: '+91 75692 74373',
                  href: 'tel:+917569274373',
                  itemProp: 'telephone',
                },
                {
                  icon: <MapPin size={24} aria-hidden="true" />,
                  label: 'Location',
                  value: 'Amaravati, India',
                  href: undefined,
                  itemProp: 'address',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cosmic-gold/50 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-cosmic-gold/10 rounded-full flex items-center justify-center text-cosmic-gold shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-white/50 text-xs uppercase tracking-widest block mb-1">{item.label}</span>
                    {item.href ? (
                      <a
                        href={item.href}
                        itemProp={item.itemProp}
                        className="text-white font-bold font-montserrat hover:text-cosmic-gold transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span itemProp={item.itemProp} className="text-white font-bold font-montserrat">
                        {item.value}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </address>

            {/* Process steps */}
            <section
              className="p-8 rounded-3xl bg-cosmic-gold/10 border border-cosmic-gold/20"
              aria-label="Our process"
            >
              <h2 className="text-white font-bold uppercase tracking-widest text-sm mb-6">
                What happens next?
              </h2>
              <ol className="space-y-5" aria-label="Process steps">
                {[
                  { step: '01', text: 'Initial discovery call to understand your goals' },
                  { step: '02', text: 'Technical feasibility audit and strategy' },
                  { step: '03', text: 'Detailed project roadmap and pricing' },
                  { step: '04', text: 'Kick-off and rapid prototyping phase' },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <span className="text-cosmic-gold font-black text-xs w-6" aria-hidden="true">{item.step}</span>
                    <span className="text-white/70 text-sm font-montserrat">{item.text}</span>
                  </li>
                ))}
              </ol>
            </section>
          </aside>

        </div>
      </main>
    </>
  );
}
