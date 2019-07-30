import { Relation, IIdentifiable } from './all';

//Interface declaring fields used from sys_metadata
export interface ISysMetadata extends IIdentifiable
{
    sys_policy: string;
    sys_updated_on: Date;
    sys_created_on: Date;
    sys_package: Relation;
    sys_scope: Relation;

    canWrite: boolean;
    canRead: boolean;
}