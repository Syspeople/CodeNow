import { ISysMetadata } from "./all";
import { IWorkspaceConvertable } from "../Manager/all";
import { Relation } from "./Relation";

export interface ISysWsOperation extends ISysMetadata, IWorkspaceConvertable
{
    web_service_version: Relation;
    web_service_definition: Relation;
    active: boolean;
    name: string;
    relative_path: string;
    description: string;
    operation_script: string;
}