import React, { useState, useEffect } from 'react';
import LandingPage from "./Pages/LandingPage"; 
import Login from "./Pages/Login";
import Header from "./Components/Header";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Personnel from "./Pages/Personnel";
import ConfirmModal from "./Components/ConfirmModal";
import Ebooks from "./Student/LibraryCatalog/Ebooks";

// //eto pre: DEFINITIVE SEPARATION OF CONCERNS ROUTING IMPORTS!
import Books from "./Student/LibraryCatalog/Books"; // Student View (Pure Cards)
import LibInventoryBooks from "./Librarian/BookInventory/Books"; // Book Inventory (Pure Table Spreadsheet)
import PrintBooks from "./Librarian/LibraryCatalog/PrintBooks"; // Library Catalog Showcase (Librarian Cards)

// //eto pre: CENTRAL MEMORY SYSTEM PIPELINE
import useAuthStore from "./Store/useAuthStore";

function App() {
  // //eto pre: STATE EXTRACTION ENGINE mula kay Zustand persist cache store natively
  const { 
    role, 
    login, 
    logout, 
    catalogItems 
  } = useAuthStore();

  const [appScreen, setAppScreen] = useState("landing"); 
  const [currentTab, setCurrentTab] = useState("dashboard"); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [globalModal, setGlobalModal] = useState({
    isOpen: false, message: "", type: "confirm", onConfirm: () => {}
  });

  // //eto pre: DETECT REFRESH PERSISTENCE SYNC loop cleanly para hindi mawala ang role data page
  useEffect(() => {
    const localSessionData = localStorage.getItem("library-system-session");
    if (localSessionData) {
      try {
        const parsedSession = JSON.parse(localSessionData);
        if (parsedSession?.state?.user) {
          setAppScreen("dashboard");
          const activeRole = parsedSession.state.user.role.toLowerCase();
          setCurrentTab(activeRole === 'librarian' ? "lib-dashboard" : "dashboard");
        }
      } catch (err) {
        console.error("Session integrity mismatch:", err);
      }
    }
  }, []);

  const triggerGlobalConfirmation = (message, confirmCallback) => {
    setGlobalModal({
      isOpen: true,
      message: message,
      type: "confirm",
      onConfirm: () => {
        confirmCallback();
        setGlobalModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const triggerGlobalPrivacyModal = (confirmCallback) => {
    setGlobalModal({
      isOpen: true,
      message: "",
      type: "privacy",
      onConfirm: () => {
        confirmCallback();
        setGlobalModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleAuthEngineBridge = (userData) => {
    // Isinasaksak ang payload directive pabalik kay Zustand array safely cleanly
    login({
      user: userData,
      token: "mock-jwt-string-token-key-2026"
    });
    
    const mappedUserRole = userData.role.toLowerCase();
    setCurrentTab(mappedUserRole === 'librarian' ? "lib-dashboard" : "dashboard");
    setAppScreen("dashboard"); 
  };

  const terminateSession = () => {
    logout(); // Clear localStorage session cleanly without destroying the catalog database pre!
    setAppScreen("landing"); 
    setIsSidebarOpen(false);
  };

  const triggerBackToLandingViewWithoutLogout = () => {
    setAppScreen("landing");
    setIsSidebarOpen(false);
  };

  if (appScreen === "landing") {
    return (
      <LandingPage 
        onNavigateToLogin={() => {
          if (role) setAppScreen("dashboard");
          else setAppScreen("login");
        }} 
      />
    );
  }

  if (appScreen === "login" && !role) {
    return <Login onLoginSuccess={handleAuthEngineBridge} />;
  }

  const isLibrarianActive = role === 'librarian';
  
  const isCustomRoutedTab = 
    currentTab === 'inventory' || 
    currentTab === 'librarians' || 
    currentTab === 'ebooks-tab' || 
    currentTab === 'theses-tab' ||
    currentTab === 'profile' || 
    currentTab === 'lib-profile' || 
    currentTab === 'lib-inventory' ||
    currentTab === 'lib-ebooks' ||
    currentTab === 'lib-theses' ||
    currentTab === 'lib-showcase-books' || 
    currentTab === 'lib-showcase-ebooks' || 
    currentTab === 'lib-showcase-theses' || 
    currentTab === 'lib-team' ||
    currentTab === 'lib-personnel' ||
    currentTab.startsWith('lib-');

  return (
    <div className="w-full h-screen bg-[#F4F6F9] flex flex-col overflow-hidden font-sans antialiased text-slate-800 relative">
      
      <Header 
        currentUser={isLibrarianActive ? { name: "Ryan Apinan", username: "HEAD LIBRARIAN", role: "Librarian" } : { name: "Limuel Kyle Geroy", username: "STUDENT", role: "Student" }} 
        onLogoutTrigger={terminateSession}
        activeTab={currentTab}
        setActiveTab={setCurrentTab}
        role={role || 'student'}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <Navbar 
        activeTab={currentTab} 
        setActiveTab={setCurrentTab} 
        role={role || 'student'}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onBackToLandingTrigger={triggerBackToLandingViewWithoutLogout}
      />

      <div className="flex-1 overflow-y-auto flex flex-col justify-between">
        <main className="max-w-[1600px] w-full mx-auto p-4 md:p-8 flex-1 text-left">
          
          {/* 🎓 STUDENT VIEWS INTERFACES CONFIGURATION PANELS */}
          {currentTab === 'inventory' && (
            <Books /> 
          )}

          {currentTab === 'librarians' && (
            <Personnel onTriggerConfirm={triggerGlobalConfirmation} />
          )}

          {currentTab === 'ebooks-tab' && (
            <Ebooks 
              onTriggerGlobalConfirm={triggerGlobalConfirmation}
              onTriggerGlobalPrivacyModal={triggerGlobalPrivacyModal}
            />
          )}

          {currentTab === 'theses-tab' && (
            <div className="p-12 bg-white border border-slate-200/80 rounded-[32px] shadow-sm text-center text-xs font-black text-slate-400 uppercase tracking-widest mt-4 animate-scaleUp">
              Student Theses Core Module Tab: [ <span className="text-emerald-700 font-mono font-black">{currentTab}</span> ] 
              <p className="text-[10px] text-slate-400 font-bold lowercase tracking-normal normal-case mt-1">Ready for student theses grid mapping natively pre!</p>
            </div>
          )}

          {currentTab === 'profile' && (
            <div className="p-12 bg-white border border-slate-200/80 rounded-[32px] shadow-sm text-center animate-scaleUp mt-4">
              <div className="flex flex-col items-center justify-center py-10 max-w-md mx-auto">
                <div className="w-16 h-16 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-center text-amber-600 mb-5 animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-construction"><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M2 22h20"/><path d="M8 2v4"/><path d="M16 2v4"/></svg>
                </div>
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-1.5">Profile Module Under Maintenance</h3>
                <p className="text-xs font-bold text-slate-400 lowercase tracking-normal leading-relaxed">We are currently configuring the real-time library security credentials desk view setup. Available soon pre!</p>
                <div className="mt-6 px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full font-mono text-[10px] text-slate-400 font-black tracking-wider uppercase">Status: Coming Soon (ProfileInfo.jsx)</div>
              </div>
            </div>
          )}
          
          {/* 📊 LIBRARIAN VIEWS INTERFACES CONFIGURATION DESK SYSTEM */}

          {/* LAYER 1: LIBRARY CATALOG (DAPAT PURE CARDS ANG LALABAS) */}
          {isLibrarianActive && currentTab === 'lib-showcase-books' && (
            <PrintBooks 
              onTriggerConfirm={triggerGlobalConfirmation}
            />
          )}

          {isLibrarianActive && currentTab === 'lib-showcase-ebooks' && (
            <div className="p-12 bg-white border border-slate-200/80 rounded-[32px] shadow-sm text-center text-xs font-black text-slate-400 uppercase tracking-widest mt-4 animate-scaleUp">
              Librarian Showcase: E-Books Magazine Window Template 
              <p className="text-[10px] text-slate-400 font-bold lowercase tracking-normal normal-case mt-1">Ready for layout sync matching natively pre!</p>
            </div>
          )}

          {isLibrarianActive && currentTab === 'lib-showcase-theses' && (
            <div className="p-12 bg-white border border-slate-200/80 rounded-[32px] shadow-sm text-center text-xs font-black text-slate-400 uppercase tracking-widest mt-4 animate-scaleUp">
              Librarian Showcase: Theses Magazine Window Template
              <p className="text-[10px] text-slate-400 font-bold lowercase tracking-normal normal-case mt-1">Ready for layout sync matching natively pre!</p>
            </div>
          )}

          {/* LAYER 2: BOOK INVENTORY (DAPAT PURE DATA TABLE REAL-TIME PERSISTENT SPREADSHEET) */}
          {isLibrarianActive && currentTab === 'lib-inventory' && (
            <LibInventoryBooks 
              onTriggerConfirm={triggerGlobalConfirmation} 
              setActiveTab={setCurrentTab}
            />
          )}

          {isLibrarianActive && currentTab === 'lib-theses' && (
            <LibTheses onTriggerConfirm={triggerGlobalConfirmation} />
          )}

          {isLibrarianActive && (currentTab === 'lib-personnel' || currentTab === 'lib-team') && (
            <Personnel onTriggerConfirm={triggerGlobalConfirmation} />
          )}

          {isLibrarianActive && currentTab === 'lib-profile' && (
            <div className="p-12 bg-white border border-slate-200/80 rounded-[32px] shadow-sm text-center animate-scaleUp mt-4">
              <div className="flex flex-col items-center justify-center py-10 max-w-md mx-auto">
                <div className="w-16 h-16 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-center text-amber-600 mb-5 animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wrench"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                </div>
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-1.5">Admin Profile Under Maintenance</h3>
                <p className="text-xs font-bold text-slate-400 lowercase tracking-normal leading-relaxed">Librarian personnel credential update matrices are currently locked for construction parameters pre.</p>
                <div className="mt-6 px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full font-mono text-[10px] text-slate-400 font-black tracking-wider uppercase">Status: Under Construction</div>
              </div>
            </div>
          )}

          {/* FALLBACK CATCH ROUTERS CONTROLLER */}
          {isLibrarianActive && currentTab !== 'lib-inventory' && currentTab !== 'lib-theses' && currentTab !== 'lib-personnel' && currentTab !== 'lib-team' && currentTab !== 'lib-profile' && currentTab !== 'lib-showcase-books' && currentTab !== 'lib-showcase-ebooks' && currentTab !== 'lib-showcase-theses' && currentTab.startsWith('lib-') && (
            <div className="p-12 bg-white border border-slate-200/80 rounded-[32px] shadow-sm text-center text-xs font-black text-slate-400 uppercase tracking-widest mt-4 animate-scaleUp">
              Librarian Dashboard Sub-View Window: [ <span className="text-orange-700 font-mono font-black">{currentTab}</span> ] 
              <p className="text-[10px] text-slate-400 font-bold lowercase tracking-normal normal-case mt-1">Ready for admin record tables paste injections pre!</p>
            </div>
          )}

          {!isCustomRoutedTab && (
            <div className="p-12 bg-white border border-slate-200/80 rounded-[32px] shadow-sm text-center text-xs font-black text-slate-400 uppercase tracking-widest mt-4 animate-scaleUp">
              Current Active Viewport Template: [ <span className="text-emerald-700 font-mono font-black">{currentTab}</span> ] 
              <p className="text-[10px] text-slate-400 font-bold lowercase tracking-normal normal-case mt-1">Ready for sub-tab content pages pasting natively pre!</p>
            </div>
          )}

        </main>

        <Footer isLanding={false} />
      </div>

      <ConfirmModal 
        isOpen={globalModal.isOpen}
        message={globalModal.message}
        type={globalModal.type}
        onConfirm={globalModal.onConfirm}
        onCancel={() => setGlobalModal(prev => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
}

export default App;