<?php
header('Content-Type: application/json; charset=utf-8');

// CONEXÃO
$host = "localhost";
$user = "root";
$pass = "";
$db = "toca_dos_peludos";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["erro" => "Erro na conexão com o banco"], JSON_UNESCAPED_UNICODE);
    exit;
}

$conn->set_charset("utf8mb4");

// FILTRO OPCIONAL
$status = $_GET['status'] ?? null;

if ($status) {
    $stmt = $conn->prepare("SELECT * FROM pets WHERE status = ?");
    $stmt->bind_param("s", $status);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    $result = $conn->query("SELECT * FROM pets");
}

// TRATAR ERRO
if (!$result) {
    http_response_code(500);
    echo json_encode(["erro" => "Erro ao buscar pets"], JSON_UNESCAPED_UNICODE);
    exit;
}

// MONTAR RESPOSTA
$pets = [];

while ($row = $result->fetch_assoc()) {
    $pets[] = $row;
}

// RETORNO
echo json_encode($pets, JSON_UNESCAPED_UNICODE);

$conn->close();