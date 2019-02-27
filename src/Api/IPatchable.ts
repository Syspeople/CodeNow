//interface for records that can be patched via the API

export interface IPatchable
{
    /**
     * returns and object containing the objects that should be patched via the API manager.
     */
    GetPatchable(): Object;
}