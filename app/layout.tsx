import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'FixLens', description: 'Upload a home repair photo, get AI guidance, and offer a paid handyman review.' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><div className="container"><div className="header"><div><Link href="/"><strong>FixLens</strong></Link><div className="small">AI home repair triage + professional review</div></div><nav className="nav"><Link href="/">Home</Link><Link href="/upload">Upload</Link><Link href="/dashboard">Dashboard</Link></nav></div>{children}</div></body></html>;
}
