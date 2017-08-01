/* String.customTrim - custom cleanup method for Text */
if (typeof String.prototype.customTrim !== 'function') {
    String.prototype.customTrim = function () {
        return this.replace("aFeoOverrideAttrRead('img', 'src')", '').replace(/^\s+|\s+$/g, '');
    };
}

javascript: (function () {
    if (typeof window._data == 'undefined') {
        window._data = {};
        window._data.utils = {};
        window._data.page = {};
        window._data.page.pageInfo = {};
        window._data.product = new Array();
        window._data.cart = {};
        window._data.transaction = {};
        window._data.events = new Array();
        window._data.version = "1.0";
        window._data.debug = false;

        window._data.getPageType = function () {
            var urlTests = {
                product: /\/p\//i,
                home: /^\/$/,
                category: /\/c\//i,
                searchresults: /\/search/i,
                cart: /\/cart/i,
                purchase: /\/orderConfirmation\//i,
                checkout: /checkout\//i
            }

            for (var prop in urlTests) {
                if (urlTests.hasOwnProperty(prop)) {
                    if (urlTests[prop].test(window.location.pathname)) {
                        return prop;
                    }
                }
            }
            return "other";
        };

        //Get query parameters and values from a path string or default
        //window.location (you can pass a url string otherwise it uses window.location)
        window._data.utils.getQueryParamValues = function (path) {
            if (typeof (path) == "string") {
                if (path.match(/:\\\\/i)) {
                    var url = new URL(path);
                } else {
                    var url = new URL(window.location.protocol + "//" + window.location.host + path);
                }
            } else {
                var url = new URL(window.location.href);
            }
            var whQueryParamValues = {};
            var match,
                pl = /\+/g, // Regex for replacing addition symbol with a space
                search = /([^&=]+)=?([^&]*)/g,
                decode = function (s) {
                    return decodeURIComponent(s.replace(pl, " "));
                },
                query = url.search.substring(1);
            while (match = search.exec(query))
                whQueryParamValues[decode(match[1])] = decode(match[2]);
            return whQueryParamValues;
        };

        window._data.utils.isElementVisible = function ($element) { //jQuery wrapped Element
            var windowHeight = $(window).height(),
                docScroll = $(document).scrollTop(),
                elPosition = $element.offset().top,
                elHeight = $element.height(),
                hiddenBefore = docScroll - elPosition,
                hiddenAfter = (elPosition + elHeight) - (docScroll + windowHeight);

            if ((docScroll > elPosition + elHeight) || (elPosition > docScroll + windowHeight)) {
                return false;
            } else {
                var result = 100;

                if (hiddenBefore > 0) {
                    result -= (hiddenBefore * 100) / elHeight;
                }

                if (hiddenAfter > 0) {
                    result -= (hiddenAfter * 100) / elHeight;
                }

                return result >= 25 ? true : false;
            };
        };

        //Get the Anchor text from an element
        window._data.utils.getElementText = function (element) {
            var text;
            //we are an anchor
            if (element.href) {
                text = jQuery(element).text().customTrim();
            }
            //anchor with image child
            if (jQuery(element).find("img").length > 0) {
                text = jQuery(element).find("img:first").attr("alt") || "Image without Alt Tag"
            }
            //we are an image
            if (element.src) {
                text = element.alt || "Image without Alt Tag";
            }
            //Catchall
            if (!text) {
                text = "No text could be determined for this link."
            }
            return text;
        };

        //Normalize our Error Tracking and send Exception to GA
        window._data.utils.trackError = function (msg, url, line, col, error) {
            // Note that col & error are new to the HTML 5 spec and may not be 
            // supported in every browser.
            var message = msg || "";
            var column = col || "";
            var lineNum = line || "";
            var refURL = url || "";
            var errorObj = error || "";
            var errorString = "ERROR: " + message;
            errorString += refURL ? "|URL: " + refURL : "";
            errorString += lineNum ? "|LINE: " + lineNum : "";
            errorString += column ? "|COL: " + column : "";
            errorString += errorObj ? "|ERROR OBJ: " + errorObj : "";
            try {
                //alert(errorString);
                ga('send', 'exception', {
                    'exDescription': errorString,
                    'exFatal': false
                })
            } catch (e) {
                //Nothing to do at this point.
            }
            var suppressErrorAlert = false;
            //If you return true, then error alerts and messages will be suppressed 
            //(default: false)
            return suppressErrorAlert;
        };

        // round/truncate a number to n decimal points: 
        window._data.utils.roundValue = function (value, n) {
            return Math.round(Math.pow(10, n) * value) / Math.pow(10, n);
        };

        window._data.utils.getElementUrl = function (element) {
            switch (element.nodeName) {
                case "BUTTON":
                    try {
                        if (element.getAttribute("onclick").match(/(\/.*?)\'/) != -1) {
                            return window.location.hostname + element.getAttribute("onclick").match(/(\/.*?)\'/)[1];
                        }
                    } catch (e) {
                        return "Cannot Determine URL";
                    }
                    break;
                case "A":
                    try {
                        return window.location.hostname + element.getAttribute("href");
                    } catch (e) {
                        return "Cannot Determine URL";
                    }
                    break;
            }
        };

        window._data.getBreadCrumbs = function () {
            $('.breadcrumbs a').map(function (i, el) {
                return $(el).text().trim();
            }).toArray()
        };
        /*
        breadToCat: function(isProduct){
        var isProduct = isProduct || false;
        var category = "";
        $(".breadcrumbs a").each(function(n){
                if(isProduct){
                    if(n == $(".breadcrumbs a").length-1){
                        return false;
                    }
                }
                try {
                    switch(n){
                        case 0:
                            break;
                        case 1:
                            category += $(this).text().customTrim();
                            break;
                        default:
                            category += "/"+$(this).text().customTrim();
                    }
                } catch(e) {
                    //Do Nothing
                }
        })
        return category;
    }*/

        // **_data.page.pageInfo:**a
        // Describes details about the page.
        //
        window._data.page.pageInfo = {
            destinationURL: document.URL,
            referringURL: document.referrer,
            breadCrumbs: window._data.getBreadCrumbs(),
            geoRegion: "",
        };

        window._data.page.category = {
            pageType: window._data.getPageType()
        };

        // **_data.page.attributes:**
        // This object provides extensibility to the Page object. All names are optional and should fit the
        // individual implementation needs in both naming and values passed.
        window._data.page.attributes = {};

        if (window._data.page.pageType == "searchresults") {
            // added to capture data specific to search results pages.
            window._data.page.attributes.search = {
                searchTerm: window._data.utils.getQueryParamValues(window.location.search),
            };
        }

        // **_data.newProduct:** Utility function to create new product entries.
        // Usage: window._data.product.push(window._data.newProduct({}))
        window._data.newProduct = function (p) {
            // The **Product object** carries details about a particular product with frequently used properties
            // listed below.
            // This is intended for data about products displayed on pages or other content. For
            // products added to a shopping cart or ordered in a transaction, see the Cart and Transaction
            // objects below.
            var product_ = {
                sku: null,
                productID: null,
                productName: null,
                category: null,
                quantity: null,
                price: null,
                variant: null,
                position: null,
                attributes: {}
            };
            if (p) {
                (p.sku != undefined) ? (product_.sku = p.sku) : (product_.sku);
                (p.productID != undefined) ? (product_.productID = p.productID) : (product_.productID);
                (p.productName != undefined) ? (product_.productName = p.productName) : (product_.productName);
                (p.quantity != undefined) ? (product_.quantity = p.quantity) : (product_.quantity);
                (p.price != undefined) ? (product_.price = p.price) : (product_.price);
                (p.variant != undefined) ? (product_.variant = p.variant) : (product_.variant);
                (p.position != undefined) ? (product_.position = p.position) : (product_.position);
                (p.category != undefined) ? (product_.category = p.category) : (product_.category);
                (p.attributes != undefined) ? (product_.attributes = p.attributes) : (product_.attributes);
            }
            return product_;
        };

        // The **Cart object** carries details about a shopping cart or basket and the products that have been
        // added to it. The Cart object is intended for a purchase that has not yet been completed. See the
        // Transaction object below for completed orders.
        window._data.cart.cartID = null;
        // **_data.cart.price:** This object provides details of the cart price. The **basePrice** SHOULD be the price of the
        // **items** before applicable discounts, shipping charges, and tax. The **cartTotal** SHOULD be
        // the total price inclusive of all discounts, charges, and tax.
        //
        // **Reserved:** **basePrice** (Number), **voucherCode** (String), **voucherDiscount** (Number),
        // **currency** (String), **taxRate** (Number), **shipping** (Number), **shippingMethod** (String),
        // **priceWithTax** (Number), **cartTotal** (Number)
        window._data.cart.price = {
            basePrice: null,
            voucherCode: null,
            voucherDiscount: null,
            currency: null,
            taxRate: null,
            shipping: null,
            shippingMethod: null,
            priceWithTax: null,
            cartTotal: null,
            attributes: {}, // This object provides extensibility to the cart as a whole. Any additional dimensions related to the cart can be provided.
            item: [] // [one or more product objects] window._data.cart.item.push(window._data.newProduct({})) could be used to populate the cart.

        };

        window._data.cart.product = [];

        window._data.transaction = {
            id: null,
            revenue: null,
            tax: null,
            shipping: null,
            coupon: null,
            attributes: {}
        };

        // Utility function to create new event entries.
        window._data.newEvent = function (ev) {
            var event_ = {
                eventName: null,
                eventAction: null,
                eventPoints: null,
                type: null,
                timeStamp: new Date(),
                effect: null,
                category: {
                    primaryCategory: null,
                    subCategory: null
                },
                attributes: {}
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
            window._data.events.push(event_);
            window.dispatchEvent(new CustomEvent(event_.type, {
                detail: event_
            }));

            return event_;
        };

        window._data.myron = {};
        window._data.myron.setGeoRegion = function (geoRegion) {
            window._data.page.pageInfo.geoRegion = geoRegion;
        };

        window._data.myron.setProductCheck = function () {
            console.log("WH - setProductCheck");
            if (typeof (this.checkProductTimeoutId) == "number") {
                clearTimeout(this.checkProductTimeoutId);
            }
            this.checkProductTimeoutId = setTimeout(window._data.myron.checkProductPositions, 300);
        };

        window._data.myron.getGeoRegion = function () {
            if (window.location.hostname.toLowerCase().indexOf(".com") > 0) {
                return "US";
            }
            if (window.location.hostname.toLowerCase().indexOf(".de") > 0) {
                return "DE";
            }
            if (window.location.hostname.toLowerCase().indexOf(".co.uk") > 0) {
                return "UK";
            }
            if (window.location.hostname.toLowerCase().indexOf(".fr") > 0) {
                return "FR";
            }
            if (window.location.hostname.toLowerCase().indexOf(".ch") > 0) {
                return "CH";
            }
            if (window.location.hostname.toLowerCase().indexOf(".it") > 0) {
                return "IT";
            }
        };

        window._data.myron.bindStandardEvents = function () {
            $("a").on("click", function () {
                var fileReg = /\.(zip|exe|dmg|pdf|docx?|xlsx?|pptx?|mp3|txt|rar|wma|mov|avi|wmv|flv|wav|rm|sit|sitx|tgz)/i;
                if (fileReg.test(this.href)) {
                    window._data.newEvent({
                        eventName: this.href,
                        eventAction: window._data.utils.getElementText(this),
                        type: "Downloads",
                        attributes: {
                            nonInteraction: true
                        }
                    });
                }

                var telReg = /tel:/i;
                if (telReg.test(this.href)) {
                    window._data.newEvent({
                        eventName: this.href.replace(/tel:/, ""),
                        eventAction: "Phone",
                        type: "Contact",
                        attributes: {
                            nonInteraction: true
                        }
                    });
                }

                var emailReg = /mailto:.*?@.*$/i;
                //console.log(emailReg.test(this.href));
                if (emailReg.test(this.href)) {
                    window._data.newEvent({
                        eventName: this.href.replace(/mailto:/, ""),
                        eventAction: "Email",
                        type: "Contact",
                        attributes: {
                            nonInteraction: true
                        }
                    });
                }

                if ($(this).is(".a2a_i")) {
                    var socialReg = /facebook|google_plus|email|reddit|twitter|pinterest|linkedin|tumblr/i;
                    if (socialReg.test(this.href)) {
                        window._data.newEvent({
                            eventName: "Link Click",
                            eventAction: this.href.match(/facebook|google_plus|email|reddit|twitter|pinterest|linkedin|tumblr/i)[0],
                            type: "Social",
                            attributes: {
                                nonInteraction: true
                            }
                        });
                    }
                }
            });

            /* Ribbon Link Click */
            $("#ribbon_content a").on("click", function () {
                window._data.newEvent({
                    eventName: $(this).text().customTrim(),
                    eventAction: "Ribbon Click",
                    type: "Navigation - Ribbon",
                    attributes: {
                        nonInteraction: true
                    }
                });
            });

            /* Banner Image Click */
            // CMYRNANQ-20
            $('div.main div.carousel-inner div.item map area').on('mousedown', function () {
                var action = "Banner Click";
                if (typeof $("ol.carousel-indicators li.active").data("slide-to") != 'undefined') {
                    action += " : " + (parseInt($("ol.carousel-indicators li.active").data("slide-to") + 1));
                }
                if (typeof $(this).prop('alt') != 'undefined') {
                    window._data.newEvent({
                        eventName: $(this).prop('alt').customTrim(),
                        eventAction: action,
                        type: "Navigation - Banner",
                        attributes: {
                            nonInteraction: true
                        }
                    });
                } else {
                    window._data.newEvent({
                        eventName: "None",
                        eventAction: action,
                        type: "Navigation - Banner",
                        attributes: {
                            nonInteraction: true
                        }
                    });
                }
            });

            /* Javascript Error */
            if (typeof (window._data.utils) != "undefined") {
                window.onerror = window._data.utils.trackError();
            }
        };

        window._data.myron.bindNavigationEvents = function () {

            /* Primary Nav Links */
            $(".top-nav-item > .title > a").on("mousedown", function () {
                window._data.newEvent({
                    eventName: $(this).text().customTrim(),
                    eventAction: "Primary",
                    type: "Navigation - Top",
                    attributes: {
                        nonInteraction: true
                    }
                });
            });

            /* Sub-Navigation Links */
            $(".menu-dropdown a").on("mousedown", function () {
                var parentText = $(this).parents(".menu-dropdown").prev().find("a").text().customTrim();
                window._data.newEvent({
                    eventName: $(this).text().customTrim(),
                    eventAction: parentText,
                    type: "Navigation - Top",
                    attributes: {
                        nonInteraction: true
                    }
                });
            });

            /* Sub-Navigation Links - Side */
            $(".sidebar-menu-item > .title > a").on("mousedown", function () {
                window._data.newEvent({
                    eventName: $(this).text().customTrim(),
                    eventAction: $(this).text().customTrim(),
                    type: "Navigation - Top",
                    attributes: {
                        nonInteraction: true
                    }
                });
            });

            /* Footer Links */
            $(".footer-columns a").on("click", function () {
                window._data.newEvent({
                    eventName: $(this).text().customTrim(),
                    eventAction: "Primary",
                    type: "Navigation - Footer",
                    attributes: {
                        nonInteraction: true
                    }
                });
            });

            /* Header Links */
            $(".top-nav ul.service-links li > div > a, .top-nav ul.service-links li > a").on("mousedown", function () {
                window._data.newEvent({
                    eventName: $(this).text().customTrim(),
                    eventAction: "Primary",
                    type: "Navigation - Header",
                    attributes: {
                        nonInteraction: true
                    }
                });
            })

            /* Chat Button */
            $(".footer-chat-box-button").on("mousedown", function () {
                window._data.newEvent({
                    eventName: "Launch",
                    eventAction: "Chat",
                    type: "Contact",
                    attributes: {
                        nonInteraction: true
                    }
                });
            });

            /* Continue Shopping Checkout */
            $(".continue-shopping").on("click", function () {
                window._data.newEvent({
                    eventName: window._data.utils.getElementUrl(this),
                    eventAction: $(this).text().customTrim(),
                    type: "Shopping Engagement",
                    attributes: {
                        nonInteraction: true
                    }
                });
            })

            /* Continue Shopping Links */
            if (window._data.page.category.pageType != "checkout") {
                $(".continue a , button[name='continue']").on("click", function () {
                    window._data.newEvent({
                        eventName: window._data.utils.getElementUrl(this),
                        eventAction: $(this).text().customTrim(),
                        type: "Shopping Engagement",
                        attributes: {
                            nonInteraction: true
                        }
                    });
                });
            } else {
                $(".continue a , button[name='continue']").on("click", function () {
                    window._data.newEvent({
                        eventName: "Continue to Next Checkout Step",
                        eventAction: $(this).text().customTrim(),
                        type: "Shopping Engagement",
                        attributes: {
                            nonInteraction: true
                        }
                    });
                });
            }

            /* Edit Order Links */
            $(".edit-order a").on("click", function () {
                window._data.newEvent({
                    eventName: "Edit Order Click",
                    eventAction: "Edit Order",
                    type: "Shopping Engagement",
                    attributes: {
                        nonInteraction: true
                    }
                });
            });

            /* Category - Sort Order */
            $("select#sortOptions2").on("change", function () {
                window._data.newEvent({
                    eventName: $("#" + this.id + " option:selected").text().customTrim(),
                    eventAction: "Sort By",
                    type: "Category Sort Engagement",
                    attributes: {
                        nonInteraction: true
                    }
                });
            });

            /* Checkout - Proceed to Checkout Checkout */
            $("button[name='checkout']").on("click", function () {
                window._data.newEvent({
                    eventName: "Checkout Login Modal Popup",
                    eventAction: $(this).text().customTrim(),
                    type: "Shopping Engagement",
                    attributes: {
                        nonInteraction: true
                    }
                });
            });

            /* Checkout - Existing Customer Login */
            $(".checkout-login-form .login-modal-existing-customer button[type='submit']").on("click", function () {
                window._data.newEvent({
                    eventName: "Sign In",
                    eventAction: "Existing Customer",
                    type: "Checkout Method",
                    attributes: {
                        nonInteraction: true
                    }
                });
            });

            /*Checkout -  New Customer w/ Email */
            $(".checkout-login-form .login-modal-new-customer button[type='submit']").on("click", function () {
                window._data.newEvent({
                    eventName: "Continue",
                    eventAction: "New Customer w/Email",
                    type: "Checkout Method",
                    attributes: {
                        nonInteraction: true
                    }
                });
            });

            /* Checkout - Checkout as Guest */
            $("a[href='/checkout/myron/guest']").on("click", function () {
                window._data.newEvent({
                    eventName: "Checkout as Guest",
                    eventAction: "Guest",
                    type: "Checkout Method",
                    attributes: {
                        nonInteraction: true
                    }
                });
            });

            /* Checkout - Payment Type */
            if (window.location.pathname == "/checkout/multi/add-payment-method") {
                $("input[type='radio']").on("click", function () {
                    var radioClass = $(this).attr("class").customTrim();
                    var payCredit = /open-credit-form-pane/i;
                    var payInvoice = /open-invoiceme-form-pane/i;

                    if (payCredit.test(radioClass)) {
                        window._data.newEvent({
                            eventName: "Credit Card",
                            eventAction: "Select",
                            type: "Payment Method",
                            attributes: {
                                nonInteraction: true
                            }
                        });
                    }

                    if (payInvoice.test(radioClass)) {
                        window._data.newEvent({
                            eventName: "Invoice Me Later",
                            eventAction: "Select",
                            type: "Payment Method",
                            attributes: {
                                nonInteraction: true
                            }
                        });
                    }
                });
            }

            /* Checkout - Shipping Option */
            $("select#shippingOptionSelect").on("change", function () {
                window._data.newEvent({
                    eventName: $("#" + this.id + " option:selected").text().customTrim().replace(/[ ]-[ ].*$/, ""),
                    eventAction: "Option Selected",
                    type: "Shipping Method",
                    attributes: {
                        nonInteraction: true
                    }
                });
            });

            /* Checkout - Place Your Order */
            $("button[name='place-your-order']").on("click", function () {
                window._data.newEvent({
                    eventName: "Place Your Order Click",
                    eventAction: "Place Your Order",
                    type: "Shopping Engagement",
                    attributes: {
                        nonInteraction: true
                    }
                });
            });

        };

        window._data.myron.bindProductPageEvents = function () {
            /* Product */
            if (window._data.page.category.pageType === "product") {
                /* Product Rating */
                if ($(".star-rating span").first().text().customTrim()) {
                    window._data.newEvent({
                        eventName: document.querySelector("[itemprop~='productID']").getAttribute("content"),
                        eventAction: "Product Rating",
                        type: "Product Information",
                        attributes: {
                            nonInteraction: true,
                            value: $(".star-rating span").first().text().customTrim()
                        }
                    });
                }

                /*Design Now*/
                $("#personalizeAndAddToCart").on("click", function () {
                    window._data.newEvent({
                        eventName: "Design Now Click",
                        eventAction: "Design Now",
                        type: "Shopping Engagement",
                        attributes: {
                            nonInteraction: true
                        }
                    });
                });

                /*Buy Now*/
                $("#expressPersonalizeAndAddToCart").on("click", function () {
                    window._data.newEvent({
                        eventName: "Buy Now Click",
                        eventAction: "Buy Now",
                        type: "Shopping Engagement",
                        attributes: {
                            nonInteraction: true
                        }
                    });
                });

                /* Zip Code */
                $("#zip-form-button").on("click", function () {
                    window._data.newEvent({
                        eventName: $("#zip-code").val(),
                        eventAction: "Apply Shipping Zip Code",
                        type: "Shopping Engagement",
                        attributes: {
                            nonInteraction: true
                        }
                    });
                })

                /* Quantity */
                $("#productAmount").on("change", function () {
                    window._data.newEvent({
                        eventName: $(this).val(),
                        eventAction: "Change Quantity",
                        type: "Shopping Engagement",
                        attributes: {
                            nonInteraction: true
                        }
                    });
                })

                /* Product Details Accordian */
                $(".expander").on("click", function () {
                    window._data.newEvent({
                        eventName: $(this).next().text().customTrim(),
                        eventAction: "Change Product Detail Section",
                        type: "Product Information",
                        attributes: {
                            nonInteraction: true
                        }
                    });
                })
                $("a[href='#product-details-accordion-title']").on("click", function () {
                    window._data.newEvent({
                        eventName: "Product Details Link Click",
                        eventAction: "Product Details",
                        type: "Product Information",
                        attributes: {
                            nonInteraction: true
                        }
                    });
                })

                /* Write a Review */
                $("a[data-subsequenturl*='powerreview'], a[href='#pdp-reviews']").on("click", function () {
                    window._data.newEvent({
                        eventName: $(this).text().customTrim(),
                        eventAction: "Product Review Click",
                        type: "Product Information",
                        attributes: {
                            nonInteraction: true
                        }
                    });
                })

                /* Send Art Later */
                $("label[id*='sendArtLaterLabel']").on("click", function () {
                    window._data.newEvent({
                        eventName: "Send Art Later Click",
                        eventAction: "Send Art Later",
                        type: "Shopping Engagement",
                        attributes: {
                            nonInteraction: true
                        }
                    });
                });

                /* Select Number of Colors */
                $("select[id*='selectColors']").on("change", function () {
                    window._data.newEvent({
                        eventName: $("#" + this.id + " option:selected").text().customTrim(),
                        eventAction: "Select Number of Colors",
                        type: "Shopping Engagement",
                        attributes: {
                            nonInteraction: true
                        }
                    });
                });

                /* Selected Colors */
                $(".color-swatches-pdp img.product-swatch").on("click", function () {
                    window._data.newEvent({
                        eventName: $(this).data("color") + " | " + $(this).data("swatchcolorname"),
                        eventAction: "Select Color",
                        type: "Shopping Engagement",
                        attributes: {
                            nonInteraction: true
                        }
                    });
                });
            }
        };

        window._data.myron.bindSearchPageEvents = function () {
            /* Site Search Empty Results */
            if (window._data.page.category.pageType === "searchresults") {
                if ($(".noSearchH2, .sitemap").length > 0) {
                    var queryObj = window._data.page.attributes.search.searchTerm;
                    window._data.newEvent({
                        eventName: (queryObj.text == "" ? "No Search Text Entered" : queryObj.text),
                        eventAction: "No Results",
                        type: "Site Search",
                        attributes: {
                            nonInteraction: true
                        }
                    });
                }
            }
        };

        window._data.myron.bindAddToCart = function () {
            /* Add to Cart*/
            $("#expressAddToCart, .buttonAddToCart").on("click", function () {
                getProductData = function (prodElement) {
                    var id = document.location.toString().split("/").pop().split("?")[0];
                    var name = $(prodElement).find("#productName").text().customTrim();
                    var category = whEnhancedEcommerce.breadToCat(true);
                    var variant = $(prodElement).find("img.product-swatch.current").data("color") || null; //Visible Color
                    var position = 1;
                    // TODO: should be UNIT price, not total price
                    // var price = $("#price-break-total").text().match(/[0-9.,]+\.[0-9][0-9]$|[0-9.,]+\,[0-9][0-9]$/)[0];
                    var price = $("#price-break").text().match(/[0-9.,]+\.[0-9][0-9]$|[0-9.,]+\,[0-9][0-9]$/)[0];
                    var quantity = $("#productAmount");
                    if (quantity.length > 0) {
                        quantity = quantity.val();
                    } else {
                        quantity = null;
                    }
                    return window._data.newProduct({
                        "productID": id,
                        "productName": name,
                        "category": category,
                        "variant": variant,
                        "position": position,
                        "price": price,
                        "quantity": quantity
                    });
                };

                $productElement = $("[itemtype='http://schema.org/Product']").first();
                window._data.newEvent({
                    eventName: "Add to Cart",
                    eventAction: "Product Page",
                    type: "eCommerce Event",
                    attributes: {
                        nonInteraction: true,
                        product: window._data.newProduct(getProductData($productElement))
                    }
                });
            });
        };

        window._data.myron.buildCart = function () {
            if (window._data.page.category.pageType === "cart") {
                /* Cart Value */
                var productIDs = [];
                /* Get Cart IDs */
                jQuery(".cart-item-image a").each(function () {
                    var params = window._data.utils.getQueryParamValues(this.getAttribute("href"));
                    if (typeof (params.variant) != "undefined") {
                        productIDs.push(params.variant);
                    } else {
                        var path = this.getAttribute("href").match(/\/[A-Z0-9]+$/);
                        if (path) {
                            productIDs.push(path[0].substring["1"]);
                        }
                    }
                });

                productIDs.forEach(function (id) {
                    window._data.cart.product.push(window._data.newProduct({
                        "productID": id
                    }));
                });
            }
        };

        window._data.myron.buildCheckoutCart = function () {
            var items = $('div.order-info-items > div.order-info-item');
            window._data.cart.product = [];
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var id = $(item).find("div.name > span.small").text().customTrim();
                var name = $(item).find("div.name").text().customTrim();
                var category = "";
                var variant = $(item).find("div.name > span.sda").text().customTrim() || null; //Visible Color
                var position = i + 1;
                // should be unit price, not total price  TODO: fix this.  
                var price = $(item).find("div.total > span.summary-total").text().customTrim().match(/[0-9.,]+\.[0-9][0-9]$|[0-9.,]+\,[0-9][0-9]$/)[0];
                var quantity = $(item).find("div.count").text().match(/[0-9]+/).toString() || null;

                window._data.cart.product.push(window._data.newProduct({
                    "productID": id,
                    "productName": name,
                    "category": category,
                    "variant": variant,
                    "position": position,
                    "price": price,
                    "quantity": quantity
                }));
            }
        };

        window._data.myron.buildPurchaseCart = function () {
            var items = $('div.order-summary > div.order-summary-item');
            window._data.cart.product = [];
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var id = $(item).find('span.item-no').text().replace(new RegExp(/item no./i), "").customTrim();
                var name = $(item).find('span.product-title').text().customTrim();
                var category = ""; // TODO
                var variant = ""; // TODO 
                var position = i + 1;
                var price = $(item).find('div.row.large > span.col-2.cl').text().customTrim().match(/[0-9.,]+\.[0-9][0-9]$|[0-9.,]+\,[0-9][0-9]$/)[0];
                var quantity = $(item).find('span.line-qty').text().match(/[0-9]+/).toString() || null;

                window._data.cart.product.push(window._data.newProduct({
                    "productID": id,
                    "productName": name,
                    "category": category,
                    "variant": variant,
                    "position": position,
                    "price": price,
                    "quantity": quantity
                }));
            }
        };

        window._data.myron.setTransaction = function () {
            purchase.id = $('span.orderIdNr').text().customTrim();
            purchase.revenue = $('div.merch-total span.pull-right:first').text().customTrim().match(/[0-9.,]+\.[0-9][0-9]$|[0-9.,]+\,[0-9][0-9]$/)[0];
            purchase.tax = $("span.your-totals-netTax").text().customTrim().match(/[0-9.,]+\.[0-9][0-9]$|[0-9.,]+\,[0-9][0-9]$/)[0] || null;
            purchase.shipping = $('div#shippingNHandling span.pull-right:first').text().customTrim().match(/[0-9.,]+\.[0-9][0-9]$|[0-9.,]+\,[0-9][0-9]$/)[0];
            purchase.coupon = ""; // TODO: ask about test coupon codes/discounts

            window._data.transaction = { // Transaction details are provided in an actionFieldObject.
                'id': purchase.id, // (Required) Transaction id (string).
                'revenue': purchase.revenue, // Revenue (currency).
                'tax': purchase.tax, // Tax (currency).
                'shipping': purchase.shipping, // Shipping (currency).
                'coupon': purchase.coupon, // Transaction coupon (string).
                'attributes': {}
            };
        }

        window._data.myron.bindCartPageEvents = function () {
            if (window._data.page.category.pageType === "cart") {
                window._data.myron.buildCart();

                //Use for Euro- Based Sites
                totalValue = whMyronHelpers.sumEuroString(jQuery(".merch-total .pull-right:first").text());
                //Use for Dollar Based Sites
                //totalValue = whMyronHelpers.sumDollarString(jQuery(".merch-total .pull-right:first").text());
                window.whMyronHelpers.sendGAEvent("", "", productID, totalValue, true);

                window._data.newEvent({
                    eventName: window._data.cart.product.map(function (e) {
                        return e.productID
                    }).join(','),
                    eventAction: "Cart Value",
                    type: "Cart Information",
                    attributes: {
                        nonInteraction: true,
                        value: totalValue
                    }
                });

                /* Close Modal */
                $("#loginPopup a.closeModal").on("click", function () {
                    window._data.newEvent({
                        eventName: "Checkout Modal X Click",
                        eventAction: "Close Checkout Modal Popup",
                        type: "Shopping Engagement",
                        attributes: {
                            nonInteraction: true
                        }
                    });
                })

                /* Promo Code */
                $("#voucherCode_btn").on("click", function () {
                    window._data.newEvent({
                        eventName: $("#voucherCode").val(),
                        eventAction: "Apply Promo Code",
                        type: "Shopping Engagement",
                        attributes: {
                            nonInteraction: true
                        }
                    });
                })

                /* ZipCode */
                $("#shippingZipCode_btn").on("click", function () {
                    window._data.newEvent({
                        eventName: $("#shippingZipCode").val(),
                        eventAction: "Apply Shipping Zip Code",
                        type: "Shopping Engagement",
                        attributes: {
                            nonInteraction: true
                        }
                    });
                })
            }
        };

        window._data.myron.checkoutFunnelEcommerceEvents = function () {
            if (window._data.page.category.pageType === 'checkout') {
                window._data.myron.buildCheckoutCart();

                var billing = $('div.checkout-section-header').text().match(/billing/gi) || null;
                if (billing) {
                    window._data.newEvent({
                        eventName: "Billing",
                        eventAction: "Checkout Page",
                        type: "eCommerce Event",
                        attributes: {
                            nonInteraction: true,
                            step: 1,
                            cart: window._data.cart
                        }
                    });
                }
                var shipping = $('div.checkout-section-header').text().match(/shipping/gi) || null;
                if (shipping) {
                    window._data.newEvent({
                        eventName: "Shipping",
                        eventAction: "Checkout Page",
                        type: "eCommerce Event",
                        attributes: {
                            nonInteraction: true,
                            step: 2,
                            cart: window._data.cart
                        }
                    });
                }
                var payment = $('div.checkout-section-header').text().match(/payment/gi) || null;
                if (payment) {
                    window._data.newEvent({
                        eventName: "Review & Payment",
                        eventAction: "Checkout Page",
                        type: "eCommerce Event",
                        attributes: {
                            nonInteraction: true,
                            cart: window._data.cart,
                            step: 3,
                            shippingMethod: ($('#shippingOptionSelect option:selected').text().replace(/-.*/gi, "").customTrim() || null)
                        }
                    });
                }
            }
        };

        window._data.myron.orderConfirmation = function () {
            if (window._data.page.category.pageType === 'purchase') {
                window._data.myron.buildPurchaseCart();
                window._data.myron.setTransaction();
                window._data.newEvent({
                    eventName: "Purchase",
                    eventAction: "Order Confirmation Page",
                    type: "eCommerce Event",
                    attributes: {
                        nonInteraction: true,
                        cart: window._data.cart,
                        transaction: window._data.transaction
                    }
                });
            }
        };

        window._data.myron.getProductPageData = function (prodElement) {
            var productData = {};

            // TODO: should be style id instead of product id
            // var id = $(prodElement).find("[itemprop~='productID']").attr("content");
            var id = document.location.toString().split("/").pop().split("?")[0];
            var name = $(prodElement).find("#productName").text().customTrim();
            var category = whEnhancedEcommerce.breadToCat(true);
            var variant = $(prodElement).find("img.product-swatch.current").data("color") || null; //Visible Color
            var position = 1;
            // TODO: should be UNIT price, not total price
            // var price = $("#price-break-total").text().match(/[0-9.,]+\.[0-9][0-9]$|[0-9.,]+\,[0-9][0-9]$/)[0];
            var price = $("#price-break").text().match(/[0-9.,]+\.[0-9][0-9]$|[0-9.,]+\,[0-9][0-9]$/)[0];
            var quantity = $("#productAmount");
            if (quantity.length > 0) {
                quantity = quantity.val();
            } else {
                quantity = null;
            }

            productData = {
                "id": id,
                "name": name,
                "category": category,
                "variant": variant,
                "position": position,
                "price": price,
                "quantity": quantity
            };

            return productData;
        };

        window._data.myron.checkProductPositions = function () {

            var $productElements = $([]);
            var impressionsAdded = false;

            console.log("WH - checkProductPositions Fired! Pagetype:", whEnhancedEcommerce.pageType);
            switch (window._data.page.category.pageType) {
                case "category":
                case "searchresults":
                    $productElements = $("div.main [itemtype='http://schema.org/Product']");

                    console.log("WH - $productElements count", $productElements.length);
                    $productElements.each(function (index) {
                        if (window._data.utils.isElementVisible($(this)) && typeof ($(this).data('wh_ecomm_impression')) == "undefined") {
                            var productData = window._data.newProduct(window._data.myron.getCategoryProductData(this, index));
                            console.log("WH - Product Data:");
                            console.log(productData);
                            if (productData["id"] != null &&
                                productData["category"] != "" &&
                                productData["name"] != null &&
                                productData["price"] != null) {

                                //Send Product Impression
                                console.log("WH - Product Impression Added");
                                window._data.GA.ecommerce.addImpression(productData)
                                impressionsAdded = true;
                                $(this).data('wh_ecomm_impression', 'sent');
                            }
                        }
                    });

                    var categoryName = window._data.page.category.pageType == "category" ? "Category Page" : "Search Page"

                    if (impressionsAdded) {
                        window._data.newEvent({
                            eventName: "Product Impression",
                            eventAction: categoryName,
                            type: "eCommerce Event",
                            attributes: {
                                nonInteraction: true
                            }
                        });
                    }
                    break;
                case "product":
                    $productElement = $("[itemtype='http://schema.org/Product']").first();
                    if (typeof ($productElement.data('wh_ecomm_impression')) == "undefined") {
                        window._data.newEvent({
                            eventName: "Product Impression",
                            eventAction: "Product Page",
                            type: "eCommerce Event",
                            attributes: {
                                nonInteraction: true,
                                product: window._data.newProduct(window._data.myron.getProductPageData($productElement))
                            }
                        });
                        $productElement.data('wh_ecomm_impression', 'sent');
                    }
                    break;
            }
        };

        // GA _data plugin.  
        window._data.GA = {};
        window._data.GA.ecommerce = {};
        window._data.GA.sendEvent = function (category, action, label, value, noninteraction) {
            if (typeof (value) == "boolean") {
                noninteraction = value;
            }
            var val = Math.round(value) || null;
            var ni = noninteraction || null;
            if (typeof (ga) != "undefined") {
                if (typeof (val) == "number") {
                    if (ni) {
                        ga('send', 'event', category, action, label, val, {
                            nonInteraction: true
                        })
                    } else {
                        ga('send', 'event', category, action, label, val)
                    }
                } else {
                    if (ni) {
                        ga('send', 'event', category, action, label, {
                            nonInteraction: true
                        })
                    } else {
                        ga('send', 'event', category, action, label)
                    }
                }
            }
        };

        window._data.GA.ecommerce.init = function () {
            if (typeof (ga) == "undefined") {
                return false;
            }
            ga('require', 'ec');
        };

        window._data.GA.ecommerce.setAction = function (action, actionObj) {
            if (typeof (ga) == "undefined") {
                return false;
            }
            if (typeof (actionObj) == "undefined") {
                ga('ec:setAction', action);
            } else {
                ga('ec:setAction', action, actionObj);
            }
        };

        window._data.GA.ecommerce.addProduct = function (productData) {
            if (typeof (ga) == "undefined") {
                return false;
            }
            /*
            {   //Expected productData Object
                'id': id,
                'name': name,
                'category': category,
                'variant': variant,
                'position': position,
                'price': price
            }
            */
            ga('ec:addProduct', productData);
        };

        window._data.GA.ecommerce.addImpression = function (productData) {
            if (typeof (ga) == "undefined") {
                return false;
            }
            /*
            {   //Expected productData Object
                'id': id,
                'name': name,
                'category': category,
                'variant': variant,
                'position': position,
                'price': price
            }
            */
            ga('ec:addImpression', productData);
        };
    }
})();


// sample code for demo -
window._data.debug = true;

//This event handler goes into a TMS 
window._data.myron.eventHandler = function () {

    if (window._data.page.pageInfo.geoRegion === "US") {
        window.onscroll = function () {
            window._data.myron.setProductCheck();
        }
    }

    window.addEventListener("eCommerce Event", function (e) {
        if (window._data.debug !== false) {
            console.log("event triggered: name-" + e.detail.eventName + " action-" + e.detail.eventAction + " type-" + e.type);
            if (e.detail.eventName == "Purchase") {
                window._data.cart.product.forEach(function (element) {
                    window._data.GA.ecommerce.addProduct(element);
                });
                window._data.GA.ecommerce.setAction("purchase", window._data.transaction);
            }
            if (e.detail.eventName == "Product Impression" && e.detail.eventAction == "Product Page") {
                window._data.product.push(e.detail.attributes.product);
                window._data.GA.ecommerce.addImpression(e.detail.attributes.product);
                window._data.GA.ecommerce.setAction("detail");
            }
        }
        if (e.detail.eventName == "Add to Cart") {
            window._data.GA.ecommerce.addProduct(e.detail.attributes.product);
            window._data.GA.ecommerce.setAction("add");
        }
        if (e.detail.eventName == "Billing" ||
            e.detail.eventName == "Shipping" ||
            e.detail.eventName == "Review & Payment") {
            window._data.cart.product.forEach(function (element) {
                window._data.GA.ecommerce.addProduct(element);
            });
            window._data.GA.ecommerce.setAction("checkout", {
                'step': e.detail.attributes.step,
                'option': e.detail.attributes.shippingMethod
            });
        }
        window._data.GA.sendEvent(e.detail.eventType, e.detail.eventAction, e.detail.eventName, e.detail.attributes.nonInteraction);
        return true; 
    });

    var eventTypes = [
        "Downloads",
        "Contact",
        "Social",
        "Product Information",
        "Cart Information",
        "Shopping Engagement",
        "Navigation - Ribbon",
        "Navigation - Banner",
        "Navigation - Top",
        "Navigation - Footer",
        "Navigation - Header",
        "Site Search",
        "Checkout Method",
        "Payment Method",
        "Shipping Method",
        "Javascript Error",
        "Newsletter Signup",
        "Newsletter Signup Errors",
        "QSN Form",
        "QSN Form Errors",
        "New User Registration",
        "New User Registration Errors",
        "Customer Service Support",
        "Video Engagement",
        "Wishlist"
    ];
    eventTypes.forEach(function (element) {
        window.addEventListener(element, function (e) {
            debugger; 
            if (e.detail.attributes.value != 'undefined') {
                window._data.GA.sendEvent(e.detail.eventType, e.detail.eventAction, e.detail.eventName, e.detail.attributes.value, e.detail.attributes.nonInteraction);
            } else {
                window._data.GA.sendEvent(e.detail.eventType, e.detail.eventAction, e.detail.eventName, e.detail.attributes.nonInteraction);
            }
            return true; 
        })
    });
};

window._data.myron.setGeoRegion(window._data.myron.getGeoRegion());
if (window._data.page.pageInfo.geoRegion === "US") {
    window._data.GA.ecommerce.init();
    window._data.myron.checkoutFunnelEcommerceEvents();
    window._data.myron.orderConfirmation();
    window._data.myron.checkProductPositions();
    window._data.myron.bindAddToCart();
}
window._data.myron.eventHandler();
window._data.myron.bindStandardEvents();
window._data.myron.bindNavigationEvents();
window._data.myron.bindProductPageEvents();
window._data.myron.bindSearchPageEvents();
window._data.myron.bindCartPageEvents();