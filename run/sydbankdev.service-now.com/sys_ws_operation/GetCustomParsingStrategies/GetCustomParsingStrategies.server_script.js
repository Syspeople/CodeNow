(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {

	response.setStatus(200);
	response.setContentType("application/json");
	response.getStreamWriter().writeString(new SNC.GlidePatternLibrary().getCustomParsingStrategies());

})(request, response);