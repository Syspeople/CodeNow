import { ISysMetadata } from "./all";
import { IWorkspaceConvertable } from "../Manager/all";

export interface ISysEventScriptAction extends ISysMetadata, IWorkspaceConvertable
{
    condition_script: string;
    active: boolean;
    description: string;
    script: string;
    name: string;
    event_name: string;
    order: number;
}