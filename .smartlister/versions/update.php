<?php




/*

  Script will check for updates via the github repo
  - check current version
  - backup current version before updating
  - download latest version of smartlister and update all files

*/




//  set current version of smartlister
$version = 2.04;




//  recursive copy function for copying all files from a directory
function xcopy($src, $dest)
{


        //  open source directory
        //  create destination directory
        $dir = opendir($src);
        @mkdir($dest);


        //  loop all files in source folder
        while(false !== ( $file = readdir($dir) ))
        {


                //  skip non-user files
                if (( $file != '.' ) && ( $file != '..' ))
                {


                        //  if there is another directory within the source folder
                        if ( is_dir($src . '/' . $file) )
                        {


                                //  recursivly copy all folders within the source folder
                                xcopy($src . '/' . $file,$dest . '/' . $file);


                        }
                        else
                        {


                                //  copy files induvidualy to destination folder
                                copy($src . '/' . $file,$dest . '/' . $file);


                        }


                }


        }


        //  close the directory
        closedir($dir);


}




//  check for possible cli arguments
if (isset($argv[1]))
{




        //  -h - show help info
        if ($argv[1] == '-h' ||
            $argv[1] == '-help')
        {


                //  print a help sheet for this script
                echo "
>  help for update.php

>  -h  | show help for update.php script
>  -v  | show current version of smartlister
>  -b  | backup current version of smartlister to 'versions/backups/'
>  -u  | update smartlister to latest version

>  idea  | create a cron job to automaticaly run this script and update smartlister
";


                //  exit script
                die();


        }




        //  if the first cli argument is '-v'
        //  print current version
        if ($argv[1] == '-v' ||
            $argv[1] == '-version')
        {


                //  print this version of smartlister
                echo '>  v' . $version;


                //  exit script
                die();


        }




        //  if the first cli argument is '-b'
        if ($argv[1] == '-b' ||
            $argv[1] == '-backup')
        {


                //  print action: backing up
                echo '>  backing up smartlister: v' . $version;



                //  check for existing backup
                if (is_dir('backups/' . $version))
                {


                        //  print backup exists
                        echo "\n>  backup for version v" . $version . " already exists";



                        //  exit script
                        die();


                }



                //  creating backup folder
                if (!is_dir('backups')) { mkdir('backups'); }
                mkdir('backups/' . $version);
                mkdir('backups/' . $version . '/.smartlister');



                //  copy index.php to backup folder
                echo "\n\n>  copying index.php";
                copy("../../index.php", 'backups/'.$version."/index.php");


                //  copy css files
                echo "\n>  copying css files";
                xcopy("../css/", 'backups/'.$version."/.smartlister/css/");


                //  copy js files
                echo "\n>  copying javascript files";
                xcopy("../js/", 'backups/'.$version."/.smartlister/js/");


                //  copy fonts files
                echo "\n>  copying fonts";
                xcopy("../fonts/", 'backups/'.$version."/.smartlister/fonts/");


                //  copy image files
                echo "\n>  copying images";
                xcopy("../img/", 'backups/'.$version."/.smartlister/img/");


                //  copy php files
                echo "\n>  copying php files";
                xcopy("../php/", 'backups/'.$version."/.smartlister/php/");


                //  copy .htaccess and favicon
                echo "\n>  copying .htaccess and favicon";
                copy("../.htaccess", 'backups/'.$version."/.smartlister/.htaccess");
                copy("../favicon.ico", 'backups/'.$version."/.smartlister/favicon.ico");



                //  print backup complete
                echo "\n\n>  backup of version: v" . $version . " has completed";


                //  exit script
                die();


        }




        //  check for new versions of smartlister
        if ($argv[1] == '-u' ||
            $argv[1] == '-update' ||
            $argv[1] == '-l' ||
            $argv[1] == '-latest' ||
            $argv[1] == '-n' ||
            $argv[1] == '-new')
        {


                //  check for new versions
                echo "\n>  it is reccomended that you copy the 'update.php' file from the new version folder as it itself may have been updated";


        }




}




//  print version for reference
echo $version;




?>
