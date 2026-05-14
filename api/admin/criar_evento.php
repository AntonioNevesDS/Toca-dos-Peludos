<?php
declare(strict_types=1);
require_once __DIR__ . '/../bootstrap/app.php';
require_once __DIR__ . '/auth_middleware.php';

use App\Config\Database;
use App\Support\JsonResponse;
use App\Support\Request;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') JsonResponse::send(['success' => false, 'message' => 'Método não permitido.'], 405);

$conn = Database::getConnection();
$dados = Request::json();

// Limpeza contra vírus (XSS)
$titulo = htmlspecialchars(strip_tags(trim($dados['titulo'] ?? '')), ENT_QUOTES, 'UTF-8');
$data_evento = trim($dados['data_evento'] ?? '');
$local = htmlspecialchars(strip_tags(trim($dados['local'] ?? '')), ENT_QUOTES, 'UTF-8');
$cidade = htmlspecialchars(strip_tags(trim($dados['cidade'] ?? '')), ENT_QUOTES, 'UTF-8');
$status = 'ativo'; // Todo evento novo nasce como ativo

if ($titulo === '' || $data_evento === '' || $local === '') {
    JsonResponse::send(['success' => false, 'message' => 'Preencha os campos obrigatórios.'], 400);
}

$stmt = $conn->prepare("INSERT INTO eventos (titulo, data_evento, local, cidade, status) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $titulo, $data_evento, $local, $cidade, $status);

if ($stmt->execute()) {
    JsonResponse::send(['success' => true, 'message' => 'Evento criado com sucesso!']);
} else {
    JsonResponse::send(['success' => false, 'message' => 'Erro ao criar evento.'], 500);
}