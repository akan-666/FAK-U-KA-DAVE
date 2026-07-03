import React, { useState, useMemo, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom'; // 🟢 INJECTED: Kailangan natin para sa pag-execute ng createPortal pre!
import { Search, Filter, Barcode, Layers, Eye, ShieldAlert, AlertTriangle, Check, X } from 'lucide-react';

function Ebooks() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('ALL');
  const [selectedGenre, setSelectedGenre] = useState('ALL');
  
  // Local workflow sequence parameters tracking states
  const [activeWorkflowEbook, setActiveWorkflowEbook] = useState(null);
  const [currentWorkflowStep, setCurrentWorkflowStep] = useState(0); // 0 = Closed, 1 = Privacy Modal, 2 = Confirmation Modal
  
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchInputRef.current) searchInputRef.current.focus();
  }, [selectedCourse, selectedGenre]);

  // 20 High-Fidelity Dataset Elements Mapping cleanly pre
  const twentySampleEbooksDataset = [
    { id: 1, barcode: "E97-02-2630-8001", callNumber: "DIG IT 301.1 2026", title: "Eloquent JavaScript, 3rd Edition", author: "Marijn Haverbeke", course: "BSIT", genre: "Programming & Software Development", pages: "472", directViewUrl: "https://eloquentjavascript.net/Eloquent_JavaScript.pdf" },
    { id: 2, barcode: "E97-02-2630-8002", callNumber: "DIG IT 302.4 2026", title: "Introduction to Computer Science", author: "Subrata Ghoshal", course: "BSIT", genre: "Programming & Software Development", pages: "380", directViewUrl: "https://ccsbangalore.org/wp-content/uploads/2021/04/Computer-Science.pdf" },
    { id: 3, barcode: "E97-02-2630-8003", callNumber: "DIG IT 303.7 2026", title: "Learning Web Design & Architecture", author: "Jennifer Robbins", course: "BSIT", genre: "Programming & Software Development", pages: "520", directViewUrl: "https://allitebooks.in/wp-content/uploads/2022/10/Learning-Web-Design-5th-Edition.pdf" },
    { id: 4, barcode: "E97-02-2630-8004", callNumber: "DIG IS 304.2 2026", title: "Database Systems: Design & Implementation", author: "Carlos Coronel", course: "BSIT", genre: "Database Systems", pages: "710", directViewUrl: "http://www.vumultan.com/Books/CS403-Database%20Systems.pdf" },
    { id: 5, barcode: "E97-02-2630-8005", callNumber: "DIG SCI 305.9 2026", title: "A Brief History of Time & Scholarly Science", author: "Stephen Hawking", course: "GENERAL SCIENCE", genre: "General Science", pages: "212", directViewUrl: "https://bgchescience.files.wordpress.com/2013/05/a-brief-history-of-time-stephen-hawking.pdf" },
    { id: 6, barcode: "E97-02-2630-8006", callNumber: "DIG IT 306.3 2026", title: "Introduction to Algorithms & Data Arrays", author: "Thomas H. Cormen", course: "BSIT", genre: "Programming & Software Development", pages: "1312", directViewUrl: "https://edutechlearners.com/download/Introduction_to_algorithms-3rd%20Edition.pdf" },
    { id: 7, barcode: "E97-02-2630-8007", callNumber: "DIG IS 307.1 2026", title: "The Architecture of Open Source Applications", author: "Amy Brown", course: "BSIT", genre: "Database Systems", pages: "414", directViewUrl: "https://media.wiley.com/product_data/excerpt/94/11180231/1118023194-177.pdf" },
    { id: 8, barcode: "E97-02-2630-8008", callNumber: "DIG IT 308.5 2026", title: "Think Python: How to Think Like a Computer Scientist", author: "Allen B. Downey", course: "BSIT", genre: "Programming & Software Development", pages: "292", directViewUrl: "https://greenteapress.com/thinkpython2/thinkpython2.pdf" },
    { id: 9, barcode: "E97-02-2630-8009", callNumber: "DIG IT 309.2 2026", title: "The Clean Coder: A Code of Conduct", author: "Robert C. Martin", course: "BSIT", genre: "Programming & Software Development", pages: "242", directViewUrl: "https://thunv.github.io/files/clean-coder.pdf" },
    { id: 10, barcode: "E97-02-2630-8010", callNumber: "DIG IT 310.8 2026", title: "Operating Systems: Three Easy Pieces", author: "Remzi Arpaci-Dusseau", course: "BSIT", genre: "Programming & Software Development", pages: "720", directViewUrl: "https://pages.cs.wisc.edu/~remzi/OSTEP/Previews/intro.pdf" },
    { id: 11, barcode: "E97-02-2630-8011", callNumber: "DIG IT 311.4 2026", title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell", course: "BSIT", genre: "Cybersecurity", pages: "1150", directViewUrl: "https://people.engr.tamu.edu/guni/csce421/files/AI_Russell_Norvig.pdf" },
    { id: 12, barcode: "E97-02-2630-8012", callNumber: "DIG IS 312.6 2026", title: "Management Information Systems Architecture", author: "Kenneth C. Laudon", course: "BSIT", genre: "Systems Analysis & Design", pages: "680", directViewUrl: "https://proquest.com/excerpt/Laudon_MIS_15th_Ed.pdf" },
    { id: 13, barcode: "E97-02-2630-8013", callNumber: "DIG MAT 313.1 2026", title: "Calculus: Early Transcendentals Engineering", author: "James Stewart", course: "BSED-MATHEMATICS", genre: "Geometry and Measurement", pages: "1318", directViewUrl: "https://gregorymancillas.files.wordpress.com/2017/09/james_stewart_calculus_early_transcendentals_7th_txtbk.pdf" },
    { id: 14, barcode: "E97-02-2630-8014", callNumber: "DIG IT 314.5 2026", title: "Fundamentals of Computer Networks Engineering", author: "Andrew S. Tanenbaum", course: "BSIT", genre: "Networking", pages: "912", directViewUrl: "https://mrcet.ac.in/pdf/Lab%20Manuals/IT/COMPUTER%20NETWORKS%20%20(R18A0516).pdf" },
    { id: 15, barcode: "E97-02-2630-8015", callNumber: "DIG IS 315.7 2026", title: "Systems Analysis and Design Methods", author: "Jeffrey L. Whitten", course: "BSIT", genre: "Systems Analysis & Design", pages: "750", directViewUrl: "https://vceguide.com/wp-content/uploads/2016/11/Systems-Analysis-and-Design.pdf" },
    { id: 16, barcode: "E97-02-2630-8016", callNumber: "DIG BBA 316.3 2026", title: "Principles of Economics & Academic Administration", author: "N. Gregory Mankiw", course: "BSBA", genre: "Marketing Fundamentals", pages: "840", directViewUrl: "https://www.rba.gov.au/education/resources/economics-excerpts.pdf" },
    { id: 17, barcode: "E97-02-2630-8017", callNumber: "DIG MAT 317.9 2026", title: "Engineering Physics & Applied Mechanics", author: "D.K. Bhattacharya", course: "BSED-MATHEMATICS", genre: "Foundations of Mathematics", pages: "612", directViewUrl: "https://www.iitk.ac.in/me/data/Physics_Handbook.pdf" },
    { id: 18, barcode: "E97-02-2630-8018", callNumber: "DIG HUM 318.2 2026", title: "The Republic: Academic Philosophy Core", author: "Plato", course: "BEED", genre: "Educational Foundations", pages: "320", directViewUrl: "https://www.gutenberg.org/files/1497/1497-pdf.pdf" },
    { id: 19, barcode: "E97-02-2630-8019", callNumber: "DIG IT 319.4 2026", title: "Digital Logic and Computer Design Engine", author: "M. Morris Mano", course: "BSIT", genre: "Networking", pages: "516", directViewUrl: "https://mrcet.ac.in/pdf/Lab%20Manuals/ECE/Digital%20Logic%20Design.pdf" },
    { id: 20, barcode: "E97-02-2630-8020", callNumber: "DIG HUM 320.1 2026", title: "Academic Research Writing Manual Guide", author: "John Swales", course: "BEED", genre: "Educational Foundations", pages: "280", directViewUrl: "https://www.press.umich.edu/pdf/9780472034727-excerpt.pdf" }
  ];

  const computedAvailableGenres = useMemo(() => {
    if (selectedCourse === 'ALL') {
      const allGenres = twentySampleEbooksDataset.map(b => b.genre);
      return ['ALL', ...new Set(allGenres)];
    }
    const filteredGenres = twentySampleEbooksDataset.filter(b => b.course === selectedCourse).map(b => b.genre);
    return ['ALL', ...new Set(filteredGenres)];
  }, [selectedCourse]);

  const handleCourseChangeEngine = (e) => {
    setSelectedCourse(e.target.value);
    setSelectedGenre('ALL');
  };

  const filteredEbooksCatalogRows = useMemo(() => {
    const queryStr = searchQuery.toLowerCase().trim();
    return twentySampleEbooksDataset.filter(book => {
      const matchCourse = selectedCourse === 'ALL' || book.course === selectedCourse;
      const matchGenre = selectedGenre === 'ALL' || book.genre === selectedGenre;
      const matchQuery = queryStr === '' || 
        book.title.toLowerCase().includes(queryStr) || 
        book.author.toLowerCase().includes(queryStr) || 
        book.barcode.includes(queryStr);
      return matchCourse && matchGenre && matchQuery;
    });
  }, [searchQuery, selectedCourse, selectedGenre]);

  const handleStartWorkflowChain = (bookAsset) => {
    setActiveWorkflowEbook(bookAsset);
    setCurrentWorkflowStep(1); 
  };

  const handleExecuteFinalRedirectLink = () => {
    if (!activeWorkflowEbook) return;
    window.open(activeWorkflowEbook.directViewUrl, '_blank', 'noopener,noreferrer');
    setActiveWorkflowEbook(null);
    setCurrentWorkflowStep(0);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-800 text-left relative w-full mt-4 select-none">
      
      {/* HEADER SECTION LOG */}
      <div className="space-y-1">
        <h2 className="text-xl font-black text-[#043310] tracking-tight uppercase">Digital E-Books Collection</h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Total secure data stream records: <span className="text-emerald-700 font-mono font-black">{filteredEbooksCatalogRows.length} electronic materials listed</span>
        </p>
      </div>

      {/* FILTER TOOLS PANEL */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input 
            ref={searchInputRef}
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search e-book title, author, or barcode number keywords cleanly..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#043310] focus:bg-white transition-all shadow-inner" 
          />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 pt-1">
          <div className="flex items-center gap-3 w-full md:w-1/2">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 flex-shrink-0">
              <Filter className="h-4 w-4 text-[#043310]" /> Department:
            </span>
            <select 
              value={selectedCourse} 
              onChange={handleCourseChangeEngine}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-black text-[#043310] focus:outline-none cursor-pointer hover:bg-slate-100/50 transition-all"
            >
              <option value="ALL">ALL DEPARTMENTS</option>
              <option value="BSIT">BS INFORMATION TECHNOLOGY (BSIT)</option>
              <option value="BSBA">BSBA - MARKETING MANAGEMENT (BSBA)</option>
              <option value="BEED">ELEMENTARY EDUCATION (BEED)</option>
              <option value="BSED-ENGLISH">BSED - MAJOR IN ENGLISH</option>
              <option value="BSED-MATHEMATICS">BSED - MAJOR IN MATHEMATICS</option>
            </select>
          </div>

          <div className="flex items-center gap-3 w-full md:w-1/2">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 flex-shrink-0">
              <Layers className="h-4 w-4 text-[#043310]" /> Genre:
            </span>
            <select 
              value={selectedGenre} 
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-black text-slate-700 focus:outline-none cursor-pointer uppercase hover:bg-slate-100/50 transition-all"
            >
              {computedAvailableGenres.map((genreKey) => (
                <option key={genreKey} value={genreKey}>
                  {genreKey === 'ALL' ? 'ALL GENRES' : genreKey}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* DATA TABLE SHEET */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[550px] overflow-y-auto scrollbar-none">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-50 shadow-sm text-[10px] font-black text-slate-400 uppercase tracking-wider">
              <tr className="border-b border-slate-200">
                <th className="p-4 pl-6 w-[22%] bg-slate-50">Digital Call Number</th>
                <th className="p-4 w-[40%] bg-slate-50">E-Book Title</th>
                <th className="p-4 w-[18%] bg-slate-50">Author</th>
                <th className="p-4 w-[12%] bg-slate-50">Access Rule</th>
                <th className="p-4 text-center pr-6 w-[8%] bg-slate-50">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-bold text-slate-500 text-xs">
              {filteredEbooksCatalogRows.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-400 uppercase tracking-widest font-black">
                    No matching digital e-books discovered pre.
                  </td>
                </tr>
              ) : (
                filteredEbooksCatalogRows.map((book) => (
                  <tr key={book.id} className="hover:bg-slate-50/40 transition-colors group">
                    <td className="p-4 pl-6 text-slate-400 font-mono text-[11px] leading-relaxed">
                      <div className="flex items-center gap-1.5 text-slate-800 font-black">
                        <Barcode className="h-3.5 w-3.5 text-slate-400" /> {book.barcode}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-bold font-mono pl-5 mt-0.5">{book.callNumber}</div>
                    </td>

                    <td className="p-4 text-slate-800 font-black max-w-sm">
                      <div className="truncate text-slate-900 text-xs md:text-[13px] leading-snug group-hover:text-[#043310] transition-colors">{book.title}</div>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-1.5 py-0.5 rounded-md uppercase font-black tracking-wider">{book.course}</span>
                        <span className="text-[9px] bg-slate-100 text-slate-500 border border-slate-200/40 px-1.5 py-0.5 rounded-md uppercase font-black tracking-wider">{book.genre}</span>
                        <span className="text-[9px] text-slate-400 font-normal">({book.pages} Pages)</span>
                      </div>
                    </td>

                    <td className="p-4 text-slate-600 font-bold truncate max-w-[160px]">{book.author}</td>
                    
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-black bg-emerald-100 text-emerald-800 uppercase tracking-wider">Instant View</span>
                        <div className="text-[10px] font-mono font-black text-slate-400 block pl-0.5">No Approval Req.</div>
                      </div>
                    </td>

                    <td className="p-4 text-center pr-6">
                      <button 
                        type="button"
                        onClick={() => handleStartWorkflowChain(book)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#043310] hover:bg-[#043310] text-slate-500 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1 font-black text-[10px] uppercase mx-auto whitespace-nowrap"
                      >
                        View E-Book <Eye className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🟢 REACT PORTAL PROTECTION: FORCED ONTO DOCUMENT BODY LAYERS DIRECTLY    */}
      {/* ========================================================================= */}
      
      {/* STEP 1 MODAL PORTAL: THE SECURITY & PRIVACY NOTICE BOX */}
      {currentWorkflowStep === 1 && activeWorkflowEbook && ReactDOM.createPortal(
        <div className="fixed inset-0 w-screen h-screen bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[999999] animate-fadeIn select-none">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 border-t-4 border-amber-600 flex flex-col space-y-4 animate-scaleUp text-left">
            
            <div className="flex items-center gap-3 text-amber-600">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 flex-shrink-0">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">Security & Privacy Terms</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Republic Act No. 10173 Compliance</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-2 text-xs font-bold text-slate-600 leading-relaxed max-h-[220px] overflow-y-auto">
              <p className="text-slate-900 font-black text-[13px] uppercase tracking-wide">⚠️ REPRODUCTION RESTRICTIONS NOTICE:</p>
              <p>Under the mandates of the <span className="text-slate-900">Data Privacy Act of 2012 (R.A. 10173)</span> and university intellectual property guidelines, this asset is flagged for <span className="text-amber-700">Internal Reading Only</span>.</p>
              <ul className="list-disc list-inside space-y-1 pl-1 text-slate-500">
                <li>Downloading or executing print commands is strictly disabled.</li>
                <li>Taking screenshots or capturing the screen view with mobile cameras is trackable and considered a severe policy breach.</li>
                <li>Your access credentials will be logged natively in the librarian panel.</li>
              </ul>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setCurrentWorkflowStep(0); setActiveWorkflowEbook(null); }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-black uppercase tracking-wider cursor-pointer transition-all border border-slate-200"
              >
                I Decline
              </button>
              <button
                type="button"
                onClick={() => setCurrentWorkflowStep(2)} 
                className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-black uppercase tracking-wider hover:bg-amber-700 shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Check className="h-4 w-4" /> I Agree & Accept
              </button>
            </div>

          </div>
        </div>,
        document.body // 🟢 Forces injection straight into html body frame pre!
      )}

      {/* STEP 2 MODAL PORTAL: THE HIGH-FIDELITY ROUTING REDIRECT CHECK */}
      {currentWorkflowStep === 2 && activeWorkflowEbook && ReactDOM.createPortal(
        <div className="fixed inset-0 w-screen h-screen bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[999999] animate-fadeIn select-none">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 border-t-4 border-emerald-600 flex flex-col space-y-4 animate-scaleUp text-left">
            
            <div className="flex items-center gap-3 text-emerald-600">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 flex-shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">Confirmation</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Please verify your action</p>
              </div>
            </div>

            <div className="space-y-1 pl-1">
              <p className="text-slate-700 text-xs font-black uppercase">Are you sure you want to open this link?</p>
              <p className="text-slate-500 text-xs font-bold leading-relaxed">
                You are about to stream <span className="text-emerald-800 font-black">"{activeWorkflowEbook.title}"</span> in an isolated external browser hub tab layer.
              </p>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-50">
              <button
                type="button"
                onClick={() => { setCurrentWorkflowStep(0); setActiveWorkflowEbook(null); }}
                className="px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-black uppercase tracking-wider hover:bg-red-100 cursor-pointer transition-all"
              >
                No, Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteFinalRedirectLink}
                className="px-4 py-2 rounded-xl bg-[#054a18] text-white text-xs font-black uppercase tracking-wider hover:bg-emerald-900 shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Check className="h-4 w-4" /> Yes, Proceed
              </button>
            </div>

          </div>
        </div>,
        document.body // 🟢 Forces injection straight into html body frame pre!
      )}

    </div>
  );
}

export default Ebooks;