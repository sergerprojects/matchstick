import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
const sans=localFont({src:'./fonts/Libre-Franklin-variable.ttf',variable:'--font-sans',weight:'100 900',display:'swap'});
const serif=localFont({src:'./fonts/Libre-Caslon-Text-variable.ttf',variable:'--font-serif',weight:'400 700',display:'swap'});
const base=process.env.NEXT_PUBLIC_BASE_PATH||'';
export const metadata:Metadata={metadataBase:new URL('https://sergerprojects.github.io'),title:{default:'Matchstick — Boring stuff. With a little spark.',template:'%s · Matchstick'},description:"An independent guide to Wadsworth's public decisions and everyday life.",icons:{icon:base+'/brand/matchstick-favicon.svg'},openGraph:{images:[{url:base+'/brand/social-card.png',width:1200,height:630,alt:'Matchstick · Wadsworth, Ohio'}]}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en" className={`${sans.variable} ${serif.variable}`}><body>{children}</body></html>;}
