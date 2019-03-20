<?php




/*

  Customizable settings file

*/
$settings = [


    //  name of smartlister's folder (default = '.smartlister')
    //  this value should be identical to the first require in index.php (line 38)
    'listerFolderName' => '.smartlister',



    //  show hidden files/folders
    'hiddenItems' => true,



    //  toggle ability to upload files (also drag-and-drop)
    'fileUpload' => true,


    //  toggle ability to create folders
    'folderCreation' => true,


    //  toggle ability to delete files and folders
    'deleteItems' => true,


    //  toggle ability to rename files and folders (activate via f2 key)
    'renameItems' => true,


    //  toggle ability to move file and folders
    'moveItems' => true,



    //  change theme color (default = '#80D8FF')
    //  recommended alternatives
    //  red    => '#FF6176'
    //  green  => '#4DFF61'
    //  purple => '#D685FF'
    //  yellow => '#FFD46D'
    'themeColor' => '#80D8FF',



    /*

  	  change php.ini limits (default = 'default')

  	  phpMemoryLimit: amount of memory php is aloud to use for one script
  	  phpPostMaxSize: maximum post size for a php script
  	  phpUploadMaxSize: max file size that can be uploaded

  	  example: to change to a 100mb limit - '100M'

  	*/
  	'phpMemoryLimit' => 'default',
  	'phpPostMaxSize' => 'default',
  	'phpUploadMaxSize' => 'default'


];




//  change memory_limit in php ini
if ($settings['phpMemoryLimit'] !== 'default')
{
    ini_set('memory_limit', strval($settings['phpMemoryLimit']));
}

//  change post_max_size in php ini
if ($settings['phpPostMaxSize'] !== 'default')
{
    ini_set('post_max_size', strval($settings['phpPostMaxSize']));
}

//  change upload_max_filesize in php ini
if ($settings['phpUploadMaxSize'] !== 'default')
{
    ini_set('upload_max_filesize', strval($settings['phpUploadMaxSize']));
}



?>
