import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import useAuthStore from "../../Store/useAuthStore";
import { Search, BookOpen, User, X, Calendar as CalendarIcon, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

function Books() {
  // //eto pre: Kinuha na natin si catalogItems at submitBorrowRequest tool directly sa persistent store mo!
  const { catalogItems, submitBorrowRequest } = useAuthStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedBook, setSelectedBook] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Scheduler system active states
  const [isAppointmentModeOpen, setIsAppointmentModeOpen] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTimeSlot, setAppointmentTimeSlot] = useState('Morning (08:00 AM - 11:00 AM)');
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const officialLibraryCategoryFilters = [
    { id: 'ALL', label: 'All Resources' },
    { id: 'NON-FICTION', label: 'Non-Fiction' },
    { id: 'FICTION', label: 'Fiction' },
    { id: 'READING', label: 'Reading' },
    { id: 'TAGALOG', label: 'Tagalog' },
    { id: 'MODULE', label: 'Module' }
  ];

  const filteredMagazineCatalog = useMemo(() => {
    const queryStr = searchQuery.toLowerCase().trim();
    const safeCatalog = catalogItems || [];
    return safeCatalog.filter(book => {
      const bookSubject = String(book.subject1 || '').toUpperCase().trim();
      const matchCategory = selectedCategory === 'ALL' || bookSubject === selectedCategory;
      
      const matchQuery = queryStr === '' || 
        String(book.title || '').toLowerCase().includes(queryStr) || 
        String(book.personalName || '').toLowerCase().includes(queryStr) ||
        String(book.barcode || '').includes(queryStr);

      return matchCategory && matchQuery;
    });
  }, [catalogItems, searchQuery, selectedCategory]);

  const isSelectedDateThursday = useMemo(() => {
    if (!appointmentDate) return false;
    return new Date(appointmentDate).getDay() === 4;
  }, [appointmentDate]);

  const handleOpenPublicPreviewDeck = (book) => {
    setSelectedBook(book);
    setIsAppointmentModeOpen(false);
    setShowSuccessOverlay(false);
    setIsPreviewModalOpen(true);
  };

  const handleProcessCommitAppointment = (e) => {
    if (e) e.preventDefault();
    if (!appointmentDate || isSelectedDateThursday) return;

    // //eto pre: Isinasaksak ang active structural borrow data package safely sa store registry table!
    if (typeof submitBorrowRequest === 'function') {
      submitBorrowRequest(selectedBook.id, {
        name: "Limuel-Kyle Geroy",
        id: "202315215"
      });
    }

    setShowSuccessOverlay(true);
    setTimeout(() => {
      setIsPreviewModalOpen(false);
      setIsAppointmentModeOpen(false);
      setShowSuccessOverlay(false);
    }, 3500);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800 text-left relative w-full mt-4 select-none font-sans">
      
      {/* BRAND INTERACTIVE HEADER STATUS BAR */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-[#043310] tracking-tight uppercase flex items-center gap-2.5">
            <BookOpen className="h-5 w-5 text-emerald-600 stroke-[2.5]" /> Discovery Books Catalog
          </h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Explore and request campus physical collection copies via dynamic magazine interface
          </p>
        </div>
        
        <div className="bg-emerald-50 border border-emerald-200/60 px-4 py-2 rounded-2xl text-right flex-shrink-0">
          <span className="text-[10px] font-black text-emerald-800 block uppercase tracking-widest leading-none">Catalog Match</span>
          <span className="text-lg font-mono font-black text-[#043310] leading-none block mt-1">{filteredMagazineCatalog.length} Books</span>
        </div>
      </div>

      {/* 🧭 FILTER TOOLS DECK AREA */}
      <div className="space-y-4">
        <div className="relative w-full max-w-2xl">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <Search className="h-4 w-4 stroke-[2.5]" />
          </span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type book keywords, topics, authors fields cleanly to explore dynamic cards..." 
            className="w-full bg-white text-slate-700 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-bold focus:outline-none focus:border-[#043310] transition-all shadow-sm" 
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 pr-4 scrollbar-none max-w-full">
          {officialLibraryCategoryFilters.map((category) => {
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2.5 text-[11px] font-black uppercase tracking-wider rounded-xl border transition-all duration-150 flex-shrink-0 whitespace-nowrap cursor-pointer focus:outline-none ${
                  isActive ? "bg-[#043310] border-[#043310] text-white shadow-md transform -translate-y-0.5" : "bg-white border-slate-200 text-slate-500 shadow-sm"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 📖 THE REFACTORED 5-COLUMN STUDENTS GRID DISPLAY INTERFACE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredMagazineCatalog.map((book) => (
          <div 
            key={book.id}
            onClick={() => { handleOpenPublicPreviewDeck(book); }}
            className="group bg-white border border-slate-200/80 rounded-[32px] p-4 shadow-sm hover:shadow-2xl hover:border-emerald-700/20 cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div className="w-full h-[280px] sm:h-[300px] md:h-[320px] bg-gradient-to-b from-emerald-800 to-[#021f0b] rounded-[24px] relative flex flex-col items-center justify-center shadow-md text-white overflow-hidden mb-4 border border-emerald-950/20">
              {book.image ? (
                <img src={book.image} alt={book.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 brightness-[0.95]" />
              ) : (
                <div className="flex flex-col items-center justify-center p-6 opacity-25 group-hover:opacity-40 transition-opacity">
                  <BookOpen className="h-14 w-14 text-white stroke-[1.2]" />
                </div>
              )}
            </div>

            <div className="space-y-2 px-1 flex-1 flex flex-col justify-between text-left">
              <div>
                <h4 className="text-[13px] font-black text-slate-800 tracking-tight leading-snug line-clamp-2 uppercase group-hover:text-[#043310] transition-colors">{book.title}</h4>
                <p className="text-[10px] font-semibold text-slate-400 truncate mt-0.5">{book.personalName || book.author || '—'}</p>
              </div>
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 mt-1 text-slate-400">
                <span className="font-mono font-black tracking-tight text-[10px] uppercase truncate max-w-[90px]">{book.copyNo || 'Copy 1'}</span>
                <span className={`text-[10px] font-black font-sans tracking-tight uppercase ${
                  book.status === 'FOR PICK-UP' ? 'text-amber-600' : book.status === 'BORROWED' ? 'text-red-600' : 'text-emerald-700'
                }`}>
                  STATUS: {book.status || 'AVAILABLE'}
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 👁️ CENTRALIZED PORTAL OVERLAY SHIELD FOR STUDENT SPECIFIC PREVIEWS */}
      {/* ========================================================================= */}
      {isPreviewModalOpen && selectedBook && ReactDOM.createPortal(
        <div className="fixed inset-0 w-screen h-screen bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999999] animate-fadeIn text-left select-none font-sans">
          <div className="bg-white rounded-[32px] border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scaleUp text-left flex flex-col relative">
            
            {showSuccessOverlay && (
              <div className="absolute inset-0 z-[99999] bg-white flex flex-col items-center justify-center text-center p-8 animate-fadeIn">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mb-4 animate-bounce">
                  <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Appointment Booked!</h3>
                <p className="text-xs font-bold text-slate-400 mt-1 max-w-sm leading-relaxed uppercase">
                  Your pickup schedule has been dispatched to Librarian Ryan Apinan pre cleanly!
                </p>
              </div>
            )}

            <div className="p-6 pt-8 md:p-8 md:pt-10 overflow-y-auto space-y-6 flex-1 text-slate-700 bg-white rounded-t-[32px] scrollbar-none">
              
              {!isAppointmentModeOpen ? (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="w-32 aspect-[3/4] bg-gradient-to-b from-emerald-900 to-[#011407] rounded-2xl flex-shrink-0 p-2 flex flex-col justify-between text-white shadow-md border border-emerald-950/40 relative overflow-hidden text-center">
                      {selectedBook.image ? (
                        <img src={selectedBook.image} alt={selectedBook.title} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <BookOpen className="h-8 w-8 text-emerald-400/60 mx-auto mt-12 stroke-[1.5]" />
                      )}
                      {!selectedBook.image && <span className="text-[6.5px] font-mono text-emerald-400 text-center truncate">{selectedBook.publisher || 'CvSU ILS'}</span>}
                    </div>
                    <div className="space-y-2 flex-1">
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 text-[9px] font-black rounded-md uppercase tracking-wider inline-block">{selectedBook.subject1 || 'General'}</span>
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-tight pt-1">{selectedBook.title}</h3>
                      <p className="text-xs font-bold text-emerald-800">{selectedBook.personalName || selectedBook.author || '—'}</p>
                      
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Book Summary</span>
                        <p className="text-xs text-slate-500 font-bold leading-relaxed">{selectedBook.summary || '—'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Resource Identification Properties Matrix */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4 font-sans text-xs">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Resource Identification Properties</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-medium text-slate-600">
                      <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Subject Classification:</span> <span className="font-bold text-slate-900 uppercase">{selectedBook.subject1 || '—'}</span></div>
                      <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Barcode Number:</span> <span className="font-mono font-black text-slate-800">{selectedBook.barcode || '—'}</span></div>
                      <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Accession Number:</span> <span className="font-mono font-black text-amber-800">{selectedBook.accessionNo || '—'}</span></div>
                      <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Full Call Number:</span> <span className="font-mono font-bold text-emerald-800">{selectedBook.fullCallNumber || selectedBook.callNumber || '—'}</span></div>
                      <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Remainder Title:</span> <span className="font-medium text-slate-600 italic">{selectedBook.remainderTitle || '—'}</span></div>
                      <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Place of Publication:</span> <span className="font-bold text-slate-800">{selectedBook.placeOfPublication || '—'}</span></div>
                      <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Publication Line:</span> <span className="font-bold text-slate-700">{selectedBook.publication || '—'}</span></div>
                      <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Publisher / Copyright Year:</span> <span className="font-mono font-bold text-slate-800">{selectedBook.publisher || selectedBook.publicationYear || '—'}</span></div>
                      <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Extent Pages:</span> <span className="font-medium text-slate-600">{selectedBook.extent || '—'}</span></div>
                      <div className="flex flex-col sm:col-span-2"><span className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Physical Size Dimensions:</span> <span className="font-mono text-slate-600">{selectedBook.dimensions || '—'}</span></div>
                    </div>
                  </div>

                  <div className="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5 flex flex-col gap-1 text-xs font-bold text-emerald-950 text-left">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        selectedBook.status === 'FOR PICK-UP' ? 'bg-amber-500 animate-pulse' : selectedBook.status === 'BORROWED' ? 'bg-red-500' : 'bg-emerald-600 shadow-sm animate-pulse'
                      }`} />
                      <span>Shelving Index Profile: Managed safely as <b className="font-mono font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded shadow-sm">{selectedBook.copyNo || 'Copy 1'}</b></span>
                    </div>
                    <div className="pl-4 pt-1 text-[11px] uppercase tracking-wide">
                      STATUS: <span className={`font-mono font-black ${
                        selectedBook.status === 'FOR PICK-UP' ? 'text-amber-600' : selectedBook.status === 'BORROWED' ? 'text-red-600' : 'text-emerald-700'
                      }`}>{selectedBook.status || 'AVAILABLE'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                // Dambuhalang Schedule Panel View
                <div className="space-y-6 animate-scaleUp text-left">
                  <div className="border-b border-slate-100 pb-3">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-emerald-700 stroke-[2.5]" /> Configure Appointment Schedule Window
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Book Title: {selectedBook.title}</p>
                  </div>

                  <form onSubmit={handleProcessCommitAppointment} className="space-y-5">
                    <div className="space-y-2 flex flex-col items-start w-full">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Select Pickup Date (Thursdays Excluded)</label>
                      <input type="date" required value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} className="w-full h-14 bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 text-sm font-black focus:outline-none focus:border-[#043310] transition-all shadow-inner cursor-pointer" />
                    </div>
                    {isSelectedDateThursday && (
                      <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 text-red-700 text-xs font-bold uppercase tracking-tight">
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div><span>Appointment Blocked:</span><p className="text-[11px] text-red-500 font-medium normal-case mt-0.5">Library collection pickup operations are suspended on Thursdays pre.</p></div>
                      </div>
                    )}
                    <div className="space-y-2 flex flex-col items-start w-full">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Select Operational Timeframe</label>
                      <select value={appointmentTimeSlot} onChange={(e) => setAppointmentTimeSlot(e.target.value)} className="w-full h-14 bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 text-xs font-black text-[#043310] focus:outline-none cursor-pointer shadow-inner transition-all uppercase">
                        <option value="Morning (08:00 AM - 11:00 AM)">🌅 Morning (08:00 AM - 11:00 AM)</option>
                        <option value="Afternoon (01:00 PM - 04:00 PM)">☀️ Afternoon (01:00 PM - 04:00 PM)</option>
                      </select>
                    </div>
                  </form>
                </div>
              )}

            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0">
              <button 
                type="button" 
                onClick={() => isAppointmentModeOpen ? setIsAppointmentModeOpen(false) : setIsPreviewModalOpen(false)}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl text-xs font-black uppercase tracking-wider focus:outline-none shadow-sm"
              >
                {isAppointmentModeOpen ? "Back" : "Close Catalog"}
              </button>
              {!isAppointmentModeOpen ? (
                <button 
                  type="button"
                  disabled={selectedBook.status === 'BORROWED' || selectedBook.status === 'FOR PICK-UP'}
                  onClick={() => setIsAppointmentModeOpen(true)}
                  className="px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-[#043310] hover:bg-emerald-900 disabled:bg-slate-200 disabled:text-slate-400 rounded-xl shadow-md transition-all cursor-pointer focus:outline-none"
                >
                  Appointment Borrow Request
                </button>
              ) : (
                <button 
                  type="button"
                  disabled={!appointmentDate || isSelectedDateThursday}
                  onClick={handleProcessCommitAppointment}
                  className="px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 rounded-xl shadow-md transition-all cursor-pointer focus:outline-none"
                >
                  Confirm Appointment
                </button>
              )}
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}

export default Books;