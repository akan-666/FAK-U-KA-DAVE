import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, BookOpen, Layers, GraduationCap, Calendar, History, Users, User, ArrowLeft, X, ChevronDown, BookMarked, Bookmark, ClipboardList } from 'lucide-react';

function Navbar({ activeTab, setActiveTab, role = 'student', isSidebarOpen, setIsSidebarOpen, onBackToLandingTrigger }) {
  const sidebarRef = useRef(null);

  // //eto pre: Dalawang magkabukod na independent toggle trackers para kay Librarian natively pre!
  const [isLibCatalogOpen, setIsLibCatalogOpen] = useState(false);
  const [isLibInventoryOpen, setIsLibInventoryOpen] = useState(false);
  
  // Isang magpapakasawalang state naman para sa student view
  const [isStudentCatalogOpen, setIsStudentCatalogOpen] = useState(false);

  // Automatic state synchronization layout logic registry
  useEffect(() => {
    if (activeTab) {
      // Para sa Student Side
      if (activeTab === 'inventory' || activeTab === 'ebooks-tab' || activeTab === 'theses-tab') {
        setIsStudentCatalogOpen(true);
      }
      // Para sa Librarian Side - Library Catalog (Showcase UI)
      if (activeTab === 'lib-showcase-books' || activeTab === 'lib-showcase-ebooks' || activeTab === 'lib-showcase-theses') {
        setIsLibCatalogOpen(true);
      }
      // Para sa Librarian Side - Book Inventory (Tabular Management UI)
      if (activeTab === 'lib-inventory' || activeTab === 'lib-ebooks' || activeTab === 'lib-theses') {
        setIsLibInventoryOpen(true);
      }
    }
  }, [activeTab]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && !event.target.closest('.hamburger-trigger-btn')) {
        setIsSidebarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsSidebarOpen]);

  return (
    <div 
      ref={sidebarRef}
      className={`fixed top-[80px] left-0 h-[calc(100vh-80px)] w-72 bg-gradient-to-b from-[#043310] to-[#021f0b] text-white shadow-2xl border-r border-emerald-950/60 z-[99999] p-4 flex flex-col justify-between transition-all duration-300 ease-out transform overflow-hidden ${
        isSidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
      }`}
    >
      <div 
        className="space-y-4 overflow-y-auto flex-1 py-2 pr-1 scrollbar-thin scrollbar-thumb-slate-500/40 scrollbar-track-transparent hover:scrollbar-thumb-slate-400/60 transition-colors"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(148, 163, 184, 0.3) transparent' }}
      >
        <div className="flex items-center justify-between px-2.5 pb-2 border-b border-emerald-800/40">
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest font-sans">
            Navigation Blueprint ({role.toUpperCase()})
          </span>
          <button type="button" onClick={() => setIsSidebarOpen(false)} className="text-emerald-400 hover:text-white sm:hidden p-0.5 rounded-lg focus:outline-none">
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-1">
          
          {/* ========================================================================= */}
          {/* 📊 CONDITION A: LIBRARIAN SECURE ADMINISTRATIVE ACCORDION SIDEBAR */}
          {/* ========================================================================= */}
          {role === 'librarian' ? (
            <>
              <button
                type="button"
                onClick={() => { if (setActiveTab) setActiveTab('lib-dashboard'); setIsSidebarOpen(false); }}
                className={`w-full px-4 py-3.5 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-3 transition-all text-left focus:outline-none cursor-pointer ${activeTab === 'lib-dashboard' ? "bg-emerald-50/95 text-[#043310] font-black border border-emerald-200/50 transform translate-x-1" : "text-emerald-100 hover:bg-white/5 hover:text-white"}`}
              >
                <LayoutDashboard className={`h-4 w-4 stroke-[2.5] ${activeTab === 'lib-dashboard' ? 'text-[#043310]' : 'text-emerald-400'}`} />
                <span>Dashboard</span>
              </button>

              {/* CATEGORY 1: LIBRARY CATALOG (SHOWCASE MAGAZINE VIEW PRE COPIA KAY STUDENT) */}
              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => setIsLibCatalogOpen(!isLibCatalogOpen)}
                  className={`w-full px-4 py-3.5 text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-between transition-all text-left focus:outline-none cursor-pointer ${
                    activeTab === 'lib-showcase-books' || activeTab === 'lib-showcase-ebooks' || activeTab === 'lib-showcase-theses' ? "text-emerald-300 font-black bg-white/5" : "text-emerald-100 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BookMarked className="h-4 w-4 stroke-[2.5] text-emerald-400" />
                    <span>Library Catalog</span>
                  </div>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isLibCatalogOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLibCatalogOpen && (
                  <div className="pl-4 border-l border-emerald-800/40 space-y-0.5 mt-0.5 animate-fadeIn">
                    <button
                      type="button"
                      onClick={() => { if (setActiveTab) setActiveTab('lib-showcase-books'); setIsSidebarOpen(false); }}
                      className={`w-full px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-3 transition-all text-left focus:outline-none cursor-pointer ${activeTab === 'lib-showcase-books' ? "bg-emerald-50/95 text-[#043310] font-black" : "text-emerald-200 hover:bg-white/5 hover:text-white"}`}
                    >
                      <BookOpen className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>Print Books</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { if (setActiveTab) setActiveTab('lib-showcase-ebooks'); setIsSidebarOpen(false); }}
                      className={`w-full px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-3 transition-all text-left focus:outline-none cursor-pointer ${activeTab === 'lib-showcase-ebooks' ? "bg-emerald-50/95 text-[#043310] font-black" : "text-emerald-200 hover:bg-white/5 hover:text-white"}`}
                    >
                      <Layers className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>E-Books</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { if (setActiveTab) setActiveTab('lib-showcase-theses'); setIsSidebarOpen(false); }}
                      className={`w-full px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-3 transition-all text-left focus:outline-none cursor-pointer ${activeTab === 'lib-showcase-theses' ? "bg-emerald-50/95 text-[#043310] font-black" : "text-emerald-200 hover:bg-white/5 hover:text-white"}`}
                    >
                      <GraduationCap className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>Theses Books</span>
                    </button>
                  </div>
                )}
              </div>

              {/* //eto pre: SAKTONG BLUEPRINT BASE SA IMAGE_091A72.JPG! Bukod na kategorya sa ilalim nung catalog! */}
              {/* CATEGORY 2: BOOK INVENTORY (TABULAR SPREADSHEET MANAGEMENT GRID) */}
              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => setIsLibInventoryOpen(!isLibInventoryOpen)}
                  className={`w-full px-4 py-3.5 text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-between transition-all text-left focus:outline-none cursor-pointer ${
                    activeTab === 'lib-inventory' || activeTab === 'lib-ebooks' || activeTab === 'lib-theses' ? "text-emerald-300 font-black bg-white/5" : "text-emerald-100 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 stroke-[2.5] text-emerald-400" />
                    <span>Book Inventory</span>
                  </div>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isLibInventoryOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLibInventoryOpen && (
                  <div className="pl-4 border-l border-emerald-800/40 space-y-0.5 mt-0.5 animate-fadeIn">
                    <button
                      type="button"
                      onClick={() => { if (setActiveTab) setActiveTab('lib-inventory'); setIsSidebarOpen(false); }}
                      className={`w-full px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-3 transition-all text-left focus:outline-none cursor-pointer ${activeTab === 'lib-inventory' ? "bg-emerald-50/95 text-[#043310] font-black" : "text-emerald-200 hover:bg-white/5 hover:text-white"}`}
                    >
                      <BookOpen className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>Print Books</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { if (setActiveTab) setActiveTab('lib-ebooks'); setIsSidebarOpen(false); }}
                      className={`w-full px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-3 transition-all text-left focus:outline-none cursor-pointer ${activeTab === 'lib-ebooks' ? "bg-emerald-50/95 text-[#043310] font-black" : "text-emerald-200 hover:bg-white/5 hover:text-white"}`}
                    >
                      <Layers className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>E-Books Collection</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { if (setActiveTab) setActiveTab('lib-theses'); setIsSidebarOpen(false); }}
                      className={`w-full px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-3 transition-all text-left focus:outline-none cursor-pointer ${activeTab === 'lib-theses' ? "bg-emerald-50/95 text-[#043310] font-black" : "text-emerald-200 hover:bg-white/5 hover:text-white"}`}
                    >
                      <GraduationCap className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>Theses Books</span>
                    </button>
                  </div>
                )}
              </div>

              {/* ADMINISTRATIVE CORE TASKS */}
              <button
                type="button"
                onClick={() => { if (setActiveTab) setActiveTab('lib-appointments'); setIsSidebarOpen(false); }}
                className={`w-full px-4 py-3.5 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-3 transition-all text-left focus:outline-none cursor-pointer ${activeTab === 'lib-appointments' ? "bg-emerald-50/95 text-[#043310] font-black border border-emerald-200/50 transform translate-x-1" : "text-emerald-100 hover:bg-white/5 hover:text-white"}`}
              >
                <Calendar className={`h-4 w-4 stroke-[2.5] ${activeTab === 'lib-appointments' ? 'text-[#043310]' : 'text-emerald-400'}`} />
                <span>Book Appointments</span>
              </button>

              <button
                type="button"
                onClick={() => { if (setActiveTab) setActiveTab('lib-borrowed'); setIsSidebarOpen(false); }}
                className={`w-full px-4 py-3.5 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-3 transition-all text-left focus:outline-none cursor-pointer ${activeTab === 'lib-borrowed' ? "bg-emerald-50/95 text-[#043310] font-black border border-emerald-200/50 transform translate-x-1" : "text-emerald-100 hover:bg-white/5 hover:text-white"}`}
              >
                <Bookmark className={`h-4 w-4 stroke-[2.5] ${activeTab === 'lib-borrowed' ? 'text-[#043310]' : 'text-emerald-400'}`} />
                <span>Borrowed Books</span>
              </button>

              <button
                type="button"
                onClick={() => { if (setActiveTab) setActiveTab('lib-returned'); setIsSidebarOpen(false); }}
                className={`w-full px-4 py-3.5 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-3 transition-all text-left focus:outline-none cursor-pointer ${activeTab === 'lib-returned' ? "bg-emerald-50/95 text-[#043310] font-black border border-emerald-200/50 transform translate-x-1" : "text-emerald-100 hover:bg-white/5 hover:text-white"}`}
              >
                <ClipboardList className={`h-4 w-4 stroke-[2.5] ${activeTab === 'lib-returned' ? 'text-[#043310]' : 'text-emerald-400'}`} />
                <span>Returned Logs</span>
              </button>

              <button
                type="button"
                onClick={() => { if (setActiveTab) setActiveTab('lib-team'); setIsSidebarOpen(false); }}
                className={`w-full px-4 py-3.5 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-3 transition-all text-left focus:outline-none cursor-pointer ${activeTab === 'lib-team' ? "bg-emerald-50/95 text-[#043310] font-black border border-emerald-200/50 transform translate-x-1" : "text-emerald-100 hover:bg-white/5 hover:text-white"}`}
              >
                <Users className={`h-4 w-4 stroke-[2.5] ${activeTab === 'lib-team' ? 'text-[#043310]' : 'text-emerald-400'}`} />
                <span>Librarians Personnel</span>
              </button>

              <button
                type="button"
                onClick={() => { if (setActiveTab) setActiveTab('lib-profile'); setIsSidebarOpen(false); }}
                className={`w-full px-4 py-3.5 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-3 transition-all text-left focus:outline-none cursor-pointer ${activeTab === 'lib-profile' ? "bg-emerald-50/95 text-[#043310] font-black border border-emerald-200/50 transform translate-x-1" : "text-emerald-100 hover:bg-white/5 hover:text-white"}`}
              >
                <User className={`h-4 w-4 stroke-[2.5] ${activeTab === 'lib-profile' ? 'text-[#043310]' : 'text-emerald-400'}`} />
                <span>Profile Info</span>
              </button>
            </>
          ) : (
            /* ========================================================================= */
            /* 🎓 CONDITION B: STUDENT PORTAL INTERACTIVE SIDEBAR OPTIONS CHANNELS */
            /* ========================================================================= */
            <>
              <button
                type="button"
                onClick={() => { if (setActiveTab) setActiveTab('dashboard'); setIsSidebarOpen(false); }}
                className={`w-full px-4 py-3.5 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-3 transition-all text-left focus:outline-none cursor-pointer ${activeTab === 'dashboard' ? "bg-emerald-50/95 text-[#043310] font-black border border-emerald-200/50 transform translate-x-1" : "text-emerald-100 hover:bg-white/5 hover:text-white"}`}
              >
                <LayoutDashboard className={`h-4 w-4 stroke-[2.5] ${activeTab === 'dashboard' ? 'text-[#043310]' : 'text-emerald-400'}`} />
                <span>My Dashboard</span>
              </button>

              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => setIsStudentCatalogOpen(!isStudentCatalogOpen)}
                  className={`w-full px-4 py-3.5 text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-between transition-all text-left focus:outline-none cursor-pointer ${
                    activeTab === 'inventory' || activeTab === 'ebooks-tab' || activeTab === 'theses-tab' ? "text-emerald-300 font-black bg-white/5" : "text-emerald-100 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BookMarked className="h-4 w-4 stroke-[2.5] text-emerald-400" />
                    <span>Library Catalog</span>
                  </div>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isStudentCatalogOpen ? 'rotate-180' : ''}`} />
                </button>

                {isStudentCatalogOpen && (
                  <div className="pl-4 border-l border-emerald-800/40 space-y-0.5 mt-0.5 animate-fadeIn">
                    <button
                      type="button"
                      onClick={() => { if (setActiveTab) setActiveTab('inventory'); setIsSidebarOpen(false); }}
                      className={`w-full px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-3 transition-all text-left focus:outline-none cursor-pointer ${activeTab === 'inventory' ? "bg-emerald-50/95 text-[#043310] font-black" : "text-emerald-200 hover:bg-white/5 hover:text-white"}`}
                    >
                      <BookOpen className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>Print Books</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { if (setActiveTab) setActiveTab('ebooks-tab'); setIsSidebarOpen(false); }}
                      className={`w-full px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-3 transition-all text-left focus:outline-none cursor-pointer ${activeTab === 'ebooks-tab' ? "bg-emerald-50/95 text-[#043310] font-black" : "text-emerald-200 hover:bg-white/5 hover:text-white"}`}
                    >
                      <Layers className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>E-Books</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { if (setActiveTab) setActiveTab('theses-tab'); setIsSidebarOpen(false); }}
                      className={`w-full px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-3 transition-all text-left focus:outline-none cursor-pointer ${activeTab === 'theses-tab' ? "bg-emerald-50/95 text-[#043310] font-black" : "text-emerald-200 hover:bg-white/5 hover:text-white"}`}
                    >
                      <GraduationCap className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>Theses Books</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => { if (setActiveTab) setActiveTab('returned'); setIsSidebarOpen(false); }}
                className={`w-full px-4 py-3.5 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-3 transition-all text-left focus:outline-none cursor-pointer ${activeTab === 'returned' ? "bg-emerald-50/95 text-[#043310] font-black border border-emerald-200/50 transform translate-x-1" : "text-emerald-100 hover:bg-white/5 hover:text-white"}`}
              >
                <History className={`h-4 w-4 stroke-[2.5] ${activeTab === 'returned' ? 'text-[#043310]' : 'text-emerald-400'}`} />
                <span>Books History</span>
              </button>

              <button
                type="button"
                onClick={() => { if (setActiveTab) setActiveTab('appointments'); setIsSidebarOpen(false); }}
                className={`w-full px-4 py-3.5 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-3 transition-all text-left focus:outline-none cursor-pointer ${activeTab === 'appointments' ? "bg-emerald-50/95 text-[#043310] font-black border border-emerald-200/50 transform translate-x-1" : "text-emerald-100 hover:bg-white/5 hover:text-white"}`}
              >
                <Calendar className={`h-4 w-4 stroke-[2.5] ${activeTab === 'appointments' ? 'text-[#043310]' : 'text-emerald-400'}`} />
                <span>Appointment Date</span>
              </button>

              <button
                type="button"
                onClick={() => { if (setActiveTab) setActiveTab('librarians'); setIsSidebarOpen(false); }}
                className={`w-full px-4 py-3.5 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-3 transition-all text-left focus:outline-none cursor-pointer ${activeTab === 'librarians' ? "bg-emerald-50/95 text-[#043310] font-black border border-emerald-200/50 transform translate-x-1" : "text-emerald-100 hover:bg-white/5 hover:text-white"}`}
              >
                <Users className={`h-4 w-4 stroke-[2.5] ${activeTab === 'librarians' ? 'text-[#043310]' : 'text-emerald-400'}`} />
                <span>Librarian Personnel</span>
              </button>

              <button
                type="button"
                onClick={() => { if (setActiveTab) setActiveTab('profile'); setIsSidebarOpen(false); }}
                className={`w-full px-4 py-3.5 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-3 transition-all text-left focus:outline-none cursor-pointer ${activeTab === 'profile' ? "bg-emerald-50/95 text-[#043310] font-black border border-emerald-200/50 transform translate-x-1" : "text-emerald-100 hover:bg-white/5 hover:text-white"}`}
              >
                <User className={`h-4 w-4 stroke-[2.5] ${activeTab === 'profile' ? 'text-[#043310]' : 'text-emerald-400'}`} />
                <span>Profile Info</span>
              </button>
            </>
          )}

        </div>
      </div>

      <div className="pt-3 border-t border-emerald-800/40 flex-shrink-0">
        <button
          type="button"
          onClick={() => {
            setIsSidebarOpen(false);
            if(onBackToLandingTrigger) onBackToLandingTrigger();
          }}
          className="w-full px-4 py-3 bg-emerald-900/40 hover:bg-emerald-500/20 border border-emerald-600/30 text-emerald-300 font-black uppercase text-[11px] rounded-xl tracking-wider shadow-inner transition-all flex items-center justify-center gap-2 focus:outline-none cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 text-emerald-400 stroke-[3]" />
          <span>Back to Homepage</span>
        </button>
      </div>

    </div>
  );
}

export default Navbar;