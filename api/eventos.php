<?php
header('Content-Type: application/json');

// CONEXÃO COM O BANCO
$host = "localhost";
$user = "root";
$pass = "";
$db = "toca_dos_peludos";

$conn = new mysqli($host, $user, $pass, $db);

// VERIFICA ERRO
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["erro" => "Erro na conexão com o banco"]);
    exit;
}

// QUERY
$sql = "SELECT * FROM eventos";
$result = $conn->query($sql);

// ARRAY DE RESPOSTA
$eventos = [];

while ($row = $result->fetch_assoc()) {
    $eventos[] = $row;
}

// RETORNO
echo json_encode($eventos, JSON_UNESCAPED_UNICODE);