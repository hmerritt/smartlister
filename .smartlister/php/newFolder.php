<?php


//  get settings
require 'useful.php';
include 'settings.php';

//  redirect users who are not logged in
if (!isset($_POST['name']) || !isset($settings)) {
    header('HTTP/1.0 404 Not Found');
  	die;
} elseif (!$settings['folderCreation']) {
    header('HTTP/1.0 404 Not Found');
    die;
}


//  get post vars
$name = preg_replace('/[^a-zA-Z0-9\-\._ ]/', '', $_POST['name']);
$parentDirectory = $_POST['directory'];
$directory = $parentDirectory . '/' . $name;

if ($parentDirectory == 'root') {
    $actual = realpath('../../') . '/' . $name . '/';
} else {
    $actual = realpath('../../' . after('root/', $parentDirectory) . '/') . '/' . $name . '/';
}


//  make response
$response = [
  'newFolderLink' => $directory,
  'status' => 'ok'
];


try {

    // make directory if it dows not exist
    if (!is_dir($actual)) {
        if (!mkdir($actual)) {
            throw new Exception('Folder create error');
        }
    }

}  catch(Exception $e) {
    $response['status'] = 'error';
}

echo json_encode($response);


?>
