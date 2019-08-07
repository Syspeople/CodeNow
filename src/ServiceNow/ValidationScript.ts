import { Record, IValidationScript, ISysScriptInclude, Instance, Converter } from "./all";
import { FileTypes, MetaData, KeyValuePair } from "../Manager/all";
import { Uri } from "vscode";

export class ValidationScript extends Record implements IValidationScript
{

    constructor(u: IValidationScript)
    {
        super(u);
        this.active = u.active;
        this.description = u.description;
        this.validator = u.validator;
        this.internal_type = u.internal_type;
        this.ui_type = u.ui_type;
        this.name = "";

    }

    active: boolean;
    description: string;
    name: string;
    validator: string;
    internal_type: string;
    ui_type: string;

    /**
     * returns all avaiable validation script types
     */
    public static getTypes(): Array<string>
    {
        return ["Approval Rules", "Audio", "Auto Number", "Basic Date/Time", "Basic Image", "Basic Time",
            "Bootstrap Color", "Breakdown Element", "Catalog Preview", "Char", "Choice", "Collection", "Color", "Color Display", "Composite Field", "Composite Name",
            "Compressed", "Condition String", "Conditions", "Counter", "CSS", "Currency", "Data Array", "Data Object", "Data Structure",
            "Date", "Date/Time", "Day of Week", "Days of Week", "Decimal", "Document ID", "Documentation Field", "Domain ID", "Domain Path", "Due Date", "Duration",
            "Email", "Email Script", "External Names", "Field List", "Field Name", "File Attachment", "Floating Point Number", "Formula",
            "Glide Var", "Glyph Icon (Bootstrap)", "HTML", "HTML Script", "HTML Template", "Icon", "Image", "Index Name", "Integer", "Integer Date", "Integer String", "Integer Time", "Integer Type",
            " IP Address", "IP Address (Validated IPV4, IPV6)", "Journal", "Journal Input", "Journal List", "JSON",
            "List", "Long", "Long Integer String", "Mask Code", "Metric Absolute", "Metric Counter", "Metric Derive", "Metric Gauge", "MID Server Configuration", "Month of Year", "Multiple Line Small Text Area",
            "Name-Value Pairs", "Name/Values", "NL Task Integer 1", "Order Index", "Other Date", "Password (1 Way Encrypted)", "Password (2 Way Encrypted)", "Percent Complete", "Phone Number", "Phone Nymber (E164)",
            "Phone Number (Unused)", "Precise Time", "Price", "Properties", "Radio Button Choice", "Records", "Reference", "Reference Name", "Related Tags",
            "Reminder Field Name", "Repeat Count", "Repeat Type", "Replication Payload", "Schedule Date/Time", "Script", "Script (Plain)", "Script (server side)",
            "Short Field Name", "Short Table Name", "Slush Bucket", "Snapshot Template Value", "Source ID", "Source Name", "Source Table", "String", "String (Full UTF-8)", "string_boolean", "Sys ID (GUID)", "System Class Name", "System Class path", "System Event Name", "System Rule Field Name",
            "Table Name", "Template Value", "Time", "Timer", "Translated", "Translated HTML", "Translated Text", "Tree Code", "Tree Path", "True/False", "Two Line Text Area",
            "UI Action List", "URL", "User Input", "User Roles", "Variable Conditions", "Variable template value", "Variables",
            "Version", "Video", "Week of Month", "Wide Text", "Wiki", "WMS Job", "Workflow", "Workflow Conditions", "XML"];
    }

    public get label(): string
    {
        return this.description;
    }

    detail?: string | undefined;

    SetAttribute(content: string, filetype: FileTypes): void
    {
        if (filetype === FileTypes.serverScript)
        {
            this.validator = content;
        }
    }
    GetAttribute(filetype: FileTypes): string | undefined
    {
        if (filetype === FileTypes.serverScript)
        {
            return this.validator;
        }
    }

    GetPatchable(): Object
    {
        return { script: this.validator };
    }

    GetMetadata(record: ISysScriptInclude, instance: Instance): MetaData
    {
        if (instance.IsInitialized() && instance.Url)
        {
            let f = new Array<KeyValuePair<FileTypes, Uri>>();
            f.push(new KeyValuePair(FileTypes.serverScript, Uri.parse(`/${record.description}.${Converter.getFileTypeExtension(FileTypes.serverScript)}`)));
            return new MetaData(record, f, instance.Url.host, record.description);
        }
        throw new Error("Instance not initialized");
    }
}