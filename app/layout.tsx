import type { Metadata } from 'next';
import { DM_Sans, Newsreader } from 'next/font/google';
import './globals.css';
const sans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' });
const serif = Newsreader({ subsets: ['latin'], variable: '--font-serif' });
export const metadata: Metadata = { title: { default: 'Matchstick — A little light on Wadsworth.', template: '%s · Matchstick' }, description: 'An independent public-service guide to Wadsworth government, schools, projects and everyday life. Original records. Clear explanations.' };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en" className={`${sans.variable} ${serif.variable}`}><body>{children}</body></html>; }
