import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Layers, GraduationCap, Megaphone, Bell, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

import library1 from '../assets/library1.jpg';
import library2 from '../assets/library2.jpg';
import library3 from '../assets/library3.jpg';
import library4 from '../assets/library4.jpg';
import noProfileIcon from '../assets/noprofileicon.png';

// Pure Animated Count-Up Engine para sa malinis na arithmetic loading analytics counters
function AnimatedCounter({ targetValue, startTrigger, duration = 1500 }) {
  const [currentDisplayValue, setCurrentDisplayValue] = useState(0);

  useEffect(() => {
    if (!startTrigger) return;

    let absoluteStartTime = null;
    const targetNumber = parseInt(targetValue.toString().replace(/,/g, ''), 10);

    const executeFrameStep = (currentTimestamp) => {
      if (!absoluteStartTime) absoluteStartTime = currentTimestamp;
      const totalElapsedTime = currentTimestamp - absoluteStartTime;
      
      const movementProgress = Math.min(totalElapsedTime / duration, 1);
      const easeOutProgress = 1 - Math.pow(1 - movementProgress, 3);
      
      const computedNextValue = Math.floor(easeOutProgress * targetNumber);
      setCurrentDisplayValue(computedNextValue);

      if (totalElapsedTime < duration) {
        requestAnimationFrame(executeFrameStep);
      } else {
        setCurrentDisplayValue(targetNumber);
      }
    };

    requestAnimationFrame(executeFrameStep);
  }, [targetValue, startTrigger, duration]);

  return <span>{currentDisplayValue.toLocaleString()}</span>;
}

// Intersection Observer component na nagpapasabog ng fade-in entry animation smoothly
function ObservedSection({ children, className = "" }) {
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementSectionRef = useRef(null);

  useEffect(() => {
    const activeObserverEngine = new IntersectionObserver(
      ([observerEntry]) => {
        if (observerEntry.isIntersecting) {
          setHasIntersected(true);
          activeObserverEngine.unobserve(observerEntry.target);
        }
      },
      { threshold: 0.10, rootMargin: "0px 0px -50px 0px" }
    );

    if (elementSectionRef.current) {
      activeObserverEngine.observe(elementSectionRef.current);
    }

    return () => {
      if (elementSectionRef.current) activeObserverEngine.disconnect();
    };
  }, []);

  return (
    <div
      ref={elementSectionRef}
      className={`transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) transform ${
        hasIntersected 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {typeof children === 'function' ? children(hasIntersected) : children}
    </div>
  );
}

function LandingPage({ onNavigateToLogin }) {
  const slideshowImages = [library1, library2, library3, library4];
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  useEffect(() => {
    const slideAutoRotationTimer = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => 
        prevIndex === slideshowImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);
    return () => clearInterval(slideAutoRotationTimer);
  }, [slideshowImages.length]);

  const handlePrevSlideTrigger = () => {
    setCurrentSlideIndex((prev) => prev === 0 ? slideshowImages.length - 1 : prev - 1);
  };

  const handleNextSlideTrigger = () => {
    setCurrentSlideIndex((prev) => prev === slideshowImages.length - 1 ? 0 : prev + 1);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/10 font-sans antialiased text-slate-800 select-none flex flex-col justify-between">
      
      {/* HEADER INTEGRATION */}
      <Header isLandingView={true} setActiveTab={(target) => { if(target === 'login-trigger-fallback-check') onNavigateToLogin(); }} />

      {/* 🏛 PREMIUM HERO SECTION BLOCK */}
      <div className="max-w-7xl w-full mx-auto px-8 pt-28 pb-4 flex-1 flex flex-col justify-center">
        <div className={`w-full bg-slate-50/90 backdrop-blur-sm border border-slate-200/80 p-10 md:p-14 rounded-[40px] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-12 items-center transition-all duration-1000 ease-out transform ${
          isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}>
          
          <div className="lg:col-span-6 flex flex-col justify-center h-full space-y-8 text-left">
            <div className="space-y-6">
              
              {/* Green Pill Container with Subtitle Line */}
              <div className="w-full bg-[#043310] text-white px-6 py-4 rounded-2xl shadow-sm border border-emerald-900 flex flex-col items-start gap-1 justify-center">
                <span className="text-xs md:text-[14px] font-black tracking-widest uppercase font-sans block">
                  CAVITE STATE UNIVERSITY - TANZA CAMPUS
                </span>
                <span className="text-xs md:text-[14px] font-black tracking-widest uppercase font-sans block text-emerald-300">
                  INTEGRATED LIBRARY SYSTEM
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-[58px] xl:text-[62px] font-black text-[#043310] tracking-tight uppercase leading-[1.05]">
                Gateway to<br />
                <span className="text-slate-900 font-serif normal-case italic font-medium tracking-normal block mt-1">Academic Excellence</span>
              </h1>
              
              <p className="text-slate-600 font-bold text-sm md:text-[16px] xl:text-[17px] leading-relaxed max-w-xl">
                Empowering the CvSU Tanza community through world-class resources and innovative library services. Discover a space where heritage meets digital advancement.
              </p>
            </div>
          </div>

          {/* RIGHT VIEW SLIDESHOW */}
          <div className="lg:col-span-6 relative w-full h-[300px] md:h-[400px] lg:h-[460px] group">
            <div className="w-full h-full bg-slate-900 rounded-[32px] overflow-hidden relative shadow-xl border-4 border-white">
              {slideshowImages.map((imageAsset, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                    index === currentSlideIndex ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 z-0"
                  }`}
                >
                  <img
                    src={imageAsset}
                    alt="Campus Overview View"
                    className="w-full h-full object-cover brightness-[0.8]"
                  />
                </div>
              ))}
              <button type="button" onClick={handlePrevSlideTrigger} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#054a18] text-white p-3 rounded-full hidden group-hover:flex z-50 cursor-pointer"><ChevronLeft className="h-5 w-5" /></button>
              <button type="button" onClick={handleNextSlideTrigger} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#054a18] text-white p-3 rounded-full hidden group-hover:flex z-50 cursor-pointer"><ChevronRight className="h-5 w-5" /></button>
            </div>
          </div>

        </div>

        {/* SECTION LABEL FOR THE CORE METRICS */}
        <div className="w-full text-left mt-16 mb-4 px-2">
          <h2 className="text-xs md:text-[13px] font-black tracking-widest text-[#043310] uppercase font-sans flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-emerald-600 rounded-sm inline-block"></span>
            BOOKS STATISTICS
          </h2>
        </div>

        {/* 📊 THE DEFINITIVE ACCESSIBILITY DECK ROW */}
        <ObservedSection>
          {(isSecActive) => (
            <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <div className="flex flex-col items-center space-y-3 text-center p-8 rounded-[32px] bg-white border border-slate-200/70 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-2 text-slate-400 text-[11px] font-black uppercase tracking-widest"><BookOpen className="h-4 w-4 text-emerald-700" /> Core Collection</div>
                <div className="text-4xl md:text-5xl font-black text-[#043310] font-mono tracking-tight"><AnimatedCounter targetValue={1720} startTrigger={isSecActive || isPageLoaded} /></div>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center p-8 rounded-[32px] bg-white border border-slate-200/70 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-2 text-slate-400 text-[11px] font-black uppercase tracking-widest"><BookOpen className="h-4 w-4 text-emerald-700" /> Book Collection</div>
                <div className="text-4xl md:text-5xl font-black text-[#043310] font-mono tracking-tight"><AnimatedCounter targetValue={1300} startTrigger={isSecActive || isPageLoaded} /></div>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center p-8 rounded-[32px] bg-white border border-slate-200/70 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-2 text-slate-400 text-[11px] font-black uppercase tracking-widest"><GraduationCap className="h-4 w-4 text-emerald-700" /> Thesis Works</div>
                <div className="text-4xl md:text-5xl font-black text-[#043310] font-mono tracking-tight"><AnimatedCounter targetValue={317} startTrigger={isSecActive || isPageLoaded} /></div>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center p-8 rounded-[32px] bg-white border border-slate-200/70 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-2 text-slate-400 text-[11px] font-black uppercase tracking-widest"><Layers className="h-4 w-4 text-emerald-700" /> Digital E-Books</div>
                <div className="text-4xl md:text-5xl font-black text-[#043310] font-mono tracking-tight"><AnimatedCounter targetValue={127} startTrigger={isSecActive || isPageLoaded} /></div>
              </div>
            </div>
          )}
        </ObservedSection>

        {/* //eto pre: BALIK REYNADO NG LIBRARIAN PERSONNEL DECK SECTION DIRECTLY HERE! */}
        {/* ========================================================================= */}
        {/* 👤 SECTION: LIBRARIAN PERSONNEL (With Observer Fade In Integration) */}
        {/* ========================================================================= */}
        <ObservedSection>
          <div className="w-full text-left mb-6 px-2 mt-4">
            <h2 className="text-xs md:text-[13px] font-black tracking-widest text-[#043310] uppercase font-sans flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-emerald-600 rounded-sm inline-block"></span>
              Librarian Personnel
            </h2>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto mb-16 text-left">
            <div className="flex flex-col items-center space-y-4 bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm hover:shadow-md transition-all">
              <div className="w-36 h-36 bg-slate-50 rounded-full overflow-hidden border-4 border-emerald-50 flex items-center justify-center p-2 shadow-inner">
                <img src={noProfileIcon} alt="Ryan Apinan" className="w-full h-full object-contain opacity-80" />
              </div>
              <div className="text-center space-y-1">
                <h4 className="text-[18px] font-black text-[#043310] uppercase tracking-wide">Ryan Apinan</h4>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Campus Librarian</p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4 bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm hover:shadow-md transition-all">
              <div className="w-36 h-36 bg-slate-50 rounded-full overflow-hidden border-4 border-emerald-50 flex items-center justify-center p-2 shadow-inner">
                <img src={noProfileIcon} alt="Jhon Joseph Rivas" className="w-full h-full object-contain opacity-80" />
              </div>
              <div className="text-center space-y-1">
                <h4 className="text-[18px] font-black text-[#043310] uppercase tracking-wide">Jhon Joseph Rivas</h4>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Library Assistant</p>
              </div>
            </div>
          </div>
        </ObservedSection>

        {/* ========================================================================= */}
        {/* 🗄️ SECTION: DIGITAL RESOURCES ARCHITECTURE HUB */}
        {/* ========================================================================= */}
        <ObservedSection>
          <div className="w-full text-left mb-5 px-2 mt-4">
            <h2 className="text-xs md:text-[13px] font-black tracking-widest text-[#043310] uppercase font-sans flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-emerald-600 rounded-sm inline-block"></span>
              Digital Resources
            </h2>
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16 text-left">
            
            {/* LEFT EXPANSION PANEL: THE CORE RESOURCE CARDS STACK */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
              
              {/* CARD 1: PRINTED BOOKS CARD */}
              <div className="bg-white border border-slate-200/70 p-8 rounded-[32px] shadow-sm flex flex-col justify-between min-h-[260px] transition-all hover:shadow-md">
                <div className="space-y-4 mb-6">
                  <div className="w-12 h-12 bg-emerald-50/80 border border-emerald-100 rounded-[14px] flex items-center justify-center text-emerald-800">
                    <BookOpen className="h-6 w-6 text-emerald-700" />
                  </div>
                  <h3 className="text-[19px] font-black text-slate-900 uppercase tracking-tight">Printed Books</h3>
                  <p className="text-slate-500 font-bold text-[13px] leading-relaxed pr-2">
                    Access our official system to search for physical books, check availability, and manage your borrowing history.
                  </p>
                </div>
                <button 
                  type="button" 
                  className="w-full bg-[#043310] hover:bg-emerald-900 text-white text-[11px] font-black uppercase tracking-wider py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none shadow-sm"
                >
                  <span>Browse Collection</span>
                  <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
                </button>
              </div>

              {/* CARD 2: THESES BOOKS CARD */}
              <div className="bg-white border border-slate-200/70 p-8 rounded-[32px] shadow-sm flex flex-col justify-between min-h-[260px] transition-all hover:shadow-md">
                <div className="space-y-4 mb-6">
                  <div className="w-12 h-12 bg-emerald-50/80 border border-emerald-100 rounded-[14px] flex items-center justify-center text-emerald-800">
                    <GraduationCap className="h-6 w-6 text-emerald-700" />
                  </div>
                  <h3 className="text-[19px] font-black text-slate-900 uppercase tracking-tight">Theses Books</h3>
                  <p className="text-slate-500 font-bold text-[13px] leading-relaxed pr-2">
                    A specialized repository for undergraduate and graduate theses. Browse by department, year, or academic advisor.
                  </p>
                </div>
                <button 
                  type="button" 
                  className="w-full bg-[#043310] hover:bg-emerald-900 text-white text-[11px] font-black uppercase tracking-wider py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none shadow-sm"
                >
                  <span>Explore Theses</span>
                  <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
                </button>
              </div>

              {/* CARD 3: E-BOOKS CARD */}
              <div className="bg-white border border-slate-200/70 p-8 rounded-[32px] shadow-sm flex flex-col justify-between min-h-[260px] transition-all hover:shadow-md">
                <div className="space-y-4 mb-6">
                  <div className="w-12 h-12 bg-emerald-50/80 border border-emerald-100 rounded-[14px] flex items-center justify-center text-emerald-800">
                    <Layers className="h-6 w-6 text-emerald-700" />
                  </div>
                  <h3 className="text-[19px] font-black text-slate-900 uppercase tracking-tight">E-books</h3>
                  <p className="text-slate-500 font-bold text-[13px] leading-relaxed pr-2">
                    Instant access to thousands of educational e-books across various disciplines. Accessible anywhere, anytime for CvSU students.
                  </p>
                </div>
                <button 
                  type="button" 
                  className="w-full bg-[#043310] hover:bg-emerald-900 text-white text-[11px] font-black uppercase tracking-wider py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none shadow-sm"
                >
                  <span>Browse E-books</span>
                  <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
                </button>
              </div>

            </div>

            {/* RIGHT SIDEBAR MODULE */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* PANEL A: BULLETIN BOARD SYSTEM */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-[32px] p-7 shadow-sm space-y-5">
                <h4 className="text-[15px] font-black uppercase text-slate-900 tracking-wider flex items-center gap-2.5 border-b border-slate-200/70 pb-3">
                  <Megaphone className="h-5 w-5 text-emerald-700 stroke-[2.5]" /> Bulletin Board
                </h4>
                <div className="space-y-5">
                  <div className="flex gap-4 items-start">
                    <div className="bg-emerald-800 text-white px-3 py-2 rounded-xl text-center font-mono flex-shrink-0 shadow-sm">
                      <div className="text-[12px] font-black leading-none">15</div>
                      <div className="text-[9px] font-black uppercase tracking-tight mt-1">Oct</div>
                    </div>
                    <div className="space-y-1 mt-0.5">
                      <h5 className="text-[13px] font-black text-slate-900 leading-snug uppercase tracking-tight">New Arrivals: Engineering Collection</h5>
                      <p className="text-[12px] font-bold text-slate-500 leading-relaxed pr-2">25 new titles added to the Print Section.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start border-t border-slate-200/60 pt-4">
                    <div className="bg-emerald-600/20 text-emerald-800 border border-emerald-300/40 px-3 py-2 rounded-xl text-center font-mono flex-shrink-0">
                      <div className="text-[12px] font-black leading-none">12</div>
                      <div className="text-[9px] font-black uppercase tracking-tight mt-1">Oct</div>
                    </div>
                    <div className="space-y-1 mt-0.5">
                      <h5 className="text-[13px] font-black text-slate-900 leading-snug uppercase tracking-tight">2023 Thesis Archive Uploaded</h5>
                      <p className="text-[12px] font-bold text-slate-500 leading-relaxed pr-2">Latest research abstracts now online.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANEL B: LIBRARY ANNOUNCEMENTS UTILITY */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-[32px] p-7 shadow-sm space-y-5">
                <h4 className="text-[15px] font-black uppercase text-slate-900 tracking-wider flex items-center gap-2.5 border-b border-slate-200/70 pb-3">
                  <Bell className="h-5 w-5 text-emerald-700 stroke-[2.5]" /> Library Announcements
                </h4>
                <div className="flex gap-4 items-start">
                  <div className="bg-emerald-800 text-white px-3 py-2 rounded-xl text-center font-mono flex-shrink-0 shadow-sm">
                    <div className="text-[12px] font-black leading-none">20</div>
                    <div className="text-[9px] font-black uppercase tracking-tight mt-1">Oct</div>
                  </div>
                  <div className="space-y-1 mt-0.5">
                    <h5 className="text-[13px] font-black text-slate-900 leading-snug uppercase tracking-tight">New Study Area Open</h5>
                    <p className="text-[12px] font-bold text-slate-500 leading-relaxed pr-2">Quiet zone now available for focused sessions.</p>
                  </div>
                </div>
                <div className="border-t border-slate-200/70 pt-4 text-center">
                  <button type="button" className="text-[11px] font-black uppercase text-emerald-800 hover:text-emerald-950 tracking-wider inline-flex items-center gap-1.5 cursor-pointer focus:outline-none transition-colors">
                    <span>View all announcements</span>
                    <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </ObservedSection>

      </div>

      {/* FOOTER CONNECTOR UNIT */}
      <Footer isLanding={true} />

    </div>
  );
}

export default LandingPage;