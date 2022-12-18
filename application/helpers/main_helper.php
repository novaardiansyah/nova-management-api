<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Dotenv\Dotenv;

function insertAuditlog($data = [])
{
  $ci = get_instance();
  $ci->load->library('user_agent');

  $data = !(empty($data)) ? arrayToObject($data) : [];

  $send = [
    'idUser'      => isset($data->idUser) ? $data->idUser : 0,
    'idRole'      => isset($data->idRole) ? $data->idRole : 0,
    'idType'      => isset($data->idType) ? $data->idType : 0,
    'description' => isset($data->description) ? $data->description : null,
    'browser'     => $ci->agent->browser() . ' ' . $ci->agent->version(),
    'platform'    => $ci->agent->platform(),
    'ipAddress'   => $ci->input->ip_address(),
    'userAgent'   => $ci->agent->agent_string(),
    'isActive'    => 1,
    'created_by'  => isset($data->idUser) ? $data->idUser : 0,
    'created_at'  => getTimes('now'),
  ];

  $ci->db->insert('auditlogs', $send);
  return ['status' => true, 'message' => 'Berhasil merekam data ke auditlog.', 'data' => $send];
}

function responseModelFalse($message, $error, $data = [])
{
  $csrf_renewed = trim(isset($_POST['csrf_renewed']) ? $_POST['csrf_renewed'] : random_tokens(16));
  $data         = array_merge($data, ['error' => $error, 'csrf_renewed' => $csrf_renewed]);

  $response = [
    'status'  => false,
    'message' => $message,
    'data'    => $data
  ];

  return $response;
}

function responseModelTrue($message, $data = [])
{
  $csrf_renewed = trim(isset($_POST['csrf_renewed']) ? $_POST['csrf_renewed'] : random_tokens(16));
  $data         = array_merge($data, ['csrf_renewed' => $csrf_renewed]);

  $response = [
    'status'  => true,
    'message' => $message,
    'data'    => $data
  ];

  return $response;
}

function validateAccessToken()
{
  $dotenv = Dotenv::createImmutable(dirname(__FILE__, 3));
  $dotenv->load();

  $headers       = getallheaders();
  $authorization = isset($headers['Authorization']) ? $headers['Authorization'] : '';
  $token         = $authorization ? create_array($authorization, ' ')[1] : 'invalid-token';

  try {
    JWT::decode($token, new Key($_ENV['ACCESS_TOKEN'], 'HS256'));
    return true;
  } catch (Exception $error) {
    return responseModelFalse('Invalid access token, your request was rejected.', 'CLP1A', ['accessToken' => $token]);
  }
}

function cquery($query, $where = [], $result = 'row_array')
{
  $ci = get_instance();

  $str_where = 'WHERE';
  if ($where) {
    foreach ($where as $key => $value) {
      $str_where .= " AND $key = '$value'";
    }
  }

  $query = $query . ' ' . $str_where;
  
  if ($result == 'row_array') {
    return $query;
  }
  return $query;

  // return $ci->db->query($query)->result_array();
}