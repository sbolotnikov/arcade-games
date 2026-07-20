import{EntryEditLoader}from'@/components/journal/EntryLoaders';export default async function Page({params}:{params:Promise<{id:string}>}){return <EntryEditLoader id={(await params).id}/>}
