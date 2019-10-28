import { ISysMetadata } from "../all";
import { IWorkspaceConvertable } from "../../Manager/all";

export interface ISysProcessor extends ISysMetadata, IWorkspaceConvertable
{
    active: boolean;
    description: string;
    interactive: boolean;
    name: string;
    parameters: string;
    parameters_endpoint: string;
    path: string;
    path_endpoint: string;
    require_csrf: boolean;
    script: string;
    type: string;
}