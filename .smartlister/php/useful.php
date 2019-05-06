<?php


//  get directory from url and formate it
function getDirectory($which) {
    //  default to root
    $directory = 'root';

    //  get either post or get
    if (isset($_POST['directory'])) {
        $var = $_POST['directory'];
    } if (isset($_GET['directory'])) {
        $var = $_GET['directory'];
    }

    //  get directory after root
    if ($which !== 'actual') {
        $directory = $var;
    }

    //  get actual path
    if ($which == 'actual') {
        $directory = after('root', $var);
    }

    return $directory;
}


//  convert hex to rgba
function hexToRgba($hex) {
  list($r, $g, $b) = sscanf($hex, "#%02x%02x%02x");
  return "$r, $g, $b";
}


//  get readable file size
function human_filesize($bytes, $decimals = 2) {
    $size = array('b','kb','mb','gb','tb','pb','eb','zb','yb');
    $factor = floor((strlen($bytes) - 1) / 3);
    return strtoupper(sprintf("%.1f", $bytes / pow(1024, $factor)) . ' ' . @$size[$factor]);
}


function after ($char, $string)
  {
      if (!is_bool(strpos($string, $char)))
      return substr($string, strpos($string,$char)+strlen($char));
  };

  function after_last ($char, $string)
  {
      if (!is_bool(strrevpos($string, $char)))
      return substr($string, strrevpos($string, $char)+strlen($char));
  };

  function before ($char, $string)
  {
      return substr($string, 0, strpos($string, $char));
  };

  function before_last ($char, $string)
  {
      return substr($string, 0, strrevpos($string, $char));
  };

// use strrevpos function in case your php version does not include it
function strrevpos($instr, $needle)
{
  $rev_pos = strpos (strrev($instr), strrev($needle));
  if ($rev_pos===false) return false;
  else return strlen($instr) - $rev_pos - strlen($needle);
};




function wildcard_match($pattern, $subject) {
  // quotemeta function has most similar behavior,
  // it escapes \.+*?^$[](), but doesn't escape |{}/'#
  // we don't include * and ?
  $special_chars = "\.+^$[]()|{}/'#";
  $special_chars = str_split($special_chars);
  $escape = array();
  foreach ($special_chars as $char) $escape[$char] = "\\$char";
  $pattern = strtr($pattern, $escape);
  $pattern = strtr($pattern, array(
    '*' => '.*?', // 0 or more (lazy) - asterisk (*)
    '?' => '.', // 1 character - question mark (?)
  ));
  return preg_match("/$pattern/", $subject);
}



?>
