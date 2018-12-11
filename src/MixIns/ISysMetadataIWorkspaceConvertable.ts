import { ISysMetadata } from "../ServiceNow/all";
import { IWorkspaceConvertable } from "../Manager/all";

export interface ISysMetadataIWorkspaceConvertable extends ISysMetadata, IWorkspaceConvertable
{ }