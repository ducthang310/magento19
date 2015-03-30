/**
 * Created with JetBrains PhpStorm.
 * User: uuser
 * Date: 3/27/15
 * Time: 5:16 PM
 * To change this template use File | Settings | File Templates.
 */

var dtCheckout = Class.create();
dtCheckout.prototype = {
    initialize: function(){
    },

    onComplete: function (transport) {
        if (transport && transport.responseText){
            try{
                response = eval('(' + transport.responseText + ')');
            }
            catch (e) {
                response = {};
            }
        }

        alert(response.status + ": " + response.message);
        if(jQuery('.header-minicart')){
            jQuery('.header-minicart').html(response.minicart_head);
        }

        if (jQuery("#dt-quickcheckout-popup")) {
            jQuery("#dt-quickcheckout-popup").html(response.checkout_box);
            jQuery("#dt-quickcheckout-popup").show();
        }
    },

    addToCart: function(url, data) {
        var request = new Ajax.Request(
            url,
            {
                method: 'post',
                parameters: data,
                onComplete: this.onComplete
            }
        );
    },

    checkout: function() {

    }
}