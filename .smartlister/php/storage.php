<?php


//  add useful functions
require 'useful.php';


//  get directory
$directory = getDirectory('actual');
$breadcrums = explode('/', $directory);


//  make path fit for url
$urlDir = '';
$count = count($breadcrums);
foreach ($breadcrums as $breadcrum) {

    //  skip root item
    if ($breadcrum == 'root') {continue;}

    //  formate crum for url
    $urlDir .= rawurlencode($breadcrum);

    //  add slash
    $urlDir .= '/';

}

//  make directory
$directory = realpath( '../..' . urldecode($urlDir) );


//  calculate folder size
$size = 0;
$path = $directory;
if ($path!==false && $path!='' && file_exists($path)) {
    foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS)) as $object) {
        $size += $object->getSize();
    }
}
$size = human_filesize($size);


//  print size to page
echo json_encode(['storage' => $size]);


?>
