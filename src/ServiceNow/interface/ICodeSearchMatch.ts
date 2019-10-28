import { ICodeSearchLineMatch } from "../all";

export interface ICodeSearchMatch
{
    field: string;
    fieldLabel: string;
    lineMatches: Array<ICodeSearchLineMatch>;
    count: number;
}