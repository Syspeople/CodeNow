// //
// // Note: This example test is leveraging the Mocha test framework.
// // Please refer to their documentation on https://mochajs.org/ for help.
// //

// // The module 'assert' provides assertion methods from node
// import * as assert from 'assert';

// // You can import and use all API from the 'vscode' module
// // as well as import your extension to test it
// import * as vscode from 'vscode';
// import * as codeNow from '../../extension';

// // Defines a Mocha test suite to group tests of similar kind together
// suite("Extension Tests", function ()
// {
//     // Defines a Mocha unit test
//     test("Something 1", async function ()
//     {
//         let cmd = await vscode.commands.getCommands();

//         let i = await vscode.commands.executeCommand("cn.connect", { test: "i got passed to the command" });

//         console.log(i);
//         console.log(cmd.filter((e) => { return e.startsWith('cn'); }));

//         assert.equal(cmd.length > 0, cmd.length > 0);
//     });
// });