<?php


//  add useful functions + settings
require 'useful.php';
require 'settings.php';


//  deny malformed requests
if (!isset($_POST['directory']) || !isset($_POST['newName']) || !$settings['renameItems']) {
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
$oldName = $_POST['oldName'];
$newName = $_POST['newName'];
$filePath = realpath('../../' . $directory . '/') . DIRECTORY_SEPARATOR;


//  catch any errors
try {
    //  check if file exists
    if ((file_exists($filePath.$oldName) && $type == 'file') || (is_dir($filePath.$oldName) && $type = 'folder')) {
        if (!rename($filePath.$oldName, $filePath.$newName)) {
            throw new Exception('Unable to rename item');
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
