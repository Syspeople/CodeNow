import { ISysMetadata } from "../all";
import { IWorkspaceConvertable } from "../../Manager/all";

/**
 * Scripted rest Service
 */

export interface ISysWsDefinition extends ISysMetadata, IWorkspaceConvertable
{
    active: boolean;
    doc_link: string;
    is_versioned: false;
    base_uri: string;
    namespace: string;
    service_id: string;
    short_description: string;
}