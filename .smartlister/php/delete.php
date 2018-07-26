<?php


//  add useful functions + settings
require 'useful.php';
require 'settings.php';


//  deny malformed requests
if (!isset($_POST['directory']) || !isset($_POST['name']) || !$settings['deleteItems']) {
    header('HTTP/1.0 403 Forbidden');
    die;
}


//  create response
$response = [
    'status' => 'ok'
];

//  get post vars
$directory = getDirectory('actual');
$type = $_POST['type'];
$name = $_POST['name'];
$filePath = realpath('../../' . $directory . '/' . $name);


//  delete file trees
function delTree($dir) {
   $files = array_diff(scandir($dir), array('.','..'));
    foreach ($files as $file) {
      (is_dir("$dir/$file")) ? delTree("$dir/$file") : unlink("$dir/$file");
    }
    return rmdir($dir);
}


//  catch any errors
try {

    //  check if file exists
    if ((file_exists($filePath) && $type == 'file') || (is_dir($filePath) && $type == 'folder')) {
        if ($type == 'folder') {
            if (!delTree($filePath)) {
                throw new Exception('Unable to delete folder');
            }
        } else {
            if (!unlink($filePath)) {
                throw new Exception('Unable to delete file');
            }
        }
    } else {
        throw new Exception('Item does not exist');
    }
} catch (Exception $err) {
    $response['status'] = $err;
}


//  send respnse
echo json_encode($response);


?>
