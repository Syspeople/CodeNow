import { SupportedRecords } from "./all";
export class SupportedRecordsHelper
{
    /**
     * Get display values for all supported records.
     */
    public static GetRecordsDisplayValue(): Array<string>
    {
        return Object.keys(SupportedRecords);
    }

    /**
     * Get values for all supported records. Equivelant to sys_classname
     */
    public static GetRecordsValue(): Array<string>
    {
        let out = new Array<string>();

        let keys = this.GetRecordsDisplayValue();

        keys.forEach(element =>
        {
            //@ts-ignore index error ivnalid.
            out.push(SupportedRecords[element]);
        });
        return out;
    }

    //key => SupportedRecords[key] === this.sys_class_name

    /**
     * getDiplayName
     */
    public static getDisplayName(ClassName: string): string
    {
        let keys = this.GetRecordsDisplayValue();

        let displayValue = keys.find((key) =>
            //@ts-ignore Index error invalid.
            SupportedRecords[key] === ClassName
        );

        if (displayValue)
        {
            return displayValue;
        }
        throw new Error("Class name not recognized");
    }

    /**
     * Get display values for all record records that can be selected in the UI.
     */
    public static GetRecordsDisplayValueFiltered(): Array<string>
    {
        let excluded = new Array<string>();

        //add keys to be excluded.
        excluded.push("Scripted Rest Definition");

        let keys = this.GetRecordsDisplayValue();

        //remove Scripted rest definitions. Not selecetable but required for caching purposes. 
        let RecordsFiltered = keys.filter((i) =>
        {
            return excluded.indexOf(i) === -1;
        });

        return RecordsFiltered;
    }
}