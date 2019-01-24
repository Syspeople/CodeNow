import { ISysMetadata } from "../ServiceNow/all";
import { KeyValuePair, FileTypes } from "./all";
import { Uri } from "vscode";


export interface ILocalMetaData extends ISysMetadata
{
    Files: Array<KeyValuePair<FileTypes, Uri>>;
    RecordName: string;
    basePath: Uri;
    instanceName: string;
}