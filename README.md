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
  - [Manually Specify Types](#manually-specify-types)
    - [Angular DI classes](#angular-di-classes)
    - [Custom Objects created in code.](#custom-objects-created-in-code)
- [Commands](#commands)
  - [Connect to ServiceNow](#connect-to-servicenow)
  - [Change Update Set](#change-update-set)
  - [Create Record](#create-record)
  - [Create Update Set](#create-update-set)
  - [Create Update Set and set as Current](#create-update-set-and-set-as-current)
  - [Add Script Include To Workspace](#add-script-include-to-workspace)
  - [Add Widget to Workspace](#add-widget-to-workspace)
  - [Add Theme to Workspace](#add-theme-to-workspace)
  - [Add Mail Script to Workspace](#add-mail-script-to-workspace)
  - [Add UI Script to Workspace](#add-ui-script-to-workspace)
  - [Add Script Include to Workspace](#add-script-include-to-workspace)
  - [Add Stylesheet to Workspace](#add-stylesheet-to-workspace)
  - [Add Header | Footer Widget to Workspace](#add-header--footer-widget-to-workspace)
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
* Work with multiple ServicNow record.
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

* Script Includes.
* Service Portal Themes.
* Service Portal Widgets.
* StyleSheets.
* UI Scripts.
* Mail Scripts.
* Service Portal Headers and Footers.
* Scripted Rest API.
* Script Actions
* Processors (scripted).

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

## Add Script Include To Workspace
Imports a script include into the workspace for edit.

Read only and restricted script includes is not available.

## Add Widget to Workspace
Imports a widget into the the workspace.

Read only and restricted widgets is not available.

## Add Theme to Workspace
Imports a theme into the workspace.

Read only and restricted themes is not available.

## Add Mail Script to Workspace
Imports a Mail Script into the workspace.

## Add UI Script to Workspace
Imports a UI Script into the workspace.

## Add Script Include to Workspace
Imports a Script Include into the workspace.

## Add Stylesheet to Workspace
Imports a Stylesheet into the workspace.

## Add Header | Footer Widget to Workspace
Imports a Service Portal header or footer widget into the workspace.

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
 
