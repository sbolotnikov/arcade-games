import{EntryReader}from'@/components/journal/EntryLoaders';export default async function Page({params}:{params:Promise<{id:string}>}){return <EntryReader id={(await params).id}/>}
