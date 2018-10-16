// //import { ISysMetadata, Record, Instance, ISysScriptInclude } from "../ServiceNow/all";
// //import { Uri, ExtensionContext, workspace, WorkspaceFolder } from 'vscode';

// //class for storing options and file references in local cache.
// export class RecordOptions extends Record implements ISysMetadata
// {
//     /**
//      * 
//      * @param record record object
//      * @param path Root Path for record.
//      */
//     constructor(record: ISysMetadata, instance: Instance, context: ExtensionContext)
//     {
//         super(record);

//         this.SetDelimiter(context);

//         //record type root.
//         let recordPath = Uri.parse(this.GetPathRecord(record, instance));
//         //record specific root.
//         let MetaDir: string;
//         //name of the record
//         let recordName: string;


//         switch (record.sys_class_name)
//         {
//             case "sys_script_include":
//                 recordName = (<ISysScriptInclude>record).name;
//                 this._files.push(this.GetPathRecordScript(recordPath, recordName));
//                 break;
//             case "sp_widget":

//                 break;
//             case "sp_theme":

//                 break;
//             case "sp_css":

//                 break;
//             default:
//                 console.warn(`RecordOptions: Record ${record.sys_class_name} not recognized`);
//                 break;
//         }
//     }

//     private _delimiter: string | undefined;
//     private _files: Array<Uri> = [];
//     public get files(): Array<Uri>
//     {
//         return this._files;
//     }

//     private GetPathInstance(i: Instance): string | undefined
//     {
//         let workspaceRoot = this.GetPathWorkspace();

//         if (workspaceRoot && i.Url)
//         {
//             let path = `${workspaceRoot.uri.fsPath}${this._delimiter}${i.Url.host}`;
//             return path;
//         }
//     }

//     /**returns the designated main path in workspace for any given record type */
//     private GetPathRecord<T extends ISysMetadata>(record: T, instance: Instance)
//     {
//         let p = this.GetPathInstance(instance);
//         return `${p}${this._delimiter}${record.sys_class_name}`;
//     }


//     private GetPathParent(Uri: Uri): string
//     {
//         let nameLength = this.GetFileName(Uri).length;
//         return Uri.fsPath.substring(0, Uri.fsPath.length - nameLength - 1);
//     }

//     private GetFileName(Uri: Uri): string
//     {
//         let split = Uri.fsPath.split(`${this._delimiter}`);
//         return split[split.length - 1];
//     }

//     private GetPathRecordScript(uri: Uri, recordName: string): Uri
//     {
//         return Uri.file(`${uri.fsPath}${this._delimiter}${recordName.split('.')[0]}.server_script.js`);
//     }

//     private GetPathRecordClientScript(uri: Uri): string
//     {
//         let parentPath = this.GetPathParent(uri);

//         let recordName = this.GetFileName(uri);

//         return `${parentPath}${this._delimiter}${recordName.split('.')[0]}.client_script.js`;
//     }

//     //returns the path of hte option.json that should reside in same dir. 
//     private GetPathRecordOptions(uri: Uri): string
//     {
//         let parentPath = this.GetPathParent(uri);

//         let recordName = this.GetFileName(uri);

//         return `${parentPath}${this._delimiter}${recordName.split('.')[0]}.options.json`;
//     }

//     private GetPathRecordCss(uri: Uri): string
//     {
//         let parentPath = this.GetPathParent(uri);

//         let recordName = this.GetFileName(uri);

//         return `${parentPath}${this._delimiter}${recordName.split('.')[0]}.scss`;
//     }

//     private GetPathRecordHtmlTemplate(uri: Uri): string
//     {
//         let parentPath = this.GetPathParent(uri);

//         let recordName = this.GetFileName(uri);

//         return `${parentPath}${this._delimiter}${recordName.split('.')[0]}.html`;
//     }

//     private GetPathWorkspace(): WorkspaceFolder | undefined
//     {
//         if (this.HasWorkspace)
//         {
//             if (workspace.workspaceFolders !== undefined)
//             {
//                 let workspaceRoot = workspace.workspaceFolders[0];
//                 return workspaceRoot;
//             }
//         }
//     }
//     private SetDelimiter(context: ExtensionContext)
//     {
//         let storagePath = context.storagePath;

//         if (storagePath)
//         {
//             if (storagePath.includes("/"))
//             {
//                 this._delimiter = "/";
//             }
//             else
//             {
//                 this._delimiter = "\\";
//             }
//         }
//     }
//     private HasWorkspace(): boolean
//     {
//         if (workspace.name !== undefined)
//         {
//             return true;
//         }
//         else
//         {
//             return false;
//         }
//     }
// }