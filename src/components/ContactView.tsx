import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, Map, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export default function ContactView() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Support',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API request smoothly
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: 'General Support', message: '' });
      setTimeout(() => setSubmitted(false), 6500); // Auto close success box
    }, 1200);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const contactSpecs = [
    {
      title: "Electronic Support",
      info: "amrititaula2022@gmail.com",
      desc: "Expect a detailed answer in 2-4 hours.",
      icon: Mail,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      link: "mailto:amrititaula2022@gmail.com"
    },
    {
      title: "Direct Hotlines",
      info: "+977 9767992718",
      desc: "Mon - Sat: 8 AM to 8 PM NP",
      icon: Phone,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
      link: "tel:+9779767992718"
    },
    {
      title: "Chat on WhatsApp",
      info: "+977 9767992718",
      desc: "Instant live text & support overlay.",
      icon: MessageCircle,
      color: "text-white bg-emerald-500 border-emerald-600",
      link: "https://wa.me/9779767992718",
      isWhatsApp: true
    },
    {
      title: "Flagship HQ",
      info: "Dhumbarahi, Kathmandu, Nepal.",
      desc: "We look forward to welcoming you.",
      icon: MapPin,
      color: "text-rose-600 bg-rose-50 border-rose-100"
    }
  ];

  return (
    <div id="contact-page-container" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-16">
      
      {/* 1. Page Header */}
      <section className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 font-sans mb-3">
          We Are Here to Care
        </h1>
        <p className="text-sm text-neutral-500 leading-relaxed">
          Have an inquiry regarding shipments, specific ingredient safety, or bulk orders? Toss us a letter, and our dedicated concierge team will reach back immediately.
        </p>
      </section>

      {/* 2. Interactive Columns */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        
        {/* Left Column: Direct Info Cards & Live Map */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            {contactSpecs.map((spec, i) => {
              const IconComp = spec.icon;
              const isActionable = !!spec.link;
              const CardContent = (
                <>
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl shrink-0 border ${spec.color}`}>
                    {spec.isWhatsApp ? (
                      <WhatsAppIcon className="h-5 w-5 text-white fill-white shrink-0" />
                    ) : (
                      <IconComp className="h-5 w-5" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-neutral-900 mb-0.5 flex items-center gap-1.5">
                      {spec.title}
                      {spec.isWhatsApp && (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                          <span>Live Chat</span>
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        </span>
                      )}
                    </h3>
                    <p className={`text-sm font-semibold font-mono select-all mb-1 truncate ${spec.isWhatsApp ? 'text-emerald-600' : 'text-neutral-700'}`}>{spec.info}</p>
                    <p className="text-xs text-neutral-400 leading-normal">{spec.desc}</p>
                  </div>
                </>
              );

              if (isActionable) {
                return (
                  <a
                    id={`contact-spec-link-${i}`}
                    key={i}
                    href={spec.link}
                    target={spec.isWhatsApp ? "_blank" : undefined}
                    rel={spec.isWhatsApp ? "noopener noreferrer" : undefined}
                    className={`rounded-2xl p-5 border shadow-sm flex items-start gap-4 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer ${
                      spec.isWhatsApp 
                        ? 'bg-emerald-50/40 border-emerald-200/80 hover:border-emerald-500 hover:bg-emerald-50/70 hover:shadow-emerald-100/50 hover:shadow-md' 
                        : 'bg-white border-neutral-100 hover:border-emerald-300 hover:shadow-md'
                    }`}
                  >
                    {CardContent}
                  </a>
                );
              }

              return (
                <div
                  id={`contact-spec-card-${i}`}
                  key={i}
                  className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm flex items-start gap-4"
                >
                  {CardContent}
                </div>
              );
            })}
          </div>

          {/* Styled Graphical Map Representation */}
          <div className="rounded-2xl border border-neutral-200 overflow-hidden bg-neutral-900/5 aspect-video md:aspect-[4/3] flex flex-col justify-between relative shadow-sm">
            <div className="absolute inset-0 -z-10 bg-neutral-100 grid grid-cols-6 grid-rows-6 opacity-30">
              {/* Decorative grid maps vector overlay */}
              {[...Array(36)].map((_, idx) => (
                <div key={idx} className="border-r border-b border-rose-900/5" />
              ))}
            </div>

            {/* Simulated Road Lines Graphic */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-emerald-50 via-white to-sky-50" />
            <svg className="absolute inset-0 -z-10 h-full w-full opacity-60" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0,100 L 400,100 M 100,0 L 100,500 M 0,350 L 500,100 M 350,0 Q 300,200 500,400" stroke="#cccccc" strokeWidth="2" fill="none" />
              <circle cx="100" cy="100" r="4" fill="#a3a3a3" />
              <circle cx="340" cy="120" r="4" fill="#a3a3a3" />
            </svg>

            <div className="p-4 bg-white/95 border-b border-neutral-100 backdrop-blur-sm shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Map className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-bold text-neutral-800">WeCare Flagship Store Map</span>
              </div>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">New York</span>
            </div>

            {/* Target Pin Marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="relative">
                <span className="absolute inline-flex h-8 w-8 -left-2 -top-2 animate-ping rounded-full bg-emerald-500 opacity-35" />
                <span className="flex h-4 w-4 rounded-full bg-emerald-600 border-2 border-white shadow-md shadow-emerald-500/20" />
              </div>
              <span className="bg-neutral-900 text-white font-semibold text-[10px] px-2.5 py-1 rounded-md shadow-lg font-sans tracking-wide mt-2">
                WeCare Mart Plaza
              </span>
            </div>

            <div className="p-3 bg-neutral-950 text-white text-[10px] font-mono flex items-center gap-2 justify-center opacity-90 select-none">
              <Clock className="h-3 w-3 text-emerald-400" />
              <span>Visitor parking available. NYC Green Transit subway line 5/6 exit A.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-neutral-200/60 shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-extrabold text-neutral-950 tracking-tight mb-6">Write to Support</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-name" className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Full Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    required
                    disabled={loading || submitted}
                    placeholder="E.g., Clara Oswald"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="rounded-lg border border-neutral-250 bg-neutral-50/50 px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-email" className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Email Coordinates</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    required
                    disabled={loading || submitted}
                    placeholder="E.g., clara@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="rounded-lg border border-neutral-250 bg-neutral-50/50 px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-subject" className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Inquiry Topic</label>
                <select
                  id="contact-subject"
                  name="subject"
                  disabled={loading || submitted}
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="rounded-lg border border-neutral-250 bg-neutral-50/50 px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="General Support">General Commerce Inquiry</option>
                  <option value="Shipping Status">Shipment & Delivery Tracking</option>
                  <option value="Product Sourcing">Ingredient Sourcing & Certifications</option>
                  <option value="Wholesale Orders">Wholesale / Special Event Orders</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-message" className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Message Content</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  disabled={loading || submitted}
                  placeholder="Tell us what you need in deep detail..."
                  value={formData.message}
                  onChange={handleInputChange}
                  className="rounded-lg border border-neutral-250 bg-neutral-50/50 px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 resize-none leading-relaxed"
                />
              </div>

              <AnimatePresence>
                {submitted && (
                  <motion.div
                    id="contact-success-toast"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-xs font-semibold text-emerald-800 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-extrabold text-emerald-950">Message Sent Successfully!</p>
                      <p className="text-emerald-700 font-medium leading-relaxed mt-0.5">Thank you for writing. A WeCare Mart customer guard team member will respond to your email coordinates within 2-4 hours.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                id="contact-submit-button"
                type="submit"
                disabled={loading || submitted}
                className="w-full sm:w-fit flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 text-xs transition-colors self-end shadow-md disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>Sending message to server...</span>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
