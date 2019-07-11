//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';
import { SupportedRecords } from '../../ServiceNow/all';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
// import * as myExtension from '../extension';

// Defines a Mocha test suite to group tests of similar kind together
suite("Converter.ts", function ()
{
    //test that all supported records types convert.
    let allTypes = Object.keys(SupportedRecords);

    // Defines a Mocha unit test
    test("Can find all Records", function ()
    {
        assert.equal(allTypes.length > 0, true);
    });

    allTypes.forEach(element =>
    {
        // Defines a Mocha unit test
        test(`${element} Can Convert`, function ()
        {
            //  assert.equal(true, true);
        });
    });
});