import Form from './form'; export const metadata={title:'Sign in'};
export default async function Page({searchParams}){ const {next}=await searchParams; return <Form next={typeof next==='string'?next:''}/>; }
