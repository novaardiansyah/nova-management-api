<?php
defined('BASEPATH') or exit('No direct script access allowed');

use Firebase\JWT\JWT;
use Dotenv\Dotenv;

function custom_encryption($string)
{
  $dotenv = Dotenv::createImmutable(dirname(__FILE__, 3));
  $dotenv->load();

  $encrypt_key = $_ENV['ENCRYPT_KEY'];
  $string      = hash('sha256', $string . $encrypt_key);
  return custom_encode($string);
}

function getAccessToken($email)
{
  $expired_time  = getTimes('+1 hour', 'Y-m-d H:i:s');
  $_expired_time = strtotime($expired_time);

  $payload = [
    'email' => $email,
    'exp'   => $_expired_time
  ];
  
  $access_token = JWT::encode($payload, $_ENV['ACCESS_TOKEN'], 'HS256');
  return ['accessToken' => $access_token, 'expired_at' => $expired_time];
}