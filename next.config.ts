import type {NextConfig} from 'next';
const pages=process.env.MATCHSTICK_PAGES==='true';
const config: NextConfig={
 turbopack:{root:process.cwd()},
 devIndicators:false,
 ...(pages?{output:'export' as const,basePath:process.env.NEXT_PUBLIC_BASE_PATH||'/matchstick',trailingSlash:true,images:{unoptimized:true}}:{}),
};
export default config;
