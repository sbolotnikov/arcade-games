export type EncryptedPayload={version:1;algorithm:"AES-GCM";keyDerivation:"PBKDF2";hash:"SHA-256";iterations:number;salt:string;iv:string;ciphertext:string};
export type CoverPosition={x:number;y:number;zoom:number};
export type JournalEntry={id:string;schemaVersion:1;title:string;subtitle?:string;entryDate:string;location?:string;html:string;editorState?:unknown;excerpt:string;coverAssetId?:string;coverPosition?:CoverPosition;coverLayout:"classic"|"botanical"|"noir";assetIds:string[];tags:string[];favorite:boolean;locked:boolean;privacy:"metadata"|"private";hasAudio:boolean;encryptedPayload?:EncryptedPayload;createdAt:string;updatedAt:string};
export type JournalAsset={id:string;entryId:string;kind:"image"|"audio"|"cover";name:string;mimeType:string;size:number;blob:Blob;caption?:string;alt?:string;duration?:number;createdAt:string};
export type JournalSettings={id:"settings";theme:"light"|"dark"|"system";pbkdf2Iterations:number;autoRelockMinutes:number;lastBackupAt?:string};
export type BackupFile={schemaVersion:1;exportedAt:string;entries:JournalEntry[];assets:Array<Omit<JournalAsset,"blob">&{dataUrl:string}>;settings?:JournalSettings};
