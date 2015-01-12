<?php
/**
 * Created by JetBrains PhpStorm.
 * User: DucThang
 * Date: 1/12/15
 * Time: 2:39 PM
 */

class Raveinfosys_Exporter_ApiController extends Mage_Core_Controller_Front_Action
{
    public function getOrderAction() {
        $data = $this->getRequest()->getParams();
        if (isset($data['order_id'])) {
            $client = new SoapClient('http://buywacom.com.au/api/soap/?wsdl');
            $session = $client->login('newu', 'newunewu');
            try {
                $result = $client->call($session,'order.info', $data['order_id'] );
//            $result['customer_email'] = 'johnnysm310@gmail.com';
                $this->zendOrderFile($result);
                $filePath = Mage::getBaseDir('export'). DS . 'Orders_From_LiveSite.csv';
                $this->downloadFile($filePath);
                var_dump('End ^^  -  ');
            } catch (Exception $e) {
                echo '<span style="color: red;"><b>Order Id: ' . $data['order_id'] . '</b></span></br>';
                echo '<span style="color: blue;"><b>' . $e->getMessage() . '</b></span>';
            }

        } else {
            $this->loadLayout();
            $this->renderLayout();
        }
    }

    private  function zendOrderFile($result) {
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

    }

    private function downloadFile($path) {
        ignore_user_abort(true);
        set_time_limit(0); // disable the time limit for this script

        $dl_file = preg_replace("([^\w\s\d\-_~,;:\[\]\(\].]|[\.]{2,})", '', $_GET['download_file']); // simple file name validation
        $dl_file = filter_var($dl_file, FILTER_SANITIZE_URL); // Remove (more) invalid characters
        $fullPath = $path.$dl_file;

        if ($fd = fopen ($fullPath, "r")) {
            $fsize = filesize($fullPath);
            $path_parts = pathinfo($fullPath);
            $ext = strtolower($path_parts["extension"]);
            switch ($ext) {
                case "pdf":
                    header("Content-type: application/pdf");
                    header("Content-Disposition: attachment; filename=\"".$path_parts["basename"]."\""); // use 'attachment' to force a file download
                    break;
                // add more headers for other content types here
                default;
                    header("Content-type: application/octet-stream");
                    header("Content-Disposition: filename=\"".$path_parts["basename"]."\"");
                    break;
            }
            header("Content-length: $fsize");
            header("Cache-control: private"); //use this to open files directly
            while(!feof($fd)) {
                $buffer = fread($fd, 2048);
                echo $buffer;
            }
        }
        fclose ($fd);
        exit;
    }
}