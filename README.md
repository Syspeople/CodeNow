# SNSB (ServiceNow Scripting Bridge)
The Visual Code Extension for developing on the ServiceNow platform.

This extension aims to provide ServiceNow developers a first class development experience without depending on instance specific configuration.

Only Basic auth is currently available. 

**No ServiceNow configuration required.**


## Which elements is added?
We intend support all "code only" functionality in ServiceNow, these elements have first priority.

Low code elements might get added. But none is planned. 

No code elements will not added to the extension in a way that will allow you to configure them directly from VsCode.


# Features
* Work with multiple ServicNow record.
* Automatically saves to your instance.
* Automatically updates from your instance.
* Intellisense for ServiceNow and Angular API's
* Change update Set.

# How to
Add screenshots and stuff. 

# Try it
The only way to currently try the extension is to compile from the source.

You need to have [Node.js](https://nodejs.org/en/) installed.

1. Clone and open repository
2. rebuild module dependencies using command "npm install" (make sure you are located in the workspace root)
3. start debugger
4. when debugging open a workspace (a folder)
5. invoke command: Connect to ServiceNow

# Additional Extensions
Extensions that go very well with this extension

* [IntelliSense for CSS class names in HTML](https://marketplace.visualstudio.com/items?itemName=Zignd.html-css-class-completion) - for proper css intellisense i HTML.


## Supported Records
Records types currently supported. 

* Script includes.
* Service Portal Themes.
* Service Portal Widgets.
* StyleSheets
* JS Includes
* UI Scripts
* Mail Scripts
* Service Portal Headers and Footers

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
prompts for url, username and password.

if the workspace is already associated with a ServiceNow instance only the password is required.

**NB: only Basic auth is supported**


## Change Update Set
Choose an active UpdateSet and set is as your working update set. Only in progress and global scoped update sets are currently available.

**IMPORTANT** Update set changes do not apply to active sessions. Be sure to validate your update set in your browser if working in the web UI and in VsCode at the same time.

The extension will automatically use the previuosly selected update set. if it has been closed, default i selected. 


## Add Script Include To Workspace
Imports a script include into the workspace for edit.

Read only and restricted script includes is not available.


## Add Widget to Workspace
imports a widget into the the workspace.

Read only and restricted widgets is not available.


## Add Theme to Workspace
imports a theme into the workspace

Read only and restricted themes is not available.


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
clear workspace data. eg. cached records, urls, username.

make sure to reconnect to service and refresh records or reload vscode.


## Refresh Records
Reloads caches records from you instance.

if you missing a script in the list when trying to load one use this command to retreive all from instance.


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
 
