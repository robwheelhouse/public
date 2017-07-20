//demo code, To be customized per implementation. This is what goes on the actualy page.
//This data layer structure, elements, and functions serve only as an example implementation method.


javascript: (function() {
	window.digitalData = {};
	window.digitalData.page = {};
	window.digitalData.page.pageInfo = {};
	window.digitalData.product = new Array();
	window.digitalData.cart = {};
	window.digitalData.transaction = {};
	window.digitalData.events = new Array();
	window.digitalData.component = new Array();
	window.digitalData.user = new Array();
	window.digitalData.version = "1.0";
	// **digitalData.pageInstanceID:**
	// A unique identifier for a page or other piece of content for which data is being collected.
	//
	// The Page Identifier is among the most widely used web analytics data properties, and is among
	// the top level digitalData objects.
	//
	// This value SHOULD distinguish among environments, such as whether this page is in
	// development, staging, or production.
	window.digitalData.pageInstanceID = null;
	window.digitalData.debug = false;
	//
	//
	//
	//
	// **digitalData.page.pageInfo:**
	// Describes details about the page.
	//
	// **Reserved:**
	// **pageID** (String), **pageName** (String), **destinationURL** (String), **referringURL**
	// (String), **sysEnv** (String), **variant** (String), **version** (String), **breadcrumbs** (Array::String),
	// **author** (String), **issueDate** (String or Date Object), **effectiveDate **(String or Date
	// Object), **expiryDate** (String or Date Object), **language** (String), **industryCodes** (String),
	// **publisher** (String)
	//
	// For destinationURL, and referringURL, RECOMMENDED values are
	// document.location, and document.referrer, respectively.
	//
	window.digitalData.page.pageInfo = {
		pageID : null,
		pageName : null,
		destinationURL : document.URL,
		referringURL : document.referrer,
		sysEnv : null,
		variant : null,
		version : null,
		breadCrumbs : [],
		author : null,
		issueDate : null, // may be implemented as a String or Date Object.
		effectiveDate : null, // may be implemented as a String or Date Object.
		expiryDate : null, // may be implemented as a String or Date Object.
		language : null,
		geoRegion : null,
		industryCodes : null,
		publisher : null
	};

	// **digitalData.page.category:**
	// Because of the wide range of methods for categorization, an object literal is provided for page
	// categories.
	//
	// The name **primaryCategory** is RECOMMENDED if you included only one set of categories
	// for pages, or for your primary set of categories. All other names are optional and should fit the
	// individual implementation needs in both naming and values passed.
	window.digitalData.page.category = {
		primaryCategory : null,
		subCategories : [],
		pageType : null
	};

	// **digitalData.page.attributes:**
	// This object provides extensibility to the Page object. All names are optional and should fit the
	// individual implementation needs in both naming and values passed.
	window.digitalData.page.attributes = {};

	// added to capture data specific to search results pages.
	window.digitalData.page.attributes.search = {
		type : null,
		searchTerm : null,
		resultsCount : null
	};

	// **digitalData.newProduct:** Utility function to create new product entries.
	// Usage: window.digitalData.product.push(window.digitalData.newProduct({}))
	window.digitalData.newProduct = function(p) {
		// The **Product object** carries details about a particular product with frequently used properties
		// listed below.
		// This is intended for data about products displayed on pages or other content. For
		// products added to a shopping cart or ordered in a transaction, see the Cart and Transaction
		// objects below.
		//
		// **Reserved:** **productID** (String), **productName** (String), **description** (String), **productURL**
		// (String), **productImage** (String), **productThumbnail** (String), **manufacturer** (String), **sku**
		// (String), **color** (String), **size** (String)
		// &nbsp;
		// ==
		//		// Because of the wide range of methods for categorization,
		//		// an object literal is provided for product categories.
		//		// example:
		// 		digitalData.product[n].category = {
		//	 		primaryCategory: "Haircare",
		// 			subCategory1: "Men's",
		//	 		productType: "Thinning Hair Treatments"
		// 		};
		//
		// **Reserved:** **primaryCategory** (String)
		// The name primaryCategory is RECOMMENDED if you included only one set of categories
		// for products, or for your primary set of categories.
		//
		// All other names are optional and should fit
		// the individual implementation needs in both naming and values passed.
		var product_ = {
			sku : null,
			productID : null,
			productName : null,
			description : null,
			productURL : null,
			productImage : null,
			productThumbnail : null,
			manufacturer : null,
			size : null,
			color : null,
			linkedProduct : [],
			category : {},
			quantity : null,
			price : null,
			attributes : {}
		};
		if (p) {
			(p.sku != undefined) ? (product_.sku = p.sku) : (product_.sku);
			(p.productID != undefined) ? (product_.productID = p.productID) : (product_.productID);
			(p.productName != undefined) ? (product_.productName = p.productName) : (product_.productName);
			(p.description != undefined) ? (product_.description = p.description) : (product_.description);
			(p.productURL != undefined) ? (product_.productURL = p.productURL) : (product_.productURL);
			(p.productImage != undefined) ? (product_.productImage = p.productImage) : (product_.productImage);
			(p.productThumbnail != undefined) ? (product_.productThumbnail = p.productThumbnail) : (product_.productThumbnail);
			(p.size != undefined) ? (product_.size = p.size) : (product_.size);
			(p.color != undefined) ? (product_.color = p.color) : (product_.color);
			(p.linkedProduct != undefined) ? (product_.linkedProduct = p.linkedProduct) : (product_.linkedProduct);
			(p.category != undefined) ? (product_.category = p.color) : (category.color);
			(p.quantity != undefined) ? (product_.quantity = p.quantity) : (product_.quantity);
			(p.price != undefined) ? (product_.price = p.price) : (product_.price);
			(p.attributes != undefined) ? (product_.attributes = p.attributes) : (product_.attributes);
		}
		return product_;
	};

	// The **Cart object** carries details about a shopping cart or basket and the products that have been
	// added to it. The Cart object is intended for a purchase that has not yet been completed. See the
	// Transaction object below for completed orders.
	window.digitalData.cart.cartID = null;
	// **digitalData.cart.price:** This object provides details of the cart price. The **basePrice** SHOULD be the price of the
	// **items** before applicable discounts, shipping charges, and tax. The **cartTotal** SHOULD be
	// the total price inclusive of all discounts, charges, and tax.
	//
	// **Reserved:** **basePrice** (Number), **voucherCode** (String), **voucherDiscount** (Number),
	// **currency** (String), **taxRate** (Number), **shipping** (Number), **shippingMethod** (String),
	// **priceWithTax** (Number), **cartTotal** (Number)
	window.digitalData.cart.price = {
		basePrice : null,
		voucherCode : null,
		voucherDiscount : null,
		currency : null,
		taxRate : null,
		shipping : null,
		shippingMethod : null,
		priceWithTax : null,
		cartTotal : null,
		attributes : {}, // This object provides extensibility to the cart as a whole. Any additional dimensions related to the cart can be provided.
		item : [] // [one or more product objects] window.digitalData.cart.item.push(window.digitalData.newProduct({})) could be used to populate the cart.

	};

	// The **Transaction object** is similar to the Cart object, but represents a completed order. The
	// Transaction object contains analogous sub-objects to the Cart object as well as additional subobjects
	// specific to completed orders.
	window.digitalData.transaction.transactionID = null;
	// A unique identifier for a particular transaction; usually an existing order identifier.
	window.digitalData.transaction.profile = {};
	// A profile for information about the purchaser, typically associated with a registered user.
	window.digitalData.transaction.profile.address = {// An extensible object for providing (billing) address information for the purchaser.
		line1 : null,
		line2 : null,
		city : null,
		stateProvince : null,
		postalCode : null,
		country : null,
		attributes : {}
	};

	window.digitalData.transaction.profile.shippingAddress = {// As for address, but for the shipping address.
		line1 : null,
		line2 : null,
		city : null,
		stateProvince : null,
		postalCode : null,
		country : null,
		attributes : {}
	};

	// **digitalData.transaction.total:**  This object provides details of the final price the purchaser has to pay. The basePrice
	// SHOULD be the price of the items before applicable discounts, shipping charges, and tax.
	// The transactionTotal SHOULD be the total price inclusive of all discounts, charges, and
	// tax.
	//
	// **Reserved:** **totalPrice** (Number), **voucherCode** (String), **voucherDiscount** (Number),
	// **currency** (String), **taxRate** (Number), **shipping** (Number), **shippingMethod** (String),
	// **priceWithTax** (Number), **transactionTotal** (Number)
	window.digitalData.transaction.total = {// window.digitalData.cart.item.push(window.digitalData.newProduct({})) could be used to populate the cart.
		basePrice : null,
		voucherCode : null,
		voucherDiscount : null,
		currency : null,
		taxRate : null,
		shipping : null,
		shippingMethod : null,
		priceWithTax : null,
		transactionTotal : null,
		attributes : {},
		item : [] // one or more product objects
	};

	// Utility function to create new event entries.
	window.digitalData.newEvent = function(ev) {
		var event_ = {
			eventName : null,
			eventAction : null,
			eventPoints : null,
			type : null,
			timeStamp : new Date(),
			effect : null,
			category : {
				primaryCategory : null,
				subCategory : null
			},
			attributes : {}
		};
		if (ev) {
			(ev.eventName != undefined) ? (event_.eventName = ev.eventName) : (event_.eventName);
			(ev.eventAction != undefined) ? (event_.eventAction = ev.eventAction) : (event_.eventAction);
			(ev.eventPoints != undefined) ? (event_.eventPoints = ev.eventPoints) : (event_.eventPoints);
			(ev.type != undefined) ? (event_.type = ev.type) : (event_.type);
			(ev.timeStamp != undefined) ? (event_.timeStamp = ev.timeStamp) : (event_.timeStamp);
			(ev.effect != undefined) ? (event_.effect = ev.effect) : (event_.effect);
			(ev.category != undefined) ? (event_.category = ev.category) : (event_.category);
			(ev.attributes != undefined) ? (event_.attributes = ev.attributes) : (event_.attributes);
		}
		// event array is updated and a window.trigger is fired at this point to alert the browser that a new event has occurred.
		window.digitalData.events.push(event_);
/*		if ( typeof jQuery != "undefined") {
			jQuery(window).trigger(event_);
		}
*/
		window.dispatchEvent(new CustomEvent(event_.type, {detail : event_}));

		return event_;
	};

	// The Component object is intended to capture information about a content component included
	// as part of a page, such as a video. Interactions with the component - such as playing the video
	// - would be an Event; use the events object to capture these instead.

	// Utility function to create new component entries.
	// Usage: window.digitalData.component.push(window.digitalData.newComponent({}))
	window.digitalData.newComponent = function(cmp) {
		var component_ = {
			componentID : null,
			componentName : null,
			description : null,
			category : {
				primaryCategory : null,
				subcategories : [],
				componentType : null
			},
			attributes : {}
		};
		if (cmp) {
			(cmp.componentID != undefined) ? (component_.componentID = cmp.componentID) : (component_.componentID);
			(cmp.componentName != undefined) ? (component_.componentName = cmp.componentName) : (component_.componentName);
			(cmp.description != undefined) ? (component_.description = cmp.description) : (component_.description);
			(cmp.category != undefined) ? (component_.category = cmp.category) : (component_.category);
			(cmp.attributes != undefined) ? (component_.attributes = cmp.attributes) : (component_.attributes);
		}
		return component_;
	};

	// Utility function to create new user entries.
	// Usage: window.digitalData.user.push(window.digitalData.newUser({}))
	window.digitalData.newUser = function(usr) {
		var user_ = {
			segment : {},
			profile : [{
				profileID : null,
				userName : null,
				email : null,
				language : null,
				returningStatus : null,
				type : null,
				address : {
					line1 : null,
					line2 : null,
					city : null,
					stateProvince : null,
					postalCode : null,
					country : null
				},
				social : {},
				attributes : {}
			}],
			attributes : {
				loginStatus : false
			}
		};
		if (usr) {
			(usr.segment != undefined) ? (user_.segment = usr.segment) : (user_.segment);
			(usr.profile != undefined) ? (user_.profile = usr.profile) : (user_.profile);
			(usr.attributes != undefined) ? (user_.attributes = usr.attributes) : (user_.attributes);
		}
		return user_;
	};

})();

// sample code for demo -
window.digitalData.debug = true;
//This event handler goes into DTM 


window.digitalData.eventHandler = function() {
	//if ( typeof jQuery != "undefined") {
		// binding is based on event.type:
		window.addEventListener("CustomTagEvent", function(e) {
			if (window.digitalData.debug !== false) {
				console.log("event triggered: name-" + e.detail.eventName + " action-" + e.detail.eventAction + " type-" + e.type);
				//console.log("non jQuery: name-" + e.detail.eventName + " action-" + e.detail.eventAction + " type-" + e.type);
      }
     
		});
};

window.digitalData.eventHandler();


//These triggers would happen on the page and exist just as examples for how to call the function. 
// trigger an event:
window.digitalData.newEvent({
	eventName : "TEST Tool Usage: Tool Interactions",
	eventAction : "TEST Tool Interactions",
	type : "CustomTagEvent"
});
window.digitalData.newEvent({
	eventName : "TEST Cart Add",
	eventAction : "TEST CartAdd",
	type : "CustomTagEvent"
});
