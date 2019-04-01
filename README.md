[![Build Status](https://dev.azure.com/DevOpsSyspeople/ServiceNow%20Scripting%20Bridge/_apis/build/status/Syspeople.snsb?branchName=master)](https://dev.azure.com/DevOpsSyspeople/ServiceNow%20Scripting%20Bridge/_build/latest?definitionId=1&branchName=master)

# SNSB (ServiceNow Scripting Bridge)
The Visual Code Extension for developing on the ServiceNow platform.

This extension aims to provide ServiceNow developers a first class development experience without depending on instance specific configuration.

**No ServiceNow configuration required.**

- [SNSB (ServiceNow Scripting Bridge)](#snsb-servicenow-scripting-bridge)
- [Which elements is added?](#which-elements-is-added)
- [Features](#features)
- [How to](#how-to)
- [Try it](#try-it)
  - [Vscode Debugger](#vscode-debugger)
  - [Package and install](#package-and-install)
- [Additional Extensions](#additional-extensions)
  - [Supported Records](#supported-records)
  - [Intellisense](#intellisense)
    - [ServerSide API's](#serverside-apis)
    - [Angular API's / ServicePortal](#angular-apis--serviceportal)
    - [Additional](#additional)
    - [ClientSide API's](#clientside-apis)
    - [Snippets](#Snippets)

  - [Manually Specify Types](#manually-specify-types)
    - [Angular DI classes](#angular-di-classes)
    - [Custom Objects created in code.](#custom-objects-created-in-code)
    - [Custom object mappings](#custom-object-mappings)
- [Commands](#commands)
  - [Connect to ServiceNow](#connect-to-servicenow)
  - [Change Update Set](#change-update-set)
  - [Create Record](#create-record)
  - [Create Update Set](#create-update-set)
  - [Create Update Set and set as Current](#create-update-set-and-set-as-current)
  - [Add Record to Workspace](#add-record-to-workspace)
  - [Open Record in platform](#open-record-in-platform)
  - [Open list in platform](#open-list-in-platform)
  - [Save](#save)
  - [Update](#update)
  - [Clear Instance](#clear-instance)
  - [Refresh Records](#refresh-records)
- [Options](#options)
  - [uploadOnSave](#uploadonsave)
  - [addOnOpen](#addonopen)
    - [Contributors](#contributors)


# Which elements is added?
We intend support all "code only" functionality in ServiceNow, these elements have first priority.

Low code elements might get added, but _none_ is planned. 

No code elements will not added to the extension in a way that will allow you to configure them directly from VsCode.

# Features
* Work with multiple ServicNow records.
* Create new ServiceNow Records.
* Automatically saves to your instance.
* Automatically updates from your instance.
* Intellisense for ServiceNow and Angular API's.
* Change update Set.
* Create Update Set.
* Set Parent on created update set.

# How to
Add screenshots and stuff. 

# Try it
You need to have [Node.js](https://nodejs.org/en/) installed either way. make sure the path variable is up to date (reboot).

Only Basic auth is currently available. 


## Vscode Debugger
1. Clone and open repository
2. rebuild module dependencies using command "npm install" (make sure you are located in the workspace root)
3. start debugger
4. when debugging open a workspace (a folder)
5. invoke command: Connect to ServiceNow

## Package and install
1. Clone the repository. Remember do have the branch you want checked out and synced.
2. Install Visual Studio Code Extensions: **npm install -g vsce** 
3. Open a terminal and cd to root dir of your repository.
4. package extension: **vsce package**
5. Open Vscode and use command: install from vsix
6. navigate to packaged vsix from step 4 and open it. 

Builds will automatically be made available at a later point. 

# Additional Extensions
Extensions that go very well with this extension

* [IntelliSense for CSS class names in HTML](https://marketplace.visualstudio.com/items?itemName=Zignd.html-css-class-completion) - for proper css intellisense i HTML.

## Supported Records
Records types currently supported. 

* Angular Providers.
* Mail Scripts.
* Processors (scripted).
* Script Actions
* Script Includes.
* Scripted Rest API.
* Service Portal Headers and Footers.
* Service Portal Themes.
* Service Portal Widgets.
* StyleSheets.
* UI Scripts.
* UI Page.

## Intellisense
Currently there is intellisense for the following API's.

NB: Some API's are not fully documented (Publicly anyways). if you miss a method or attribute please create an issue.

### ServerSide API's
* GlideRecord
* GlideSystem (gs)
* GlideSPScriptable ($sp)
* GlideUser
* GlideAjax
* GlideDateTime
* GlideElement
* GlideElementDescriptor
* GlideSession
* GlideSysAttachment
* GlideEmailOutbound
* TemplatePrinter
* GlideScriptedProcessor (g_processor)
* HttpServletResponse (g_response)
* HttpServletRequest (g_request)
* sn_ws
  * GlideHttpHeader
  * RestMessageV2
  * RestResponseV2
  

### Angular API's / ServicePortal
* $http
* $scope
* $q
* $location
* spModal
* spUtil
* controller (angular controller class)

### Additional
To avoid collision between Class names and global variables classes in the declaration is always named using CamelCase.

eg.: 
* $q is $Q
* $http is $Http

### ClientSide API's
* GlideAjax

## Manually Specify Types
Occassionally it is required to manually specify a type in order for Vs Code to properly identify class and provide intellisense.

### Angular DI classes
use jsdoc notation to specify a type to make it available in scope.
```javascript
/**
 * @param {$Scope} $scope 
 * @param {$Http} $http 
 */
function ($scope, $http)
{
    var c = this;
}
```

### Custom Objects created in code.
Use JsDoc notation to autocomplete on custom object mappings declared and used in code. 
```javascript
/**
 * @type {SpModalOptions}
 */
var opt = {
    widget: "widget-form", widgetInput: {}
};

spModal.open(opt).then(function (res)
{
    console.log("modal end");
});
```

## Snippets
Snippest are code fragments that can be imported, the following can be used: 

### General Queries
| Command  | Description |
| ------------- | ------------- |
`sn_query`      | A standard GlideRecord query follows this format. Can also be used in Client scripts and UI policies
| `sn_query_with_Or_condition`  | Basic query with chained or condition to filter results |
| `sn_query_with_encoded`  | Basic query with encoded filters  |
| `sn_query_aggregate`  | Query aggregate data. ( Count, SUM, MIN, MAX, AVG )  |
|`sn_query_orderBy` | Query with order by|
| `sn_query_(not)null`  | Query to find where a field is null or not null  |
| `sn_query_rowcount_serverscript`  | Query to find the row count on a server side script  |
| `sn_query_rowcount_clientscript`  | Query to find the row count on a client side script |
| `sn_query_with_resultLimit`  |  "Specify a limit for the result count. |
| `sn_query_with_resultLimit_chooseWindow`  |  The chooseWindow(first,last) method lets you set the first and last row number that you want to retrieve and is typical for chunking-type operations. The rows for any given query result are numbered 0..(n-1), where there are n rows. The first parameter is the row number of the first result you’ll get. The second parameter is the number of the row after the last row to be returned. In the example below, the parameters (10, 20) will cause 10 rows to be returned: rows 10..19, inclusive. |


### QUERY SINGLE
| Command  | Description |
| ------------- | ------------- |
| `sn_query_single`  | Get a specfic record  |
| `sn_query_single_by_field/val`  | Get the first record matching the field value pair  |
| `sn_query_single_ref_record`  | Get the first record matching the field value pair.  |
| `sn_delete`  | How to delete a records.   |
| `sn_delete_ALL`  | How to delete all the records in a result set.  |


### INSERT
| Command  | Description |
| ------------- | ------------- |
| `sn_insert`  |  How to insert a new record |


### UPDATE
| Command  | Description |
| ------------- | ------------- |
| `sn_update`  |  How to update a record. |
| `sn_update_setWorkflow`  |  `setWorkflow` is used to enable/disable the running of any business rules that may be triggered by a particular update. |
| `sn_update_autoSysFields`  | `autoSysFields` is used to disable the update of ‘sys’ fields (Updated, Created, etc.) for a particular update. This really is only used in special situations. The primary example is when you need to perform a mass update of records to true up some of the data but want to retain the original update timestamps, etc.  |
| `sn_update_setForceUpdate`  |  `setForceUpdate` is used to update records without having to change a value on that record to get the update to execute. |

### ServiceNow Operators
| Command  | Description |
| ------------- | ------------- |
| `sn_addquery_startswith`  | Filter results that start with specified value.  |
| `sn_addquery_endswith`  | Filter results that end with specified value.  |
| `sn_addquery_contains`  | Filter results that contains specified value.  |
| `sn_addquery_does_not_contain`  | Filter results that does not contain specified value.  |
| `sn_addquery_in`  | Field must contain the value supplied anywhere in the string provided.  |



### Service now Alerts Client/Server
| Command  | Description |
| ------------- | ------------- |
| `sn_alert_server_belowField`  | Business rule and other general use. Alert below field.  |
| `sn_alert_server_topscreen`  |  Business rule and other general use. Alert top screen. |
| `sn_alert_server_write_to_textlog`  | Business rule and other general use. Write to text log. |
| `sn_alert_server_log`  |  Business rule and other general use. Will write to the database and the log file. Too much of this can adversely affect performance |
| `sn_alert_client_popup`  |  Client Script - Will pop up a window with message and an 'OK' button. |
| `sn_alert_client_confirm`  | Client Script - Will pop up a window with message and a 'Ok' and 'Cancel' buttons.  |
| `sn_alert_client_errorNextToField`  | Client Script - Will put an error message below the specified field.   |
| `sn_alert_client_hide_errorNextToField`  | Client Script - Will hide error message next the specified field  |

### Service Now Glide User Object SERVER (Service Now Objects)
| Command  | Description |
| ------------- | ------------- |
| `sn_user_server_get_UserByID`  |  Returns a reference to the user object for the user ID (or sys_id) provided. |
| `sn_user_server_getCurrent_User`  | Returns a reference to the user object for the currently logged-in user  |
| `sn_user_server_getCurrent_UserName`  | Returns the User ID (user_name) for the currently logged-in user.e.g. `employee`  |
| `sn_user_server_getCurrent_DisplayName`  | Returns the display value for the currently logged-in user.e.g. `Joe Employe`  |
| `sn_user_server_getCurrent_ID`  | Returns the sys_id string value for the currently logged-in user. |
| `sn_user_server_getCurrent_FName`  | Returns the first name of the currently logged-in user.  |
| `sn_user_server_getCurrent_LName`  | Returns the last name of the currently logged-in user.  |
| `sn_user_server_getCurrent_Email`  | Returns the email of the currently logged-in user.  |
| `sn_user_server_getCurrent_departmentID`  | Returns the department id of the currently logged-in user.  |
| `sn_user_server_getCurrent_companyID`  |  Returns the company GlideRecord of the currently logged-in user. |
| `sn_user_server_getCurrent_listOfGroups`  |  Returns a list of all groups that the currently logged-in user is a member of. |
| `sn_user_server_getCurrent_isMemberOF`  |  Returns true if the user is a member of the given group, false otherwise. |


### Service Now Glide User Object CLIENT (Service Now Objects)
| Command  | Description |
| ------------- | ------------- |
| `sn_user_client_getCurrent_userName`  |  User name of the current user e.g. employee |
| `sn_user_client_getCurrent_FName`  |  First name of the current user e.g. Joe |
| `sn_user_client_getCurrent_LName`  |Last name of the current user e.g. Employee  |
| `sn_user_client_getCurrent_userID`  | sys_id of the current user e.g. 681ccaf9c0a8016400b98a06818d57c7  |
| `sn_user_client_getCurrent_hasRole`  |  True if the current user has the exact role specified, false otherwise, regardless of 'admin' role. Usage: g_user.hasRoleExactly('itil') |
| `sn_user_client_getCurrent_hasRoles`  |  True if the current user has at least one role specified, false otherwise. |


### Service Now Glide Form Object CLIENT
| Command  | Description |
| ------------- | ------------- |
| `sn_form_addDecoration`  | Adds an icon on a field’s label.  |
| `sn_form_flashColor`  |  Flashes the specified color the specified number of times. Used to draw attention to a particular field. |
| `sn_form_getLabelOf`  |  Gets the plain text value of the field label. |
| `sn_form_setVisibility`  | Toggles visiblity of a field in a form. |
| `sn_form_getFieldValue`  | Gets the value of a field on a form. |
| `sn_form_setFieldValue`  | Sets the value of a field on a form.|
| `sn_form_setMandatory`  |  Sets the Mandatory of a field on a form. |
| `sn_form_getMandatory`  |  Gets bool if field is mandatory.|
| `sn_form_clearField`  | Clears the value of a field  |
| `sn_form_setDisabled`  |  Enable/Disable a field. |
| `sn_form_setReadOnly`  |  Toggle read only on a field. Best Practice: Use UI Policy rather than this method whenever possible. |
| `sn_form_getIsNew`  |  Tells if this is a new record. |
| `sn_form_saveNstay`  | Saves the record and stays  |
| `sn_form_submit_gotoprevious`  | Submits and returns user to previous screen.  |

### Custom object mappings
You can use JsDoc to provide intellisense for custom objects mappings created by yourself or others. see param:arrVariables

```javascript
/**
	 * 
	 * @param {Array<{value:string,display_value:string}>} arrVariables 
	 * @param {String} stringVarName 
	 */
	function getReqVarValue(arrVariables, stringVarName)
	{
		for (var index in arrVariables)
		{
			var variable = arrVariables[index];
			if (variable.name === stringVarName)
			{
				return {
					value: variable.value,
					displayValue: variable.display_value
				}
			}
		}
	}

```

# Commands

## Connect to ServiceNow
URL: instanceurl, excluding _.service-now.com_.

Username: username of the user using the extension.

Password: password for the user.

if the workspace is already associated with a ServiceNow instance only the password is required.

**NB: only Basic auth is supported**


## Change Update Set
Choose an active UpdateSet and set it as your working update set. Only in progress and global scoped update sets are currently available.

**IMPORTANT** Update set changes do not apply to active sessions. Be sure to validate your update set in your browser if working in the web UI and in VsCode at the same time.

The extension will automatically use the previuosly selected update set. if it has been closed, default is selected. 

## Create Record
Creates a new record and adds it to the workspace. 
You will be prompted for information such as type and name. 

**AVOID** spaces in names not all record types support it. 

## Create Update Set
Lets you create a new update set. 

It can be chosen if a parent update set should be added.

## Create Update Set and set as Current
Lets you create a new update set and sets it as the current update set.

It can be chosen if a parent update set should be added.

## Add Record to Workspace
Imports a script include into the workspace for edit.

Read only and restricted script includes is not available.

## Open Record in platform
Right click a record to open it in the platform. 

## Open list in platform
Right click a record to open the associated list.

## Save
Right click a record to force save the version currently in VsCode.

**This will force the local to be saved on instance**

## Update
Right click a record to force download the latest version into VsCode.

**This will overwrite the local file**

## Clear Instance
Clear workspace data. eg. cached records, urls, username.

Make sure to reconnect to ServiceNow and refresh records or reload vscode.

## Refresh Records
Reloads caches records from you instance.

If you are missing a script in the list when trying to load one use this command to retreive all from instance.

# Options
## uploadOnSave
Enable or disable automatic upload on save. If a newer version exists on the instance the save is aborted.

default: true


## addOnOpen
Enable or disable automatic import on document open. Only applied if higher version exists on instance.

default: true

### Contributors
 [ambsoerensen](https://github.com/ambsoerensen)

 [CGraabaek](https://github.com/CGraabaek)

 #### How to contribute

 [Here](/contribution.md) is a contribution guide, outlining the steps to be taken to contribute to this project.
 
