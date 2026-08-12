'use client';
import {useRef,useState} from 'react';
import Webcam from 'react-webcam';
import {Camera,RotateCcw,Check,X} from 'lucide-react';
export default function CameraCapture({value,onChange,label='Capture Photo',required=true}){
 const webcamRef=useRef(null); const [active,setActive]=useState(false); const [error,setError]=useState('');
 const capture=()=>{const shot=webcamRef.current?.getScreenshot(); if(!shot)return; onChange(shot); setActive(false)};
 const clear=()=>{onChange('');setError('');setActive(false)};
 return <div className="flex flex-col items-center gap-3">
  {active?<div className="camera-frame w-full max-w-[340px]"><Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" videoConstraints={{facingMode:'user'}} onUserMediaError={()=>setError('Unable to access your camera. Please allow camera permission and try again.')} className="w-full aspect-[4/3] object-cover"/></div>:value?<div className="relative"><img src={value} alt="Captured visitor" className="w-28 h-28 rounded-full object-cover border-4 border-white shadow"/><button type="button" onClick={clear} className="absolute -right-2 -top-2 bg-white rounded-full shadow p-1 text-red-500"><X size={15}/></button></div>:<button type="button" onClick={()=>{setError('');setActive(true)}} className="w-28 h-28 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 hover:border-orange-300"><Camera size={26}/><span className="text-[10px] font-bold mt-2">CAMERA</span></button>}
  {active&&<div className="flex gap-2"><button type="button" onClick={capture} className="purple-btn flex items-center gap-1"><Check size={15}/> Capture</button><button type="button" onClick={()=>setActive(false)} className="soft-btn flex items-center gap-1"><X size={15}/> Cancel</button></div>}
  {!active&&!value&&<div className="text-xs text-slate-400">Tap to capture photo (Camera Only)</div>}
  {value&&!active&&<button type="button" onClick={()=>setActive(true)} className="soft-btn flex items-center gap-1"><RotateCcw size={14}/> Retake</button>}
  {required&&!value&&<div className="text-xs text-red-500">Photo is required</div>}
  {error&&<div className="error text-center max-w-xs">{error}</div>}
 </div>
}
