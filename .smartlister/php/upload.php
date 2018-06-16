<?php


//  get settings
require 'useful.php';
require 'settings.php';


//  redirect users who are not logged in
if (!isset($_FILES['file']) || !isset($settings)) {
    header('HTTP/1.0 404 Not Found');
  	die;
} elseif (!$settings['fileUpload']) {
    header('HTTP/1.0 404 Not Found');
    die;
}


//  get file info
clearstatcache();
$name = preg_replace('/[^a-zA-Z0-9\-\._ ]/', '', $_FILES['file']['name']);
$tmpName = $_FILES['file']['tmp_name'];
$size = filesize($tmpName);


//  get file location
$directory = $_POST['directory'];

if ($directory == 'root') {
    $actual = realpath('../../') . '/' . $name;
} else {
    $actual = realpath('../../' . after('root/', $directory) . '/') . '/' . $name;
}


//  make response
$response = [
  'status' => 'ok'
];


//  move file into folder
if (!move_uploaded_file($tmpName, $actual)) {
    $response['status'] = 'error';
}


echo json_encode($response);


?>
