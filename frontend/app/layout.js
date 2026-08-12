import './globals.css';
import { Toaster } from 'react-hot-toast';
export const metadata={title:'Visitor Check-In | OrangeMantra',description:'Visitor check-in application'};
export default function RootLayout({children}){return <html lang="en"><body>{children}<Toaster position="top-right"/></body></html>}
