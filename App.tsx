import React, { useState, useEffect, useCallback } from 'react';
import { GenderData } from './types';
import { StatsCard } from './components/StatsCard';
import { GenderChart } from './components/GenderChart';

// SVGs as components
const MaleSymbol = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="10" cy="10" r="5" />
        <path d="M13.5 6.5l5 -5" />
        <path d="M19 4v-2.5" />
        <path d="M19 1.5h-2.5" />
        <path d="M16 4l3 -3" />
    </svg>
);
const FemaleSymbol = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="10" r="5" />
        <path d="M12 15v6" />
        <path d="M9 18h6" />
    </svg>
);
const UnknownSymbol = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SAMPLE_DATA = `Nữ
Nữ
Nữ
Nam
Nam
Nữ
Nữ
Nữ
Nữ
Nam
Nữ`;

export default function App() {
  const [inputText, setInputText] = useState<string>('');
  const [stats, setStats] = useState<GenderData>({ male: 0, female: 0, unknown: 0, total: 0 });

  // Simple local regex matching
  const performSimpleAnalysis = useCallback((text: string) => {
    if (!text.trim()) {
      setStats({ male: 0, female: 0, unknown: 0, total: 0 });
      return;
    }

    const lines = text.split(/\n+/);
    let m = 0;
    let f = 0;
    let u = 0;

    lines.forEach(line => {
      const trimmed = line.trim().toLowerCase();
      if (!trimmed) return;
      
      // Simple keyword matching
      // Handles: Nam, nam, Male, Trai
      if (trimmed === 'nam' || trimmed === 'male' || trimmed === 'trai') {
        m++;
      } 
      // Handles: Nữ, nữ, Nu, nu, Female, Gái
      else if (trimmed === 'nữ' || trimmed === 'nu' || trimmed === 'female' || trimmed === 'gái') {
        f++;
      } else {
        u++;
      }
    });

    setStats({
      male: m,
      female: f,
      unknown: u,
      total: m + f + u
    });
  }, []);

  // Effect to auto-analyze using simple mode when typing
  useEffect(() => {
    performSimpleAnalysis(inputText);
  }, [inputText, performSimpleAnalysis]);

  const handleLoadSample = () => {
    setInputText(SAMPLE_DATA);
  };

  const handleClear = () => {
    setInputText('');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Thống Kê <span className="text-blue-600">Nam</span> & <span className="text-pink-600">Nữ</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Nhập danh sách (mỗi dòng một người) để đếm số lượng.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Input */}
          <div className="flex flex-col space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <label htmlFor="input-data" className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  Dữ liệu đầu vào
                </label>
                <div className="space-x-2">
                  <button 
                    onClick={handleLoadSample}
                    className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
                  >
                    Dữ liệu mẫu
                  </button>
                  <button 
                    onClick={handleClear}
                    className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors px-2 py-1 rounded bg-red-50 hover:bg-red-100"
                  >
                    Xóa
                  </button>
                </div>
              </div>
              
              <textarea
                id="input-data"
                className="flex-grow w-full p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none font-mono text-sm bg-slate-50 transition-all min-h-[300px]"
                placeholder={`Nhập dữ liệu tại đây, mỗi dòng một người...\nVí dụ:\nNam\nNữ\nNam...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />

              <div className="mt-4 flex items-center justify-center text-slate-400 text-sm">
                 <span className="flex items-center">
                    <span className="relative flex h-3 w-3 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    Tự động cập nhật kết quả
                 </span>
              </div>
            </div>
          </div>

          {/* Right Column: Stats & Chart */}
          <div className="space-y-6">
            
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatsCard 
                title="Nam" 
                count={stats.male} 
                total={stats.total} 
                colorClass="bg-blue-500 text-blue-600"
                icon={<MaleSymbol />}
              />
              <StatsCard 
                title="Nữ" 
                count={stats.female} 
                total={stats.total} 
                colorClass="bg-pink-500 text-pink-600"
                icon={<FemaleSymbol />}
              />
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <StatsCard 
                  title="Tổng Cộng" 
                  count={stats.total} 
                  total={stats.total} 
                  colorClass="bg-slate-800 text-slate-800"
                  icon={
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  }
                />
                 <StatsCard 
                  title="Khác" 
                  count={stats.unknown} 
                  total={stats.total} 
                  colorClass="bg-gray-400 text-gray-500"
                  icon={<UnknownSymbol />}
                />
             </div>

            {/* Chart Area */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Biểu đồ phân bố</h3>
              <GenderChart data={stats} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}