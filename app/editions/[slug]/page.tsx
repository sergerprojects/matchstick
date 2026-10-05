import Matchstick from '../../../components/matchstick';
import {notFound} from 'next/navigation';
import previewIssue from '../../../lib/preview-issue.json';
export function generateStaticParams(){return [{slug:previewIssue.slug}];}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return {title:`Edition · ${slug}`};}
export default async function Edition({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!/^\d{4}-\d{2}-\d{2}$/.test(slug))notFound();return <Matchstick section="archived-edition" slug={slug}/>;}
