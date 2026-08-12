"use client";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";
import Brand from "../components/visitor/Brand";
import BrandFooter from "../components/visitor/BrandFooter";
import { QrCode, ArrowRight } from "lucide-react";
export default function Home() {
  const url =
    process.env.NEXT_PUBLIC_VISITOR_URL || "http://localhost:3000/visit";
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="container-card max-w-xl text-center">
        <Brand />
        <div className="mt-8">
          <div className="inline-flex items-center gap-2 text-purple-800 font-bold text-lg">
            <QrCode /> Visitor Check-In
          </div>
          <p className="text-slate-500 mt-2">
            Scan the QR code with your phone camera to check in.
          </p>
          <div className="bg-white inline-flex p-5 rounded-2xl shadow border border-slate-100 mt-6">
            <QRCodeSVG value={url} size={240} includeMargin />
          </div>
          <p className="font-bold text-slate-700 mt-4">Scan to Check In</p>
          {/* <p className="text-xs text-slate-400 mt-1 break-all">{url}</p> */}
          {/* <Link
            href="/visit"
            className="inline-flex orange-btn items-center gap-2 mt-6"
          >
            Continue to Check In <ArrowRight size={18} />
          </Link> */}
        </div>
        <BrandFooter />
      </div>
    </main>
  );
}
