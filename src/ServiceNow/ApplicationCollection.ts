import { Application } from "./all";

export class ApplicationCollection
{
    constructor(a: ApplicationCollection)
    {
        this.current = a.current;
        this.list = new Array<Application>();

        a.list.forEach((element) =>
        {
            this.list.push(new Application(element));
        });
    }
    current: string;
    list: Array<Application>;
}