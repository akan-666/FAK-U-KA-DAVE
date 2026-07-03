import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, BookmarkCheck, ChevronDown, LogIn, Menu, User, LogOut } from 'lucide-react';
import cvsuLogo from '../assets/cvsulogo.png';
import cvsuTanzaLogo2 from '../assets/cvsutanzalogo2.png';

function Header({ currentUser, onLogoutTrigger, activeTab, setActiveTab, isLandingView = false, role = 'student', isSidebarOpen, setIsSidebarOpen }) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [hasUnreadNotif, setHasUnreadNotif] = useState(true);
  const [isScrolledDown, setIsScrolledDown] = useState(false);

  const notifRef = useRef(null);

  const mockNotifications = [
    { id: 1, text: "Book Available: 'React Professional Frameworks' is ready for pickup.", time: "5 mins ago" },
    { id: 2, text: "Notice: Your borrow period for 'MySQL Core v8.0' expires in 3 hours.", time: "3 hrs ago" }
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScrollEngineCheck = () => {
      if (window.scrollY > 20) setIsScrolledDown(true);
      else setIsScrolledDown(false);
    };
    window.addEventListener('scroll', handleScrollEngineCheck);
    return () => window.removeEventListener('scroll', handleScrollEngineCheck);
  }, []);

  const getDynamicMenuItemsRegistry = () => {
    if (role === 'librarian') {
      return [
        { id: 'lib-dashboard', label: 'Dashboard' },
        { id: 'lib-inventory', label: 'Book Inventory' },
        { id: 'lib-ebooks', label: 'E-Books Collection' },
        { id: 'lib-theses', label: 'Theses Books' },
        { id: 'lib-appointments', label: 'Book Appointments' },
        { id: 'lib-borrowed', label: 'Borrowed Books' },
        { id: 'lib-returned', label: 'Returned Logs' },
        { id: 'lib-team', label: 'Librarians Personnel' },
        { id: 'lib-profile', label: 'Profile Info' }
      ];
    }
    
    return [
      { id: 'dashboard', label: 'My Dashboard' },
      { id: 'inventory', label: 'Available Books' },
      { id: 'ebooks-tab', label: 'E-Books' },
      { id: 'theses-tab', label: 'Theses Books' },
      { id: 'returned', label: 'Books History' },
      { id: 'appointments', label: 'Appointment Date' },
      { id: 'librarians', label: 'Librarian Personnel' },
      { id: 'profile', label: 'Profile Info' }
    ];
  };

  const activeDisplayMenuCollection = getDynamicMenuItemsRegistry();
  const currentActiveTabObject = activeDisplayMenuCollection.find(item => item.id === activeTab);
  const activeTabLabelString = currentActiveTabObject ? currentActiveTabObject.label.toUpperCase() : "DASHBOARD";

  // =========================================================================
  // 🟢 MODE 1: HOMEPAGE / LANDING VIEW NAVIGATION BAR THEME (EMERALD HARMONY)
  // =========================================================================
  if (isLandingView || !currentUser) {
    return (
      <nav className={`w-full fixed top-0 left-0 right-0 z-[1000] px-12 transition-all duration-300 h-[95px] flex items-center ${
        isScrolledDown 
          ? "bg-[#03290d]/95 backdrop-blur-md shadow-lg border-b border-emerald-900/60" 
          : "bg-[#043310] border-b border-emerald-900/40"
      }`}>
        <div className="max-w-[1600px] w-full mx-auto flex items-center justify-between">
          
          {/* CAMPUS BADGE IDENTITY BRAND - ULTRA-SLIM MINIMALIST WRAPPER */}
          <div className="flex items-center flex-shrink-0 bg-white px-3 py-1.5 rounded-xl border border-white/10 shadow-sm transition-all duration-200">
            <img 
              src={cvsuTanzaLogo2} 
              alt="CvSU Tanza Campus Banner" 
              className="h-[36px] md:h-[40px] w-auto object-contain cursor-pointer transition-transform duration-200 active:scale-95"
              onClick={() => { if(setActiveTab) setActiveTab('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            />
          </div>

          {/* NEW CENTRALIZED NAVIGATION MENU LINKS */}
          <div className="hidden lg:flex items-center gap-7 text-[13.5px] font-black font-sans tracking-widest uppercase text-emerald-100/90">
            
            {/* HOME CONTROLLER RE-ROUTE DECK */}
            <div 
              onClick={() => { if(setActiveTab) setActiveTab('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className="hover:text-white cursor-pointer transition-colors py-2 relative group tracking-widest text-white"
            >
              <span>Home</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 transition-all" />
            </div>

            {/* ABOUT DROPDOWN MAP */}
            <div className="relative group py-2">
              <div className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
                <span>About</span>
                <ChevronDown className="h-3.5 w-3.5 text-emerald-400/80 group-hover:rotate-180 transition-transform duration-200" />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 bg-gradient-to-b from-[#043310] to-[#021f0b] border border-emerald-900/60 shadow-2xl rounded-2xl overflow-hidden opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 text-left">
                <div className="p-2 space-y-0.5">
                  <div className="px-5 py-3.5 text-emerald-100/90 hover:text-white hover:bg-white/5 font-black rounded-xl transition-colors cursor-pointer text-[12px] tracking-wider text-left block leading-relaxed">
                    Overview, Mission, Vision and Objectives
                  </div>
                  <div className="px-5 py-3.5 text-emerald-100/90 hover:text-white hover:bg-white/5 font-black rounded-xl transition-colors cursor-pointer text-[12px] tracking-wider text-left block border-t border-emerald-900/40 leading-relaxed">
                    Rules and Regulations
                  </div>
                  <div 
                    onClick={() => { const targetFooter = document.querySelector('footer'); if(targetFooter) targetFooter.scrollIntoView({ behavior: 'smooth' }); }} 
                    className="px-5 py-3.5 text-emerald-100/90 hover:text-white hover:bg-white/5 font-black rounded-xl transition-colors cursor-pointer text-[12px] tracking-wider text-left block border-t border-emerald-900/40"
                  >
                    Directory and Contacts
                  </div>
                </div>
              </div>
            </div>

            {/* CATALOG DROPDOWN MODULE */}
            <div className="relative group py-2">
              <div className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
                <span>Catalog</span>
                <ChevronDown className="h-3.5 w-3.5 text-emerald-400/80 group-hover:rotate-180 transition-transform duration-200" />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-60 bg-gradient-to-b from-[#043310] to-[#021f0b] border border-emerald-900/60 shadow-2xl rounded-2xl overflow-hidden opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 text-left">
                <div className="p-2 space-y-0.5">
                  <div className="px-5 py-3.5 text-emerald-100/90 hover:text-white hover:bg-white/5 font-black rounded-xl transition-colors cursor-pointer text-[12px] tracking-wider text-left block">Printed Books</div>
                  <div className="px-5 py-3.5 text-emerald-100/90 hover:text-white hover:bg-white/5 font-black rounded-xl transition-colors cursor-pointer text-[12px] tracking-wider text-left block border-t border-emerald-900/40">Theses Books</div>
                  <div className="px-5 py-3.5 text-emerald-100/90 hover:text-white hover:bg-white/5 font-black rounded-xl transition-colors cursor-pointer text-[12px] tracking-wider text-left block border-t border-emerald-900/40">E-Books</div>
                </div>
              </div>
            </div>

            {/* SERVICES DROPDOWN CONTEXT */}
            <div className="relative group py-2">
              <div className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
                <span>Services</span>
                <ChevronDown className="h-3.5 w-3.5 text-emerald-400/80 group-hover:rotate-180 transition-transform duration-200" />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-gradient-to-b from-[#043310] to-[#021f0b] border border-emerald-900/60 shadow-2xl rounded-2xl overflow-hidden opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 text-left">
                <div className="p-2 space-y-0.5">
                  <div className="px-5 py-3.5 text-emerald-100/90 hover:text-white hover:bg-white/5 font-black rounded-xl transition-colors cursor-pointer text-[12px] tracking-wider text-left block leading-relaxed">Online Library Services</div>
                  <div className="px-5 py-3.5 text-emerald-100/90 hover:text-white hover:bg-white/5 font-black rounded-xl transition-colors cursor-pointer text-[12px] tracking-wider text-left block border-t border-emerald-900/40 leading-relaxed">School Library Services</div>
                </div>
              </div>
            </div>

            {/* //eto pre: GINAWANG SOLID WHITE BUTTON NA PRO ANG DATING AT HIGH VISIBILITY TEXT GRAPHICS */}
            <button
              type="button" 
              onClick={() => { if(setActiveTab) setActiveTab('login-trigger-fallback-check'); }}
              className="bg-white hover:bg-slate-100 text-[#043310] text-[12px] font-black uppercase tracking-widest px-7 py-3.5 rounded-xl shadow-md transition-all cursor-pointer拦截 focus:outline-none transform hover:-translate-y-0.5 flex items-center gap-2 border border-slate-100"
            >
              <LogIn className="h-4 w-4 stroke-[3] text-[#043310]" />
              <span>Sign In</span>
            </button>
          </div>

        </div>
      </nav>
    );
  }

  // =========================================================================
  // 👤 MODE 2: ACTIVE SECURED PORTAL SYSTEM BAR (FOREST GREEN THEME)
  // =========================================================================
  const displayStudentName = currentUser?.name || "Limuel-Kyle Geroy";
  const displayStudentNo = currentUser?.username || "202315215";

  return (
    <header className="w-full bg-[#043310] text-white flex select-none shadow-md z-50 flex-shrink-0 relative h-[80px] px-6 font-sans">
      <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between">
        
        <div className="flex items-center gap-5">
          <div className="bg-white w-10 h-10 rounded-full shadow-md flex items-center justify-center p-0.5 border border-emerald-800/10 flex-shrink-0">
            <img src={cvsuLogo} alt="CvSU Logo" className="w-8 h-8 object-contain" />
          </div>

          <div className="text-left flex flex-col justify-center">
            <h1 className="font-black tracking-wider text-base md:text-lg leading-none">CvSU Tanza</h1>
            <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-1 leading-none">Integrated Library System</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-4 border-r border-emerald-800/60 pr-4">
            
            <button
              type="button"
              onClick={() => { if(setIsSidebarOpen) setIsSidebarOpen(!isSidebarOpen); }}
              className="hamburger-trigger-btn p-2.5 bg-white/10 hover:bg-white/20 border border-emerald-500/20 rounded-xl transition-all cursor-pointer flex items-center justify-center group text-emerald-100 hover:text-white focus:outline-none shadow-sm flex-shrink-0 mr-1"
            >
              <Menu className="h-4.5 w-4.5 stroke-[3] transition-transform duration-200 group-hover:scale-105" />
            </button>

            <div className="relative" ref={notifRef}>
              <button 
                type="button"
                onClick={() => { setIsNotifOpen(!isNotifOpen); setHasUnreadNotif(false); }}
                className={`relative transition-all p-2 rounded-xl cursor-pointer focus:outline-none ${isNotifOpen ? 'bg-white/10 text-emerald-300' : 'text-emerald-100 hover:text-white hover:bg-white/5'}`}
              >
                <Bell className="h-5 w-5" />
                {hasUnreadNotif && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#043310]" />}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-4 w-80 bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden text-slate-800 animate-fadeIn z-[99]">
                  <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                      <BookmarkCheck className="h-4 w-4 text-emerald-700" /> Notifications
                    </h4>
                    <button type="button" onClick={() => setIsNotifOpen(false)} className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-slate-200/60 cursor-pointer">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  
                  <div className="divide-y divide-slate-100 font-medium max-h-64 overflow-y-auto text-left">
                    {mockNotifications.map(notif => (
                      <div key={notif.id} className="p-3 text-left text-xs transition-colors hover:bg-slate-50/80 cursor-pointer flex gap-2 items-start">
                        <span className="w-1.5 h-1.5 rounded-full mt-1.5 bg-emerald-600 flex-shrink-0" />
                        <div className="space-y-0.5">
                          <p className="text-slate-600 font-bold leading-normal text-[11px]">{notif.text}</p>
                          <span className="text-[9px] font-mono font-black text-slate-400 block">{notif.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          <div className="relative group py-2">
            <div className="flex items-center gap-3 text-left cursor-pointer p-1 rounded-2xl transition-all duration-200 select-none">
              <div className="hidden sm:block text-right">
                <div className="text-xs font-black tracking-tight text-white uppercase">{displayStudentName}</div>
                <span className="text-[10px] font-mono font-black text-emerald-400 tracking-wider block mt-0.5">{displayStudentNo}</span>
              </div>
              <div className="w-9 h-9 bg-emerald-600 rounded-full border-2 border-emerald-400 text-xs font-mono font-black flex items-center justify-center text-white shadow-inner tracking-wider flex-shrink-0">
                {displayStudentName.substring(0,2).toUpperCase()}
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-emerald-400 transition-transform duration-200 group-hover:rotate-180" />
            </div>

            <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden text-slate-800 hidden group-hover:block z-[9999] animate-fadeIn">
              <div className="p-2 space-y-0.5">
                <button 
                  type="button"
                  onClick={() => { 
                    if (typeof setActiveTab === 'function') {
                      setActiveTab(role === 'librarian' ? 'lib-profile' : 'profile'); 
                    }
                  }}
                  className="w-full px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-600 hover:text-emerald-950 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer text-left flex items-center gap-3 focus:outline-none bg-transparent border-none"
                >
                  <User className="h-4 w-4 text-slate-400 stroke-[2.5]" />
                  <span>Profile Info</span>
                </button>
                
                <button 
                  type="button"
                  onClick={() => { if(onLogoutTrigger) onLogoutTrigger(); }}
                  className="w-full px-4 py-3 text-xs font-black uppercase tracking-wider text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer text-left flex items-center gap-3 focus:outline-none border-t border-slate-100 bg-transparent"
                >
                  <LogOut className="h-4 w-4 text-red-500 stroke-[2.5]" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}

export default Header;