<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Chama o arquivo de conexão com o banco de dados
require 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recebe os dados do formulário HTML/JS
    $dados = json_decode(file_get_contents("php://input"));

    if (!empty($dados->email) && !empty($dados->senha)) {
        
        try {
            // 1. Procura se existe algum usuário com o e-mail digitado
            $sql = "SELECT id, nome, senha_hash FROM usuarios WHERE email = :email";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':email', $dados->email);
            $stmt->execute();

            // 2. Se encontrou o e-mail...
            if ($stmt->rowCount() > 0) {
                $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

                // 3. Verifica se a senha digitada bate com a senha criptografada do banco
                if (password_verify($dados->senha, $usuario['senha_hash'])) {
                    
                    // Sucesso! Devolve os dados do usuário para o JS salvar a sessão
                    http_response_code(200);
                    echo json_encode([
                        "mensagem" => "Login realizado com sucesso!",
                        "usuario" => [
                            "id" => $usuario['id'],
                            "nome" => $usuario['nome']
                        ]
                    ]);
                } else {
                    // Senha errada
                    http_response_code(401); 
                    echo json_encode(["erro" => "Senha incorreta."]);
                }
            } else {
                // E-mail não cadastrado
                http_response_code(404); 
                echo json_encode(["erro" => "Usuário não encontrado com este e-mail."]);
            }
            
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["erro" => "Erro no servidor: " . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["erro" => "E-mail e senha são obrigatórios."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["erro" => "Método não permitido. Use POST."]);
}
?>