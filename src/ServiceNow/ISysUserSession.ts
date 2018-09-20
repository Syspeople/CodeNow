import { ISysMetadata } from "./all";

export interface ISysUserSession extends ISysMetadata
{
    csrf_token: string;
    id: string;
}