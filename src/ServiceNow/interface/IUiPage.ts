import { ISysMetadata } from "../all";
import { IWorkspaceConvertable } from "../../Manager/all";

export interface IUiPage extends ISysMetadata, IWorkspaceConvertable
{
    client_script: string;
    description: string;
    name: string;
    html: string;
    category: string;
    processing_script: string;
}