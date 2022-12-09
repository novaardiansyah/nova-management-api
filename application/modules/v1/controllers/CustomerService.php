<?php
defined('BASEPATH') or exit('No direct script access allowed');

use chriskacerguis\RestServer\RestController;

class CustomerService extends RestController
{
  public function __construct()
  {
    parent::__construct();
    $this->load->model('CustomerService_api', 'api');
  }

  public function contactUsList_post()
  {
    $result = $this->api->contactUsList($_POST);
    $result ? $this->response($result, 200) : $this->response(['data' => []], 404);
  }

  public function storeContactUs_post()
  {
    $result = $this->api->storeContactUs($_POST);
    $result ? $this->response($result, 200) : $this->response(['data' => []], 404);
  }

  public function factoryContactUs_post()
  {
    $result = $this->api->factoryContactUs($_POST);
    $result ? $this->response($result, 200) : $this->response(['data' => []], 404);
  }
}
