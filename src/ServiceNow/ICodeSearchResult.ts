import { ICodeSearchHit } from "./all";

/**
 * Contains results from a search for a given record type.
 */
export interface ICodeSearchResult
{
    recordType: string;
    hits: Array<ICodeSearchHit>;
}