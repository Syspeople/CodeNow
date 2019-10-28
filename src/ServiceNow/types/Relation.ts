import { IRelation } from '../all';
//related serviceNow entity
export class Relation implements IRelation
{
    constructor(r: IRelation)
    {
        this.link = r.link;
        this.value = r.value;
    }
    link: string;
    value: string;
}