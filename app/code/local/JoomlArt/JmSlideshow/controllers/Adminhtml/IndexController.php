<?php

class JoomlArt_JmSlideshow_Adminhtml_IndexController extends Mage_Adminhtml_Controller_Action
{

    /**
     * Ajax list images from folder path action
     */
    public function listImagesAction()
    {
        if( Mage::app()->getRequest()->isAjax() ){
            $block = $this->getLayout()->createBlock('core/template', 'jmslideshow.listImages');
            if($block){
                $block->setTemplate('jmslideshow/listImages.phtml');

                $source = Mage::app()->getRequest()->getPost('source', 'images');
                $folderPath = Mage::app()->getRequest()->getPost('folder_path');

                $storeCode = Mage::app()->getRequest()->getPost('store', null);
                $websiteCode = Mage::app()->getRequest()->getPost('website', null);

                //Get Images from folder
                $helper = Mage::helper('joomlart_jmslideshow/data');

                $configs = array();
                foreach($helper::$_params as $paramKey){
                    $configs[$paramKey] = $helper->get($paramKey, array(), $storeCode, $websiteCode);
                }
                $configs['folder'] = $folderPath;
                $configs['source'] = $source;

                $slides = $helper->getSlideShowData($configs);

                $block->setData('slides', $slides);

                echo $block->toHtml();
            }
        }
    }

    /**
     * Ajax delete images from folder path
     */
    public function deleteImagesAction()
    {
        $result = array(
            'error' => false
        );
        if( Mage::app()->getRequest()->isAjax() ){
            $imageName = Mage::app()->getRequest()->getPost('name', '');
            $folderPath = Mage::app()->getRequest()->getPost('folder_path');
            $imagePath = Mage::getBaseDir() . DS . $folderPath . DS . $imageName;

            try {
                unlink($imagePath);
                $result['message'] = 'The image has been deleted.';
            } catch (Exception $e) {
                $result['error'] = true;
                $result['message'] = $e->getMessage();
            }
        }

        $this->getResponse()->setHeader('Content-type', 'application/json');
        $this->getResponse()->setBody(json_encode($result));
    }

    /**
     * Ajax upload images from folder path
     */
    public function uploadImagesAction()
    {
        $result = array();

        $folderPath = Mage::app()->getRequest()->getPost('folder_path');
        $output_dir = Mage::getBaseDir() . DS . $folderPath;

        try {
            // Check exist folder & create new
            if (!is_dir($output_dir)) {
                mkdir($output_dir, 0777, true);
            }

            // Save new folder path
            Mage::getConfig()->saveConfig('joomlart_jmslideshow/joomlart_jmslideshow/folder', $folderPath);

            if(!is_array($_FILES['jm_images']["name"]))
            {
                $fileName = $_FILES['jm_images']["name"];
                move_uploaded_file($_FILES['jm_images']["tmp_name"],$output_dir . DS . $fileName);
                $result[]= $fileName;
            }
            else  //Multiple files, file[]
            {
                $fileCount = count($_FILES['jm_images']["name"]);
                for($i=0; $i < $fileCount; $i++)
                {
                    $fileName = $_FILES['jm_images']["name"][$i];
                    move_uploaded_file($_FILES['jm_images']["tmp_name"][$i],$output_dir.$fileName);
                    $result[]= $fileName;
                }
            }
        } catch (Exception $e) {
            Mage::logException($e->getMessage());
        }

        $this->getResponse()->setHeader('Content-type', 'application/json');
        $this->getResponse()->setBody(json_encode($result));
    }
}