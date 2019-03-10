<?php




/*

  Script will check for updates via github
  - check current version
  - backup current version before updating
  - download latest version of smartlister and update all files

*/




//  set current version of smartlister
$version = json_decode(file_get_contents('version'), true)['version'];




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




//  copy files while printing out each action
function copySmartlisterFiles($src, $dest)
{


        //  copy index.php to backup folder
        echo "\n\n>  copying index.php";
        copy($src . "/index.php", $dest . "/index.php");


        //  copy css files
        echo "\n>  copying css files";
        xcopy($src . "/.smartlister/css/", $dest . "/.smartlister/css/");


        //  copy js files
        echo "\n>  copying javascript files";
        xcopy($src . "/.smartlister/js/", $dest . "/.smartlister/js/");


        //  copy fonts files
        echo "\n>  copying fonts";
        xcopy($src . "/.smartlister/fonts/", $dest . "/.smartlister/fonts/");


        //  copy image files
        echo "\n>  copying images";
        xcopy($src . "/.smartlister/img/", $dest . "/.smartlister/img/");


        //  copy php files
        echo "\n>  copying php files";
        xcopy($src . "/.smartlister/php/", $dest . "/.smartlister/php/");


        //  copy .htaccess and favicon
        echo "\n>  copying version, .htaccess and favicon";
        copy($src . "/.smartlister/versions/version", $dest . "/.smartlister/versions/version");
        copy($src . "/.smartlister/.htaccess", $dest . "/.smartlister/.htaccess");
        copy($src . "/.smartlister/favicon.ico", $dest . "/.smartlister/favicon.ico");


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



                //  backup all files
                copySmartlisterFiles('../../', 'backups/'.$version);



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


                //  print updating smartlister
                echo "\n>  updating smartlister to the latest version";



                //  get latest version number
                echo "\n\n>  fetching latest version number";


                //  get latest version number by downloading version file from github
                $latestVersion = json_decode(file_get_contents('https://raw.githubusercontent.com/Hmerritt/smartlister/master/.smartlister/versions/version'), true)['version'];



                //  compare this version to the latest version
                if ($version == $latestVersion)
                {


                        //  the script is up-to-date
                        echo "\n\n>  smartlister is already up-to-date (version ". $latestVersion ." is the latest version)\n";


                        //  exit script
                        die();


                }



                //  print action: creating folder
                echo "\n>  creating folder for new version";


                //  create directory for the latest version
                @mkdir($latestVersion);



                //  print action: downloading latest version of smartlister
                echo "\n>  downloading latest version of smartlister\n\n";


                //  download latest version of smartlister using 'git clone'
                exec("git clone https://github.com/Hmerritt/smartlister $latestVersion");



                //  copy index.php to backup folder
                copySmartlisterFiles("$latestVersion", "../../");



                //  print update complete
                echo "\n\n>  smartlister has been updated successfully (v". $version ." => v". $latestVersion .")";



                //  print recommendation
                echo "\n\n>  it is recommended that you copy the 'update.php' file from the new version folder as it itself may have been updated\n";


                //  exit script
                die();


        }




}




//  print version for reference
echo 'v' . $version;




?>
