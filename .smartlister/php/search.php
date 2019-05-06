<?php


//  add useful functions
require 'useful.php';
require 'settings.php';


//  get directory
$directory = realpath( '../../' . getDirectory('actual') );
$path = getDirectory('path');
$searchQuery = $_POST['text'];
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
  "search" => [
      $pathHash => [
        'directory' => getDirectory('path'),
        'breadcrums' => $breadcrums,
        'folders' => [],
        'files' => []
      ]
  ],
  'status' => 'ok'
];


//  make path fit for url
$urlDir = '/';
$count = count($breadcrums);
foreach ($breadcrums as $breadcrum) {

    //  skip root item
    if ($breadcrum == 'root') {continue;}

    //  formate crum for url
    $urlDir .= rawurlencode($breadcrum);

    //  add slash
    $urlDir .= '/';

}




//  loop directory
//  sepatatings files and folders
function scanDirectory($scandir)
{


    foreach ($scandir as $item)
    {

        

    }


}


//  loop directory
//  sepatatings files and folders
foreach ($scandir as $item) {

    //  skip non-items
    //  show/hide hidden items
    if ($item == '.' || $item == '..' || (!$settings['hiddenItems'] && $item[0] == '.'))
    {
      continue;
    }


    //  if file
    if (is_file($directory . '/' . $item)) {

        //  hide smartlister files
        if (getDirectory('path') == 'root' &&
            $item == 'index.php') {
            continue;
        }


        //  search
        if (wildcard_match($item, $searchQuery) !== 1)
        {
            continue;
        }


        //  file link
        $actualLink = $directory . '/' . $item;
        $link = $urlDir . rawurlencode($item); //  getDirectory('actual') . '/' . $item;

        //  get file type
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $type = finfo_file($finfo, $actualLink);

        $response['search'][$pathHash]['files'][] = [
          'name' => $item,
          'type' => $type,
          'size' => human_filesize(filesize($actualLink)),
          'link' => $link,
          'uploadId' => '',
          'modified' => date('M d, Y', filemtime($actualLink))
        ];

    } elseif (is_dir($directory . '/' . $item)) {

        //  hide smartlister files
        if (getDirectory('path') == 'root' &&
            $item == '.smartlister') {
            continue;
        }


        //  folder link
        $actualLink = $directory . '/' . $item;
        $link = getDirectory('actual') . '/' . $item;

        //  folder last modified date
        $modified = date('M d, Y', filemtime($actualLink));
        if (strlen($modified) == 0) {
            $modified = '-';
        }

        //  if folder
        $response['search'][$pathHash]['folders'][] = [
          'name' => $item,
          'link' => $link,
          'modified' => $modified
        ];

    }

}


echo json_encode($response);


?>
