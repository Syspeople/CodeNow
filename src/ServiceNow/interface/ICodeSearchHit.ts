import { ICodeSearchMatch } from "../all";

export interface ICodeSearchHit
{
    name: string;
    className: string;
    tableLabel: string;
    matches: Array<ICodeSearchMatch>;
    sysId: string;
    modified: number;
}