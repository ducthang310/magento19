<?php
/**
 * Created by JetBrains PhpStorm.
 * User: DucThang
 * Date: 3/27/15
 * Time: 5:46 PM
 */

require('Mage' . DS . 'Checkout' . DS . 'controllers' . DS . 'OnepageController.php');
class DT_QuickCheckout_IndexController extends Mage_Checkout_OnepageController
{
    public function quickAction()
    {
//        if (!$this->_validateFormKey()) {
//            $this->_redirect('*/*');
//            return;
//        }
//
//        if ($this->_expireAjax()) {
//            return;
//        }

        try {
            $data = $this->getRequest()->getPost('quick', array());
            // Save Method
            $method = 'guest';
            $this->getOnepage()->saveCheckoutMethod($method);

            // Save Billing && Shipping
            $customerAddressId = false;
            $billingData = array(
                'address_id' => '',
                'firstname' => 'Fn - ',
                'lastname' => $data['name'],
                'company' => 'smart',
                'email' => $data['email'],
                'street' =>
                array(
                    0 => '266 doi can',
                    1 => ''),
                'city' => 'ha noi',
                'region_id' => '13',
                'region' => '',
                'postcode' => '12121',
                'country_id' => 'US',
                'telephone' => $data['telephone'],
                'fax' => '',
                'customer_password' => '',
                'confirm_password' => '',
                'save_in_address_book' => '1',
                'use_for_shipping' => '1'
            );
            $this->getOnepage()->saveBilling($billingData, $customerAddressId);

            // Save ShippingMethod
            $method = 'freeshipping_freeshipping';
            $this->getOnepage()->saveShippingMethod($method);

            // Save Payment Method
            $data = array('method' => 'checkmo');
            $this->getOnepage()->savePayment($data);

            // Save Order
            $data = array('method' => 'checkmo');
            $data['checks'] = Mage_Payment_Model_Method_Abstract::CHECK_USE_CHECKOUT
                | Mage_Payment_Model_Method_Abstract::CHECK_USE_FOR_COUNTRY
                | Mage_Payment_Model_Method_Abstract::CHECK_USE_FOR_CURRENCY
                | Mage_Payment_Model_Method_Abstract::CHECK_ORDER_TOTAL_MIN_MAX
                | Mage_Payment_Model_Method_Abstract::CHECK_ZERO_TOTAL;
            $this->getOnepage()->getQuote()->getPayment()->importData($data);

            $this->getOnepage()->saveOrder();
            $this->_redirect('checkout/onepage/success');

        } catch (Exception $e) {
            Mage::logException($e);
            $result['error']    = true;
            $result['error_messages'] = $this->__('There was an error processing your order. Please contact us or try again later.');
            $this->getResponse()->setBody(Mage::helper('core')->jsonEncode($result));
        }

    }
}