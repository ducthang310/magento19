<?php

require_once 'abstract.php';

class Mage_Shell_Api extends Mage_Shell_Abstract
{
    protected function _deleteAllProducts()
    {
        $col = Mage::getModel('catalog/product')->getCollection();
        foreach ($col as $product) {
            try {
                $product->delete();
            } catch (Exception $e) {
                Mage::logException($e);
            }

        }
    }

    private function _getOrderList()
    {
        $this->_dtCount = 0;
        $fileOrderId = Mage::getBaseDir('media') . DS .'import' . DS . 'order_ids.csv';

        $csvObject  = new Varien_File_Csv();
        $csvData = $csvObject->getData($fileOrderId);

        $client = new SoapClient('http://buywacom.com.au/api/soap/?wsdl');
        $session = $client->login('newu', 'newunewu');
//        $filters = array(
//            'increment_id' => array('like' => '100000005%')
//        );
        $startNumber = 50;
        $endNumber = 70;
//        for($i = $startNumber; $i < $endNumber; $i++) {
            $result = $client->call($session,'order.info',  '100006944' );
            $this->_createCommentFile($result['status_history'], '100006944');
            $this->_createOrderFile($result);

//        Mage::log(print_r($result, true), null, 'dt_order.log');
//        }
    }

    private  function _createOrderFile($result) {
        $this->_dtCount++;
        $orderData = new Varien_Object();
        $orderData->addData($result);

        // Billing
        $billing = new Varien_Object();
        $billing->addData($orderData->getBillingAddress());
        $orderData->setBillingAddress($billing);

        // Shipping
        $shipping = new Varien_Object();
        $shipping->addData($orderData->getShippingAddress());
        $orderData->setShippingAddress($shipping);

        // Payment
        $payment = new Varien_Object();
        $payment->addData($orderData->getPayment());
        $orderData->setPayment($payment);

        // Items
        $items = $orderData->getItems();
        $count = count($items);
        for ($i = 0; $i < $count; $i++) {
            $itemData = new Varien_Object();
            $itemData->addData($items[$i]);
            $items[$i] = $itemData;
        }
        $orderData->setItems($items);

        Mage::getModel('exporter/exportorders')->exportPro($orderData);
        var_dump('End ^^  -  ' . $this->_dtCount);
    }

    private function _createCommentFile($comment, $orderId)
    {
        $comment = Mage::helper('core')->jsonEncode($comment);
        $filePath = Mage::getBaseDir('export'). DS . 'List_Comments.csv';

        try {
            $fp = fopen($filePath, 'a');
            $record = array($orderId, $comment);
            fputcsv($fp, $record, ',');
            fclose($fp);
        } catch(Exception $e) {
            Mage::logException($e);
        }
    }

    private  function _createComment() {
        $filePath = Mage::getBaseDir('export'). DS . 'List_Comments.csv';
        $csvObject  = new Varien_File_Csv();
        $data = $csvObject->getData($filePath);
        foreach ($data as $row) {
            $order = Mage::getModel('sales/order')->loadByIncrementId($row[0]);
            $data = Mage::helper('core')->jsonDecode($row[1]);
            try {
                foreach ($data as $comment) {
                    $order->addStatusHistoryCommentPro($comment);
                }
                $order->save();
            } catch (Exception $e) {
                Mage::logException($e);
            }
        }
    }

    /**
     * Run script
     *
     */
    public function run()
    {
        $this->_getOrderList();
//        $this->_createComment();
    }

    /**
     * Retrieve Usage Help Message
     *
     */
    public function usageHelp()
    {
        return <<<USAGE
Usage:  php -f api.php
  help          This help

USAGE;
    }
}

$shell = new Mage_Shell_Api();
$shell->run();
