/**
 * Minimal required attributes to find any given record in ServiceNow.
 */
export interface IIdentifiable
{
    sys_class_name: string;
    sys_id: string;
}