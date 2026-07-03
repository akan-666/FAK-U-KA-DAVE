import React, { useState, useMemo, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useAuthStore from "../../Store/useAuthStore";
import { Search, Plus, Trash2, Edit3, BookOpen, Check, X, FileText, ChevronRight, Filter, CheckCircle2, AlertCircle, ListPlus, Layers3, Image, Trash } from 'lucide-react';

// //eto pre: SYNTAX ALIGNMENT INJECTION! Ginawa nating LibInventoryBooks ang pangalan para pormal na mahiwalay sa Catalog Cards!
function LibInventoryBooks({ onTriggerConfirm, onImportToCatalog, setActiveTab }) {
  const { inventoryItems, setInventoryItems, saveOrUpdateCatalogItem } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchCriteriaFilter, setSearchCriteriaFilter] = useState('ALL'); 
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeEditingId, setActiveEditingId] = useState(null);

  const [isImportCatalogModalOpen, setIsImportCatalogModalOpen] = useState(false);
  const [targetBookToImport, setTargetBookToImport] = useState(null);
  const [localBookImagePreview, setLocalBookImagePreview] = useState(null);

  const [activeFormTab, setActiveTabForm] = useState('cat1'); 
  const [stagedBatchQueue, setStagedBatchQueue] = useState([]);

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
      formScrollContainerRef.current.scrollTo({
        top: 0, behavior: 'smooth'
      });
    }
  }, [activeFormTab]);

  const formScrollContainerRef = useRef(null);

  const handleCriteriaFilterChange = (newCriteriaValue) => {
    setSearchCriteriaFilter(newCriteriaValue);
    setSearchQuery(''); 
  };

  useEffect(() => {
    if (!window.XLSX) {
      const scriptNodeElement = document.createElement('script');
      scriptNodeElement.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
      scriptNodeElement.async = true;
      document.body.appendChild(scriptNodeElement);
    }
  }, []);

  const [formData, setFormData] = useState({
    barcode: '', barcodeColor: 'none', callNumber: '', itemNumber: '', personalName: '', relatorTerm: '', title: '', remainderTitle: '', statementOfResponsibility: '', placeOfPublication: '', publication: '',
    publisher: '', extent: '', physicalDetails: '', dimensions: '', note: '', sourceOfAcquisition: '', vendor: '', methodOfAcquisition: '', dateOfAcquisition: '', accessionNo: '',
    owner: 'Tanza Campus Library', purchasePrice: '', poNo: '', icsOrParNo: '', extent2: 'Copy 1', subject1: '', subject2: '', subject3: '', subject4: '',
    addPersName1: '', relatorName1: '', addPersName2: '', relatorName2: '', addPersName3: '', relatorName3: '', addPersName4: '', relatorName4: '', classification: '', fullCallNumber: '', copyNo: 'Copy 1'
  });

  const [catalogImportFormData, setCatalogImportFormData] = useState({
    subject1: '', accessionNo: '', personalName: '', remainderTitle: '', fullCallNumber: '',
    placeOfPublication: '', publication: '', publisher: '', extent: '', dimensions: '', copyNo: 'Copy 1'
  });

  const [emptyBypass, setEmptyBypass] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCatalogImportFieldChange = (field, value) => {
    setCatalogImportFormData(prev => ({ ...prev, [field]: value }));
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
        const primarySheetName = targetWorkbookInstance.SheetNames[0];
        const rowsJsonPayload = window.XLSX.utils.sheet_to_json(targetWorkbookInstance.Sheets[primarySheetName]);

        if (rowsJsonPayload.length === 0) {
          triggerToastAlert("The uploaded spreadsheet file is empty.", "error");
          return;
        }

        const standardizedBatchCollection = rowsJsonPayload.map((rowItem, indexIdx) => {
          const rawBarcodeCellData = rowItem["Barcode"] || rowItem["barcode"];
          const finalSanitizedBarcode = rawBarcodeCellData !== undefined && rawBarcodeCellData !== null ? String(rawBarcodeCellData).trim() : '';

          return {
            id: Date.now() + indexIdx,
            barcode: finalSanitizedBarcode,
            barcodeColor: "none",
            callNumber: String(rowItem["Call Number"] || rowItem["callNumber"] || ''),
            itemNumber: String(rowItem["Item Number"] || rowItem["itemNumber"] || ''),
            personalName: String(rowItem["Personal Name"] || rowItem["personalName"] || ''),
            relatorTerm: String(rowItem["Relator Term"] || rowItem["relatorTerm"] || ''),
            title: String(rowItem["Title"] || rowItem["title"] || `Untitled Book Entry #${indexIdx + 1}`),
            remainderTitle: String(rowItem["Remainder Title"] || rowItem["remainderTitle"] || ''),
            statementOfResponsibility: String(rowItem["Statement of Responsibility"] || rowItem["statementOfResponsibility"] || ''),
            placeOfPublication: String(rowItem["Place of Publication"] || rowItem["placeOfPublication"] || ''),
            publication: String(rowItem["Publication"] || rowItem["publication"] || ''),
            publisher: String(rowItem["Publisher"] || rowItem["publisher"] || ''),
            extent: String(rowItem["Extent"] || rowItem["extent"] || ''),
            physicalDetails: String(rowItem["Other Physical Details"] || rowItem["physicalDetails"] || ''),
            dimensions: String(rowItem["Dimensions"] || rowItem["dimensions"] || ''),
            note: String(rowItem["Note"] || rowItem["note"] || ''),
            sourceOfAcquisition: String(rowItem["Source of Acquisition"] || rowItem["sourceOfAcquisition"] || ''),
            vendor: String(rowItem["Vendor"] || rowItem["vendor"] || ''),
            methodOfAcquisition: String(rowItem["Method of Acquisition"] || rowItem["methodOfAcquisition"] || ''),
            dateOfAcquisition: rowItem["Date of Acquisition"] ? new Date(rowItem["Date of Acquisition"]).toISOString().split('T')[0] : '',
            accessionNo: String(rowItem["Accession No."] || rowItem["Accession No"] || rowItem["accessionNo"] || ''),
            owner: "Tanza Campus Library",
            purchasePrice: String(rowItem["Purchase Price"] || rowItem["purchasePrice"] || ''),
            poNo: String(rowItem["P.O. No."] || rowItem["poNo"] || ''),
            icsOrParNo: String(rowItem["ICS or PAR No."] || rowItem["icsOrParNo"] || ''),
            extent2: String(rowItem["Extent (ex: Copy 1, Copy 2)"] || 'Copy 1'),
            subject1: String(rowItem["Subject 1"] || ''),
            subject2: String(rowItem["Subject 2"] || ''),
            subject3: String(rowItem["Subject 3"] || ''),
            subject4: String(rowItem["Subject 4"] || ''),
            addPersName1: String(rowItem["Add Pers. Name 1"] || ''),
            relatorName1: String(rowItem["Relator Name 1"] || ''),
            addPersName2: String(rowItem["Add Pers. Name 2"] || ''),
            relatorName2: String(rowItem["Relator Name 1"] || ''),
            addPersName3: String(rowItem["Add Pers. Name 3"] || ''),
            relatorName3: String(rowItem["Relator Name 3"] || ''),
            addPersName4: String(rowItem["Add Pers. Name 4"] || ''),
            relatorName4: String(rowItem["Relator Name 4"] || ''),
            classification: String(rowItem["Classification"] || ''),
            fullCallNumber: String(rowItem["Full Call Number"] || rowItem["fullCallNumber"] || ''),
            copyNo: String(rowItem["Copy No."] || 'Copy 1')
          };
        });

        setInventoryItems([...standardizedBatchCollection, ...(inventoryItems || [])]);
        triggerToastAlert(`Successfully imported ${standardizedBatchCollection.length} books from spreadsheet!`, "success");
        setIsAddModalOpen(false);
        setActiveTabForm('cat1');
      } catch (err) {
        console.error(err);
        triggerToastAlert("Failed to parse the file template structure.", "error");
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

  const handleTriggerCatalogImportWizard = (targetItem) => {
    setTargetBookToImport(targetItem);
    setLocalBookImagePreview(null);
    setCatalogImportFormData({
      subject1: targetItem.subject1 || 'General',
      accessionNo: targetItem.accessionNo || '',
      personalName: targetItem.personalName || '',
      remainderTitle: targetItem.remainderTitle || '',
      fullCallNumber: targetItem.fullCallNumber || targetItem.callNumber || '',
      placeOfPublication: targetItem.placeOfPublication || 'Cavite, Philippines',
      publication: targetItem.publication || '',
      publisher: targetItem.publisher || '2026',
      extent: targetItem.extent || '',
      dimensions: targetItem.dimensions || '',
      copyNo: targetItem.copyNo || 'Copy 1'
    });
    setIsImportCatalogModalOpen(true);
  };

  const handleLocalImageFileChange = (e) => {
    const activeImageFile = e.target.files[0];
    if (activeImageFile) {
      const mediaReader = new FileReader();
      mediaReader.onloadend = () => {
        setLocalBookImagePreview(mediaReader.result);
      };
      mediaReader.readAsDataURL(activeImageFile);
    }
  };

  const handleCommitToPublicCatalogStream = (e) => {
    if (e) e.preventDefault();
    
    const finalStructuredPayload = {
      id: targetBookToImport.id,
      title: targetBookToImport.title,
      barcode: targetBookToImport.barcode,
      image: localBookImagePreview,
      status: "AVAILABLE",
      ...catalogImportFormData
    };

    saveOrUpdateCatalogItem(finalStructuredPayload);

    if (typeof onImportToCatalog === 'function') {
      onImportToCatalog(finalStructuredPayload);
    }

    setIsImportCatalogModalOpen(false);
    alert(`[SYSTEM TOAST NOTICE]\n\nSuccessfully imported "${targetBookToImport.title.toUpperCase()}" to the Public Catalog matrix!`);
    
    setTargetBookToImport(null);
    setLocalBookImagePreview(null);

    if (typeof setActiveTab === 'function') {
      setActiveTab('lib-showcase-books');
    }
  };

  const handleExecuteDeleteRecordRow = (targetId) => {
    setInventoryItems((inventoryItems || []).filter(row => row.id !== targetId));
    triggerToastAlert("Book record was deleted successfully.", "success");
  };

  const handleTriggerDeleteAllInventoryRecords = () => {
    if (typeof onTriggerConfirm === 'function') {
      onTriggerConfirm(
        "Are you sure you want to delete all items inside the active inventory database? This operation cannot be undone pre.",
        () => {
          setInventoryItems([]); 
          triggerToastAlert("Operational tracking inventory database completely purged safely!", "success");
        }
      );
    } else {
      setInventoryItems([]);
      triggerToastAlert("Inventory dataset records cleared.", "success");
    }
  };

  const handlePushToBatchQueue = (e) => {
    if (e) e.preventDefault();
    if (!formData.title && !emptyBypass.title) {
      triggerToastAlert("Book Title field is required to stage entry.", "error");
      return;
    }

    const queuedRowRecord = {
      id: Date.now() + Math.random(),
      ...formData
    };

    setStagedBatchQueue(prev => [...prev, queuedRowRecord]);
    triggerToastAlert("Book added to input queue table successfully.", "success");

    setFormData({
      barcode: '', barcodeColor: 'none', callNumber: '', itemNumber: '', personalName: '', relatorTerm: '', title: '', remainderTitle: '', statementOfResponsibility: '', placeOfPublication: '', publication: '',
      publisher: '', extent: '', physicalDetails: '', dimensions: '', note: '', sourceOfAcquisition: '', vendor: '', methodOfAcquisition: '', dateOfAcquisition: '', accessionNo: '',
      owner: 'Tanza Campus Library', purchasePrice: '', poNo: '', icsOrParNo: '', extent2: 'Copy 1', subject1: '', subject2: '', subject3: '', subject4: '',
      addPersName1: '', relatorName1: '', addPersName2: '', relatorName2: '', addPersName3: '', relatorName3: '', addPersName4: '', relatorName4: '', classification: '', fullCallNumber: '', copyNo: 'Copy 1'
    });
    setEmptyBypass({});
    setActiveTabForm('cat1');
  };

  const handleCommitStagedBatchToInventory = () => {
    if (stagedBatchQueue.length === 0) {
      triggerToastAlert("No staged book rows detected inside queue list.", "error");
      return;
    }

    setInventoryItems([...stagedBatchQueue, ...(inventoryItems || [])]);
    triggerToastAlert(`Successfully processed and committed batch collection of ${stagedBatchQueue.length} books!`, "success");
    setStagedBatchQueue([]);
    setIsAddModalOpen(false);
  };

  const handleExecuteRemoveFromQueueList = (targetQueueId) => {
    setStagedBatchQueue(prev => prev.filter(row => row.id !== targetQueueId));
  };

  const executeCommitRecord = (e) => {
    if(e) e.preventDefault();
    if (!formData.title && !emptyBypass.title) {
      triggerToastAlert("Book Title field is required.", "error");
      return;
    }

    if (isEditMode) {
      setInventoryItems((inventoryItems || []).map(row => row.id === activeEditingId ? { ...formData } : row));
      triggerToastAlert("Book record details updated successfully.", "success");
      setIsAddModalOpen(false);
      setIsEditMode(false);
      setActiveEditingId(null);
    } else {
      const newRecordPayload = { id: Date.now(), ...formData };
      setInventoryItems([newRecordPayload, ...(inventoryItems || [])]);
      triggerToastAlert("New book catalog entry saved successfully.", "success");
      setIsAddModalOpen(false);
    }

    setFormData({
      barcode: '', barcodeColor: 'none', callNumber: '', itemNumber: '', personalName: '', relatorTerm: '', title: '', remainderTitle: '', statementOfResponsibility: '', placeOfPublication: '', publication: '',
      publisher: '', extent: '', physicalDetails: '', dimensions: '', note: '', sourceOfAcquisition: '', vendor: '', methodOfAcquisition: '', dateOfAcquisition: '', accessionNo: '',
      owner: 'Tanza Campus Library', purchasePrice: '', poNo: '', icsOrParNo: '', extent2: 'Copy 1', subject1: '', subject2: '', subject3: '', subject4: '',
      addPersName1: '', relatorName1: '', addPersName2: '', relatorName2: '', addPersName3: '', relatorName3: '', addPersName4: '', relatorName4: '', classification: '', fullCallNumber: '', copyNo: 'Copy 1'
    });
    setEmptyBypass({});
    setActiveTabForm('cat1');
  };

  const processedFilteredRowsCollection = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const safeItems = inventoryItems || [];
    if (q === '') return safeItems;

    return safeItems.filter(item => {
      const barcodeValue = String(item.barcode || '').toLowerCase();
      const titleValue = String(item.title || '').toLowerCase();
      const accessionValue = String(item.accessionNo || '').toLowerCase();
      const shortCallNumValue = String(item.callNumber || '').toLowerCase();
      const fullCallNumValue = String(item.fullCallNumber || '').toLowerCase();

      switch (searchCriteriaFilter) {
        case 'title': return titleValue.includes(q);
        case 'barcode': return barcodeValue.includes(q);
        case 'accessionNo': return accessionValue.includes(q);
        case 'fullCallNumber': return fullCallNumValue.includes(q) || shortCallNumValue.includes(q);
        case 'ALL':
        default:
          return titleValue.includes(q) || barcodeValue.includes(q) || accessionValue.includes(q) || fullCallNumValue.includes(q) || shortCallNumValue.includes(q);
      }
    });
  }, [searchQuery, searchCriteriaFilter, inventoryItems]);

  return (
    <div className="w-full space-y-6 animate-fadeIn text-slate-800 text-left relative mt-2 select-none font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-[#043310] tracking-tight uppercase">Physical Book Inventory Management</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Catalog Database Records: <span className="text-emerald-700 font-mono font-black">{processedFilteredRowsCollection.length} total books</span>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button" 
            onClick={() => { setIsEditMode(false); setStagedBatchQueue([]); setIsAddModalOpen(true); }}
            className="flex-1 md:flex-none px-5 py-3.5 bg-[#043310] hover:bg-emerald-900 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
          >
            <Plus className="h-4 w-4 stroke-[3]" /> Add / Import Physical Asset
          </button>
          
          <button
            type="button"
            disabled={processedFilteredRowsCollection.length === 0}
            onClick={handleTriggerDeleteAllInventoryRecords}
            className="px-5 py-3.5 bg-red-600 hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
          >
            <Trash className="h-4 w-4 stroke-[2.5]" /> Delete All Items
          </button>
        </div>
      </div>

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
              <option value="ALL">🔍 GLOBAL MATCH (ALL CRITERIA)</option>
              <option value="title">📖 BOOK TITLE ONLY</option>
              <option value="barcode">🎫 BARCODE NUMBER ONLY</option>
              <option value="accessionNo">🗄️ ACCESSION NUMBER ONLY</option>
              <option value="fullCallNumber">🏷️ FULL CALL NUMBER ONLY</option>
            </select>
          </div>

          <div className="relative flex-1 w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input 
              type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search registry parameters cleanly..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#043310] focus:bg-white transition-all shadow-inner" 
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full scrollbar-thin max-h-[620px] overflow-y-auto">
          <table className="min-w-[4650px] text-left border-collapse table-fixed">
            <thead className="sticky top-0 z-20 bg-slate-100 shadow-sm text-[10.5px] font-black text-slate-500 uppercase tracking-wider">
              <tr className="border-b border-slate-200 divide-x divide-slate-200/60">
                <th className="sticky left-0 z-30 bg-slate-100 p-5 text-center w-[170px] shadow-md border-r-2 border-[#043310]/10 text-slate-700 font-sans font-black">Actions</th>
                <th className="p-5 w-[180px] bg-slate-100/90 text-emerald-950 font-black">Barcode</th>
                <th className="p-5 w-[220px]">Call Number</th>
                <th className="p-5 w-[140px]">Item Number</th>
                <th className="p-5 w-[200px]">Personal Name</th>
                <th className="p-5 w-[140px]">Relator Term</th>
                <th className="p-5 w-[380px] text-emerald-900 font-black bg-emerald-50/40">Title</th>
                <th className="p-5 w-[240px]">Remainder Title</th>
                <th className="p-5 w-[260px]">Statement of Responsibility</th>
                <th className="p-5 w-[180px]">Place of Publication</th>
                <th className="p-5 w-[220px]">Publication</th>
                <th className="p-5 w-[220px]">Publisher</th>
                <th className="p-5 w-[140px]">Extent</th>
                <th className="p-5 w-[240px]">Other Physical Details</th>
                <th className="p-5 w-[140px]">Dimensions</th>
                <th className="p-5 w-[260px]">Note</th>
                <th className="p-5 w-[220px]">Source of Acquisition</th>
                <th className="p-5 w-[220px]">Vendor</th>
                <th className="p-5 w-[180px]">Method of Acquisition</th>
                <th className="p-5 w-[160px]">Date of Acquisition</th>
                <th className="p-5 w-[160px] text-amber-950 bg-amber-50/40 font-black">Accession No.</th>
                <th className="p-5 w-[200px]">Owner</th>
                <th className="p-5 w-[150px]">Purchase Price</th>
                <th className="p-5 w-[160px]">P.O. No.</th>
                <th className="p-5 w-[160px]">ICS or PAR No.</th>
                <th className="p-5 w-[260px] text-[#043310] font-black bg-amber-50/50">Extent (ex: Copy 1, Copy 2)</th>
                <th className="p-5 w-[170px]">Subject 1</th>
                <th className="p-5 w-[170px]">Subject 2</th>
                <th className="p-5 w-[170px]">Subject 3</th>
                <th className="p-5 w-[170px]">Subject 4</th>
                <th className="p-5 w-[200px]">Add Pers. Name 1</th>
                <th className="p-5 w-[150px]">Relator Name 1</th>
                <th className="p-5 w-[200px]">Add Pers. Name 2</th>
                <th className="p-5 w-[150px]">Relator Name 2</th>
                <th className="p-5 w-[200px]">Add Pers. Name 3</th>
                <th className="p-5 w-[150px]">Relator Name 3</th>
                <th className="p-5 w-[200px]">Add Pers. Name 4</th>
                <th className="p-5 w-[150px]">Relator Name 4</th>
                <th className="p-5 w-[150px]">Classification</th>
                <th className="p-5 w-[240px]">Full Call Number</th>
                <th className="p-5 w-[140px] rounded-r-3xl">Copy No.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-slate-600 text-xs">
              {processedFilteredRowsCollection.map((item) => (
                <tr key={item.id} className="even:bg-slate-50/80 odd:bg-white hover:bg-slate-100/60 transition-all divide-x divide-slate-100/80 group">
                  <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 transition-colors p-3 shadow-md border-r-2 border-[#043310]/10 min-h-[64px]">
                    <div className="flex items-center justify-center gap-1.5 w-full h-full">
                      <button 
                        type="button" title="Import to Library Catalog"
                        onClick={() => handleTriggerCatalogImportWizard(item)}
                        className="p-2 border border-slate-300 bg-white hover:bg-emerald-700 text-slate-600 hover:text-white hover:border-emerald-700 rounded-xl transition-all cursor-pointer focus:outline-none shadow-sm flex items-center justify-center"
                      >
                        <ListPlus className="h-4 w-4 stroke-[2.5]" />
                      </button>
                      <button 
                        type="button" title="Edit Record Parameters"
                        onClick={() => handleTriggerEditPipelineMode(item)}
                        className="p-2 border border-slate-300 bg-white hover:bg-blue-600 text-slate-700 hover:text-white hover:border-blue-600 rounded-xl transition-all cursor-pointer focus:outline-none shadow-sm flex items-center justify-center"
                      >
                        <Edit3 className="h-4 w-4 stroke-[2.5]" />
                      </button>
                      <button 
                        type="button" title="Delete Record Row"
                        onClick={() => {
                          if (typeof onTriggerConfirm === 'function') {
                            onTriggerConfirm(
                              `Are you sure you want to delete the book "${item.title}"?`,
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
                  <td className="p-5 font-mono font-black text-slate-900">
                    <div className="flex items-center gap-1.5">
                      {item.barcodeColor === 'green' && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block border border-emerald-600/20 shadow-sm" />}
                      {item.barcodeColor === 'yellow' && <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block border border-yellow-500/20 shadow-sm" />}
                      {item.barcode ? item.barcode : <span className="text-slate-300 font-sans font-normal italic">[blank]</span>}
                    </div>
                  </td>
                  <td className="p-5 font-mono text-emerald-800 text-[11.5px] truncate">{item.callNumber || '—'}</td>
                  <td className="p-5 font-mono text-slate-500">{item.itemNumber || '—'}</td>
                  <td className="p-5 truncate text-slate-800">{item.personalName || '—'}</td>
                  <td className="p-5 text-[11px] font-medium text-slate-500 uppercase">{item.relatorTerm || '—'}</td>
                  <td className="p-5 font-black text-slate-900 text-[12.5px] leading-tight max-w-[380px] truncate bg-emerald-50/10 group-hover:text-[#043310] transition-colors">{item.title}</td>
                  <td className="p-5 text-[11px] font-medium text-slate-500 italic truncate">{item.remainderTitle || '—'}</td>
                  <td className="p-5 truncate text-slate-700">{item.statementOfResponsibility || '—'}</td>
                  <td className="p-5 text-slate-800 truncate">{item.placeOfPublication || '—'}</td>
                  <td className="p-5 truncate text-slate-700">{item.publication || '—'}</td>
                  <td className="p-5 text-slate-800 truncate">{item.publisher || '—'}</td>
                  <td className="p-5 text-slate-500 font-mono">{item.extent || '—'}</td>
                  <td className="p-5 text-slate-500 truncate">{item.physicalDetails || '—'}</td>
                  <td className="p-5 text-slate-500 font-mono">{item.dimensions || '—'}</td>
                  <td className="p-5 text-slate-500 italic truncate">{item.note || '—'}</td>
                  <td className="p-5 text-slate-700 truncate">{item.sourceOfAcquisition || '—'}</td>
                  <td className="p-5 text-slate-700 truncate">{item.vendor || '—'}</td>
                  <td className="p-5 font-medium text-slate-500 uppercase">{item.methodOfAcquisition || '—'}</td>
                  <td className="p-5 font-mono text-slate-500">{item.dateOfAcquisition || '—'}</td>
                  <td className="p-5 font-mono font-black text-amber-800 bg-amber-50/5 text-[12px]">{item.accessionNo || '—'}</td>
                  <td className="p-5 text-slate-500 text-[10.5px] uppercase">{item.owner || '—'}</td>
                  <td className="p-5 text-teal-800 font-mono font-bold">{item.purchasePrice || '—'}</td>
                  <td className="p-5 font-mono text-slate-500">{item.poNo || '—'}</td>
                  <td className="p-5 font-mono text-slate-500">{item.icsOrParNo || '—'}</td>
                  <td className="p-5 font-mono text-[#043310] font-black bg-amber-50/10">{item.extent2 || '—'}</td>
                  <td className="p-5 text-slate-700 font-medium truncate">{item.subject1 || '—'}</td>
                  <td className="p-5 text-slate-500 font-medium truncate">{item.subject2 || '—'}</td>
                  <td className="p-5 text-slate-500 font-medium truncate">{item.subject3 || '—'}</td>
                  <td className="p-5 text-slate-500 font-medium truncate">{item.subject4 || '—'}</td>
                  <td className="p-5 text-slate-500 truncate">{item.addPersName1 || '—'}</td>
                  <td className="p-5 text-slate-500 truncate">{item.relatorName1 || '—'}</td>
                  <td className="p-5 text-slate-500 truncate">{item.addPersName2 || '—'}</td>
                  <td className="p-5 text-slate-500 truncate">{item.relatorName2 || '—'}</td>
                  <td className="p-5 text-slate-500 truncate">{item.addPersName3 || '—'}</td>
                  <td className="p-5 text-slate-500 truncate">{item.relatorName3 || '—'}</td>
                  <td className="p-5 text-slate-500 truncate">{item.addPersName4 || '—'}</td>
                  <td className="p-5 text-slate-500 truncate">{item.relatorName4 || '—'}</td>
                  <td className="p-5 font-mono text-slate-500">{item.classification || '—'}</td>
                  <td className="p-5 font-mono text-emerald-800 truncate">{item.fullCallNumber || '—'}</td>
                  <td className="p-5 font-mono text-slate-900 font-black">{item.copyNo || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🖼️ INTERACTIVE BOOK CATALOG IMPORT SUITE WIZARD MODAL */}
      {/* ========================================================================= */}
      {isImportCatalogModalOpen && targetBookToImport && ReactDOM.createPortal(
        <div className="fixed inset-0 w-screen h-screen bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999999] animate-fadeIn text-left select-none font-sans">
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-2xl max-w-4xl w-full h-[85vh] overflow-hidden animate-scaleUp flex flex-col">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <ListPlus className="h-5 w-5 text-emerald-700 stroke-[2.5]" />
                <div>
                  <h3 className="text-sm font-black uppercase text-slate-900 tracking-tight">Ingest Asset into Public Catalog</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Target Publication: {targetBookToImport.title}</p>
                </div>
              </div>
              <button type="button" onClick={() => setIsImportCatalogModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer focus:outline-none"><X className="h-4 w-4" /></button>
            </div>

            <form onSubmit={handleCommitToPublicCatalogStream} className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50/20">
              <div className="w-full md:w-[320px] bg-slate-50 p-6 border-r border-slate-200/60 flex flex-col items-center justify-start space-y-5 flex-shrink-0 overflow-y-auto scrollbar-none">
                <div className="w-full text-left">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Book Display Thumbnail</h4>
                </div>
                <div className="w-40 aspect-[3/4] bg-gradient-to-b from-emerald-800/20 to-slate-200 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-3 text-center overflow-hidden relative shadow-inner group">
                  {localBookImagePreview ? (
                    <>
                      <img src={localBookImagePreview} alt="Catalog Cover Preview" className="w-full h-full object-cover rounded-xl" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-150">
                        <span className="text-[10px] text-white font-black uppercase tracking-wider bg-emerald-800 px-2.5 py-1.5 rounded-lg shadow border border-emerald-900">Change Media</span>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2 text-slate-400">
                      <Image className="h-8 w-8 mx-auto opacity-60 stroke-[1.5]" />
                      <p className="text-[10px] font-bold leading-normal px-2 uppercase tracking-wide">No image uploaded yet</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleLocalImageFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                </div>
                <div className="w-full bg-white p-4 border border-slate-200/80 rounded-xl space-y-1 shadow-sm font-sans text-xs">
                  <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase block font-black">System Metadata</span>
                  <div className="truncate"><b className="font-black text-slate-700">Title:</b> <span className="font-bold text-slate-900 uppercase">{targetBookToImport.title}</span></div>
                  <div><b className="font-black text-slate-700">Barcode:</b> <span className="font-mono font-black text-[#043310]">{targetBookToImport.barcode || 'N/A'}</span></div>
                </div>
              </div>

              <div className="flex-1 p-6 md:p-8 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-5 content-start scrollbar-none">
                <div className="sm:col-span-2 text-left border-b border-slate-100 pb-1.5">
                  <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Catalog Ingestion Parameters Table</h4>
                </div>
                <div className="space-y-1.5 flex flex-col items-start w-full">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Subject 1 Classification</label>
                  <input type="text" value={catalogImportFormData.subject1} onChange={(e) => handleCatalogImportFieldChange('subject1', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none" />
                </div>
                <div className="space-y-1.5 flex flex-col items-start w-full">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Accession Number</label>
                  <input type="text" value={catalogImportFormData.accessionNo} onChange={(e) => handleCatalogImportFieldChange('accessionNo', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none" />
                </div>
                <div className="space-y-1.5 flex flex-col items-start w-full">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Personal Name (Author)</label>
                  <input type="text" value={catalogImportFormData.personalName} onChange={(e) => handleCatalogImportFieldChange('personalName', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none" />
                </div>
                <div className="space-y-1.5 flex flex-col items-start w-full">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Remainder Title</label>
                  <input type="text" value={catalogImportFormData.remainderTitle} onChange={(e) => handleCatalogImportFieldChange('remainderTitle', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none" />
                </div>
                <div className="space-y-1.5 flex flex-col items-start w-full">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Full Call Number</label>
                  <input type="text" value={catalogImportFormData.fullCallNumber} onChange={(e) => handleCatalogImportFieldChange('fullCallNumber', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none" />
                </div>
                <div className="space-y-1.5 flex flex-col items-start w-full">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Place of Publication</label>
                  <input type="text" value={catalogImportFormData.placeOfPublication} onChange={(e) => handleCatalogImportFieldChange('placeOfPublication', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none" />
                </div>
                <div className="space-y-1.5 flex flex-col items-start w-full">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Publication (Vendor / Ingestion Line)</label>
                  <input type="text" value={catalogImportFormData.publication} onChange={(e) => handleCatalogImportFieldChange('publication', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none" />
                </div>
                <div className="space-y-1.5 flex flex-col items-start w-full">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Publisher (Copyright Year Entry)</label>
                  <input type="text" value={catalogImportFormData.publisher} onChange={(e) => handleCatalogImportFieldChange('publisher', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none" />
                </div>
                <div className="space-y-1.5 flex flex-col items-start w-full">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Extent (Total Pages Reference)</label>
                  <input type="text" value={catalogImportFormData.extent} onChange={(e) => handleCatalogImportFieldChange('extent', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none" />
                </div>
                <div className="space-y-1.5 flex flex-col items-start w-full">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Dimensions (Physical Size)</label>
                  <input type="text" value={catalogImportFormData.dimensions} onChange={(e) => handleCatalogImportFieldChange('dimensions', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none" />
                </div>
                <div className="space-y-1.5 flex flex-col items-start w-full">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Copy Number Tag</label>
                  <input type="text" value={catalogImportFormData.copyNo} onChange={(e) => handleCatalogImportFieldChange('copyNo', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none" />
                </div>
              </div>
            </form>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0">
              <button type="button" onClick={() => setIsImportCatalogModalOpen(false)} className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-black uppercase tracking-wider transition-all">Cancel Ingestion</button>
              <button type="submit" onClick={handleCommitToPublicCatalogStream} className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"><Check className="h-4 w-4 stroke-[3]" /> Import Book Asset</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* WORKSPACE ADD WIZARD PORTER */}
      {isAddModalOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 w-screen h-screen bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[999999] animate-fadeIn select-none">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[90vh] md:h-[85vh] flex flex-col overflow-hidden animate-scaleUp border border-slate-100 text-left">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-[#043310] rounded-xl border border-emerald-100/60"><BookOpen className="h-5 w-5 stroke-[2.5]" /></div>
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">{isEditMode ? "📝 Modify / Edit Catalog Entry" : "Add Master Catalog Entry"}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{isEditMode ? `Target Record System ID: ${activeEditingId}` : "Manual Form Entry, Staging Queue, or Batch Excel Import Suite"}</p>
                </div>
              </div>
              <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditMode(false); setActiveEditingId(null); setStagedBatchQueue([]); }} className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer focus:outline-none"><X className="h-5 w-5" /></button>
            </div>

            <div className="bg-white border-b border-slate-100 flex items-center px-4 overflow-x-auto scrollbar-none flex-shrink-0">
              {['cat1', 'cat2', 'cat3', 'cat4'].map((tabKey, idx) => (
                <button key={tabKey} type="button" onClick={() => setActiveTabForm(tabKey)} className={`px-4 py-3.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 focus:outline-none ${activeFormTab === tabKey ? "border-slate-800 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-700"}`}><FileText className="h-3.5 w-3.5" /> Category {idx + 1}</button>
              ))}
              {!isEditMode && (
                <button type="button" onClick={() => setActiveTabForm('excel-upload')} className={`px-5 py-3.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 text-emerald-700 focus:outline-none ${activeFormTab === 'excel-upload' ? "border-emerald-600 bg-emerald-50/40 text-emerald-800" : "border-transparent text-emerald-600/70 hover:bg-emerald-50/10"}`}><FileText className="h-4 w-4" /> Batch Excel Ingestion (.xlsx)</button>
              )}
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50/20">
              <div ref={formScrollContainerRef} className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-none border-r border-slate-200/60">
                {activeFormTab === 'cat1' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Barcode</label>
                      <div className="flex items-center gap-2">
                        <input type="text" value={formData.barcode} onChange={(e) => handleInputChange('barcode', e.target.value)} className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono font-black text-slate-800 focus:outline-none" />
                        <div className="flex items-center gap-1 border border-slate-200 rounded-xl p-1 bg-white shadow-sm">
                          <button type="button" onClick={() => handleInputChange('barcodeColor', 'green')} className={`w-6 h-6 rounded-lg bg-emerald-500 border ${formData.barcodeColor === 'green' ? 'border-slate-900 scale-110 shadow-sm' : 'border-transparent opacity-60'}`} />
                          <button type="button" onClick={() => handleInputChange('barcodeColor', 'yellow')} className={`w-6 h-6 rounded-lg bg-yellow-400 border ${formData.barcodeColor === 'yellow' ? 'border-slate-900 scale-110 shadow-sm' : 'border-transparent opacity-60'}`} />
                          <button type="button" onClick={() => handleInputChange('barcodeColor', 'none')} className={`p-1 text-[9px] font-black uppercase text-slate-400 ${formData.barcodeColor === 'none' ? 'text-slate-900 font-bold' : ''}`}>Clear</button>
                        </div>
                      </div>
                    </div>

                    {[
                      { id: 'callNumber', label: 'Call Number' },
                      { id: 'itemNumber', label: 'Item Number' },
                      { id: 'personalName', label: 'Personal Name' },
                      { id: 'relatorTerm', label: 'Relator Term' },
                      { id: 'title', label: 'Title' },
                      { id: 'remainderTitle', label: 'Remainder Title' },
                      { id: 'statementOfResponsibility', label: 'Statement of Responsibility' },
                      { id: 'placeOfPublication', label: 'Place of Publication' },
                      { id: 'publication', label: 'Publication' }
                    ].map((field) => (
                      <div key={field.id} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">{field.label}</label>
                          <button type="button" onClick={() => toggleBypassFlag(field.id)} className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${emptyBypass[field.id] ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-black shadow-inner" : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"}`}><div className={`w-3 h-3 rounded flex items-center justify-center border text-white ${emptyBypass[field.id] ? "bg-emerald-600 border-emerald-600" : "border-slate-300 bg-white"}`}>{emptyBypass[field.id] && "✓"}</div>Leave Empty</button>
                        </div>
                        <input type="text" value={formData[field.id]} disabled={emptyBypass[field.id]} onChange={(e) => handleInputChange(field.id, e.target.value)} className="w-full bg-white disabled:bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none" />
                      </div>
                    ))}
                  </div>
                )}

                {activeFormTab === 'cat2' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
                    {[
                      { id: 'publisher', label: 'Publisher' },
                      { id: 'extent', label: 'Extent' },
                      { id: 'physicalDetails', label: 'Other Physical Details' },
                      { id: 'dimensions', label: 'Dimensions' },
                      { id: 'note', label: 'Note' },
                      { id: 'sourceOfAcquisition', label: 'Source of Acquisition' },
                      { id: 'vendor', label: 'Vendor' },
                      { id: 'methodOfAcquisition', label: 'Method of Acquisition' },
                      { id: 'dateOfAcquisition', label: 'Date of Acquisition' },
                      { id: 'accessionNo', label: 'Accession No.' }
                    ].map((field) => (
                      <div key={field.id} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">{field.label}</label>
                          <button type="button" onClick={() => toggleBypassFlag(field.id)} className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${emptyBypass[field.id] ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-black shadow-inner" : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"}`}><div className={`w-3 h-3 rounded flex items-center justify-center border text-white ${emptyBypass[field.id] ? "bg-emerald-600 border-emerald-600" : "border-slate-300 bg-white"}`}>{emptyBypass[field.id] && "✓"}</div>Leave Empty</button>
                        </div>
                        <input type="text" value={formData[field.id]} disabled={emptyBypass[field.id]} onChange={(e) => handleInputChange(field.id, e.target.value)} className="w-full bg-white disabled:bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none" />
                      </div>
                    ))}
                  </div>
                )}

                {activeFormTab === 'cat3' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Owner</label>
                      <input type="text" value={formData.owner} disabled className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-xs font-black text-slate-500 shadow-inner" />
                    </div>
                    {[
                      { id: 'purchasePrice', label: 'Purchase Price' },
                      { id: 'poNo', label: 'P.O. No.' },
                      { id: 'icsOrParNo', label: 'ICS or PAR No.' },
                      { id: 'extent2', label: 'Extent (ex: Copy 1, Copy 2)' },
                      { id: 'subject1', label: 'Subject 1' },
                      { id: 'subject2', label: 'Subject 2' },
                      { id: 'subject3', label: 'Subject 3' },
                      { id: 'subject4', label: 'Subject 4' }
                    ].map((field) => (
                      <div key={field.id} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">{field.label}</label>
                          <button type="button" onClick={() => toggleBypassFlag(field.id)} className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${emptyBypass[field.id] ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-black shadow-inner" : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"}`}><div className={`w-3 h-3 rounded flex items-center justify-center border text-white ${emptyBypass[field.id] ? "bg-emerald-600 border-emerald-600" : "border-slate-300 bg-white"}`}>{emptyBypass[field.id] && "✓"}</div>Leave Empty</button>
                        </div>
                        <input type="text" value={formData[field.id]} disabled={emptyBypass[field.id]} onChange={(e) => handleInputChange(field.id, e.target.value)} className="w-full bg-white disabled:bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none" />
                      </div>
                    ))}
                  </div>
                )}

                {activeFormTab === 'cat4' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
                    {[
                      { id: 'addPersName1', label: 'Add Pers. Name 1' },
                      { id: 'relatorName1', label: 'Relator Name 1' },
                      { id: 'addPersName2', label: 'Add Pers. Name 2' },
                      { id: 'relatorName2', label: 'Relator Name 2' },
                      { id: 'addPersName3', label: 'Add Pers. Name 3' },
                      { id: 'relatorName3', label: 'Relator Name 3' },
                      { id: 'addPersName4', label: 'Add Pers. Name 4' },
                      { id: 'relatorName4', label: 'Relator Name 4' },
                      { id: 'classification', label: 'Classification' },
                      { id: 'fullCallNumber', label: 'Full Call Number' },
                      { id: 'copyNo', label: 'Copy No.' }
                    ].map((field) => (
                      <div key={field.id} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">{field.label}</label>
                          <button type="button" onClick={() => toggleBypassFlag(field.id)} className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${emptyBypass[field.id] ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-black shadow-inner" : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"}`}><div className={`w-3 h-3 rounded flex items-center justify-center border text-white ${emptyBypass[field.id] ? "bg-emerald-600 border-emerald-600" : "border-slate-300 bg-white"}`}>{emptyBypass[field.id] && "✓"}</div>Leave Empty</button>
                        </div>
                        <input type="text" value={formData[field.id]} disabled={emptyBypass[field.id]} onChange={(e) => handleInputChange(field.id, e.target.value)} className="w-full bg-white disabled:bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none" />
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
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Select Koha Excel Spreadsheet</h4>
                      <p className="text-xs text-slate-400 font-medium">Supports official library registry (.xlsx or .xls files)</p>
                    </div>
                    <div className="relative max-w-xs mx-auto">
                      <input type="file" accept=".xlsx, .xls" onChange={handleProcessExcelImportStream} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm text-center">Browse Spreadsheet File</div>
                    </div>
                  </div>
                )}
              </div>

              {!isEditMode && activeFormTab !== 'excel-upload' && (
                <div className="w-full md:w-[320px] bg-slate-100/70 border-t md:border-t-0 md:border-l border-slate-200 p-4 flex flex-col overflow-hidden animate-fadeIn flex-shrink-0">
                  <div className="flex items-center gap-1.5 pb-3 border-b border-slate-200 flex-shrink-0">
                    <Layers3 className="h-4 w-4 text-emerald-800" />
                    <h4 className="text-[11.5px] font-black text-slate-900 uppercase tracking-wider">Staging Batch Queue</h4>
                    <span className="ml-auto bg-emerald-700 text-white font-mono font-black text-[10px] px-2 py-0.5 rounded-full shadow-inner">{stagedBatchQueue.length}</span>
                  </div>
                  <div className="flex-1 py-3 overflow-y-auto space-y-2 scrollbar-none">
                    {stagedBatchQueue.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 border border-dashed border-slate-300 rounded-2xl bg-white/40 shadow-inner">
                        <div className="text-[10px] font-black uppercase tracking-wider">Queue is Empty</div>
                        <p className="text-[9px] font-bold text-slate-400 mt-0.5">Fill form fields and click 'Add to Queue' button to batch data rows.</p>
                      </div>
                    ) : (
                      stagedBatchQueue.map((queueItem, idx) => (
                        <div key={queueItem.id} className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm space-y-1 relative group hover:border-emerald-600/30 transition-all text-left">
                          <div className="text-[9px] font-mono text-emerald-700 font-bold uppercase tracking-wider">Asset Item #{idx + 1}</div>
                          <div className="text-[11px] font-black text-slate-900 leading-snug line-clamp-2 pr-6">{queueItem.title}</div>
                          <div className="text-[9px] font-mono text-slate-400 truncate">BC: {queueItem.barcode || '[blank]'} | CN: {queueItem.callNumber || 'N/A'}</div>
                          <button type="button" onClick={() => handleExecuteRemoveFromQueueList(queueItem.id)} className="absolute top-2 right-2 text-slate-300 hover:text-red-600 p-0.5 rounded transition-colors focus:outline-none"><X className="h-3.5 w-3.5" /></button>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex-shrink-0">
                    <button type="button" disabled={stagedBatchQueue.length === 0} onClick={handleCommitStagedBatchToInventory} className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-[10.5px] font-black uppercase tracking-wider shadow-md disabled:opacity-40 flex items-center justify-center gap-1.5 focus:outline-none"><Check className="h-3.5 w-3.5 stroke-[3]" /> Save Batch ({stagedBatchQueue.length})</button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
              <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider pl-2">Active Workspace Section: <span className="text-emerald-800 font-mono font-black">{activeFormTab.toUpperCase()}</span></div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditMode(false); setActiveEditingId(null); setStagedBatchQueue([]); }} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 text-xs font-black uppercase tracking-wider">Cancel</button>
                {activeFormTab !== 'cat4' && activeFormTab !== 'excel-upload' ? (
                  <button type="button" onClick={() => {
                    if (activeFormTab === 'cat1') setActiveTabForm('cat2');
                    else if (activeFormTab === 'cat2') setActiveTabForm('cat3');
                    else if (activeFormTab === 'cat3') setActiveTabForm('cat4');
                  }} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1">Next Category Tab <ChevronRight className="h-3.5 w-3.5" /></button>
                ) : activeFormTab === 'cat4' ? (
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={handlePushToBatchQueue} className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all">Stage Entry to Queue</button>
                    <button type="button" onClick={(e) => {
                      if (isEditMode && typeof onTriggerConfirm === 'function') {
                        onTriggerConfirm("Are you sure you want to save the changes made to this book record?", () => executeCommitRecord(e));
                      } else {
                        executeCommitRecord(e);
                      }
                    }} className="px-5 py-2.5 rounded-xl bg-[#043310] hover:bg-emerald-900 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md focus:outline-none"><Check className="h-4 w-4 stroke-[3]" /> {isEditMode ? "Save Changes" : "Save Single Asset"}</button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* CUSTOM TOAST SYSTEM */}
      {toastNotification.isVisible && ReactDOM.createPortal(
        <div className="fixed bottom-6 right-6 z-[9999999] max-w-sm w-full bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 p-4 flex items-start gap-3 animate-slideUp">
          <div className="mt-0.5 flex-shrink-0">{toastNotification.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-emerald-400 stroke-[2.5]" /> : <AlertCircle className="h-5 w-5 text-red-400 stroke-[2.5]" />}</div>
          <div className="flex-1 space-y-0.5">
            <h5 className="text-xs font-black uppercase tracking-wider text-slate-200">{toastNotification.type === 'success' ? 'Action Successful' : 'System Alert Notice'}</h5>
            <p className="text-[11.5px] font-bold text-slate-400 leading-snug">{toastNotification.message}</p>
          </div>
          <button type="button" onClick={closeToastAlert} className="p-1 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white focus:outline-none"><X className="h-4 w-4" /></button>
        </div>,
        document.body
      )}

    </div>
  );
}

export default LibInventoryBooks; // //eto pre: FIX DEFINITIVE! Pinalitan natin yung standalone name to LibInventoryBooks para mahiwalay smoothly!