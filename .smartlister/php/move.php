<?php


//  add useful functions + settings
require 'useful.php';
require 'settings.php';


//  deny malformed requests
if (!isset($_POST['directory']) || !isset($_POST['name']) || !$settings['moveItems']) {
    header('HTTP/1.0 403 Forbidden');
    die;
}


//  create response
$response = [
    'status' => 'ok'
];

//  get post vars
$directory = getDirectory('actual');
$directoryBreadcrums = json_decode($_POST['newBreadcrums']);
$type = $_POST['type'];
$name = $_POST['name'];
$filePath = realpath('../../' . $directory . '/') . DIRECTORY_SEPARATOR;

//  loop breadcrums creating the new directory
//  remove root from string
$newDirectory = '';
foreach ($directoryBreadcrums as $folder) {
    $newDirectory .= $folder . '/';
}
$newDirectory = substr($newDirectory, 5);

//  get full new directory
$newFilePath = realpath('../../' . $newDirectory) . DIRECTORY_SEPARATOR;

//  catch any errors
try {
    //  check if file exists
    if ((file_exists($filePath.$name) && $type == 'file') || (is_dir($filePath.$name) && $type = 'folder')) {
        if (!rename($filePath.$name, $newFilePath.$name)) {
            throw new Exception('Unable to move item');
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
