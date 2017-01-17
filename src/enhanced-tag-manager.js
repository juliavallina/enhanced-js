/*!
 * Enhanced Tag Manager 1.0.0
 * Lib that eases metrics for GTM enhanced ecommerce
 * 
 * https://github.com/juliavallina/AÑADIR
 * 
 * Copyright 2017, Julia Vallina
 * 
 * Licensed under MIT
 * 
 * Released on: AÑADIR
 */

(function($, global, undefined) {
  'use strict';

  var $doc = $(document),
      dataLayer = global.dataLayer,
      // Available options
      options = {
        currency: 'EUR'
      };

  function init(user_options) {
    options = Object.assign(options, user_options);

    $('[data-etm-list]').each( function() {
      var actual_list = $(this);
      var actual_list_value = actual_list.data('etm-list');
      var products = actual_list.find('[data-etm-product]');

      pushImpressions(products, actual_list_value);
      attachEvents(products, actual_list_value);
    });
  }

  function pushImpressions(products, list) {
    var impressions = [];
    var position = 1;

    products.each( function() {
      var prod = $(this);
      var json_data = {};
      var data = prod.data('etm-product');
      if (data !== '') {
        try {
          // json_data = JSON.parse(data);
          json_data = data;
        } catch(error) {
          console.error("Error: Invalid format for product");
        }
      } else {
        // TO DO: SEARCH FOR VALUES
        console.log('TO DO');
      }
      json_data.position = position++;
      json_data.list = list;
      impressions.push(json_data);
    });

    dataLayer.push({
      'ecommerce': {
        'currencyCode': options.currency, // Local currency is optional.
        'impressions': impressions
      }
    });
  }

  function attachEvents(products, list) {
    products.each( function() {
      var prod = $(this);
      var position = 1;

      // PRODUCT_CLICK EVENT
      prod.on('click touchend', '[data-etm-product-link]', function() {
        dataLayer.push({
          'event': 'productClick',
          'ecommerce': {
            'click': {
              'actionField': {'list': list },
              'products': [{
                'name': 'product ' + position,  // Name or ID is required.
                // 'id': productObj.id,
                // 'price': productObj.price,
                // 'brand': productObj.brand,
                // 'category': productObj.cat,
                // 'variant': productObj.variant,
                'position': position
               }]
             }
          },
          'eventCallback': function() {
            document.location = this.url
          }
        });
      });

      // ADD_TO_CART EVENT
      prod.on('click touchend', '[data-etm-product-cart]', function() {
        dataLayer.push({
          'event': 'addToCart',
          'ecommerce': {
            'currencyCode': options.currency,
            'add': {         
              'actionField': {'list': list },
              'products': [{
                'name': 'product ' + position,
                // 'id': '12345',
                // 'price': '15.25',
                // 'brand': 'Google',
                // 'category': 'Apparel',
                // 'variant': 'Gray',
                'quantity': 1
               }]
            }
          }
        });
      });

      position += 1;
    });
  }


  window.EnhancedTM = {
    init: init
  };

})(jQuery, window);