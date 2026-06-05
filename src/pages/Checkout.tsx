import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { CosmicCard } from '../components/cosmic/CosmicCard';
import {
  ArrowLeft, ShoppingBag, Sparkles, CreditCard,
  Upload, CheckCircle, ArrowRight, Loader
} from 'lucide-react';
import { apiFetch, apiUrl, assetUrl } from '../lib/api';

interface BillingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { product: any; option: 'purchase' | 'customise' } | undefined;

  const [billing, setBilling] = useState<BillingAddress>({
    name: '', street: '', city: '', state: '', pincode: '', country: '',
  });

  const [contact, setContact] = useState({ email: '', phone: '' });

  const [customisation, setCustomisation] = useState({
    description: '', deadline: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'Gpay' | 'Paytm'>('Gpay');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Empty state — no product selected
  if (!state || !state.product) {
    return (
      <>
        <Helmet>
          <title>Checkout | Karana</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <main className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 z-10 relative">
          <h1 className="text-2xl font-bold text-white mb-4">No product selected</h1>
          <p className="text-white/50 text-sm mb-6 font-montserrat">
            Please return to the catalog and select a product to proceed with checkout.
          </p>
          <button
            onClick={() => navigate('/buy')}
            className="px-6 py-3 bg-cosmic-gold text-cosmic-black rounded-full font-black text-xs uppercase tracking-widest"
          >
            Return to Catalog
          </button>
        </main>
      </>
    );
  }

  const { product, option } = state;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: 'billing' | 'customisation' | 'contact'
  ) => {
    const { name, value } = e.target;
    if (section === 'billing') setBilling((prev) => ({ ...prev, [name]: value }));
    else if (section === 'customisation') setCustomisation((prev) => ({ ...prev, [name]: value }));
    else if (section === 'contact') setContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let fileUrl = '';
      let filename = '';

      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const uploadRes = await fetch(apiUrl('/api/upload'), {
          method: 'POST',
          body: formData,
        });
        if (!uploadRes.ok) throw new Error('File upload failed');
        const uploadData = await uploadRes.json();
        fileUrl = uploadData.url;
        filename = uploadData.filename;
      }

      const orderPayload = {
        productId: product.id,
        productTitle: product.title,
        price: product.price,
        option,
        billingAddress: billing,
        contact: option === 'customise' ? contact : undefined,
        customisation: option === 'customise'
          ? { ...customisation, fileUrl, filename }
          : undefined,
        paymentMethod,
      };

      const orderData = await apiFetch<any>('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      setOrderConfirmed(orderData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Payment or checkout transaction failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageTitle = orderConfirmed
    ? `Order Confirmed — ${product.title} | Karana`
    : `Checkout — ${product.title} | Karana`;

  //const _stepNumber = (n: number) =>
    //option === 'customise' ? `0${n}/` : `0${n - 1}/`;

  return (
    <>
      <Helmet>
        {/* Checkout pages should never be indexed */}
        <title>{pageTitle}</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta
          name="description"
          content={`Complete your ${option === 'customise' ? 'customisation request' : 'purchase'} for ${product.title} on Karana.`}
        />

        {/* Open Graph — useful for link previews even on noindex pages */}
        <meta property="og:title" content={pageTitle} />
        <meta
          property="og:description"
          content={`Secure checkout for ${product.title} — ₹${product.price.toFixed(2)}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Karana" />

        {/* Structured Data — Purchase action */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CheckoutPage',
            name: `Checkout — ${product.title}`,
            url: 'https://yourdomain.com/checkout',
            description: `Secure checkout for ${product.title} by Karana.`,
            provider: {
              '@type': 'Organization',
              name: 'Karana',
              url: 'https://yourdomain.com',
            },
            offers: {
              '@type': 'Offer',
              name: product.title,
              price: product.price.toFixed(2),
              priceCurrency: 'INR',
            },
          })}
        </script>
      </Helmet>

      <main className="relative z-10 min-h-screen px-6 py-24 max-w-6xl mx-auto flex flex-col items-center">
        {/* Background Glow */}
        <div
          className="absolute top-10 left-10 w-[300px] h-[300px] bg-cosmic-gold/5 blur-[100px] rounded-full pointer-events-none -z-10"
          aria-hidden="true"
        />

        {/* Back navigation */}
        <nav aria-label="Breadcrumb" className="self-start mb-8">
          <button
            onClick={() => navigate('/buy')}
            className="flex items-center gap-2 text-white/50 hover:text-cosmic-gold text-xs font-black uppercase tracking-widest transition-colors"
            aria-label="Back to product catalog"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Catalog
          </button>
        </nav>

        <AnimatePresence mode="wait">
          {!orderConfirmed ? (
            <motion.div
              key="checkout-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Form Column */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <h1 className="text-4xl font-black font-montserrat text-white leading-none">
                  SECURE <span className="text-cosmic-gold">CHECKOUT</span>
                </h1>

                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6"
                  aria-label="Checkout form"
                  noValidate
                >
                  {/* Billing Details */}
                  <CosmicCard className="border-white/5 bg-white/[0.02]">
                    <h2 className="text-lg font-bold font-montserrat text-white mb-6 flex items-center gap-2">
                      <span className="text-cosmic-gold font-mono" aria-hidden="true">01/</span>
                      Billing Address
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: 'Full Name', name: 'name', type: 'text', placeholder: 'John Doe', autoComplete: 'name' },
                        { label: 'Street Address', name: 'street', type: 'text', placeholder: '123 Cosmic Way', autoComplete: 'street-address' },
                        { label: 'City', name: 'city', type: 'text', placeholder: 'Mumbai', autoComplete: 'address-level2' },
                        { label: 'State / Region', name: 'state', type: 'text', placeholder: 'Maharashtra', autoComplete: 'address-level1' },
                        { label: 'Pincode / Postal Code', name: 'pincode', type: 'text', placeholder: '400001', autoComplete: 'postal-code' },
                        { label: 'Country', name: 'country', type: 'text', placeholder: 'India', autoComplete: 'country-name' },
                      ].map(({ label, name, type, placeholder, autoComplete }) => (
                        <div key={name} className="flex flex-col gap-2">
                          <label
                            htmlFor={`billing-${name}`}
                            className="text-[10px] font-black text-white/40 uppercase tracking-widest"
                          >
                            {label}
                          </label>
                          <input
                            required
                            id={`billing-${name}`}
                            type={type}
                            name={name}
                            value={billing[name as keyof BillingAddress]}
                            onChange={(e) => handleInputChange(e, 'billing')}
                            autoComplete={autoComplete}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-montserrat focus:outline-none focus:border-cosmic-gold transition-all text-sm"
                            placeholder={placeholder}
                            aria-required="true"
                          />
                        </div>
                      ))}
                    </div>
                  </CosmicCard>

                  {/* Customisation Section */}
                  {option === 'customise' && (
                    <CosmicCard className="border-white/5 bg-white/[0.02]">
                      <h2 className="text-lg font-bold font-montserrat text-white mb-6 flex items-center gap-2">
                        <span className="text-cosmic-gold font-mono" aria-hidden="true">02/</span>
                        Customisation Request
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex flex-col gap-2">
                          <label htmlFor="contact-email" className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                            Contact Email
                          </label>
                          <input
                            required
                            id="contact-email"
                            type="email"
                            name="email"
                            value={contact.email}
                            onChange={(e) => handleInputChange(e, 'contact')}
                            autoComplete="email"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-montserrat focus:outline-none focus:border-cosmic-gold transition-all text-sm"
                            placeholder="client@space.com"
                            aria-required="true"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label htmlFor="contact-phone" className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                            Contact Phone
                          </label>
                          <input
                            required
                            id="contact-phone"
                            type="tel"
                            name="phone"
                            value={contact.phone}
                            onChange={(e) => handleInputChange(e, 'contact')}
                            autoComplete="tel"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-montserrat focus:outline-none focus:border-cosmic-gold transition-all text-sm"
                            placeholder="+91 99999 00000"
                            aria-required="true"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                          <label htmlFor="customisation-description" className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                            Description
                          </label>
                          <textarea
                            required
                            id="customisation-description"
                            name="description"
                            value={customisation.description}
                            onChange={(e) => handleInputChange(e, 'customisation')}
                            rows={4}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-montserrat focus:outline-none focus:border-cosmic-gold transition-all text-sm resize-none"
                            placeholder="Outline any special details, colors, components, or feature integrations required..."
                            aria-required="true"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label htmlFor="customisation-deadline" className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                            Target Deadline
                          </label>
                          <input
                            required
                            id="customisation-deadline"
                            type="date"
                            name="deadline"
                            value={customisation.deadline}
                            onChange={(e) => handleInputChange(e, 'customisation')}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-montserrat focus:outline-none focus:border-cosmic-gold transition-all text-sm"
                            aria-required="true"
                          />
                        </div>

                        {/* File Upload */}
                        <div className="flex flex-col gap-2">
                          <label htmlFor="reference-file" className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                            Reference Files (Optional)
                          </label>
                          <div className="relative border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-cosmic-gold transition-all cursor-pointer bg-white/[0.01]">
                            <input
                              id="reference-file"
                              type="file"
                              onChange={handleFileChange}
                              accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg,.fig"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              aria-label="Upload reference files — PDF, CAD, or mockup (max 10MB)"
                            />
                            <Upload className="w-8 h-8 text-cosmic-gold/50 mx-auto mb-2" aria-hidden="true" />
                            <span className="text-xs text-white/60 block font-montserrat">
                              {selectedFile ? selectedFile.name : 'Upload PDF, CAD files, Mockups (Max 10MB)'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CosmicCard>
                  )}

                  {/* Payment Gateway */}
                  <CosmicCard className="border-white/5 bg-white/[0.02]">
                    <h2 className="text-lg font-bold font-montserrat text-white mb-6 flex items-center gap-2">
                      <span className="text-cosmic-gold font-mono" aria-hidden="true">
                        {option === 'customise' ? '03/' : '02/'}
                      </span>
                      Payment Gateway
                    </h2>

                    <div
                      className="grid grid-cols-2 gap-4"
                      role="radiogroup"
                      aria-label="Select payment method"
                    >
                      {(['Gpay', 'Paytm'] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          role="radio"
                          aria-checked={paymentMethod === method}
                          onClick={() => setPaymentMethod(method)}
                          className={`px-6 py-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
                            paymentMethod === method
                              ? 'border-cosmic-gold bg-cosmic-gold/10 text-white'
                              : 'border-white/10 bg-white/5 text-white/40 hover:text-white'
                          }`}
                        >
                          <CreditCard className="w-6 h-6" aria-hidden="true" />
                          <span className="text-xs font-black tracking-widest uppercase">
                            {method === 'Gpay' ? 'Google Pay' : 'Paytm Gateway'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </CosmicCard>

                  {/* Error */}
                  {error && (
                    <div
                      role="alert"
                      aria-live="assertive"
                      className="p-4 bg-red-950/20 border border-red-500/20 rounded-xl text-red-400 text-xs font-montserrat"
                    >
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                    aria-label={
                      isSubmitting
                        ? 'Processing payment, please wait'
                        : `Complete checkout for ${product.title} — ₹${product.price.toFixed(2)}`
                    }
                    className="w-full py-4 bg-cosmic-gold hover:bg-cosmic-gold-light text-cosmic-black font-black text-sm uppercase tracking-widest rounded-xl transition-all duration-300 hover:shadow-gold-glow flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" aria-hidden="true" /> Authorising payment...
                      </>
                    ) : (
                      <>
                        Complete Checkout <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Order Summary Sidebar */}
              <aside aria-label="Order summary" className="flex flex-col gap-6">
                <h2 className="text-xl font-bold font-montserrat text-white">Order Summary</h2>

                <CosmicCard className="sticky top-28 border-white/5 bg-white/[0.02]">
                  <div className="flex gap-4 border-b border-white/5 pb-4 mb-4">
                    <div className="w-16 h-16 rounded-lg bg-cosmic-black overflow-hidden flex-shrink-0">
                      <img
                        src={assetUrl(product.thumbnail)}
                        alt={`${product.title} thumbnail`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        width={64}
                        height={64}
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-cosmic-gold uppercase tracking-widest block mb-1">
                        {product.category}
                      </span>
                      <h3 className="text-sm font-bold text-white line-clamp-1">{product.title}</h3>
                      <span className="text-xs text-white/40 block mt-1 font-mono">
                        ₹{product.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Option Badge */}
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      {option === 'customise' ? (
                        <>
                          <Sparkles className="w-4 h-4 text-cosmic-gold" aria-hidden="true" />
                          <span className="text-xs text-white font-bold font-montserrat">Customisation Requested</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4 text-white" aria-hidden="true" />
                          <span className="text-xs text-white font-bold font-montserrat">Standard Acquisition</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="flex flex-col gap-2 font-montserrat text-sm border-t border-white/5 pt-4">
                    <div className="flex justify-between text-white/60">
                      <span>Base price</span>
                      <span className="font-mono">₹{product.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Customisation fee</span>
                      <span className="font-mono">
                        {option === 'customise' ? 'TBD (Admin review)' : '₹0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between text-white font-bold border-t border-white/5 pt-3 text-base mt-2">
                      <span>Acquisition Total</span>
                      <span className="text-cosmic-gold font-mono">₹{product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </CosmicCard>
              </aside>
            </motion.div>
          ) : (
            /* Order Confirmation */
            <motion.section
              key="order-confirmed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              aria-label="Order confirmed"
              aria-live="polite"
              className="w-full max-w-xl text-center py-16 bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px]"
                aria-hidden="true"
              />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cosmic-gold/5 blur-3xl rounded-full"
                aria-hidden="true"
              />

              <div className="relative z-10 flex flex-col items-center">
                <CheckCircle className="w-16 h-16 text-cosmic-gold mb-6 animate-bounce" aria-hidden="true" />
                <h2 className="text-3xl font-black font-montserrat text-white tracking-tight mb-2">
                  ORDER SUCCESSFUL
                </h2>
                <p className="text-white/40 text-xs font-mono mb-8 uppercase tracking-widest">
                  Transaction Ref: <span aria-label={`Transaction reference ${orderConfirmed.id}`}>{orderConfirmed.id}</span>
                </p>

                {/* Receipt */}
                <div className="w-full bg-cosmic-black/80 border border-white/10 rounded-2xl p-6 text-left font-montserrat text-sm mb-8">
                  <div className="border-b border-white/5 pb-4 mb-4 flex justify-between">
                    <div>
                      <span className="text-[10px] font-black text-white/40 uppercase block mb-1">Acquired Product</span>
                      <span className="font-bold text-white text-base">{product.title}</span>
                    </div>
                    <span className="font-mono text-cosmic-gold font-bold text-lg">
                      ₹{product.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-black text-white/40 uppercase block mb-1">Billing To</span>
                      <span className="text-white font-bold">{billing.name}</span>
                      <span className="text-white/60 block text-xs">{billing.street}, {billing.city}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-white/40 uppercase block mb-1">Method</span>
                      <span className="text-white font-bold">{paymentMethod}</span>
                      <span className="text-xs text-cosmic-gold font-bold block mt-1 uppercase tracking-widest">Paid</span>
                    </div>
                  </div>

                  {option === 'customise' && (
                    <div className="mt-4 border-t border-white/5 pt-4">
                      <span className="text-[10px] font-black text-white/40 uppercase block mb-1">
                        Custom Request Details
                      </span>
                      <p className="text-white/70 text-xs italic">"{customisation.description}"</p>
                      <span className="text-xs text-cosmic-gold font-bold block mt-2">
                        Target Date: {customisation.deadline}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate('/buy')}
                  aria-label="Return to product catalog"
                  className="px-8 py-3 bg-cosmic-gold hover:bg-cosmic-gold-light text-cosmic-black font-black text-xs uppercase tracking-widest rounded-full transition-all duration-300 hover:shadow-gold-glow"
                >
                  Return to Catalog
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
