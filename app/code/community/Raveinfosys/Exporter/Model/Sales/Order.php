<?php
/**
 * Created by JetBrains PhpStorm.
 * User: DUCTHANG
 * Date: 1/14/15
 * Time: 3:55 AM
 * To change this template use File | Settings | File Templates.
 */
class Raveinfosys_Exporter_Model_Sales_Order extends Mage_Sales_Model_Order
{
    public function addStatusHistoryCommentPro($data)
    {
        if (false === $data['comment']) {
            $status = $this->getStatus();
        } elseif (true === $data['comment']) {
            $status = $this->getConfig()->getStateDefaultStatus($this->getState());
        } else {
            $this->setStatus($status);
        }
        $history = Mage::getModel('sales/order_status_history')
            ->setComment($data['comment'])
            ->setStatus($data['status'])
            ->setCreatedAt($data['created_at'])
            ->setEntityName($data['entity_name']);
        $this->addStatusHistory($history);
        return $history;
    }
}