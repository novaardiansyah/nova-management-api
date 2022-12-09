<?php
defined('BASEPATH') or exit('No direct script access allowed');

class CustomerService_api extends CI_Model
{
  public function __construct()
  {
    parent::__construct();
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
    $responseType = trim(isset($_POST['responseType']) ? $_POST['responseType'] : 'normal');

    $faker = Faker\Factory::create();

    $batch = [];

    for ($i = 1; $i < 500; $i++)
    {
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

    return responseModelTrue('Data berhasil digenerate.', ['result' => $batch], $responseType);
  }
}
