import * as assert from 'assert';
import { Instance } from '../../ServiceNow/all';
import { workspace, WorkspaceConfiguration, ExtensionContext } from "vscode";
import { WorkspaceManager, WorkspaceStateManager, StatusBarManager } from '../../Manager/all';

// Defines a Mocha test suite to group tests of similar kind together
suite("Instance Tests", function ()
{

    let context = new ExtensionContext();

    const nm = new StatusBarManager();
    const wsm = new WorkspaceStateManager()
    const wm = new WorkspaceManager(wsm);

    let config: WorkspaceConfiguration;
    let instance: Instance;

    test("Instantiates", () =>
    {
        assert.doesNotThrow(() =>
        {
            config = workspace.getConfiguration("cn");
            instance = new Instance(config);
        });
    });

    test("instance Initializes", () =>
    {
        instance.Initialize(i, u, p, wsm, nm);
    });
});