<?php


if (!(isset($_GET['fileDirectory']))) {
    echo 'No directory set';
    die;
}


//  get url vars
$fileDirectory = $_GET['fileDirectory'];
$size = $_GET['size'];
$fileName = 'lol';

//  get file path + info
$path = realpath( '../../' . $fileDirectory );


//  get file type
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$type = finfo_file($finfo, $path);


//  check if the file exists
if (!file_exists($path)) {
    echo 'File does not exist';
    die;
}


try {


    //  cache image for 1 week
    //  set image name
    //header("Cache-Control: max-age=604800");
    //header("Content-Disposition: inline; filename=$fileName");


    //  if file type = ico
    //  send full size image
    if ($type == 'image/x-icon') {
        header("Content-Type: $type");
        fpassthru(fopen($path, 'rb'));
        die;
    }


    //  resize image
    //  lower quality to 88%
    require 'resize.php';
    $image = new \Gumlet\ImageResize($path);
    $image->quality_jpg = 88;
    $image->resizeToBestFit($size, $size);

    //  open the file in the browser
    $image->output(IMAGETYPE_JPEG);


} catch(ImageResizeException  $error) {
    echo $error->getMessage();
}

exit;


?>
