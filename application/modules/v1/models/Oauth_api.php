<?php
defined('BASEPATH') or exit('No direct script access allowed');

use Firebase\JWT\JWT;
use Dotenv\Dotenv;

class Oauth_api extends CI_Model
{
  public function __construct()
  {
    parent::__construct();
    $dotenv = Dotenv::createImmutable(dirname(__FILE__, 5));
    $dotenv->load();
  }

  public function login($data = [])
  {
    $this->load->helper('auth_helper');

    $email     = trim(isset($data['email']) ? $data['email'] : '');
    $password  = trim(isset($data['password']) ? $data['password'] : '');
    $_password = custom_encryption($password);
    
    $user = [
      'email'    => 'superadmin@nova.com',
      'password' => custom_encryption('123456'),
    ];
    $user = arrayToObject($user);

    if ($email !== $user->email || $_password !== $user->password) return responseModelFalse('Invalid email or password.', 'KFTVH');

    $expired_time  = getTimes('+1 hour', 'Y-m-d H:i:s');
    $_expired_time = strtotime($expired_time);

    $payload = [
      'email' => $email,
      'exp'   => $_expired_time
    ];
    
    $access_token = JWT::encode($payload, $_ENV['ACCESS_TOKEN'], 'HS256');

    return responseModelTrue('Successfully got the access token.', ['access-token' => $access_token, 'expiry' => $expired_time]);
  }
}
