export async function blobToDataUrl(blob:Blob){return new Promise<string>((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result));r.onerror=()=>rej(r.error);r.readAsDataURL(blob)})}
export async function dataUrlToBlob(dataUrl:string){const r=await fetch(dataUrl);return r.blob()}
export function bestAudioMimeType(){if(typeof MediaRecorder==="undefined")return"";return["audio/webm;codecs=opus","audio/webm","audio/mp4","audio/ogg;codecs=opus"].find(t=>MediaRecorder.isTypeSupported(t))||""}
export function formatBytes(n:number){return new Intl.NumberFormat(undefined,{notation:"compact",maximumFractionDigits:1}).format(n)+"B"}
export function revokeUrl(url?:string){if(url?.startsWith("blob:"))URL.revokeObjectURL(url)}
