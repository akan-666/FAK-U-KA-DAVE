import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import useAuthStore from "../../Store/useAuthStore";
import { Search, BookOpen, User, X, Plus, Image, Edit2, CheckCircle2 } from 'lucide-react';

function PrintBooks({ onTriggerConfirm }) {
const { 
  catalogItems, 
  saveOrUpdateCatalogItem, 
  borrowRequests, 
  acceptBorrowRequest, 
  declineBorrowRequest 
} = useAuthStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedBook, setSelectedBook] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [manualBookImagePreview, setManualBookImagePreview] = useState(null);
  
  const [toastNotification, setToastNotification] = useState({ isVisible: false, message: '' });

  const [formData, setFormData] = useState({
    title: '', personalName: '', remainderTitle: '', barcode: '', fullCallNumber: '',
    publisher: '', placeOfPublication: '', publication: '',
    extent: '', dimensions: '', subject1: '', copyNo: 'Copy 1', summary: '—', status: 'AVAILABLE'
  });

  const [mockBorrowRequests, setMockBorrowRequests] = useState({
    'mock-1': { studentName: "LIMUEL KYLE GEROY", id: "202315215", active: true },
    'mock-2': null
  });

  const triggerLocalToasterAlert = (message) => {
    setToastNotification({ isVisible: true, message });
    setTimeout(() => setToastNotification({ isVisible: false, message: '' }), 3500);
  };

  const initialMockDataset = useMemo(() => {
    return [
      { id: 'mock-1', title: "CLEAN CODE", personalName: "Martin, Robert C.", subject1: "Non-Fiction", barcode: "978-0132350884", fullCallNumber: "QA76.76.R44 M37 2009", placeOfPublication: "Boston", publication: "Prentice Hall", publisher: "2009", extent: "xxix, 431 pages", dimensions: "24 cm", copyNo: "Copy 1", summary: "—", status: "AVAILABLE" },
      { id: 'mock-2', title: "THE PRAGMATIC PROGRAMMER", personalName: "Hunt, Andrew", subject1: "Fiction", barcode: "978-0201616224", fullCallNumber: "QA76.6 .H85 2000", placeOfPublication: "Reading", publication: "Addison-Wesley", publisher: "2000", extent: "320 pages", dimensions: "23 cm", copyNo: "Copy 1", summary: "—", status: "AVAILABLE" },
      { id: 'mock-3', title: "CODE COMPLETE", personalName: "McConnell, Steve", subject1: "Module", barcode: "978-0735619678", fullCallNumber: "QA76.6 .M36 2004", placeOfPublication: "Redmond", publication: "Microsoft Press", publisher: "2004", extent: "914 pages", dimensions: "24 cm", copyNo: "Copy 1", summary: "—", status: "AVAILABLE" },
      { id: 'mock-4', title: "INTRODUCTION TO JAVA PROGRAMMING", personalName: "Liang, Y. Daniel", subject1: "Reading", barcode: "978-0133761313", fullCallNumber: "QA76.73.J38 L52 2015", placeOfPublication: "New York", publication: "Pearson", publisher: "2015", extent: "1240 pages", dimensions: "26 cm", copyNo: "Copy 1", summary: "—", status: "AVAILABLE" },
      { id: 'mock-5', title: "PYTHON CRASH COURSE", personalName: "Matthes, Eric", subject1: "Tagalog", barcode: "978-1593276034", fullCallNumber: "QA76.73.P98 M38 2016", placeOfPublication: "San Francisco", publication: "No Starch Press", publisher: "2016", extent: "560 pages", dimensions: "23 cm", copyNo: "Copy 1", summary: "—", status: "AVAILABLE" }
    ];
  }, []);

  // //eto pre: COMPILATION DECK MAP FIXED - Humihigop na sa catalogItems ng store!
  const completeRenderDataset = useMemo(() => {
    const safeCatalog = catalogItems || [];
    const userAddedIds = new Set(safeCatalog.map(b => b.id));
    const filteredMocks = initialMockDataset.filter(b => !userAddedIds.has(b.id));
    return [...safeCatalog, ...filteredMocks];
  }, [catalogItems, initialMockDataset]);

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
    return completeRenderDataset.filter(book => {
      const bookSubject = String(book.subject1 || '').toUpperCase().trim();
      const matchCategory = selectedCategory === 'ALL' || bookSubject === selectedCategory;
      const matchQuery = queryStr === '' || 
        String(book.title || '').toLowerCase().includes(queryStr) || 
        String(book.personalName || '').toLowerCase().includes(queryStr) ||
        String(book.barcode || '').includes(queryStr);
      return matchCategory && matchQuery;
    });
  }, [completeRenderDataset, searchQuery, selectedCategory]);

  const handleFormInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFormImageUploadChange = (e) => {
    const targetFile = e.target.files[0];
    if (targetFile) {
      const fileEngineReader = new FileReader();
      fileEngineReader.onloadend = () => {
        setManualBookImagePreview(fileEngineReader.result);
      };
      fileEngineReader.readAsDataURL(targetFile);
    }
  };

  const handleTriggerInlineBookModification = (targetBook) => {
    setFormData({
      title: targetBook.title || '',
      personalName: targetBook.personalName || '',
      remainderTitle: targetBook.remainderTitle || '',
      barcode: targetBook.barcode || '',
      fullCallNumber: targetBook.fullCallNumber || '',
      publisher: targetBook.publisher || '',
      placeOfPublication: targetBook.placeOfPublication || '',
      publication: targetBook.publication || '',
      extent: targetBook.extent || '',
      dimensions: targetBook.dimensions || '',
      subject1: targetBook.subject1 || '',
      copyNo: targetBook.copyNo || 'Copy 1',
      summary: targetBook.summary || '—',
      status: targetBook.status || 'AVAILABLE',
      id: targetBook.id
    });
    setManualBookImagePreview(targetBook.image || null);
    setIsEditMode(true);
    setIsPreviewModalOpen(false); 
    setIsAddFormOpen(true);
  };

  const handleProcessCancelActionWithPrompt = () => {
    setIsAddFormOpen(false);
    if (typeof onTriggerConfirm === 'function') {
      onTriggerConfirm(
        "Are you sure you want to cancel and discard all your unsaved field entries?",
        () => {
          setIsAddFormOpen(false);
          setIsEditMode(false);
          setManualBookImagePreview(null);
          setFormData({ title: '', personalName: '', remainderTitle: '', barcode: '', fullCallNumber: '', publisher: '', placeOfPublication: '', publication: '', extent: '', dimensions: '', subject1: '', copyNo: 'Copy 1', summary: '—', status: 'AVAILABLE' });
        },
        () => {
          setIsAddFormOpen(true);
        }
      );
    } else {
      setIsAddFormOpen(false);
      setIsEditMode(false);
      setManualBookImagePreview(null);
    }
  };

  const handleProcessFormSubmission = (e) => {
    if (e) e.preventDefault();
    if (!formData.title || !formData.personalName || !formData.barcode || !formData.fullCallNumber) {
      alert("Please populate core credentials tracking fields!");
      return;
    }

    const executeDatabaseCommitTransaction = () => {
      if (isEditMode) {
        // //eto pre: DIRETSO KAY ZUSTAND STORE NA PARA HINDI NA MAG-DUPLICATE KAILANMAN!
        saveOrUpdateCatalogItem({ ...formData, image: manualBookImagePreview });
        triggerLocalToasterAlert(`"${formData.title.toUpperCase()}" updated successfully inside operational tables!`);
      } else {
        saveOrUpdateCatalogItem({ ...formData, id: Date.now(), image: manualBookImagePreview, isModifiedRecord: false });
        triggerLocalToasterAlert(`New print asset entry registered successfully into active system memory!`);
      }
      
      setFormData({ title: '', personalName: '', remainderTitle: '', barcode: '', fullCallNumber: '', publisher: '', placeOfPublication: '', publication: '', extent: '', dimensions: '', subject1: '', copyNo: 'Copy 1', summary: '—', status: 'AVAILABLE' });
      setManualBookImagePreview(null);
      setIsAddFormOpen(false);
      setIsEditMode(false);
      setSelectedBook(null); 
    };

    if (isEditMode) {
      setIsAddFormOpen(false);
      if (typeof onTriggerConfirm === 'function') {
        onTriggerConfirm(
          "Are you sure you want to save the modified changes made to this book record template entry?",
          executeDatabaseCommitTransaction,
          () => setIsAddFormOpen(true)
        );
      } else {
        executeDatabaseCommitTransaction();
      }
    } else {
      executeDatabaseCommitTransaction();
    }
  };

// //eto pre: REAL-TIME WORKFLOW PIPELINE! No more confirmation modals!
const handleAcceptBorrowRequest = (bookId) => {
  if (typeof acceptBorrowRequest === 'function') {
    acceptBorrowRequest(bookId); // Clear active requests queue cleanly
  }
  if (typeof saveOrUpdateCatalogItem === 'function') {
    saveOrUpdateCatalogItem({ id: bookId, status: 'FOR PICK-UP' }); // Swabe nang magiging FOR PICK-UP!
  }
  if (selectedBook && selectedBook.id === bookId) {
    setSelectedBook(prev => ({ ...prev, status: 'FOR PICK-UP' }));
  }
  triggerLocalToasterAlert("Borrow schedule request confirmed! Status updated to FOR PICK-UP pre.");
};

const handleDeclineBorrowRequest = (bookId) => {
  if (typeof declineBorrowRequest === 'function') {
    declineBorrowRequest(bookId);
  }
  triggerLocalToasterAlert("Borrow transaction request declined successfully.", "error");
};

  const handleOpenPublicPreviewDeck = (book) => {
    setSelectedBook(book);
    setIsPreviewModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800 text-left relative w-full mt-4 select-none font-sans">
      
      {/* BRAND INTERACTIVE HEADER STATUS BAR */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-[#043310] tracking-tight uppercase flex items-center gap-2.5">
            <BookOpen className="h-5 w-5 text-emerald-600 stroke-[2.5]" /> Library Catalog Showcase
          </h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Librarian Interface Workspace: Previewing visual catalog matrix layout for verification
          </p>
        </div>
        
        <button
          type="button"
          onClick={() => { setManualBookImagePreview(null); setIsEditMode(false); setFormData({ title: '', personalName: '', remainderTitle: '', barcode: '', fullCallNumber: '', publisher: '', placeOfPublication: '', publication: '', extent: '', dimensions: '', subject1: '', copyNo: 'Copy 1', summary: '—', status: 'AVAILABLE' }); setIsAddFormOpen(true); }}
          className="bg-[#043310] hover:bg-emerald-900 text-white text-xs font-black uppercase tracking-widest px-6 py-3.5 rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2 border border-emerald-950/10 focus:outline-none"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Add New Print Book</span>
        </button>
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
            placeholder="Search matching catalog fields seamlessly by title, author, or barcode parameters..." 
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

      {/* 📖 THE REFACTORED 5-COLUMN HIGH-FIDELITY GRID MATRIX */}
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
                <p className="text-[10px] font-semibold text-slate-400 truncate mt-0.5">{book.personalName || '—'}</p>
              </div>
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 mt-1 text-slate-400">
                <span className="font-mono font-black tracking-tight text-[10px] uppercase truncate max-w-[90px]">{book.copyNo || 'Copy 1'}</span>
                <span className={`text-[10px] font-black font-sans tracking-tight uppercase ${book.status === 'BORROWED' ? 'text-red-600' : 'text-emerald-700'}`}>
                  STATUS: {book.status || 'AVAILABLE'}
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* ➕ INTERACTIVE CENTER MODAL FORM REGISTRATION WIZARD */}
      {/* ========================================================================= */}
      {isAddFormOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 w-screen h-screen bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999999] animate-fadeIn text-left select-none font-sans">
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-2xl max-w-4xl w-full h-[85vh] overflow-hidden animate-scaleUp flex flex-col">
            
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <BookOpen className="h-5 w-5 text-emerald-700 stroke-[2.5]" />
                <div>
                  <h3 className="text-sm font-black uppercase text-slate-900 tracking-tight">{isEditMode ? "Modify / Edit Book Catalog Record" : "Configure New Asset Entry"}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{isEditMode ? "Inline Content Modification Environment" : "Manual Public Catalog Registration Suite"}</p>
                </div>
              </div>
              <button type="button" onClick={handleProcessCancelActionWithPrompt} className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer focus:outline-none"><X className="h-4 w-4" /></button>
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50/20">
              <div className="w-full md:w-[320px] bg-slate-50 p-6 border-r border-slate-200/60 flex flex-col items-center justify-start space-y-5 flex-shrink-0 overflow-y-auto scrollbar-none">
                <div className="w-full text-left">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Book Display Thumbnail</h4>
                </div>
                
                <div className="w-40 aspect-[3/4] bg-gradient-to-b from-emerald-800/20 to-slate-200 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-3 text-center overflow-hidden relative shadow-inner group">
                  {manualBookImagePreview ? (
                    <>
                      <img src={manualBookImagePreview} alt="Catalog Cover Preview" className="w-full h-full object-cover rounded-xl" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-150">
                        <span className="text-[10px] text-white font-black uppercase tracking-wider bg-emerald-800 px-2.5 py-1.5 rounded-lg shadow border border-emerald-900">Change Media</span>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2 text-slate-400">
                      <Image className="h-8 w-8 mx-auto opacity-60 stroke-[1.5]" />
                      <p className="text-[10px] font-bold leading-normal px-2 uppercase tracking-wide">Upload Book Photo</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleFormImageUploadChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                </div>

                <div className="w-full bg-white p-4 border border-slate-200/80 rounded-xl space-y-1 shadow-sm font-sans text-xs">
                  <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase block font-black">Live Ingestion Preview</span>
                  <div className="truncate"><b className="font-black text-slate-700">Title:</b> <span className="font-bold text-slate-900 uppercase">{formData.title || 'UNTITLED ASSET'}</span></div>
                  <div><b className="font-black text-slate-700">Barcode:</b> <span className="font-mono font-black text-[#043310]">{formData.barcode || 'N/A'}</span></div>
                </div>
              </div>

              <div className="flex-1 p-6 md:p-8 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-5 content-start scrollbar-none">
                <div className="sm:col-span-2 text-left border-b border-slate-100 pb-1.5">
                  <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Catalog Registration Matrix</h4>
                </div>

                <div className="space-y-1.5 flex flex-col items-start w-full">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Official Book Title</label>
                  <input type="text" value={formData.title || ''} onChange={(e) => handleFormInputChange('title', e.target.value)} placeholder="e.g. Core Database Architecture" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-700 shadow-sm" />
                </div>

                <div className="space-y-1.5 flex flex-col items-start w-full">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Barcode</label>
                  <input type="text" value={formData.barcode || ''} onChange={(e) => handleFormInputChange('barcode', e.target.value)} placeholder="e.g. 971-02-2630-X" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono font-black text-slate-800 focus:outline-none focus:border-emerald-700 shadow-sm" />
                </div>

                <div className="space-y-1.5 flex flex-col items-start w-full">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Subject Classification</label>
                  <input type="text" value={formData.subject1 || ''} onChange={(e) => handleFormInputChange('subject1', e.target.value)} placeholder="e.g. Non-Fiction" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-700 shadow-sm" />
                </div>

                <div className="space-y-1.5 flex flex-col items-start w-full">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Accession Number</label>
                  <input type="text" value={formData.accessionNo || ''} onChange={(e) => handleFormInputChange('accessionNo', e.target.value)} placeholder="e.g. 000564" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-700 shadow-sm" />
                </div>

                <div className="space-y-1.5 flex flex-col items-start w-full">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Personal Name (Author)</label>
                  <input type="text" value={formData.personalName || ''} onChange={(e) => handleFormInputChange('personalName', e.target.value)} placeholder="e.g. Cruz, Celia C." className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-700 shadow-sm" />
                </div>

                <div className="space-y-1.5 flex flex-col items-start w-full">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Remainder Title</label>
                  <input type="text" value={formData.remainderTitle || ''} onChange={(e) => handleFormInputChange('remainderTitle', e.target.value)} placeholder="e.g. Inbound reference nodes" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-700 shadow-sm" />
                </div>

                <div className="space-y-1.5 flex flex-col items-start w-full">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Full Call Number</label>
                  <input type="text" value={formData.fullCallNumber || ''} onChange={(e) => handleFormInputChange('fullCallNumber', e.target.value)} placeholder="FIL LB1765.P6C887 1998" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono font-black text-slate-800 focus:outline-none focus:border-emerald-700 shadow-sm" />
                </div>

                <div className="space-y-1.5 flex flex-col items-start w-full">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Place of Publication</label>
                  <input type="text" value={formData.placeOfPublication || ''} onChange={(e) => handleFormInputChange('placeOfPublication', e.target.value)} placeholder="e.g. Manila" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-700 shadow-sm" />
                </div>

                <div className="space-y-1.5 flex flex-col items-start w-full">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Publication Line</label>
                  <input type="text" value={formData.publication || ''} onChange={(e) => handleFormInputChange('publication', e.target.value)} placeholder="e.g. Pearson Company Inc." className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-700 shadow-sm" />
                </div>

                <div className="space-y-1.5 flex flex-col items-start w-full">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Publisher (Copyright Year)</label>
                  <input type="text" value={formData.publisher || ''} onChange={(e) => handleFormInputChange('publisher', e.target.value)} placeholder="e.g. 1998" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-700 shadow-sm" />
                </div>

                <div className="space-y-1.5 flex flex-col items-start w-full">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Extent Pages</label>
                  <input type="text" value={formData.extent || ''} onChange={(e) => handleFormInputChange('extent', e.target.value)} placeholder="e.g. 424 pages" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-700 shadow-sm" />
                </div>

                <div className="space-y-1.5 flex flex-col items-start w-full">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Dimensions</label>
                  <input type="text" value={formData.dimensions || ''} onChange={(e) => handleFormInputChange('dimensions', e.target.value)} placeholder="e.g. 22 cm" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-700 shadow-sm" />
                </div>

                <div className="space-y-1.5 flex flex-col items-start w-full sm:col-span-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Copy Number Tag</label>
                  <input type="text" value={formData.copyNo || ''} placeholder="e.g. Copy 1" onChange={(e) => handleFormInputChange('copyNo', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-700 shadow-sm" />
                </div>

                <div className="space-y-1.5 flex flex-col items-start w-full sm:col-span-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Book Summary / Abstract Description</label>
                  <textarea value={formData.summary || ''} onChange={(e) => handleFormInputChange('summary', e.target.value)} placeholder="Optional book description or reference text notes..." rows="3" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-700 shadow-sm resize-none" />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0">
              <button type="button" onClick={handleProcessCancelActionWithPrompt} className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer focus:outline-none">Cancel</button>
              <button 
                type="button" 
                onClick={handleProcessFormSubmission}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer focus:outline-none"
              >
                {isEditMode ? "Save Changes" : "Save New Asset"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 👁️ CENTRALIZED DETAILED PREVIEW DIALOG MODAL SUITE */}
      {/* ========================================================================= */}
      {isPreviewModalOpen && selectedBook && ReactDOM.createPortal(
        <div className="fixed inset-0 w-screen h-screen bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999999] animate-fadeIn text-left select-none font-sans">
          <div className="bg-white rounded-[32px] border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scaleUp text-left flex flex-col">

            <div className="p-6 pt-8 md:p-8 md:pt-10 overflow-y-auto space-y-6 flex-1 text-slate-700 bg-white rounded-t-[32px] scrollbar-none">
              
{/* //eto pre: REAL-TIME DATA REGISTER LOOKUP SUITE FOR PENDING BAR ALERTS */}
{borrowRequests && borrowRequests[selectedBook.id]?.active && (
  <div className="w-full bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
    <div className="flex items-center gap-3 text-left">
      <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping flex-shrink-0" />
      <div>
        <h5 className="text-xs font-black text-slate-900 uppercase tracking-tight">Active Borrow Request Detected</h5>
        <p className="text-[11px] font-bold text-amber-800 uppercase">
          {borrowRequests[selectedBook.id].studentName} (ID: {borrowRequests[selectedBook.id].id}) WANTS TO BORROW THIS BOOK
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
      <button 
        type="button" 
        onClick={() => handleAcceptBorrowRequest(selectedBook.id)}
        className="flex-1 sm:flex-none px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-[10.5px] font-black uppercase tracking-wider rounded-xl shadow-sm transition-all focus:outline-none cursor-pointer"
      >
        Accept Request
      </button>
      <button 
        type="button" 
        onClick={() => handleDeclineBorrowRequest(selectedBook.id)}
        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-600 text-[10.5px] font-black uppercase tracking-wider rounded-xl transition-all focus:outline-none cursor-pointer"
      >
        Decline
      </button>
    </div>
  </div>
)}

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
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-snug">{selectedBook.title}</h3>
                  <p className="text-xs font-bold text-emerald-800 flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-slate-400" /> {selectedBook.personalName || '—'}</p>
                  
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Book Summary</span>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">{selectedBook.summary || '—'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4 font-sans text-xs">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Resource Identification Properties</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-medium text-slate-600">
                  <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Subject Classification:</span> <span className="font-bold text-slate-900 uppercase">{selectedBook.subject1 || '—'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Barcode Number:</span> <span className="font-mono font-black text-slate-800">{selectedBook.barcode || '—'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Accession Number:</span> <span className="font-mono font-black text-amber-800">{selectedBook.accessionNo || '—'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Full Call Number:</span> <span className="font-mono font-bold text-emerald-800">{selectedBook.fullCallNumber || '—'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Remainder Title:</span> <span className="font-medium text-slate-600 italic">{selectedBook.remainderTitle || '—'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Place of Publication:</span> <span className="font-bold text-slate-800">{selectedBook.placeOfPublication || '—'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Publication Line:</span> <span className="font-bold text-slate-700">{selectedBook.publication || '—'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Publisher / Copyright Year:</span> <span className="font-mono font-bold text-slate-800">{selectedBook.publisher || '—'}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Extent Pages:</span> <span className="font-medium text-slate-600">{selectedBook.extent || '—'}</span></div>
                  <div className="flex flex-col sm:col-span-2"><span className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Physical Size Dimensions:</span> <span className="font-mono text-slate-600">{selectedBook.dimensions || '—'}</span></div>
                </div>
              </div>

<div className="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5 flex flex-col gap-1 text-xs font-bold text-emerald-950 text-left">
  <div className="flex items-center gap-2">
    <div className={`w-2 h-2 rounded-full ${
      selectedBook.status === 'FOR PICK-UP' ? 'bg-amber-500 animate-pulse' : selectedBook.status === 'BORROWED' ? 'bg-red-500' : 'bg-emerald-600 shadow-sm animate-pulse'
    }`} />
    <span className="uppercase font-mono font-black text-[11px]">COPY: {selectedBook.copyNo ? selectedBook.copyNo.toUpperCase() : 'COPY 1'}</span>
  </div>
<div className="pl-4 pt-1 text-[11px] uppercase tracking-wide">
    STATUS: <span className={`font-mono font-black ${
      selectedBook.status === 'FOR PICK-UP' ? 'text-amber-600' : selectedBook.status === 'BORROWED' ? 'text-red-600' : 'text-emerald-700'
    }`}>{selectedBook.status || 'AVAILABLE'}</span>
  </div>
</div>
</div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0">
              <button 
                type="button" 
                onClick={() => handleTriggerInlineBookModification(selectedBook)}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none shadow-md"
              >
                <Edit2 className="h-4 w-4 stroke-[3]" /> Modify Details
              </button>
              <button type="button" onClick={() => setIsPreviewModalOpen(false)} className="px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-slate-800 hover:bg-slate-900 rounded-xl shadow-md transition-all cursor-pointer focus:outline-none">Close Preview</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* FLOATING TOASTER OVERLAY STRIP CONTAINER FOR MANUAL SUCCESS ALERTS */}
      {toastNotification.isVisible && ReactDOM.createPortal(
        <div className="fixed bottom-6 right-6 z-[99999999] max-w-sm w-full bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 p-4 flex items-start gap-3 animate-slideUp select-none font-sans">
          <div className="mt-0.5 flex-shrink-0">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 stroke-[2.5]" />
          </div>
          <div className="flex-1 space-y-0.5 text-left">
            <h5 className="text-xs font-black uppercase tracking-wider text-slate-200">Action Successful</h5>
            <p className="text-[11.5px] font-bold text-slate-400 leading-snug">{toastNotification.message}</p>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}

export default PrintBooks;