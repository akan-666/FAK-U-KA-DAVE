import React, { useState } from 'react';
import { MapPin, Mail, Phone, ChevronDown, ChevronUp } from 'lucide-react';
// I-import ang Philippine government seal asset mula sa sidebar tracking mo
import govSeal1 from '../assets/govseal1.png';

function Footer({ isLanding = false }) {
  const [isLocationsOpen, setIsLocationsOpen] = useState(false);

  // Kapag nasa loob ng active system dashboard view, simpleng corporate bar lang ang luluwa
  if (!isLanding) {
    return (
      <footer className="w-full bg-white border-t border-slate-200/60 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest select-none z-10 flex-shrink-0">
        © 2026 Cavite State University – Tanza Campus. All rights reserved.
      </footer>
    );
  }

  // 🏛️ DETAILED PORTAL FOOTER MATRIX FOR HOME / LANDING VIEW
  return (
    <footer className="w-full bg-[#043310] text-white pt-16 pb-8 px-6 border-t border-emerald-900/40 select-none font-sans text-left z-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 items-start pb-12 border-b border-emerald-800/40">
        
        {/* COLUMN 1: OFFICIAL REPUBLIKA NG PILIPINAS SEAL */}
        <div className="flex flex-col items-start space-y-4">
          <img 
            src={govSeal1} 
            alt="Republika ng Pilipinas Seal" 
            className="w-36 h-auto object-contain drop-shadow-xl"
          />
        </div>

        {/* COLUMN 2: QUICK LINKS PARAMETERS */}
        <div className="space-y-4">
          <h4 className="text-sm font-black tracking-wider uppercase border-b-2 border-white/20 pb-2 w-fit pr-6">Quick Links</h4>
          <ul className="space-y-2.5 text-xs font-bold text-emerald-100/80">
            <li><a href="https://cvsu.edu.ph" target="_blank" rel="noreferrer" className="hover:text-white transition-colors block">Admission Procedures</a></li>
            <li><a href="https://cvsu.edu.ph" target="_blank" rel="noreferrer" className="hover:text-white transition-colors block">Academic Programs</a></li>
            <li><a href="https://cvsu.edu.ph" target="_blank" rel="noreferrer" className="hover:text-white transition-colors block">News & Updates</a></li>
            <li><a href="https://cvsu.edu.ph" target="_blank" rel="noreferrer" className="hover:text-white transition-colors block">Downloadable Forms</a></li>
            <li><a href="https://cvsu.edu.ph" target="_blank" rel="noreferrer" className="hover:text-white transition-colors block">Email & Services</a></li>
          </ul>
        </div>

        {/* COLUMN 3: GOVERNMENT DIRECTORY COHORTS */}
        <div className="space-y-4">
          <h4 className="text-sm font-black tracking-wider uppercase border-b-2 border-white/20 pb-2 w-fit pr-6">Government Links</h4>
          <ul className="space-y-2.5 text-xs font-bold text-emerald-100/80">
            <li><a href="https://mirror.gov.ph" target="_blank" rel="noreferrer" className="hover:text-white transition-colors block">Government PH</a></li>
            <li><a href="https://ched.gov.ph" target="_blank" rel="noreferrer" className="hover:text-white transition-colors block">CHED</a></li>
            <li><a href="https://dost.gov.ph" target="_blank" rel="noreferrer" className="hover:text-white transition-colors block">DOST</a></li>
            <li><a href="https://tesda.gov.ph" target="_blank" rel="noreferrer" className="hover:text-white transition-colors block">TESDA</a></li>
            <li><span className="block opacity-90">Province of Cavite</span></li>
            <li><span className="block opacity-90">Municipality of Tanza</span></li>
          </ul>
        </div>

        {/* COLUMN 4: REPLICATED CONTACT INFORMATION SCHEDULING INTERACTIVE DROPDOWN */}
        <div className="space-y-4 relative">
          <h4 className="text-sm font-black tracking-wider uppercase border-b-2 border-white/20 pb-2 w-fit pr-6">Contact Information</h4>
          
          <div className="space-y-4 text-xs font-bold text-emerald-100/90">
            
            {/* Interactive Location Dropdown Panel matching Tanza systems layout */}
            <div className="space-y-2">
              <button 
                onClick={() => setIsLocationsOpen(!isLocationsOpen)}
                className="flex items-center justify-between w-full hover:text-white transition-colors text-left bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/40 cursor-pointer"
              >
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald-400" /> Campus Locations</span>
                {isLocationsOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>

              {isLocationsOpen && (
                <div className="bg-[#03240b] border border-emerald-800/60 rounded-xl p-3 space-y-3 font-medium text-[11px] leading-relaxed text-emerald-200/90 animate-fadeIn shadow-inner">
                  <div>
                    <div className="font-black text-white flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> TANZA CAMPUS-MAIN</div>
                    <p className="pl-2.5 text-emerald-300/80">Municipality of Tanza, Cavite</p>
                  </div>
                  <div className="border-t border-emerald-900/40 pt-2">
                    <div className="font-black text-white flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> TANZA CAMPUS-ANNEX</div>
                    <p className="pl-2.5 text-emerald-300/80">Phase 2, Bahay Katuparan Subdivision, Tanza, Cavite</p>
                  </div>
                </div>
              )}
            </div>

            {/* Email Contact Data Channels */}
            <div className="space-y-0.5">
              <span className="text-slate-300 text-[10px] uppercase font-black tracking-wider block">Campus Email:</span>
              <a href="mailto:cvsutanzalibrary@cvsu.edu.ph" className="text-white hover:underline block flex items-center gap-1.5 mt-0.5">
                <Mail className="h-3.5 w-3.5 text-emerald-400" /> cvsutanzalibrary@cvsu.edu.ph
              </a>
            </div>

            {/* Telephone Lines Segment */}
            <div className="space-y-1">
              <span className="text-slate-300 text-[10px] uppercase font-black tracking-wider block">Contact:</span>
              <div className="text-white space-y-0.5 font-mono">
                <div className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-emerald-400" /> (046) 414 - 3979</div>
                <div className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-emerald-400" /> (046) 480 - 7858</div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* LOWER BOTTOM STRIP BOUNDARY COPY */}
      <div className="max-w-7xl mx-auto pt-6 text-center text-[10px] font-black text-emerald-300/60 uppercase tracking-widest select-none">
        © 2026 | Cavite State University - Tanza Campus
      </div>
    </footer>
  );
}

export default Footer;