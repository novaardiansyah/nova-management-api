<?php
defined('BASEPATH') or exit('No direct script access allowed');

function custom_encryption($string)
{
  $ci = get_instance();
  $encrypt_key = $ci->config->item('encrypt_key');
  $string      = hash('sha256', $string . $encrypt_key);
  return custom_encode($string);
}