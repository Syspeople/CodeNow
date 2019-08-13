## 0.10.xxx
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