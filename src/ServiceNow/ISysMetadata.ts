import { Relation } from './all';

//Interface declaring fields used from sys_metadata
export interface ISysMetadata
{
    sys_class_name: string;
    sys_id: string;
    sys_policy: string;
    sys_updated_on: Date;
    sys_created_on: Date;
    sys_package: Relation;
    sys_scope: Relation;
}