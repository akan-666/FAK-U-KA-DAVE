import React, { useState, useMemo, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Search, Plus, Trash2, Edit3, BookOpen, Check, X, FileText, ChevronRight, Upload, FileSpreadsheet, Filter, CheckCircle2, AlertCircle, ListPlus, Layers3 } from 'lucide-react';

// //eto pre: Isinabit natin si onTriggerConfirm prop galing sa App.jsx para tawagin ang central pop-up check windows natin!
function Theses({ onTriggerConfirm }) {
  // //eto pre: Dito nakasandal ang real-time search string variable key sa top deck
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCriteriaFilter, setSearchCriteriaFilter] = useState('ALL'); 
  
  // //eto pre: Controls para sa structural toggle states ng modal pop-up screens
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeEditingId, setActiveEditingId] = useState(null);

  // //eto pre: Stepper tab selector tracking variable inside forms window
  const [activeFormTab, setActiveTabForm] = useState('cat1'); 
  const [stagedBatchQueue, setStagedBatchQueue] = useState([]);

  const formScrollContainerRef = useRef(null);

  const [toastNotification, setToastNotification] = useState({
    isVisible: false, message: '', type: 'success'
  });

  const triggerToastAlert = (message, type = 'success') => {
    setToastNotification({ isVisible: true, message, type });
  };

  const closeToastAlert = () => {
    setToastNotification(prev => ({ ...prev, isVisible: false }));
  };

  useEffect(() => {
    if (toastNotification.isVisible) {
      const displayTimer = setTimeout(() => {
        closeToastAlert();
      }, 4000);
      return () => clearTimeout(displayTimer);
    }
  }, [toastNotification.isVisible]);

  useEffect(() => {
    if (formScrollContainerRef.current) {
      formScrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeFormTab]);

  const handleCriteriaFilterChange = (newCriteriaValue) => {
    setSearchCriteriaFilter(newCriteriaValue);
    setSearchQuery(''); 
  };

  // //eto pre: Ang baseline target mockups database ng academic theses matching exactly with image_ca93fd.jpg
  const [thesesDataset, setThesesDataset] = useState([
    {
      id: 1,
      callNo: "UT BSBM M52 2019",
      department: "BACHELOR OF SCIENCE IN BUSINESS MANAGEMENT",
      title: "LEVEL OF ENGAGEMENT AND PERCEIVED BENEFITS OF GREEN BUSINESS PRACTICES OF FISHERFOLKS IN SELECTED COASTAL BARANGAYS IN TANZA, CAVITE",
      author: "ABIGAIL JOY S. MENDOZA, JOLINA P. PACAMPARRA",
      copyright: "2019"
    },
    {
      id: 2,
      callNo: "UT BSBM An691 2022",
      department: "BACHELOR OF SCIENCE IN BUSINESS MANAGEMENT",
      title: "SOCIAL MEDIA MARKETING STRATEGIES TOWARDS CONSUMERS ONLINE PURCHASE INTENTION ON SKINCARE PRODUCTS IN CAVITE",
      author: "KIM ARROYO, MILDRED S. CAJULIS, JESSA D. GRAPANI, JERIMIAHE MONZALES",
      copyright: "2022"
    }
  ]);

  const [formData, setFormData] = useState({
    callNo: '', department: '', title: '', author: '', copyright: ''
  });

  const [emptyBypass, setEmptyBypass] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleBypassFlag = (field) => {
    setEmptyBypass(prev => {
      const isCurrentlyFlagged = !prev[field];
      const updated = { ...prev, [field]: isCurrentlyFlagged };
      if (isCurrentlyFlagged) {
        handleInputChange(field, 'N/A');
      } else {
        handleInputChange(field, '');
      }
      return updated;
    });
  };

  const handleProcessExcelImportStream = (e) => {
    const fileTarget = e.target.files[0];
    if (!fileTarget) return;

    if (!window.XLSX) {
      triggerToastAlert("System libraries are still loading. Please try again.", "info");
      return;
    }

    const fileReaderEngine = new FileReader();
    fileReaderEngine.onload = (event) => {
      try {
        const rawBinaryData = event.target.result;
        const targetWorkbookInstance = window.XLSX.read(rawBinaryData, { type: 'binary', cellDates: true });
        const targetSheetKey = targetWorkbookInstance.SheetNames.find(name => name.toUpperCase() === "THESES");
        
        if (!targetSheetKey) {
          triggerToastAlert("Error: Cannot find the specific 'THESES' sheet tab inside the uploaded workbook file.", "error");
          return;
        }

        const rowsJsonPayload = window.XLSX.utils.sheet_to_json(targetWorkbookInstance.Sheets[targetSheetKey]);

        if (rowsJsonPayload.length === 0) {
          triggerToastAlert("The theses data collection sheet is empty.", "error");
          return;
        }

        const standardizedBatchCollection = rowsJsonPayload.map((rowItem, indexIdx) => {
          return {
            id: Date.now() + indexIdx,
            callNo: String(rowItem["CALL NO."] || rowItem["Call No."] || rowItem["callNo"] || ''),
            department: String(rowItem["DEPARTMENT"] || rowItem["department"] || ''),
            title: String(rowItem["TITLE"] || rowItem["title"] || `Untitled Thesis Project Entry #${indexIdx + 1}`),
            author: String(rowItem["AUTHOR/S"] || rowItem["Author/s"] || rowItem["author"] || ''),
            copyright: String(rowItem["COPYRIGHT"] || rowItem["copyright"] || '')
          };
        });

        setThesesDataset(prev => [...standardizedBatchCollection, ...prev]);
        triggerToastAlert(`Successfully imported ${standardizedBatchCollection.length} academic theses documents directly from 'THESES' spreadsheet tab!`, "success");
        setIsAddModalOpen(false);
        setActiveTabForm('cat1');
      } catch (err) {
        console.error(err);
        triggerToastAlert("Failed to complete cluster file ingestion parameters.", "error");
      }
    };
    fileReaderEngine.readAsBinaryString(fileTarget);
  };

  const handleTriggerEditPipelineMode = (targetRowItem) => {
    setFormData({ ...targetRowItem });
    setActiveEditingId(targetRowItem.id);
    setIsEditMode(true);
    setActiveTabForm('cat1');
    setIsAddModalOpen(true);
  };

  const handleExecuteDeleteRecordRow = (targetId) => {
    setThesesDataset(prev => prev.filter(row => row.id !== targetId));
    triggerToastAlert("Academic thesis record removed successfully.", "success");
  };

  const handlePushToBatchQueue = (e) => {
    if (e) e.preventDefault();
    if (!formData.title && !emptyBypass.title) {
      triggerToastAlert("Document Title field is required to stage entry.", "error");
      return;
    }

    const queuedRowRecord = {
      id: Date.now() + Math.random(),
      ...formData
    };

    setStagedBatchQueue(prev => [...prev, queuedRowRecord]);
    triggerToastAlert("Thesis project added to staging grid row table.", "success");

    setFormData({ callNo: '', department: '', title: '', author: '', copyright: '' });
    setEmptyBypass({});
    setActiveTabForm('cat1');
  };

  const handleCommitStagedBatchToInventory = () => {
    if (stagedBatchQueue.length === 0) {
      triggerToastAlert("Staging row cache table database is currently empty.", "error");
      return;
    }

    setThesesDataset(prev => [...stagedBatchQueue, ...prev]);
    triggerToastAlert(`Successfully deployed collection pool of ${stagedBatchQueue.length} theses to inventory database!`, "success");
    
    setStagedBatchQueue([]);
    setIsAddModalOpen(false);
  };

  const executeCommitRecord = (e) => {
    if(e) e.preventDefault();
    if (!formData.title && !emptyBypass.title) {
      triggerToastAlert("Thesis Document Title is required.", "error");
      return;
    }

    if (isEditMode) {
      setThesesDataset(prev => prev.map(row => row.id === activeEditingId ? { ...formData } : row));
      triggerToastAlert("Thesis details modified successfully.", "success");
      setIsAddModalOpen(false);
      setIsEditMode(false);
      setActiveEditingId(null);
    } else {
      const newRecordPayload = { id: Date.now(), ...formData };
      setThesesDataset(prev => [newRecordPayload, ...prev]);
      triggerToastAlert("New thesis data saved to catalog system ledger.", "success");
      setIsAddModalOpen(false);
    }

    setFormData({ callNo: '', department: '', title: '', author: '', copyright: '' });
    setEmptyBypass({});
    setActiveTabForm('cat1');
  };

  // //eto pre: Real-time dynamic sorting loop matrix filter algorithm
  const processedFilteredRowsCollection = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (q === '') return thesesDataset;

    return thesesDataset.filter(item => {
      const titleValue = String(item.title || '').toLowerCase();
      const authorValue = String(item.author || '').toLowerCase();
      const callValue = String(item.callNo || '').toLowerCase();
      const deptValue = String(item.department || '').toLowerCase();

      switch (searchCriteriaFilter) {
        case 'title': return titleValue.includes(q);
        case 'author': return authorValue.includes(q);
        case 'callNo': return callValue.includes(q);
        case 'department': return deptValue.includes(q);
        case 'ALL':
        default:
          return titleValue.includes(q) || authorValue.includes(q) || callValue.includes(q) || deptValue.includes(q);
      }
    });
  }, [searchQuery, searchCriteriaFilter, thesesDataset]);

  return (
    <div className="w-full space-y-6 animate-fadeIn text-slate-800 text-left relative mt-2 select-none font-sans">
      
      {/* HEADER SECTION LAYOUT */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-[#043310] tracking-tight uppercase">Academic Theses Archive Management</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Research Inventory: <span className="text-emerald-700 font-mono font-black">{processedFilteredRowsCollection.length} total manuscripts</span>
          </p>
        </div>

        <button
          type="button" onClick={() => { setIsEditMode(false); setStagedBatchQueue([]); setIsAddModalOpen(true); }}
          className="px-5 py-3.5 bg-[#043310] hover:bg-emerald-900 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer focus:outline-none"
        >
          <Plus className="h-4 w-4 stroke-[3]" /> Add / Import Thesis Entry
        </button>
      </div>

      {/* FILTER SEARCH DISPATCH LINK BAR */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-3.5">
          
          <div className="flex items-center gap-2 w-full md:w-[320px] flex-shrink-0">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
              <Filter className="h-3.5 w-3.5 text-[#043310]" /> Search Filter:
            </span>
            <select 
              value={searchCriteriaFilter} 
              onChange={(e) => handleCriteriaFilterChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3.5 text-xs font-black text-[#043310] focus:outline-none cursor-pointer hover:bg-slate-100/50 transition-all shadow-sm"
            >
              <option value="ALL">🔍 GLOBAL MATCH (ALL FIELDS)</option>
              <option value="title">📖 MANUSCRIPT TITLE ONLY</option>
              <option value="author">👤 PRIMARY AUTHOR/S ONLY</option>
              <option value="callNo">🏷️ THESIS CALL NO. ONLY</option>
              <option value="department">🏢 ACADEMIC DEPT ONLY</option>
            </select>
          </div>

          <div className="relative flex-1 w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input 
              type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                searchCriteriaFilter === 'ALL' ? "Search across research manuscript title strings, author vectors, classifications or course headers..." :
                searchCriteriaFilter === 'title' ? "Filter dataset by specific thesis title statement terms..." :
                searchCriteriaFilter === 'author' ? "Type to search by researcher names or project authors..." :
                searchCriteriaFilter === 'callNo' ? "Filter records by academic catalog shelf Call Numbers..." :
                "Type to audit by college branch departments classification lines..."
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#043310] focus:bg-white transition-all shadow-inner" 
            />
          </div>
        </div>
      </div>

      {/* //eto pre: DYNAMIC SCROLL SHEET WRAPPER - Burado na ang pagination components, rekta linear display loop pre! */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        {/* //eto pre: Inilatag natin sa max-h-[620px] scroll view para swabe at walang pagbagal ang rendering speed ng rows collection pre! */}
        <div className="overflow-x-auto w-full scrollbar-thin max-h-[620px] overflow-y-auto">
          <table className="min-w-[2000px] text-left border-collapse table-fixed">
            <thead className="sticky top-0 z-20 bg-slate-100 shadow-sm text-[10.5px] font-black text-slate-500 uppercase tracking-wider">
              <tr className="border-b border-slate-200 divide-x divide-slate-200/60">
                <th className="sticky left-0 z-30 bg-slate-100 p-5 text-center w-[120px] shadow-md border-r-2 border-[#043310]/10 text-slate-700 font-sans font-black">Actions</th>
                <th className="p-5 w-[220px] bg-slate-100/90 text-emerald-950 font-black">Call No.</th>
                <th className="p-5 w-[380px]">Course Department</th>
                <th className="p-5 w-[650px] text-emerald-900 font-black bg-emerald-50/40">Manuscript Research Title</th>
                <th className="p-5 w-[450px]">Project Author / Creator Names</th>
                <th className="p-5 w-[180px] rounded-r-3xl">Copyright Year</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-slate-600 text-xs">
              {processedFilteredRowsCollection.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-400 uppercase tracking-widest font-black">
                    No active thesis manuscripts found matching search criteria.
                  </td>
                </tr>
              ) : (
                /* //eto pre: Rekta single layout flow mapping sa core filtered arrays para luluwa nang tuluy-tuloy ang data cells niyo pre natively smoothly! */
                processedFilteredRowsCollection.map((item) => (
                  <tr key={item.id} className="even:bg-slate-50/80 odd:bg-white hover:bg-slate-100/60 transition-all divide-x divide-slate-100/80 group">
                    
{/* //eto pre: FIXED FLOW FOR THESES! Rekta edit form agad, at pinasimpleng verification naman para sa Delete action! */}
<td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 transition-colors p-3 shadow-md border-r-2 border-[#043310]/10 min-h-[64px]">
  <div className="flex items-center justify-center gap-2 w-full h-full">
    <button 
      type="button" 
      onClick={() => handleTriggerEditPipelineMode(item)}
      className="p-2 border border-slate-300 bg-white hover:bg-blue-600 text-slate-700 hover:text-white hover:border-blue-600 rounded-xl transition-all cursor-pointer focus:outline-none shadow-sm flex items-center justify-center"
    >
      <Edit3 className="h-4 w-4 stroke-[2.5]" />
    </button>
    <button 
      type="button" 
      onClick={() => {
        if (typeof onTriggerConfirm === 'function') {
          onTriggerConfirm(
            `Are you sure you want to delete the thesis record "${item.title}"?`,
            () => handleExecuteDeleteRecordRow(item.id)
          );
        } else {
          handleExecuteDeleteRecordRow(item.id);
        }
      }}
      className="p-2 border border-slate-300 bg-white hover:bg-red-600 text-slate-600 hover:text-white hover:border-red-600 rounded-xl transition-all cursor-pointer focus:outline-none shadow-sm flex items-center justify-center"
    >
      <Trash2 className="h-4 w-4 stroke-[2.5]" />
    </button>
  </div>
</td>

                    <td className="p-5 font-mono font-black text-slate-900 tracking-wider">{item.callNo || '—'}</td>
                    <td className="p-5 text-slate-700 text-[11px] font-sans tracking-wide uppercase truncate">{item.department || '—'}</td>
                    <td className="p-5 font-black text-slate-900 text-[12.5px] leading-relaxed bg-emerald-50/10 group-hover:text-[#043310] transition-colors">{item.title}</td>
                    <td className="p-5 text-slate-800 font-sans tracking-wide truncate">{item.author || '—'}</td>
                    <td className="p-5 font-mono font-black text-slate-950 text-center text-[12px]">{item.copyright || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* //eto pre: CLEAN PORTAL SUMMARY FOOTER STRIP - Strictly statistical tracking line na lang ang natira cleanly pre */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs">
          <div className="text-slate-400 font-black uppercase tracking-wider text-left">
            Showing <span className="text-[#043310] font-black">{processedFilteredRowsCollection.length}</span> thesis records total | Unified dynamic stream view enabled.
          </div>
        </div>
      </div>

      {/* REACT PORTAL OVERLAY HUB FOR MANUSCRIPTS ENTRY CREATIONS AND CHANGES */}
      {isAddModalOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 w-screen h-screen bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[999999] animate-fadeIn select-none">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[90vh] md:h-[85vh] flex flex-col overflow-hidden animate-scaleUp border border-slate-100 text-left">
            
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-[#043310] rounded-xl border border-emerald-100/60">
                  <BookOpen className="h-5 w-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">{isEditMode ? "📝 Modify / Edit Thesis Entry" : "Add Research Manuscript Catalog Entry"}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{isEditMode ? `Target Record ID Link: ${activeEditingId}` : "Manual Form Layout or Batch Excel 'THESES' Tab Extraction Suite"}</p>
                </div>
              </div>
              <button 
                type="button" onClick={() => { setIsAddModalOpen(false); setIsEditMode(false); setActiveEditingId(null); setStagedBatchQueue([]); }}
                className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-white border-b border-slate-100 flex items-center px-4 overflow-x-auto scrollbar-none flex-shrink-0">
              <button
                type="button" onClick={() => setActiveTabForm('cat1')}
                className={`px-5 py-3.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 focus:outline-none ${
                  activeFormTab === 'cat1' ? "border-slate-800 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                <FileText className="h-3.5 w-3.5" /> 1. Research Details Form
              </button>
              
              {!isEditMode && (
                <button
                  type="button" onClick={() => setActiveTabForm('excel-upload')}
                  className={`px-5 py-3.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 text-emerald-700 focus:outline-none ${
                    activeFormTab === 'excel-upload' ? "border-emerald-600 bg-emerald-50/40 text-emerald-800" : "border-transparent text-emerald-600/70 hover:bg-emerald-50/10"
                  }`}
                >
                  <FileText className="h-4 w-4" /> 2. Tab 'THESES' Ingestion (.xlsx)
                </button>
              )}
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50/40">
              
              <div 
                ref={formScrollContainerRef}
                className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-none border-r border-slate-200/60"
              >
                
                {activeFormTab === 'cat1' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
                    {[
                      { id: 'callNo', label: 'Call No.' },
                      { id: 'department', label: 'Department / Course' },
                      { id: 'title', label: 'Manuscript Research Title' },
                      { id: 'author', label: 'Author / Co-Authors' },
                      { id: 'copyright', label: 'Copyright Year' }
                    ].map((field) => (
                      <div key={field.id} className={`space-y-1.5 ${field.id === 'title' || field.id === 'author' ? 'md:col-span-2' : ''}`}>
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">{field.label}</label>
                          <button 
                            type="button" onClick={() => toggleBypassFlag(field.id)}
                            className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${emptyBypass[field.id] ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-black shadow-inner" : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"}`}
                          >
                            <div className={`w-3 h-3 rounded flex items-center justify-center border text-white ${emptyBypass[field.id] ? "bg-emerald-600 border-emerald-600" : "border-slate-300 bg-white"}`}>{emptyBypass[field.id] && "✓"}</div>
                            Leave Empty
                          </button>
                        </div>
                        <input 
                          type="text" value={formData[field.id]} disabled={emptyBypass[field.id]} onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="w-full bg-white disabled:bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {activeFormTab === 'excel-upload' && !isEditMode && (
                  <div className="p-8 border-2 border-dashed border-emerald-300/60 bg-emerald-50/20 rounded-2xl text-center space-y-4 animate-fadeIn">
                    <div className="p-4 bg-emerald-100/50 text-emerald-800 rounded-full w-14 h-14 flex items-center justify-center mx-auto border border-emerald-200">
                      <Plus className="h-6 w-6 stroke-[2.5]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Select Koha Excel Master Sheet</h4>
                      <p className="text-xs text-slate-400 font-medium">System will automatically target and extract the 'THESES' tab records index cleanly</p>
                    </div>
                    <div className="relative max-w-xs mx-auto">
                      <input type="file" accept=".xlsx, .xls" onChange={handleProcessExcelImportStream} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all text-center">Browse Spreadsheet file</div>
                    </div>
                  </div>
                )}

              </div>

              {/* RIGHT CHANNELS: Manual batch staging queue list */}
              {!isEditMode && activeFormTab !== 'excel-upload' && (
                <div className="w-full md:w-[320px] bg-slate-100/70 border-t md:border-t-0 md:border-l border-slate-200 p-4 flex flex-col overflow-hidden animate-fadeIn flex-shrink-0">
                  <div className="flex items-center gap-1.5 pb-3 border-b border-slate-200 flex-shrink-0">
                    <Layers3 className="h-4 w-4 text-emerald-800" />
                    <h4 className="text-[11.5px] font-black text-slate-900 uppercase tracking-wider">Staging Theses Queue</h4>
                    <span className="ml-auto bg-emerald-700 text-white font-mono font-black text-[10px] px-2 py-0.5 rounded-full shadow-inner">{stagedBatchQueue.length}</span>
                  </div>

                  <div className="flex-1 py-3 overflow-y-auto space-y-2 scrollbar-none">
                    {stagedBatchQueue.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 border border-dashed border-slate-300 rounded-2xl bg-white/40 shadow-inner">
                        <div className="text-[10px] font-black uppercase tracking-wider">Queue is Empty</div>
                        <p className="text-[9px] font-bold text-slate-400 mt-0.5">Fill academic parameters and click 'Add to Queue Table' button to stack rows.</p>
                      </div>
                    ) : (
                      stagedBatchQueue.map((queueItem, idx) => (
                        <div key={queueItem.id} className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm space-y-1 relative group hover:border-emerald-600/30 transition-all animate-slideUp text-left">
                          <div className="text-[9px] font-mono text-emerald-700 font-bold uppercase tracking-wider">Manuscript Item #{idx + 1}</div>
                          <div className="text-[11px] font-black text-slate-900 leading-snug line-clamp-2 pr-6">{queueItem.title}</div>
                          <div className="text-[9px] font-mono text-slate-400 truncate">CN: {queueItem.callNo || '[blank]'} | Dept: {queueItem.department || 'N/A'}</div>
                          <button
                            type="button" onClick={() => handleRemoveFromQueueList(queueItem.id)}
                            className="absolute top-2 right-2 text-slate-300 hover:text-red-600 p-0.5 rounded transition-colors cursor-pointer focus:outline-none"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex-shrink-0">
                    <button
                      type="button" disabled={stagedBatchQueue.length === 0}
                      onClick={handleCommitStagedBatchToInventory}
                      className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-[10.5px] font-black uppercase tracking-wider shadow-md disabled:opacity-40 disabled:hover:bg-emerald-800 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 focus:outline-none"
                    >
                      <Check className="h-3.5 w-3.5 stroke-[3]" /> Save Staged Batch ({stagedBatchQueue.length})
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* MODAL CONTROL STRIP FOOTER BLOCK */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
              <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider pl-2">
                Active Category Workspace: <span className="text-[#043310] font-mono">{activeFormTab.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button" onClick={() => { setIsAddModalOpen(false); setIsEditMode(false); setActiveEditingId(null); setStagedBatchQueue([]); }}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 text-xs font-black uppercase tracking-wider cursor-pointer focus:outline-none"
                >
                  Cancel
                </button>
                
                {activeFormTab === 'cat1' && (
                  <div className="flex items-center gap-2">
                    {!isEditMode && (
                      <button
                        type="button" onClick={handlePushToBatchQueue}
                        className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Stage Entry to Queue
                      </button>
                    )}
<button
  type="button" 
  onClick={(e) => {
    if (isEditMode && typeof onTriggerConfirm === 'function') {
      onTriggerConfirm(
        "Are you sure you want to save the changes made to this thesis record?",
        () => executeCommitRecord(e)
      );
    } else {
      executeCommitRecord(e);
    }
  }}
  className="px-5 py-2.5 rounded-xl bg-[#043310] hover:bg-emerald-900 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md focus:outline-none"
>
  <Check className="h-4 w-4 stroke-[3]" /> {isEditMode ? "Save Changes" : "Save Single Asset"}
</button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* REACT PORTAL OVERLAY CONTAINER FOR CUSTOM TOAST NOTIFICATIONS */}
      {toastNotification.isVisible && ReactDOM.createPortal(
        <div className="fixed bottom-6 right-6 z-[9999999] max-w-sm w-full bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 p-4 flex items-start gap-3 animate-slideUp select-none">
          <div className="mt-0.5 flex-shrink-0">
            {toastNotification.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 stroke-[2.5]" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-400 stroke-[2.5]" />
            )}
          </div>
          <div className="flex-1 space-y-0.5">
            <h5 className="text-xs font-black uppercase tracking-wider text-slate-200">
              {toastNotification.type === 'success' ? 'Action Successful' : 'System Alert Notice'}
            </h5>
            <p className="text-[11.5px] font-bold text-slate-400 leading-snug">{toastNotification.message}</p>
          </div>
          <button 
            type="button" onClick={closeToastAlert}
            className="p-1 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-all cursor-pointer focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>,
        document.body
      )}

    </div>
  );
}

export default Theses;