import { Record, ISpCss } from "./all";
import { QuickPickItem } from "vscode";
import { FileTypes } from "../Manager/all";

export class StyleSheet extends Record implements ISpCss, QuickPickItem
{
    constructor(css: ISpCss)
    {
        super(css);

        this.name = css.name;
        this.css = css.css;
    }

    public get label(): string
    {
        return this.name;
    }


    public get description(): string
    {
        return "";
    }

    detail?: string | undefined = undefined;

    name: string;
    css: string;

    SetAttribute(content: string, filetype: FileTypes): void
    {
        switch (filetype)
        {
            case FileTypes.styleSheet:
                this.css = content;
                break;
            default:
                break;
        }
    }
    GetAttribute(filetype: FileTypes): string | undefined
    {
        switch (filetype)
        {
            case FileTypes.styleSheet:
                return this.css;
            default:
                break;
        }
    }

    /**
    * toJSON
    */
    public toJSON()
    {
        let b = super.toJSON();
        return {
            sys_class_name: b.sys_class_name,
            sys_id: b.sys_id,
            sys_policy: b.sys_policy,
            sys_updated_on: b.sys_updated_on,
            sys_created_on: b.sys_created_on,
            sys_package: b.sys_package,
            sys_scope: b.sys_scope,
            name: this.name,
            css: this.css
        };
    }
}