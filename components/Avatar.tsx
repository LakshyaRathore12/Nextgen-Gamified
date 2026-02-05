import React from 'react';

interface AvatarProps {
  color: string;
  eyes: string;
  mouth: string;
  accessory: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ color, eyes, mouth, accessory, className = "w-48 h-48" }) => {
  
  const renderEyes = () => {
    const baseEye = "absolute top-[35%] w-[20%] h-[20%] bg-white rounded-full transition-all duration-300 shadow-sm";
    const pupil = <div className="absolute top-1/4 right-1/4 w-[40%] h-[40%] bg-slate-900 rounded-full"></div>;

    switch(eyes) {
      case 'Happy':
        return (
          <>
             <div className="absolute top-[40%] left-[20%] w-[20%] h-[12%] border-t-[4px] md:border-t-[6px] border-white rounded-t-full"></div>
             <div className="absolute top-[40%] right-[20%] w-[20%] h-[12%] border-t-[4px] md:border-t-[6px] border-white rounded-t-full"></div>
          </>
        );
      case 'Wink':
        return (
          <>
             <div className={`${baseEye} left-[20%]`}>{pupil}</div>
             <div className="absolute top-[42%] right-[20%] w-[20%] h-[4%] bg-white rounded-full"></div>
          </>
        );
      case 'Cyclops':
        return (
           <div className="absolute top-[30%] left-[30%] w-[40%] h-[30%] bg-red-400 rounded-full border-4 border-white shadow-[0_0_15px_rgba(248,113,113,0.8)] flex items-center justify-center">
             <div className="w-[30%] h-[30%] bg-black rounded-full"></div>
           </div>
        );
      case 'Sunglasses':
         return (
            <div className="absolute top-[32%] left-[15%] w-[70%] h-[22%] flex gap-1 z-10">
                <div className="flex-1 bg-black rounded-l-full rounded-r-md border-t-2 border-slate-700 opacity-90">
                   <div className="w-[30%] h-[30%] bg-white/20 rounded-full m-1"></div>
                </div>
                <div className="w-[5%] bg-black mt-2 h-[20%]"></div>
                <div className="flex-1 bg-black rounded-r-full rounded-l-md border-t-2 border-slate-700 opacity-90"></div>
            </div>
         );
      case 'Robo-Visor':
        return (
            <div className="absolute top-[35%] left-[10%] w-[80%] h-[15%] bg-gradient-to-r from-red-600 via-yellow-400 to-red-600 rounded-sm shadow-[0_0_15px_rgba(239,68,68,0.6)] flex items-center">
                <div className="w-full h-[2px] bg-white/50"></div>
            </div>
        );
      case 'Lashes':
        return (
            <>
                <div className={`${baseEye} left-[20%]`}>
                  {pupil}
                  <div className="absolute -top-1 -left-1 w-2 h-2 border-l-2 border-t-2 border-white rounded-tl-lg"></div>
                </div>
                <div className={`${baseEye} right-[20%]`}>
                  {pupil}
                  <div className="absolute -top-1 -right-1 w-2 h-2 border-r-2 border-t-2 border-white rounded-tr-lg"></div>
                </div>
            </>
        );
      default: // Normal
        return (
            <>
                <div className={`${baseEye} left-[20%]`}>{pupil}</div>
                <div className={`${baseEye} right-[20%]`}>{pupil}</div>
            </>
        );
    }
  };

  const renderMouth = () => {
     switch(mouth) {
         case 'Grin':
             return (
               <div className="absolute bottom-[20%] left-[30%] w-[40%] h-[12%] bg-white rounded-lg border-2 border-slate-300 overflow-hidden flex">
                  <div className="flex-1 border-r border-slate-300"></div>
                  <div className="flex-1 border-r border-slate-300"></div>
                  <div className="flex-1 border-r border-slate-300"></div>
                  <div className="flex-1"></div>
               </div>
             );
         case 'O-Face':
             return <div className="absolute bottom-[20%] left-[40%] w-[20%] h-[20%] bg-black rounded-full border-[3px] border-white"></div>;
         case 'Tongue':
             return (
                 <div className="absolute bottom-[22%] left-[30%] w-[40%] h-[5%] bg-black rounded-full overflow-visible z-10">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[40%] h-[400%] bg-red-500 rounded-b-full border-2 border-black"></div>
                 </div>
             );
         case 'Neutral':
             return <div className="absolute bottom-[25%] left-[35%] w-[30%] h-[3%] bg-white rounded-full shadow-sm"></div>;
         case 'Teeth':
              return (
                <div className="absolute bottom-[22%] left-[32%] w-[36%] h-[10%] bg-white rounded-sm border border-slate-400 flex">
                   {[1,2,3,4].map(i => <div key={i} className="flex-1 border-r border-slate-300"></div>)}
                </div>
              );
         case 'Moustache':
             return (
                 <>
                  <div className="absolute bottom-[25%] left-[35%] w-[30%] h-[2%] bg-white rounded-full"></div>
                  <div className="absolute bottom-[28%] left-[25%] w-[50%] h-[8%] bg-slate-800 rounded-full"></div>
                 </>
             );
         default: // Smile
             return <div className="absolute bottom-[22%] left-[25%] w-[50%] h-[12%] border-b-[4px] md:border-b-[6px] border-white rounded-[50%]"></div>;
     }
  };

  const renderAccessory = () => {
    switch(accessory) {
        case 'Headphones':
            return (
                <>
                    <div className="absolute top-[25%] -left-[5%] w-[15%] h-[40%] bg-slate-800 rounded-xl border-2 border-slate-600 z-20"></div>
                    <div className="absolute top-[25%] -right-[5%] w-[15%] h-[40%] bg-slate-800 rounded-xl border-2 border-slate-600 z-20"></div>
                    <div className="absolute -top-[12%] left-[10%] w-[80%] h-[50%] border-t-[8px] border-slate-800 rounded-t-[30px] z-0"></div>
                </>
            );
        case 'Antenna':
             return (
                 <div className="absolute -top-[25%] left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-0">
                     <div className="w-[15%] aspect-square bg-red-500 rounded-full shadow-[0_0_10px_red]"></div>
                     <div className="w-[4px] h-[30px] bg-slate-400"></div>
                 </div>
             );
        case 'Crown':
            return (
               <div className="absolute -top-[18%] left-[25%] w-[50%] h-[25%] z-20">
                   <svg viewBox="0 0 100 50" className="w-full h-full fill-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]">
                       <polygon points="0,50 20,0 40,50 60,0 80,50 100,0 100,50" />
                   </svg>
               </div>
            );
        case 'Glasses':
            return (
                <div className="absolute top-[32%] left-[15%] w-[70%] h-[25%] z-20 flex gap-2 items-center">
                    <div className="flex-1 aspect-square rounded-full border-4 border-black bg-white/10"></div>
                    <div className="w-[10%] h-[2px] bg-black"></div>
                    <div className="flex-1 aspect-square rounded-full border-4 border-black bg-white/10"></div>
                </div>
            );
        case 'Cap':
             return (
                 <div className="absolute -top-[5%] left-0 w-full h-[40%] bg-blue-600 rounded-t-full z-20 border-b-4 border-blue-800">
                     <div className="absolute bottom-0 right-[-10%] w-[40%] h-[20%] bg-blue-600 rounded-r-lg skew-x-12 border-b-4 border-blue-800"></div>
                 </div>
             );
        case 'Scarf':
            return (
                <div className="absolute bottom-[-5%] left-[10%] w-[80%] h-[20%] bg-red-500 rounded-lg z-20 shadow-lg flex items-center justify-center text-white/20 text-xs">
                    <div className="w-full border-t-2 border-dashed border-red-700 mt-1"></div>
                </div>
            );
        default: return null;
    }
  }

  return (
    <div 
      className={`rounded-full border-[3px] md:border-8 border-white shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 relative bg-slate-900 mx-auto overflow-visible ${className}`}
      style={{ backgroundColor: color }}
    >
      {renderAccessory()}
      {renderEyes()}
      {renderMouth()}
    </div>
  );
};