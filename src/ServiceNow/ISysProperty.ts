import { ISysMetadata } from './all';
export interface ISysProperty extends ISysMetadata
{
    name: string;
    value: string;
    type: boolean;
}