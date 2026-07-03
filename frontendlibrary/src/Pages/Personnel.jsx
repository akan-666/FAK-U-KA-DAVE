import React from 'react';
import { Mail, ShieldCheck, UserCheck } from 'lucide-react';

// //eto pre: Inaangkat natin 'yung empty avatar picture block para may visual layer ang staff listings natively
import noProfileIcon from '../assets/noprofileicon.png';

function Personnel({ onTriggerConfirm }) {
  // //eto pre: Array registry na naglalaman ng mga saktong profile identities nina sir Ryan at library assistants
  const staffDirectory = [
    { id: 1, name: "Ryan Apinan", title: "HEAD LIBRARIAN", email: "ryan.apinan@cvsu.edu.ph", type: "HEAD" },
    { id: 2, name: "Jhon Joseph Rivas", title: "LIBRARIAN ASSISTANT", email: "jhonjoseph.rivas@cvsu.edu.ph", type: "ASSISTANT" }
  ];

  // //eto pre: Triggers function helper na pumupukaw sa global configuration modal framework natin cleanly
  const handleContactTrigger = (staff) => {
    // //eto pre: Plain at simpleng structured sentence para madaling maintindihan ng mga estudyanteng gagamit
    const promptMsg = `Do you want to open Gmail and send an email to ${staff.name}?`;
    
    // //eto pre: Isinasabit nito ang callback commands para automatic bumukas ang mailto function pagka-click ng save
    onTriggerConfirm(promptMsg, () => {
      window.location.href = `mailto:${staff.email}?subject=Library%20Inquiry`;
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn text-left text-slate-800 w-full mt-4 select-none font-sans">
      
      {/* //eto pre: Ang upper metadata header strip summary info panel layout natin */}
      <div className="space-y-1">
        <h2 className="text-xl font-black text-[#043310] tracking-tight uppercase">Library Staff</h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Official library personnel directory.</p>
      </div>

      {/* //eto pre: Flexible dynamic layout flex grid container para sa responsive cards display block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {staffDirectory.map((staff) => (
          <div 
            key={staff.id} 
            className="bg-white border border-slate-200/80 rounded-[32px] p-8 shadow-sm flex flex-col items-center justify-between text-center space-y-6 relative overflow-hidden transition-all hover:shadow-md"
          >
            
            {/* //eto pre: Avatar card circles framework tag container placeholder inside slots */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-200/60 shadow-inner flex items-center justify-center bg-slate-50">
              <img src={noProfileIcon} alt="Staff profile" className="w-full h-full object-cover" />
            </div>

            {/* //eto pre: Info deck blocks tracking full name at custom badge headers */}
            <div className="space-y-1.5">
              <h3 className="text-base font-black text-slate-900 tracking-tight">{staff.name}</h3>
              <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black tracking-wider uppercase items-center ${
                staff.type === 'HEAD' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}>
                {staff.type === 'HEAD' ? (
                  <ShieldCheck className="h-3 w-3 mr-1 inline-block" />
                ) : (
                  <UserCheck className="h-3 w-3 mr-1 inline-block" />
                )}
                {staff.title}
              </span>
            </div>

            {/* //eto pre: Box area na nagpapasilip ng official CvSU school electronic emails account indicators */}
            <div className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-slate-500 text-xs font-mono font-bold">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              <span>{staff.email}</span>
            </div>

            {/* //eto pre: Action execution trigger zone button links options */}
            <button
              type="button"
              onClick={() => handleContactTrigger(staff)}
              className="w-full bg-[#054a18] hover:bg-emerald-900 text-white text-xs font-black uppercase tracking-wider py-3 rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 focus:outline-none"
            >
              Contact Librarian
            </button>

          </div>
        ))}
      </div>

    </div>
  );
}

export default Personnel;