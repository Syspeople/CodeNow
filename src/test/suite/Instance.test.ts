import * as assert from 'assert';
import { Instance, SupportedRecords } from '../../ServiceNow/all';
import { workspace, WorkspaceConfiguration } from "vscode";
import * as codeNow from '../../extension';
import { URL } from 'url';


// Defines a Mocha test suite to group tests of similar kind together
describe("ServiceNow Instanse", function ()
{
    let nm = codeNow.nm;
    let wsm = codeNow.wsm;
    let wm = codeNow.wm;

    let config: WorkspaceConfiguration;
    let instance: Instance;


    it("Instantiates", () =>
    {
        assert.doesNotThrow(() =>
        {
            config = workspace.getConfiguration("cn");
            instance = new Instance(config);
        });
    });


    it("all record types cached", () =>
    {
        suu
    });

});