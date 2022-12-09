<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

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
  $csrf_renewed = trim(isset($_POST['csrf_renewed']) ? $_POST['csrf_renewed'] : '');
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
  $csrf_renewed = trim(isset($_POST['csrf_renewed']) ? $_POST['csrf_renewed'] : '');
  $data         = array_merge($data, ['csrf_renewed' => $csrf_renewed]);

  $response = [
    'status'  => true,
    'message' => $message,
    'data'    => $data
  ];

  return $response;
}