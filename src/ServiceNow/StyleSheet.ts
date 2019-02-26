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

    detail?: string | undefined = undefined;
    name: string;
    css: string;

    public get label(): string
    {
        return this.name;
    }

    public get description(): string
    {
        return "";
    }

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

}