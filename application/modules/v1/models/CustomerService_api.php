<?php
defined('BASEPATH') or exit('No direct script access allowed');

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Dotenv\Dotenv;

class CustomerService_api extends CI_Model
{
  public function __construct()
  {
    parent::__construct();
    $dotenv = Dotenv::createImmutable(dirname(__FILE__, 5));
    $dotenv->load();
  }

  public function contactUsList($data = [])
  {
    $result = $this->db->query("SELECT a.id, a.idUser, a.name, a.email, a.phone, a.message, a.isUser, a.isActive FROM contact_us AS a")->result();

    if (empty($result)) return responseModelFalse('Maaf, belum ada data yang tersedia.', 'KFTVH');

    foreach ($result as $key => $value) {
      $result[$key]->id = custom_encode($value->id);
    }

    return responseModelTrue('Data berhasil ditemukan.', ['list' => $result]);
  }

  public function storeContactUs($data = [])
  {
    return responseModelTrue('Data berhasil ditemukan.', ['list' => $data]);
  }

  public function factoryContactUs($data = [])
  {
    $headers       = getallheaders();
    $authorization = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    $token         = $authorization ? create_array($authorization, ' ')[1] : 'invalid-token';
    
    try {
      JWT::decode($token, new Key($_ENV['ACCESS_TOKEN'], 'HS256'));

      $faker = Faker\Factory::create();

      $batch = [];

      for ($i = 1; $i < 500; $i++) {
        $send = [
          'name'       => $faker->name,
          'email'      => $faker->email,
          'phone'      => $faker->phoneNumber,
          'message'    => $faker->text,
          'isUser'     => 0,
          'isActive'   => 1,
          'created_by' => 1
        ];

        array_push($batch, $send);
      }

      $this->db->truncate('contact_us');
      $this->db->insert_batch('contact_us', $batch);

      return responseModelTrue('Successfully generated temporary data.', ['result' => $batch]);
    } catch (Exception $error) {
      return responseModelFalse('Invalid access token.', 'KFTKH', ['access-token' => $token]);
    }
  }
}
