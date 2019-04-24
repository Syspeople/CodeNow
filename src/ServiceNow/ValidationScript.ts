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