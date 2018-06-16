<?php


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


//  get readable file size
function human_filesize($bytes, $decimals = 2) {
    $size = array('b','kb','mb','gb','tb','pb','eb','zb','yb');
    $factor = floor((strlen($bytes) - 1) / 3);
    return strtoupper(sprintf("%.1f", $bytes / pow(1024, $factor)) . ' ' . @$size[$factor]);
}


function after ($this, $inthat)
  {
      if (!is_bool(strpos($inthat, $this)))
      return substr($inthat, strpos($inthat,$this)+strlen($this));
  };

  function after_last ($this, $inthat)
  {
      if (!is_bool(strrevpos($inthat, $this)))
      return substr($inthat, strrevpos($inthat, $this)+strlen($this));
  };

  function before ($this, $inthat)
  {
      return substr($inthat, 0, strpos($inthat, $this));
  };

  function before_last ($this, $inthat)
  {
      return substr($inthat, 0, strrevpos($inthat, $this));
  };

  function between ($this, $that, $inthat)
  {
      return before ($that, after($this, $inthat));
  };

  function between_last ($this, $that, $inthat)
  {
   return after_last($this, before_last($that, $inthat));
  };

// use strrevpos function in case your php version does not include it
function strrevpos($instr, $needle)
{
  $rev_pos = strpos (strrev($instr), strrev($needle));
  if ($rev_pos===false) return false;
  else return strlen($instr) - $rev_pos - strlen($needle);
};

?>
