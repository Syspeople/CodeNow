import { Record, ISpCss } from "./all";

export class StyleSheet extends Record implements ISpCss
{
    /**
     *
     */
    constructor(css: ISpCss)
    {
        super(css);

        this.name = css.name;
        this.css = css.css;
    }

    name: string;
    css: string;

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