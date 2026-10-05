import Matchstick from '../../../components/matchstick';
import archive from '../../../lib/story-archive.json';
import {notFound} from 'next/navigation';
export function generateStaticParams(){return archive.map(s=>({slug:s.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const story=archive.find(s=>s.slug===slug);return {title:story?.title,description:story?.dek};}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!archive.some(s=>s.slug===slug))notFound();return <Matchstick section="story" slug={slug}/>;}
