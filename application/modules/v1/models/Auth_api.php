<?php
defined('BASEPATH') or exit('No direct script access allowed');

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Dotenv\Dotenv;

class Auth_api extends CI_Model
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

    $username     = trim(isset($data['username']) ? $data['username'] : '');
    $_password    = trim(isset($data['password']) ? $data['password'] : '');
    $password     = custom_encryption($_password);
    
    $user = $this->db->query("SELECT a.id, a.idRole, a.username, a.email, a.isActive, a.isDeleted, a.activate_at, b.name AS nameRole
      FROM users AS a
    INNER JOIN role AS b ON a.idRole = b.id WHERE a.username = '$username' AND a.password = '$password'")->row();
    
    if (empty($user)) return responseModelFalse('Your username or password is wrong.', '64B7L');

    if ((int) $user->isDeleted == 1) return responseModelFalse('Account has been deleted, if this is an error please contact customer support.', 'IBC54');

    $this->db->delete('tokens', ['idUser' => $user->id, 'idType' => 2]);
    $this->db->delete('tokens', ['idUser' => $user->id, 'idType' => 3]);

    $s_token = [
      'idUser'     => $user->id,
      'idType'     => 2,
      'token'      => random_tokens(63, null, true),
      'isActive'   => 1,
      'created_by' => 1,
      'created_at' => getTimes('now'),
      'expired_at' => getTimes('+7 day', 'Y-m-d') . ' 23:59:59'
    ];
    $this->db->insert('tokens', $s_token);
    
    $accessToken = getAccessToken($user->email);

    $s_accessToken = [
      'idUser'     => $user->id,
      'idType'     => 3,
      'token'      => $accessToken['accessToken'],
      'isActive'   => 1,
      'created_by' => 1,
      'created_at' => getTimes('now'),
      'expired_at' => $accessToken['expired_at']
    ];
    $this->db->insert('tokens', $s_accessToken);

    $response = [
      'user'  => [
        'id'          => custom_encode($user->id),
        'idRole'      => custom_encode($user->idRole),
        'nameRole'    => $user->nameRole,
        'username'    => $user->username,
        'email'       => $user->email,
        'isActive'    => $user->isActive,
        'activate_at' => $user->activate_at
      ],
      'token' => [
        'name'       => 'token-login',
        'value'      => $s_token['token'] . ';' . custom_encode($user->id) . ';' . custom_encode(2),
        'expired_at' => $s_token['expired_at']
      ],
      'access-token' => [
        'name'       => 'access-token',
        'value'      => $accessToken['accessToken'],
        'expired_at' => $accessToken['expired_at']
      ]
    ];

    $this->db->update('users', ['last_on' => getTimes('now')], ['id' => $user->id]);
    return responseModelTrue('Login successfully please wait a moment.', $response);
  }
}
