<?php


//permite a leitura via JavaScript com o retorno em JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST");

require 'conexao.php';

$metodo = $_SERVER['REQUEST_METHOD'];

//Rota GET
if ($metodo === 'GET') {
    try {
        $stmt = $pdo->prepare("SELECT id, nome, especie, idade, foto_url FROM pets WHERE status = 'disponivel'");
        $stmt->execute();
        $pets = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($pets);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["erro" => "Erro ao buscar pets."]);

    }
}

// ROTA POST
elseif ($metodo === 'POST') {
    
    $dados = json_decode(file_get_contents("php://input"));

    if(!empty($dados->nome) && !empty($dados->especie)) {
        try {
            $sql = "INSERT INTO pets (nome, especie, idade, status) VALUES (:nome, :especie, :idade, 'disponivel')";
            $stmt = $pdo->prepare($sql);
            
            $stmt->bindParam(':nome', $dados->nome);
            $stmt->bindParam(':especie', $dados->especie);
            $stmt->bindParam(':idade', $dados->idade);
            
            if($stmt->execute()) {
                http_response_code(201);
                echo json_encode(["mensagem" => "Pet cadastrado com sucesso!"]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["erro" => "Erro ao salvar o pet."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["erro" => "Dados incompletos. Nome e espécie são obrigatórios."]);
    }
}


?>