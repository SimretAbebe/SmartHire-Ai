import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Info, KeyRound, CheckCircle2 } from 'lucide-react';

// Math tables for the Verhoeff Algorithm
const d = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

const p = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

/**
 * Validates a number string using the Verhoeff algorithm.
 * @param {string} numStr The number string to validate.
 * @returns {boolean} True if checksum passes, else false.
 */
function validateVerhoeff(numStr) {
  if (!numStr || !/^\d+$/.test(numStr)) return false;
  
  let c = 0;
  // Convert string to array of numbers and reverse it
  const array = numStr.split('').map(Number).reverse();
  
  for (let i = 0; i < array.length; i++) {
    c = d[c][p[i % 8][array[i]]];
  }
  
  return c === 0;
}

export default function FaydaIdVerification() {
  const [faydaId, setFaydaId] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'valid', 'invalid', 'incomplete', 'verifying'

  const handleInputChange = (e) => {
    // Only allow digits and restrict to 12 characters
    const rawValue = e.target.value.replace(/\D/g, '').slice(0, 12);
    setFaydaId(rawValue);
    
    if (rawValue.length === 0) {
      setStatus('idle');
    } else if (rawValue.length < 12) {
      setStatus('incomplete');
    } else {
      // Start simulated server-side verification after all 12 digits are entered
      setStatus('verifying');
      
      setTimeout(() => {
        const isValid = validateVerhoeff(rawValue);
        setStatus(isValid ? 'valid' : 'invalid');
      }, 1500);
    }
  };

  // Format the ID for display in chunks of 4 (e.g., 1234 5678 9012)
  const formatDisplay = (val) => {
    if (!val) return '';
    const match = val.match(/^(\d{0,4})(\d{0,4})(\d{0,4})$/);
    if (!match) return val;
    let formatted = match[1];
    if (match[2]) formatted += ' ' + match[2];
    if (match[3]) formatted += ' ' + match[3];
    return formatted;
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)] transition-all duration-500 ease-out hover:shadow-[0_16px_60px_rgba(0,0,0,0.12)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
          <KeyRound strokeWidth={2.5} size={20} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Fayda ID</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Verify your 12-digit identifier</p>
        </div>
      </div>

      <div className="relative group">
        <input
          type="text"
          value={formatDisplay(faydaId)}
          onChange={handleInputChange}
          placeholder="0000 0000 0000"
          className={`w-full px-5 py-4 text-2xl font-mono tracking-widest bg-slate-50 dark:bg-slate-950/50 outline-none rounded-2xl border-2 transition-all duration-300 placeholder:text-slate-300 dark:placeholder:text-slate-700
            ${status === 'idle' || status === 'incomplete' || status === 'verifying'
              ? 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20' 
              : ''}
            ${status === 'valid' 
              ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 focus:ring-4 focus:ring-emerald-500/20' 
              : ''}
            ${status === 'invalid' 
              ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 focus:ring-4 focus:ring-rose-500/20' 
              : ''}
          `}
        />
        
        {/* Status Animated Icon Wrapper */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <div className="transition-all duration-500">
            {status === 'valid' && (
              <CheckCircle2 className="text-emerald-500 animate-in zoom-in-50 duration-300" size={28} />
            )}
            {status === 'invalid' && (
              <ShieldAlert className="text-rose-500 animate-in shake duration-300" size={28} />
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 relative">
        <div className={`flex items-start gap-3 p-4 rounded-xl transition-all duration-300 border
          ${status === 'idle' ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400' : ''}
          ${status === 'incomplete' || status === 'verifying' ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/50 text-blue-700 dark:text-blue-400' : ''}
          ${status === 'valid' ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400' : ''}
          ${status === 'invalid' ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/50 text-rose-700 dark:text-rose-400' : ''}
        `}>
          <div className="mt-0.5 animate-in fade-in slide-in-from-left-2">
            {status === 'idle' && <Info size={18} />}
            {status === 'incomplete' && <Loader2 className="animate-spin" size={18} />}
            {status === 'valid' && <ShieldCheck size={18} />}
            {status === 'invalid' && <ShieldAlert size={18} />}
          </div>
          <div className="text-sm font-medium leading-relaxed">
            {status === 'idle' && 'Please enter your unique 12-digit Fayda National ID to verify its authenticity.'}
            {status === 'incomplete' && `Keep typing... (${faydaId.length}/12 digits entered)`}
            {status === 'verifying' && 'Communicating with the national ID service...'}
            {status === 'valid' && 'Success! This Fayda ID passes mathematical verification and appears to be globally valid.'}
            {status === 'invalid' && 'Warning: This Fayda ID failed the checksum validation. Please check for typos or incorrect digits.'}
          </div>
        </div>
      </div>
    </div>
  );
}

// Add a simple fallback for Next/Vite missing 'Loader2' from lucide if needed
function Loader2({ className, size }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} height={size} 
      viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
      className={className}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  );
}
