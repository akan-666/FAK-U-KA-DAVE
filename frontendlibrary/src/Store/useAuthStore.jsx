import { create } from "zustand";
import { persist } from "zustand/middleware";

// //eto pre: Central database initialization reference blueprint for robust testing phase tracking
const generateOfficialCapstoneCatalog = () => {
  const sourcePayload = [
    { course: "BSIT", genre: "Programming & Software Development", titles: ["Clean Code", "The Pragmatic Programmer", "Code Complete", "Introduction to Java Programming and Data Structures", "Python Crash Course"] },
    { course: "BSIT", genre: "Database Systems", titles: ["Database System Concepts", "Fundamentals of Database Systems", "SQL Queries for Mere Mortals", "Learning SQL", "Database Design for Mere Mortals"] },
    { course: "BSIT", genre: "Networking", titles: ["Computer Networking: A Top-Down Approach", "Data and Computer Communications", "Network+ Guide to Networks", "CCNA 200-301 Official Cert Guide", "TCP/IP Illustrated Volume 1"] },
    { course: "BSIT", genre: "Cybersecurity", titles: ["Cybersecurity Essentials", "Computer Security: Principles and Practice", "The Web Application Hacker's Handbook", "Hacking: The Art of Exploitation", "Security+ Guide to Network Security Fundamentals"] }
  ];

  let uniqueId = 1;
  const targetOutputRecords = [];

  sourcePayload.forEach((group) => {
    group.titles.forEach((titleString, titleIdx) => {
      targetOutputRecords.push({
        id: uniqueId++,
        barcode: `971-02-2630-${8200 + uniqueId}`,
        fullCallNumber: `FIL ${group.course.slice(0, 3)} ${300 + uniqueId}.${titleIdx % 9} 2026`,
        title: titleString,
        personalName: titleIdx % 2 === 0 ? "Geroy, Limuel-Kyle B." : "Apinan, Ryan L.",
        publisher: titleIdx % 3 === 0 ? "CvSU Publishing Office" : "Rex Book Store, Inc.",
        placeOfPublication: "Cavite, Philippines",
        publicationYear: "2026",
        stock: (2 + (uniqueId % 6)),
        course: group.course,
        subject1: "Non-Fiction", // Match initial filter keys seamlessly
        copyNo: "Copy 1",
        summary: "—",
        status: "AVAILABLE"
      });
    });
  });

  return targetOutputRecords;
};

const useAuthStore = create(
  persist(
    (set) => ({
      // //eto pre: USER METADATA AND ACCESS CONTEXT REGISTRY
      user: null,
      token: null,
      role: null,
      
// Siguraduhing ganito ang handling sa useAuthStore mo pre para sa inventory:
inventoryItems: [
  {
    id: 1,
    barcode: "978-0-13-361202-8",
    barcodeColor: "none",
    callNumber: "QH316",
    itemNumber: "—",
    personalName: "John Bartsch",
    relatorTerm: "MARY P. COLVARD",
    title: "The living Environment",
    remainderTitle: "—",
    statementOfResponsibility: "—",
    placeOfPublication: "Quezon City",
    publication: "C&E Publishing Inc.",
    publisher: "C&E Publishing Inc.",
    extent: "xx, 366 pages",
    physicalDetails: "illustrations",
    dimensions: "26 cm",
    note: "None",
    sourceOfAcquisition: "Tanza Campus Library",
    vendor: "C&E Publishing",
    methodOfAcquisition: "Purchase",
    dateOfAcquisition: "2022-04-12",
    accessionNo: "000821",
    owner: "Tanza Campus Library",
    purchasePrice: "PHP 650.00",
    poNo: "PO-2022-089",
    icsOrParNo: "None",
    extent2: "Copy 1",
    subject1: "Science", subject2: "Biology", subject3: "None", subject4: "None",
    classification: "LCC",
    fullCallNumber: "QH316 .B37 2022",
    copyNo: "Copy 1"
  }
],

// Siguraduhing may setInventoryItems ka sa actions pre:
setInventoryItems: (items) => set({ inventoryItems: items || [] }),
      catalogItems: generateOfficialCapstoneCatalog(), // Synchronized live matrix list for student & librarian views
      borrowRequests: {
        'mock-1': { studentName: "LIMUEL KYLE GEROY", id: "202315215", active: true }
      },

      // //eto pre: AUTH TRANSACTION LOGS INTERCEPTOR PIPELINES
      login: (data) =>
        set({
          user: data.user,
          token: data.token,
          role: String(data.user.role).toLowerCase(), // Always standardized downcase for unified multi-routing checks
        }),

// //eto pre: FIX LOGOUT STATE DESTRUCTION BUG! 
// Tinanggal na natin ang pag-reset sa catalogItems at inventoryItems para permanenteng nakaselyo ang inadd mong libro kahit mag-logout/login ka!
logout: () =>
  set({
    user: null,
    token: null,
    role: null
    // Hindi na natin isasama dito sina catalogItems at inventoryItems para retained sila sa localStorage pre!
  }),

      // //eto pre: INVENTORY ACTIONS CONTROLLER
      setInventoryItems: (items) => set({ inventoryItems: items || [] }),
      addInventoryItem: (item) => set((state) => ({ inventoryItems: [item, ...state.inventoryItems] })),
      removeInventoryItem: (id) => set((state) => ({ inventoryItems: state.inventoryItems.filter((item) => item.id !== id) })),
      updateInventoryItem: (updatedItem) => set((state) => ({ inventoryItems: state.inventoryItems.map((item) => item.id === updatedItem.id ? updatedItem : item) })),

      // //eto pre: PUBLIC PRINT CATALOG CORE ENGINE LOGISTICS
      setCatalogItems: (items) => set({ catalogItems: items || [] }),
      
      // Strict unique mapping interceptor to prevent any double injection conflicts pre flawlessly
      saveOrUpdateCatalogItem: (bookObject) => set((state) => {
        const isExisting = state.catalogItems.some((b) => b.id === bookObject.id);
        if (isExisting) {
          return {
            catalogItems: state.catalogItems.map((b) => b.id === bookObject.id ? { ...b, ...bookObject } : b)
          };
        }
        return { catalogItems: [bookObject, ...state.catalogItems] };
      }),

      // //eto pre: INTERACTIVE BORROW REQUEST TRANSACTION SIGNALS
      submitBorrowRequest: (bookId, studentData) => set((state) => ({
        borrowRequests: {
          ...state.borrowRequests,
          [bookId]: { studentName: studentData.name, id: studentData.id, active: true }
        }
      })),

      acceptBorrowRequest: (bookId) => set((state) => ({
        borrowRequests: { ...state.borrowRequests, [bookId]: null },
        catalogItems: state.catalogItems.map((b) => b.id === bookId ? { ...b, status: "BORROWED" } : b)
      })),

      declineBorrowRequest: (bookId) => set((state) => ({
        borrowRequests: { ...state.borrowRequests, [bookId]: null }
      }))
    }),
    {
      name: "library-system-session", // Exclusive encryption storage key row cleanly
    }
  )
);

export default useAuthStore;