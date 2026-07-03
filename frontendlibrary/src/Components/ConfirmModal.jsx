import React from 'react';
import { AlertTriangle, Check, ShieldAlert } from 'lucide-react';

function ConfirmModal({ isOpen, message, onConfirm, onCancel, type = 'confirm' }) {
  if (!isOpen) return null;

  const isPrivacyProfileMode = type === 'privacy';

  return (
 <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999999] animate-fadeIn">
      
      {/* Dynamic max-width structural box frame calculation */}
      <div className={`bg-white rounded-3xl shadow-2xl w-full p-6 overflow-hidden flex flex-col space-y-4 animate-scaleUp transition-all text-left border-t-4 ${
        isPrivacyProfileMode ? "max-w-lg border-t-amber-600" : "max-w-md border-t-emerald-600"
      }`}>
        
        {/* PROFILE 1: THE REPLICATED PRIVACY COMPLIANCE NOTICE PANEL PROFILE */}
        {isPrivacyProfileMode ? (
          <div className="flex items-center gap-3 text-amber-600">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 flex-shrink-0">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">Security & Privacy Terms</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Republic Act No. 10173 Compliance</p>
            </div>
          </div>
        ) : (
          /* PROFILE 2: THE CRITERIA STANDARD SYSTEM VALIDATION PROFILE */
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 flex-shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">Confirmation</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Please verify your action</p>
            </div>
          </div>
        )}

        {/* DETAILED CONTENT FIELD RENDERING ENGINE BLOCK */}
        {isPrivacyProfileMode ? (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-2 text-xs font-bold text-slate-600 leading-relaxed max-h-[220px] overflow-y-auto">
            <p className="text-slate-900 font-black text-[13px] uppercase tracking-wide">⚠️ REPRODUCTION RESTRICTIONS NOTICE:</p>
            <p>Under the mandates of the <span className="text-slate-900">Data Privacy Act of 2012 (R.A. 10173)</span> and university intellectual property guidelines, this asset is flagged for <span className="text-amber-700">Internal Reading Only</span>.</p>
            <ul className="list-disc list-inside space-y-1 pl-1 text-slate-500">
              <li>Downloading or executing print commands is strictly disabled.</li>
              <li>Taking screenshots or capturing the screen view with mobile cameras is trackable and considered a severe policy breach.</li>
              <li>Your access credentials will be logged natively in the librarian panel.</li>
            </ul>
          </div>
        ) : (
          <p className="text-slate-600 text-xs font-bold whitespace-pre-line leading-relaxed pl-1">
            {message}
          </p>
        )}

        {/* DYNAMIC ACTION SUBMIT TRIGGERS FOOTER BAR */}
        <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-50">
          <button
            type="button"
            onClick={onCancel}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all border ${
              isPrivacyProfileMode 
                ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-500" 
                : "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
            }`}
          >
            {isPrivacyProfileMode ? "I Decline" : "No, Cancel"}
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-1.5 cursor-pointer transition-all ${
              isPrivacyProfileMode
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-[#054a18] hover:bg-emerald-900 text-white"
            }`}
          >
            <Check className="h-4 w-4" /> {isPrivacyProfileMode ? "I Agree & Accept" : "Yes, Proceed"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ConfirmModal;