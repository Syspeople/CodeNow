import { ISysMetadata } from "../all";
import { IWorkspaceConvertable } from "../../Manager/all";

export interface ISysUiScript extends ISysMetadata, IWorkspaceConvertable
{
    active: boolean;
    description: string;
    use_scoped_format: boolean;
    global: false;
    script_name: string;
    script: string;
    name: string;
}