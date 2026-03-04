<?php

$host = 'localhost';
$port = '5432'; 
$dbname = 'toca_dos_peludos'; 
$user = 'root'; 
$pass = '';


try {
    
    $dsn = "mysql:host=$host;port=$port;dbname=$dbname";
    
    
    $opcoes = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ];
    
    $pdo = new PDO($dsn, $user, $pass, $opcoes);

    echo "Sucesso! O banco da Toca dos Peludos está conectado!\n";

} catch (PDOException $e) {
   
    http_response_code(500);
    die(json_encode(["erro" => "Falha na conexão com o banco: " . $e->getMessage()]));
}

?>