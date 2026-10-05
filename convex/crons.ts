import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';
const crons=cronJobs();
crons.daily('collect original city records',{hourUTC:8,minuteUTC:15},internal.automation.daily,{});
crons.weekly('publish the weekly paper',{dayOfWeek:'monday',hourUTC:10,minuteUTC:0},internal.automation.weekly,{});
export default crons;
