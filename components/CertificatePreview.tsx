import React, { useRef } from 'react';
import { Button } from './Button';
import { Download } from 'lucide-react';
// @ts-ignore
import jsPDF from 'jspdf';
// @ts-ignore
import html2canvas from 'html2canvas';

interface CertificatePreviewProps {
  userName: string;
  courseName: string;
  date: string;
  onClose: () => void;
}

export const CertificatePreview: React.FC<CertificatePreviewProps> = ({ userName, courseName, date, onClose }) => {
  const certRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!certRef.current) return;
    
    const canvas = await html2canvas(certRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape, A4
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
    
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save(`NextGen_Certificate_${courseName}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
       <div className="flex flex-col gap-6 w-full max-w-4xl">
          <div className="flex justify-between items-center text-white">
             <h3 className="text-2xl font-bold">Certificate Preview</h3>
             <Button variant="secondary" onClick={onClose}>Close</Button>
          </div>

          {/* Certificate Design */}
          <div ref={certRef} className="bg-slate-900 border-[10px] border-yellow-500 p-10 relative overflow-hidden shadow-2xl text-center aspect-[1.414/1]">
             {/* Background Elements */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             <div className="absolute top-0 left-0 w-32 h-32 border-t-[4px] border-l-[4px] border-yellow-500 rounded-tl-3xl"></div>
             <div className="absolute bottom-0 right-0 w-32 h-32 border-b-[4px] border-r-[4px] border-yellow-500 rounded-br-3xl"></div>
             
             {/* Content */}
             <div className="relative z-10 flex flex-col items-center justify-center h-full border-4 border-yellow-500/30 p-8 rounded-2xl">
                 <div className="text-yellow-500 text-6xl mb-4">🏆</div>
                 
                 <h1 className="text-5xl font-black text-white uppercase tracking-widest mb-2 font-serif">Certificate</h1>
                 <h2 className="text-2xl text-yellow-500 uppercase tracking-widest mb-10">Of Completion</h2>
                 
                 <p className="text-slate-400 text-lg mb-4">This certifies that</p>
                 <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2 border-b-2 border-slate-700 pb-2 px-10">
                    {userName}
                 </div>
                 
                 <p className="text-slate-400 text-lg mb-4 mt-8">Has successfully mastered the curriculum for</p>
                 <div className="text-3xl font-black text-white uppercase tracking-wider mb-12">
                    {courseName}
                 </div>

                 <div className="flex justify-between w-full max-w-2xl px-10 mt-auto">
                    <div className="text-center">
                       <div className="text-slate-500 font-mono mb-2">{date}</div>
                       <div className="h-[1px] w-32 bg-slate-600 mb-2"></div>
                       <div className="text-xs text-slate-400 uppercase">Date</div>
                    </div>
                    <div className="text-center">
                       <div className="text-indigo-400 font-black font-mono mb-2 text-xl italic">NextBot AI</div>
                       <div className="h-[1px] w-32 bg-slate-600 mb-2"></div>
                       <div className="text-xs text-slate-400 uppercase">Instructor</div>
                    </div>
                 </div>
             </div>
          </div>

          <Button size="lg" variant="success" onClick={handleDownload} className="w-full">
             <Download className="mr-2" /> Download Official PDF
          </Button>
       </div>
    </div>
  );
};