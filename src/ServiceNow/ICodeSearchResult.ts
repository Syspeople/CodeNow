import { ICodeSearchHit } from "./all";

export interface ICodeSearchResult
{
    recordType: string;
    hits: Array<ICodeSearchHit>;
}