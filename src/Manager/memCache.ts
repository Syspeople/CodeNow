export class memCache
{
    constructor()
    {

    }

    private _values = new Array<KeyValuePair>();

    /**
     * Get
     */
    public Get<T>(key: string): T | undefined
    {
        var exist = this.gotKey(key);

        if (exist)
        {
            return <T>exist.value;
        }
        return;
    }

    public Set(key: string, value: any): void
    {
        var exist = this.gotKey(key);

        var kv = new KeyValuePair(key, value);

        if (exist)
        {
            var index = this._values.indexOf(exist);
            this._values[index] = kv;
        }
        else
        {
            this._values.push(kv);
        }
    }

    private gotKey(key: string): KeyValuePair | undefined
    {
        return this._values.find((item) =>
        {
            return item.key === key;
        });

    }
}

class KeyValuePair
{
    constructor(key: string, value: any)
    {
        this.key = key;
        this.value = value;
    }
    key: string;
    value: any;
}