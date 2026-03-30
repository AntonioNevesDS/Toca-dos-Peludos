<?php

namespace App\Config;

use mysqli;

class Database
{
    public static function connect(): mysqli
    {
        $host = "localhost";
        $user = "root";
        $pass = "";
        $db = "toca_dos_peludos";

        $conn = new mysqli($host, $user, $pass, $db);

        if ($conn->connect_error) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Erro na conexão com o banco",
                "data" => null
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $conn->set_charset("utf8mb4");

        return $conn;
    }
}