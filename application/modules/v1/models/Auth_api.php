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
    
    $user = cquery("SELECT a.id, a.idRole, a.username, a.email, a.isActive, a.isDeleted, a.activate_at, b.name AS nameRole
      FROM users AS a
    INNER JOIN role AS b ON a.idRole = b.id", ['a.username' => $username, 'a.password' => $password]);

    return responseModelFalse('Username or password is wrong', '0001', $user);

    if (empty($user)) return responseModelFalse('Your username or password is wrong.', '64B7L');

    if ((int) $user['isDeleted'] == 1) return responseModelFalse('Account has been deleted, if this is an error please contact customer support.', 'IBC54');

    $this->db->query('DELETE FROM tokens WHERE idUser = ? AND idType = ?', [$user['id'], 2]);
    $this->db->query('DELETE FROM tokens WHERE idUser = ? AND idType = ?', [$user['id'], 3]);

    $s_token = [
      'idUser'     => $user['id'],
      'idType'     => 2,
      'token'      => random_tokens(63, null, true),
      'isActive'   => 1,
      'created_by' => 1,
      'created_at' => getTimes('now'),
      'expired_at' => getTimes('+3 day', 'Y-m-d') . ' 23:59:59'
    ];

    $this->db->query("INSERT INTO tokens (idUser, idType, token, isActive, created_by, created_at, expired_at) VALUES (?, ?, ?, ?, ?, ?, ?)", [
      $s_token['idUser'],
      $s_token['idType'],
      $s_token['token'],
      $s_token['isActive'],
      $s_token['created_by'],
      $s_token['created_at'],
      $s_token['expired_at']
    ]);
    
    $accessToken = getAccessToken($user['email'], (24 * 3));

    $s_accessToken = [
      'idUser'     => $user['id'],
      'idType'     => 3,
      'token'      => $accessToken['accessToken'],
      'isActive'   => 1,
      'created_by' => 1,
      'created_at' => getTimes('now'),
      'expired_at' => $accessToken['expired_at']
    ];
    
    $this->db->query("INSERT INTO tokens (idUser, idType, token, isActive, created_by, created_at, expired_at) VALUES (?, ?, ?, ?, ?, ?, ?)", [
      $s_accessToken['idUser'],
      $s_accessToken['idType'],
      $s_accessToken['token'],
      $s_accessToken['isActive'],
      $s_accessToken['created_by'],
      $s_accessToken['created_at'],
      $s_accessToken['expired_at']
    ]);

    $response = [
      'user'  => [
        'id'          => custom_encode($user['id']),
        'idRole'      => custom_encode($user['idRole']),
        'nameRole'    => $user['nameRole'],
        'username'    => $user['username'],
        'email'       => $user['email'],
        'isActive'    => $user['isActive'],
        'activate_at' => $user['activate_at']
      ],
      'token' => [
        'name'       => 'login-token',
        'value'      => $s_token['token'] . ';' . custom_encode($user['id']) . ';' . custom_encode(2),
        'expired_at' => $s_token['expired_at']
      ],
      'accessToken' => [
        'name'       => 'access-token',
        'value'      => $accessToken['accessToken'],
        'expired_at' => $accessToken['expired_at']
      ]
    ];

    $this->db->query("UPDATE users SET last_on = ? WHERE id = ?", [getTimes('now'), $user['id']]);
    return responseModelTrue('Login successfully please wait a moment.', $response);
  }

  public function validateTokens($data = [])
  {
    $log_idUser = trim(isset($data['log_idUser']) ? $data['log_idUser'] : '');
    $userId     = $log_idUser ? custom_decode($log_idUser) : '';

    $loginToken  = trim(isset($data['loginToken']) ? $data['loginToken'] : '');
    $accessToken = trim(isset($data['accessToken']) ? $data['accessToken'] : '');

    $validateLoginToken  = $this->validateLoginToken($loginToken, $userId);
    if (!$validateLoginToken['status']) return responseModelFalse($validateLoginToken['message'], $validateLoginToken['error'], ['loginToken' => $loginToken]);

    $validateAccessToken = $this->validateAccessToken($accessToken, $userId);
    if (!$validateAccessToken['status']) return responseModelFalse($validateAccessToken['message'], $validateAccessToken['error'], ['accessToken' => $accessToken]);

    return responseModelTrue('Your token is valid.', ['loginToken' => $loginToken, 'accessToken' => $validateAccessToken]);
  }

  public function validateLoginToken($loginToken, $userId)
  {
    $token = $this->db->query("SELECT a.id, a.idUser, a.idType, a.token, a.isActive, a.expired_at FROM tokens AS a WHERE a.isActive = 1 AND a.idUser = '$userId' AND a.idType = 2")->row();
    
    if (empty($token)) return ['status' => false, 'message' => 'Login token is not valid.', 'error' => 'N9UW2'];  
    if ($token->token !== $loginToken) return ['status' => false, 'message' => 'Login token is not valid.', 'error' => '1XSA1'];

    if (format_date($token->expired_at, 'Y-m-d H:i:s') < getTimes('now')) {
      $this->db->delete('tokens', ['id' => $token->id]);
      return ['status' => false, 'message' => 'Login token has expired.', 'error' => '1XSA1'];
    }

    return ['status' => true, 'message' => 'Login token is valid.', 'token' => $token];
  }

  public function validateAccessToken($accessToken, $userId)
  {
    $validateToken = validateAccessToken();
    if ($validateToken !== true) return $validateToken;

    $token = $this->db->query("SELECT a.id, a.idUser, a.idType, a.token, a.isActive, a.expired_at FROM tokens AS a WHERE a.isActive = 1 AND a.idUser = '$userId' AND a.idType = 3")->row();

    if (empty($token)) return ['status' => false, 'message' => 'Access token is not valid.', 'error' => 'CEWSA'];
    if ($token->token != $accessToken) return ['status' => false, 'message' => 'Access token is not valid.', 'error' => 'A8GD4'];

    if (format_date($token->expired_at, 'Y-m-d H:i:s') < getTimes('now')) {
      $this->db->delete('tokens', ['id' => $token->id]);
      return ['status' => false, 'message' => 'Access token has expired.', 'error' => 'O17DO'];
    }

    return ['status' => true, 'message' => 'Access token is valid.', 'token' => $token];
  }

  public function getMainLogo($data = [])
  {
    $result = $this->db->query("SELECT a.id, a.name, a.path, a.isActive, a.isDeleted FROM assets AS a WHERE a.id = 1 AND a.isActive = 1 AND a.isDeleted = 0")->row_array();

    if (empty($result)) return responseModelFalse('Main logo not found.', 'TSYFD');

    return responseModelTrue('Main logo found.', $result);
  }
}
