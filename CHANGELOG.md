## 0.11.xxxx
* Improvements
  * Added progress indicator for:
    * Changing update set
    * Changing scope
    * Connecting to instance
* Fixes
  * Update set name in status bar not updated on scope change.

## 0.11.20191101
* Improvements
  * Intellisense for the following api's
    * sn_ws.SOAPResponseV2
    * sn_ws.SOAPMessageV2
    * sn_auth.GlideOAuthClient
* Fixes
  * current application not stored on first run have been fixed. Issue resulted in no records being selectable on add record even though they were valid. 

## 0.11.20191028
* Feature:
  * Added ability to change Application/scope from vs code.
    * when adding existing records only items from current scope is selectable. 
* Improvements:
  * Improve caching - Trim retrieved attributes for Script includes.
  * On connect with instance all local files are refreshed with latest version from instance. 
* Fixes
  * Remove deprecated API - workspace.rootPath
  * Errors that occurred when refreshing records have been fixed.

## 0.10.20190813
* Bug fixes:
  * Angular templates: Incorrect file extension used.
  * Scripted Rest Api: local path created can now handle relative uri and path variables.
  * extension: Caching indicator now updates properly.
  * Validation script: Wrong field patched on save. 
* Added integration test for the extension.
  * CRUD operations in local file system for all supported records.
  * CRUD operations on instance for all supported records.

## 0.10.20190802
* Codesearch is now available through the extension.
* improve caching on slow network connections. 
* Added support for:
  * UI Macroes
  * Angular Templates

## 0.9.20190628
* Fix issue were retrieval of UI Actions would time out causing caching issues. 

## 0.9.20190625
* Add options to change timeout for HTTP requests
* Add warning in case the metadata got deleted.
* Ensuring only instance files are checked on document open event.
* Update Package Dependencies
* Update Readmme

## 0.9.20190621
* Updated readme
* Typo in class name for RESTMessageV2 and RESTMessageV2
* Bug fixed where connect would fail if updateset got completed while not connected in Vs Code.

## 0.9.20190619
* add intellisense for GlideAggregate 
* Error with update set not validating properly on first run have been fixed.
* Incorrect notifications when clearing workspace state have been corrected.
* Clearing local workspace have been refactored to only remove instance specifik keys. 
* License added.

## Initial Release