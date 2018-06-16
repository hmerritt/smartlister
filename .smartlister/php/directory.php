<?php


//  add useful functions
require 'useful.php';


//  get directory
$directory = realpath( '../../' . getDirectory('actual') );
$path = getDirectory('path');
$pathHash = md5($path);


//  search directory
$scandir = scandir($directory);


//  make breadcrums
if (getDirectory('path') == 'root') {
    $breadcrums = ['root'];
} else {
    $breadcrums = explode('/', getDirectory('path'));
}


//  create response
$response = [
  $pathHash => [
    'directory' => getDirectory('path'),
    'breadcrums' => $breadcrums,
    'folders' => [],
    'files' => []
  ],
  'status' => 'ok'
];


//  loop directory
//  sepatatings files and folders
foreach ($scandir as $item) {

    //  skip hidden items
    if ($item[0] == '.') {continue;}

    //  if file
    if (is_file($directory . '/' . $item)) {

        if (getDirectory('path') == 'root' &&
            $item == 'index.php') {
          continue;
        }

        //  file link
        $actualLink = $directory . '/' . $item;
        $link = getDirectory('actual') . '/' . $item;

        //  get file type
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $type = finfo_file($finfo, $actualLink);

        $response[$pathHash]['files'][] = [
          'name' => $item,
          'type' => $type,
          'size' => human_filesize(filesize($actualLink)),
          'link' => $link,
          'uploadId' => '',
          'modified' => date('M d, Y', filemtime($actualLink))
        ];

    } elseif (is_dir($directory . '/' . $item)) {

        //  folder link
        $actualLink = $directory . '/' . $item;
        $link = getDirectory('actual') . '/' . $item;

        //  folder last modified date
        $modified = date('M d, Y', filemtime($actualLink));
        if (strlen($modified) == 0) {
            $modified = '-';
        }

        //  if folder
        $response[$pathHash]['folders'][] = [
          'name' => $item,
          'link' => $link,
          'modified' => $modified
        ];

    }

}


echo json_encode($response);


?>
