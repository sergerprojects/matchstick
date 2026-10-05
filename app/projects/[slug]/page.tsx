import Matchstick from '../../../components/matchstick';
import { projects } from '../../../lib/data';
import { notFound } from 'next/navigation';
export function generateStaticParams(){return projects.map(p=>({slug:p.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return {title:projects.find(p=>p.slug===slug)?.name||'Project'};}
export default async function Project({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!projects.some(p=>p.slug===slug))notFound();return <Matchstick section="project" slug={slug}/>;}
