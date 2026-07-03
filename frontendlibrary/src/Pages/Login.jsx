import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ChevronDown } from 'lucide-react';
import cvsuLogo from '../assets/cvsutanzalogo1.png';

function Login({ onLoginSuccess }) {
  const [selectedRole, setSelectedRole] = useState('STUDENT'); 
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!userId || !password) return;
    
    onLoginSuccess({
      username: userId,
      role: selectedRole,
      name: selectedRole === "LIBRARIAN" ? "Ryan Apinan" : "Limuel-Kyle Geroy"
    });
  };

  const getInputLabels = () => {
    switch (selectedRole) {
      case 'STUDENT':
        return {
          topLabel: 'STUDENT NUMBER',
          placeholder: 'Enter Student Number (e.g., 202315215)'
        };
      case 'STAKEHOLDER':
        return {
          topLabel: 'EMPLOYEE ID',
          placeholder: 'Enter Employee ID'
        };
      case 'LIBRARIAN':
        return {
          topLabel: 'USERNAME',
          placeholder: 'Enter username'
        };
      default:
        return { topLabel: 'USER ID', placeholder: 'Enter your ID' };
    }
  };

  const currentLabels = getInputLabels();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center p-4 font-sans antialiased select-none">
      <div className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl border border-slate-100 flex flex-col items-center space-y-6 animate-scaleUp">
        
        <div className="flex flex-col items-center space-y-2 text-center">
          <img 
            src={cvsuLogo} 
            alt="CvSU Tanza Logo" 
            className="w-20 h-20 object-contain drop-shadow-sm mb-2"
          />
          <h2 className="text-[11px] font-bold tracking-wider text-[#054a18] uppercase">
            Cavite State University – Tanza Campus
          </h2>
          <h1 className="text-xl font-black text-[#054a18] tracking-wide uppercase">
            Library Portal
          </h1>
        </div>

        <div className="w-full text-left space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Choose Login Portal
          </label>
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setUserId(''); 
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-black text-slate-700 appearance-none focus:outline-none focus:border-[#054a18] focus:bg-white transition-all cursor-pointer"
            >
              <option value="STUDENT">STUDENT</option>
              <option value="STAKEHOLDER">STAKEHOLDER</option>
              <option value="LIBRARIAN">LIBRARIAN</option>
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <ChevronDown className="h-4 w-4" />
            </span>
          </div>
        </div>

        <form onSubmit={handleLoginSubmit} className="w-full space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              {currentLabels.topLabel}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder={currentLabels.placeholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#054a18] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#054a18] focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#054a18] hover:bg-emerald-900 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-widest shadow-md transition-all cursor-pointer mt-4"
          >
            Login &rarr;
          </button>
        </form>

        <div className="w-full pt-4 border-t border-slate-100 flex wrap justify-center gap-4 text-[9px] font-black uppercase text-slate-400 select-none">
          <span className="hover:underline cursor-pointer">Terms of Use</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Privacy Policy</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">IT Support</span>
        </div>

      </div>
    </div>
  );
}

export default Login;