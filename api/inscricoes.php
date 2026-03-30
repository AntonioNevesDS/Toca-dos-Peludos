<?php
header('Content-Type: application/json; charset=utf-8');

// Permitir apenas POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "erro" => "Método não permitido. Use POST."
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// CONEXÃO COM O BANCO
$host = "localhost";
$user = "root";
$pass = "";
$db = "toca_dos_peludos";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "erro" => "Erro na conexão com o banco"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$conn->set_charset("utf8mb4");

// LER JSON DO BODY
$dados = json_decode(file_get_contents("php://input"), true);

if (!$dados) {
    http_response_code(400);
    echo json_encode([
        "erro" => "JSON inválido ou ausente"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// CAPTURAR DADOS
$evento_id = isset($dados['evento_id']) ? (int) $dados['evento_id'] : 0;
$nome = trim($dados['nome'] ?? '');
$email = trim($dados['email'] ?? '');
$telefone = trim($dados['telefone'] ?? '');
$quantidade_pessoas = isset($dados['quantidade_pessoas']) ? (int) $dados['quantidade_pessoas'] : 1;
$observacoes = trim($dados['observacoes'] ?? '');

// VALIDAÇÕES
if ($evento_id <= 0 || $nome === '' || $email === '' || $telefone === '') {
    http_response_code(400);
    echo json_encode([
        "erro" => "Campos obrigatórios: evento_id, nome, email e telefone"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        "erro" => "Email inválido"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($quantidade_pessoas < 1) {
    http_response_code(400);
    echo json_encode([
        "erro" => "A quantidade de pessoas deve ser no mínimo 1"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// VERIFICAR SE O EVENTO EXISTE
$stmtEvento = $conn->prepare("SELECT id FROM eventos WHERE id = ?");
$stmtEvento->bind_param("i", $evento_id);
$stmtEvento->execute();
$resultEvento = $stmtEvento->get_result();

if ($resultEvento->num_rows === 0) {
    http_response_code(404);
    echo json_encode([
        "erro" => "Evento não encontrado"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// INSERIR INSCRIÇÃO
$stmt = $conn->prepare("
    INSERT INTO inscricoes_evento 
    (evento_id, nome, email, telefone, quantidade_pessoas, observacoes)
    VALUES (?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "isssis",
    $evento_id,
    $nome,
    $email,
    $telefone,
    $quantidade_pessoas,
    $observacoes
);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode([
        "mensagem" => "Inscrição realizada com sucesso",
        "id" => $conn->insert_id
    ], JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(500);
    echo json_encode([
        "erro" => "Erro ao salvar inscrição"
    ], JSON_UNESCAPED_UNICODE);
}

$stmt->close();
$stmtEvento->close();
$conn->close();