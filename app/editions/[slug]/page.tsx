import Matchstick from '../../../components/matchstick';
import rawEditions from '../../../lib/published-editions.json';
const editions=rawEditions as {slug:string}[];
import {notFound} from 'next/navigation';
import previewIssue from '../../../lib/preview-issue.json';
export function generateStaticParams(){return [...editions.map(e=>({slug:e.slug})),...(!editions.some(e=>e.slug===previewIssue.slug)?[{slug:previewIssue.slug}]:[])];}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return {title:`Edition · ${slug}`};}
export default async function Edition({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!editions.some(e=>e.slug===slug)&&slug!==previewIssue.slug)notFound();return <Matchstick section="archived-edition" slug={slug}/>;}
