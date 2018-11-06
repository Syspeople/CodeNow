import { KeyValuePair } from "./all";
import { StateKeys } from "./StateKeys";

export class MemCache
{
    constructor()
    {

    }

    private _values = new Array<KeyValuePair<StateKeys, any>>();

    /**
     * Get
     */
    public Get<T>(key: StateKeys): T | undefined
    {
        var exist = this.gotKey(key);

        if (exist)
        {
            return <T>exist.value;
        }
    }

    public Set(key: StateKeys, value: any): void
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

    private gotKey(key: StateKeys): KeyValuePair<StateKeys, any> | undefined
    {
        return this._values.find((item) =>
        {
            return item.key === key;
        });

    }
}

