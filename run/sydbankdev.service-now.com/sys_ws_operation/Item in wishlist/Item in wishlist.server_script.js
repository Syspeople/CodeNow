(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {

	var cartItemId = request.pathParams.cart_item_id;
	if (!cartItemId)
		throw new sn_ws_err.BadRequestError("Cart item id is required");
	cartItemId = '' + cartItemId;
	var cartItemGr = new GlideRecordSecure("sc_cart_item");
	if (!cartItemGr.get(cartItemId))
		throw new sn_ws_err.NotFoundError("Either the Cart Item ID is invalid or Security constraints prevent access to it!");

	var cartJS = new sn_sc.CartJS("saved_items");
	return cartJS.getCartItemDetails(cartItemId);
})(request, response);