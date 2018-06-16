<?php



//  change default php settings
ini_set('memory_limit', '800M');
ini_set('post_max_size', '108M');
ini_set('upload_max_filesize', '108M');


//  settings
$settings = [

    //  name of smartlisters folder (default = '.smartlister')
    //  this value should be identical to the first require in index.php (line 38)
    'listerFolderName' => '.smartlister',

    //  toggle ability to uplaod files
    'fileUpload' => true,

    //  toggle ability to create folders
    'folderCreation' => true

];



?>
