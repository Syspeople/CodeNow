# SNSB Contribution Guide
This guide will provide an overview of the steps needed to make a contribution to the extension.

## Table of Contents

1. [Add new record](#Add-new-record)
1. [Add class declarations](#Add-class-declarations)
    1. [General](#General)
    1. [Naming](#Naming)
    1. [Detailed Examples](#Detailed-Examples)
    

# Add new Record Type

### Step 1
Add record to the string enum in src/ServiceNow/SupportedRecords.ts, Key = Human Friendly name, Value = table name

### Step 2
Add a suitable template in the getTemplate function in src/ServiceNow/instance.ts.

### Step 3
Add Record Interface to the *ServiceNow* folder.

### Step 4
Add the export of the record interface to **all.ts** in the *ServiceNow* folder.

```typescript
export * from './ISysMailScript';
```

### Step 5
Add Record that implements the interface IWorkspaceConvertable and extends the Record class to the *ServiceNow* folder

### Step 6
Add the export of the implemented record class to **all.ts** in the *ServiceNow* folder.

```typescript
export * from './MailScript';
```

### Step 7
Add casting to actual class implementation in **Converter.ts** *ServiceNow* folder. 

### Step 8 Add Template 
Add a template for record creation in extension.ts method:getTemplate.

### Step 8 Optional
specific query parameters for record type. only if required. in **Api.ts**

### Step 9 Optional
Add custom handling of creation if required.


## Add class declarations
**[Back to top](#table-of-contents)**

Typescript declaration files and JsDoc is what drive the intellisense provided by this extenseion.

It is important to understand that the declarations simply mimicks the real class available in ServiceNow.

this means it is very important that class', methods, and variables is named so that they can executed in servicenow without any modifications.

## General
Watch your casing as javascript is sensitive to that stuff.

* all methods and constructors should have their input and output types declared.
* all methods and contructors should at least have their general usage, input parameters described using JsDoc notation. for lenghty descriptions markdown is supported.
* global variables should have the context in which they are available specified using JsDoc notation. (see detailed example)
* Class only available as global variables should have that described on the contructor in JsDoc notation.
* classes, methods, and variables are named so that they can executed in servicenow without any modifications.


## Naming
To avoid naming collisons and compatibility with VsCode there is a few naming conventions that currently apply.
### Angular
Same as original class **but starts with capital letter**.

Example: 
* $q -> $Q
* $http -> $Http
* controller -> Controller

and so forth.

Methods names should not be modified.

### ServiceNow Classes
Named as the original class. 

Example: 
* GlideRecord -> GlideRecord

Methods names should not be modified.

global variable names should not be modified. 

### name spaces
Some class' in ServiceNow is available through namespaces
You can declare a name space in the declaration file aswell. the namespace should be named exactly like the one you try do mimick. see detailed example for syntax.


## Detailed Examples
Simple global variable and class declaration.
```typescript
/**
 * Available in mail scripts
 */
declare var template: TemplatePrinter;

declare class TemplatePrinter
{
    /**
     * no Constructor. Global variable available in mail scripts.
     */
    constructor();

    /**
     * Prints the string to the email body.
     * @param string
     */
    print(string: string): void;

    /**
     * Adds non-breaking spaces to the email body.
     * @param spaces 
     */
    space(spaces: number): void;
}
```

Declaration using a namespace.
```typescript
declare namespace sn_ws
{
    class RestMessagev2
    {
        /**
         * Instantiates an empty RESTMessageV2 object. 
         * When using an object instantiated this way, you must manually specify an HTTP method and endpoint.
         */
        constructor()
        /**
         * Instantiates a RESTMessageV2 object using information from a REST message record.
         * You must have a REST message record defined before you can use this constructor.
         * @param name The name of the REST message record.
         * @param methodName The name of the HTTP method to use, such as GET or PUT.
         */
        constructor(name: string, methodName: string);
        /**
         * Sends the REST message to the endpoint.
         */
        execute(): RestResponseV2;

        /**
         * Configures the REST message to save the returned response body as an attachment record.
         * @param tableName Specify the table that contains the record you want to attach the saved file to.
         * @param recordSysId Specify the sys_id of the record you want to attach the saved file to.
         * @param fileName 	Specify the file name to give to the saved file.
         */
        saveResponseBodyAsAttachment(tableName: string, recordSysId: string, fileName: string): void;

        //truncated for readibility
    }
}

```