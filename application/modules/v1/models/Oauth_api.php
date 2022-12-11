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

    $username  = trim(isset($data['username']) ? $data['username'] : '');
    $password  = trim(isset($data['password']) ? $data['password'] : '');
    $_password = custom_encryption($password);
    
    $user = $this->db->query("SELECT a.id, a.idRole, a.username, a.email, a.isActive, a.isDeleted, a.activate_at, b.name AS nameRole
      FROM users AS a
    INNER JOIN role AS b ON a.idRole = b.id WHERE a.username = '$username' AND a.password = '$_password'")->row();

    if (empty($user)) return responseModelFalse('Your username or password is wrong.', '64B7L');

    $expired_time  = getTimes('+1 hour', 'Y-m-d H:i:s');
    $_expired_time = strtotime($expired_time);

    $payload = [
      'email' => $user->email,
      'exp'   => $_expired_time
    ];
    
    $access_token = JWT::encode($payload, $_ENV['ACCESS_TOKEN'], 'HS256');

    return responseModelTrue('Successfully got the access token.', ['accessToken' => $access_token, 'expired_at' => $expired_time]);
  }

  public function custom_encryption($data = [])
  {
    $this->load->helper('auth_helper');

    $key = trim(isset($data['key']) ? $data['key'] : '');

    return responseModelTrue('Successfully encrypted the data.', ['encrypt' => custom_encryption($key)]);
  }
}
