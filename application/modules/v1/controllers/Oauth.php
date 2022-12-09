<?php
defined('BASEPATH') or exit('No direct script access allowed');

use chriskacerguis\RestServer\RestController;

class Oauth extends RestController
{
  public function __construct()
  {
    parent::__construct();
    $this->load->model('Oauth_api', 'api');
  }

  public function login_post()
  {
    $result = $this->api->login($_POST);
    $result ? $this->response($result, 200) : $this->response(['data' => []], 404);
  }
}
