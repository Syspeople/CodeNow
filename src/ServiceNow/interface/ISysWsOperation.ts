import { ISysMetadata, Relation } from "../all";
import { IWorkspaceConvertable } from "../../Manager/all";

export interface ISysWsOperation extends ISysMetadata, IWorkspaceConvertable
{
    web_service_version: Relation;
    web_service_definition: Relation;
    active: boolean;
    name: string;
    relative_path: string;
    description: string;
    operation_script: string;
    http_method: string;
    operation_uri: string;
}