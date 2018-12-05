//super basic key value pair.
export class KeyValuePair<T, X>
{
    constructor(key: T, value: X)
    {
        this.key = key;
        this.value = value;
    }
    key: T;
    value: X;
}