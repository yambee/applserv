<?php 
  
  echo "полученный POST: " . $_POST;
  print_r ($_POST);
    
  // инициализация html-строки
  $message = "";
  
  // простейшая итерация по массиву $_POST со сборкой тела html-сообщения
  foreach ($_POST as $key=>$value) {
    $message .= "$key:  $value <br />";
  }
  
  // $to      = 'master@applserv.ru,89263120274@mail.ru';
  $to      = '89263120274@mail.ru, elias@applserv.ru';
  $subject = 'Новая заявка с сайта applserv.ru';  
  $headers = 'Content-type: text/html; charset=UTF-8';
  
  mail($to, $subject, $message, $headers);

  echo "отправлено $message";

?>