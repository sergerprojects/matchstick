import Matchstick from '../../components/matchstick';
import { notFound } from 'next/navigation';
const sections=['projects','schools','representatives','bills','around-town','safety','edition','edition-preview','sources','saved'];
export function generateStaticParams(){return sections.map(section=>({section}));}
export async function generateMetadata({params}:{params:Promise<{section:string}>}){const {section}=await params;return {title:section.split('-').map(s=>s[0].toUpperCase()+s.slice(1)).join(' ')};}
export default async function Section({params}:{params:Promise<{section:string}>}){const {section}=await params;if(!sections.includes(section))notFound();return <Matchstick section={section}/>;}
