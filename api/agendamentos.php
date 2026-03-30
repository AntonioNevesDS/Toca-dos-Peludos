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
$pet_id = isset($dados['pet_id']) ? (int) $dados['pet_id'] : 0;
$nome_interessado = trim($dados['nome_interessado'] ?? '');
$email_interessado = trim($dados['email_interessado'] ?? '');
$telefone_interessado = trim($dados['telefone_interessado'] ?? '');
$data_visita = trim($dados['data_visita'] ?? '');
$horario_visita = trim($dados['horario_visita'] ?? '');
$observacoes = trim($dados['observacoes'] ?? '');

// VALIDAÇÕES
if (
    $pet_id <= 0 ||
    $nome_interessado === '' ||
    $email_interessado === '' ||
    $telefone_interessado === '' ||
    $data_visita === '' ||
    $horario_visita === ''
) {
    http_response_code(400);
    echo json_encode([
        "erro" => "Campos obrigatórios: pet_id, nome_interessado, email_interessado, telefone_interessado, data_visita e horario_visita"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!filter_var($email_interessado, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        "erro" => "Email inválido"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Validar formato da data: YYYY-MM-DD
$dataValida = DateTime::createFromFormat('Y-m-d', $data_visita);
if (!$dataValida || $dataValida->format('Y-m-d') !== $data_visita) {
    http_response_code(400);
    echo json_encode([
        "erro" => "Data inválida. Use o formato YYYY-MM-DD"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Validar formato do horário: HH:MM:SS
$horarioValido = DateTime::createFromFormat('H:i:s', $horario_visita);
if (!$horarioValido || $horarioValido->format('H:i:s') !== $horario_visita) {
    http_response_code(400);
    echo json_encode([
        "erro" => "Horário inválido. Use o formato HH:MM:SS"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// VERIFICAR SE O PET EXISTE
$stmtPet = $conn->prepare("SELECT id, status FROM pets WHERE id = ?");
$stmtPet->bind_param("i", $pet_id);
$stmtPet->execute();
$resultPet = $stmtPet->get_result();

if ($resultPet->num_rows === 0) {
    http_response_code(404);
    echo json_encode([
        "erro" => "Pet não encontrado"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$pet = $resultPet->fetch_assoc();

if ($pet['status'] !== 'disponivel') {
    http_response_code(400);
    echo json_encode([
        "erro" => "Esse pet não está disponível para visita"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// INSERIR AGENDAMENTO
$stmt = $conn->prepare("
    INSERT INTO agendamentos_visita
    (pet_id, nome_interessado, email_interessado, telefone_interessado, data_visita, horario_visita, observacoes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "issssss",
    $pet_id,
    $nome_interessado,
    $email_interessado,
    $telefone_interessado,
    $data_visita,
    $horario_visita,
    $observacoes
);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode([
        "mensagem" => "Agendamento realizado com sucesso",
        "id" => $conn->insert_id
    ], JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(500);
    echo json_encode([
        "erro" => "Erro ao salvar agendamento"
    ], JSON_UNESCAPED_UNICODE);
}

$stmt->close();
$stmtPet->close();
$conn->close();