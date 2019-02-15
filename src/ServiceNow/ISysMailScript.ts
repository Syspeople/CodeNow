import { ISysMetadata } from "./all";
import { IWorkspaceConvertable } from "../Manager/all";

export interface ISysMailScript extends ISysMetadata, IWorkspaceConvertable
{
    script: string;
    name: string;
}