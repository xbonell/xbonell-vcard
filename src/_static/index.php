<?php

  function comefrom() {

    $lang = $_SERVER['HTTP_ACCEPT_LANGUAGE'];
    $lang = substr($lang, 0, 2);
  
    header('HTTP/1.1 301 Moved Permanently');

    if ($lang == 'ca') {
      header("Location: ca/");
    } elseif ($lang == 'es') {
      header("Location: es/");
    } elseif ($lang == 'en') {
      header("Location: en/");    
    } else {
      header("Location: es/");
    }
  
  }

  comefrom();
