<?php
defined('BASEPATH') or exit('No direct script access allowed');

use chriskacerguis\RestServer\RestController;

class Auth extends RestController
{
  public function __construct()
  {
    parent::__construct();
    $this->load->model('Auth_api', 'api');
  }

  public function login_post()
  {
    $result = $this->api->login($_POST);
    $this->response($result, 200); exit;
    $result ? $this->response($result, 200) : $this->response(['data' => []], 404);
  }

  public function validateTokens_post()
  {
    $result = $this->api->validateTokens($_POST);
    $result ? $this->response($result, 200) : $this->response(['data' => []], 404);
  }
}
