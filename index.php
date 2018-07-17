

<!--
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@                  @@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@                     @@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@                                       @@@@@@@
@@@@@@@@                                       @@@@@@@
@@@@@@@@                                       @@@@@@@
@@@@@@@@                                       @@@@@@@
@@@@@@@@                                       @@@@@@@
@@@@@@@@                                       @@@@@@@
@@@@@@@@                                       @@@@@@@
@@@@@@@@                                       @@@@@@@
@@@@@@@@                                       @@@@@@@
@@@@@@@@                                       @@@@@@@
@@@@@@@@                                       @@@@@@@
@@@@@@@@                                       @@@@@@@
@@@@@@@                                          @@@@@
@@@@@@@@                                       @@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@   @@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@   @@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@     @@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@              @@@@@@@@@@@@@@@@@@@@
@@@@@                                             @@@@
@@@@@@@@@@@@@@@@@@@@              @@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@              @@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
-->


<?php


//  get settings
require '.smartlister/php/settings.php';
require $settings['listerFolderName'] . '/php/useful.php';


//  redirect folderless urls
if (!isset($_GET['directory'])) {
    header("Location: index.php?directory=root");
}

//  stop malformed directory requests + prevent accessing parent directory
if (strlen($_GET['directory']) < 4 || strpos($_GET['directory'], '/..')) {
    header("Location: index.php?directory=root");
}


//  get directory from url
$directory = $_GET['directory'];


?>


<!DOCTYPE html>
<html lang='en'>
<head>


  <!--  set meta tags  -->
  <meta name='theme-color' content='<?php echo $settings['themeColor'] ?>'>
  <meta name='author' content='https://plus.google.com/116753589877462757583' />
  <meta name='viewport' content='width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no'>

  <!--  set title + icon  -->
  <title> Smartlister </title>
  <link type='x-image/icon' rel='icon' href='<?php echo $settings['listerFolderName'] ?>/favicon.ico'>


  <!--  add styles + scripts  -->

  <!--  fonts  -->
  <link href='https://fonts.googleapis.com/css?family=Roboto:300,400,400italic,500,700&amp;subset=cyrillic,cyrillic-ext,greek,greek-ext,latin,latin-ext,vietnamese' rel='stylesheet'>

  <!--  js  -->
  <?php
  echo "
    <script src='". $settings['listerFolderName'] ."/js/jquery.js' type='text/javascript'></script>
    <script src='". $settings['listerFolderName'] ."/js/cookie.js' type='text/javascript'></script>
    <script src='". $settings['listerFolderName'] ."/js/hammer.js' type='text/javascript'></script>
    <script src='". $settings['listerFolderName'] ."/js/moment.js' type='text/javascript'></script>
    <script src='". $settings['listerFolderName'] ."/js/base64.js' type='text/javascript'></script>
    <script src='". $settings['listerFolderName'] ."/js/md5.js' type='text/javascript'></script>
    <script src='". $settings['listerFolderName'] ."/js/main.js' type='text/javascript'></script>

    <!--  css  -->
    <link href='". $settings['listerFolderName'] ."/css/main.css' type='text/css' rel='stylesheet'>
  ";
  ?>

  <!--  set directory  -->
  <script type='text/javascript'>

      //  set current directory
      window.directory = '<?php echo addslashes(rawurldecode($directory)); ?>';

      //  set users settings
      window.settings = {
          'listerFolderName': '<?php echo $settings['listerFolderName'] ?>',
          'fileUpload': Boolean(<?php echo $settings['fileUpload'] ?>),
          'folderCreation': Boolean(<?php echo $settings['folderCreation'] ?>),
          'renameItems': Boolean(<?php echo $settings['renameItems'] ?>),
          'moveItems': Boolean(<?php echo $settings['moveItems'] ?>),
          'themeColor': '<?php echo $settings['themeColor'] ?>'
      };

  </script>

  <!--  set theme colors  -->
  <style type='text/css'>

     .bar-top,
     .fab > .item {
       background-color: rgb(<?php echo hexToRgba($settings['themeColor']) ?>);
     }

     .info-items .item:not(.storage).active,
     .files-container .directory .item.new.active {
       background-color: rgba(<?php echo hexToRgba($settings['themeColor']) ?>, .7);
     }

     .files-container .item.active,
     .files-container .directory .item.new {
       background-color: rgba(<?php echo hexToRgba($settings['themeColor']) ?>, .5);
     }

     .info-items .item:not(.storage):hover {
       background-color: rgba(<?php echo hexToRgba($settings['themeColor']) ?>, .15);
     }

     .overlay-upload .icon-cloud,
     .overlay-upload .box {
       background-color: rgba(<?php echo hexToRgba($settings['themeColor']) ?>, 1);
     }

  </style>

</head>
<body>


    <!--  top bar  -->
    <div class='bar-top no-user-select'>
        <div class='wrapper flex'>
            <svg viewBox='0 0 24 24'>
                <path d='M3,14V4A2,2 0 0,1 5,2H11L13,4H19A2,2 0 0,1 21,6V14A2,2 0 0,1 19,16H13V18H14A1,1 0 0,1 15,19H22V21H15A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21H2V19H9A1,1 0 0,1 10,18H11V16H5A2,2 0 0,1 3,14Z' />
            </svg>
            <h1>Smartlister</h1>
        </div>
    </div>

    <!--  main box  -->
    <div class='main-window'>
        <div class='wrapper'>

            <!--  information boxes  -->
            <div class='info-items flex no-user-select'>
                <div class='item flex storage'>
                    <svg viewBox='0 0 24 24'>
                        <path fill='#444' d='M18,8H16V4H18M15,8H13V4H15M12,8H10V4H12M18,2H10L4,8V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V4A2,2 0 0,0 18,2Z'></path>
                    </svg>
                    <div class='info flex' tooltip='Remaining storage' tooltip-top='10'>
                        <h1>
                          Directory Size
                          <br>
                          <small>~ ~~</small>
                        </h1>
                    </div>
                </div>
                <div class='item newFile flex' onclick='$("#upload").trigger("click")' state='<?php echo ($settings['fileUpload']) ? 'true' : 'false' ?>'>
                    <svg viewBox='0 0 24 24'>
                        <path fill='#555' d='M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M11,15V12H9V15H6V17H9V20H11V17H14V15H11Z'></path>
                    </svg>
                    <div class='info flex'>
                        <h1>
                          New File
                        </h1>
                    </div>
                </div>
                <div class='item newFolder flex' state='<?php echo ($settings['folderCreation']) ? 'true' : 'false' ?>'>
                    <svg viewBox='0 0 24 24'>
                        <path fill='#555' d='M10,4L12,6H20A2,2 0 0,1 22,8V18A2,2 0 0,1 20,20H4C2.89,20 2,19.1 2,18V6C2,4.89 2.89,4 4,4H10M15,9V12H12V14H15V17H17V14H20V12H17V9H15Z'></path>
                    </svg>
                    <div class='info flex'>
                        <h1>
                          New Folder
                        </h1>
                    </div>
                </div>
            </div>

            <!--  breadcrums  -->
            <div class='breadcrums flex no-user-select'>
                <div class='item' link='root' dir=''>
                    <h1>Root</h1>
                </div>
            </div>

            <!--  sorting bar  -->
            <div class='sorting no-user-select'>
                <div class='name'>
                    <h1>
                      Name
                      <span>
                          <svg viewBox='0 0 24 24' tooltip='Reverse sort' tooltip-top='5'>
                              <path fill='#444' d='M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z'></path>
                          </svg>
                      </span>
                    </h1>
                </div>
                <div class='last-modified'>
                    <h1>Last modified</h1>
                </div>
                <div class='size'>
                    <h1>Size</h1>
                </div>
            </div>


            <!--  files container  -->
            <div class='files-container'>
                <div class='loader flex'>
                    <svg class='spinner' viewBox='0 0 66 66' xmlns='http://www.w3.org/2000/svg'>
                        <circle class='path' fill='none' stroke-width='4' stroke-linecap='round' cx='33' cy='33' r='30'></circle>
                    </svg>
                </div>

                <!--  directorys
                <div class='directory' id=''>
                    <div class='folders'></div>
                    <div class='files'></div>
                </div>
                -->
            </div>

            <!--  file drag to move box  -->
            <div class='drag-to-move flex no-user-select'>
                <svg viewBox="0 0 24 24">  </svg>
                <h2 class="name">  </h2>
            </div>


            <!--  upload input  -->
            <input id='upload' name='upload[]' type='file' multiple=''>

            <!--  upload overlay  -->
            <div class='overlay-upload flex no-user-select'>
                <div class='dragdrop'>
                    <div class='icon-cloud flex'>
                        <svg viewBox='0 0 24 24'>
                            <path fill='#555' d='M14,13V17H10V13H7L12,8L17,13M19.35,10.03C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.03C2.34,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.03Z'></path>
                        </svg>
                        <div class='border'></div>
                        <div class='effect'></div>

                        <h2>Drop to upload files</h2>
                    </div>
                </div>
            </div>

            <!--  download file into page  -->
            <iframe id='file-download' src=''></iframe>

            <!--  mobile fab  -->
            <div class='fab'>
                <div class='item main flex' action='toggleMenu'>
                    <svg viewBox='0 0 24 24'>
                        <path fill='#444' d='M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z'></path>
                    </svg>
                </div>
                <div class='item flex out-of-way fadeOutDown' action='newFile' state='<?php echo ($settings['fileUpload']) ? 'true' : 'false' ?>'>
                    <svg viewBox='0 0 24 24'>
                        <path fill='#444' d='M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M11,15V12H9V15H6V17H9V20H11V17H14V15H11Z'></path>
                    </svg>
                </div>
                <div class='item flex out-of-way fadeOutDown' action='newFolder' state='<?php echo ($settings['folderCreation']) ? 'true' : 'false' ?>'>
                      <svg viewBox='0 0 24 24'>
                          <path fill='#444' d='M10,4L12,6H20A2,2 0 0,1 22,8V18A2,2 0 0,1 20,20H4C2.89,20 2,19.1 2,18V6C2,4.89 2.89,4 4,4H10M15,9V12H12V14H15V17H17V14H20V12H17V9H15Z'></path>
                      </svg>
                </div>
            </div>

            <!--  toast  -->
            <div class='toast flex no-user-select'></div>

        </div>
    </div>


</body>
<html>
