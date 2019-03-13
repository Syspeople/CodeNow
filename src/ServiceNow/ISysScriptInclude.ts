import { ISysMetadata } from "./all";
import { IWorkspaceConvertable } from "../Manager/all";

export interface ISysScriptInclude extends ISysMetadata, IWorkspaceConvertable
{
    client_callable: boolean;
    access: string;
    active: boolean;
    description: string;
    script: string;
    api_name: string;
    name: string;
}
