import { Facebook, Linkedin, Youtube } from "lucide-react";
export default function BrandFooter() {
  return (
    <div className="social-line text-center">
      <div className="text-xs text-slate-400 tracking-wider font-semibold">
        FOLLOW US ON
      </div>
      <div className="flex justify-center gap-5 mt-3 text-slate-500">
        <Facebook size={22} fill="currentColor" />
        <Linkedin size={22} fill="currentColor" />
        <Youtube size={23} />
      </div>
    </div>
  );
}
