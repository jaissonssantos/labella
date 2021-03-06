<?php

use Utils\Conexao;

header('Content-type: application/json');
$oConexao = Conexao::getInstance();
$params = json_decode(file_get_contents('php://input'));
$response = new stdClass();

try {

    if (!isset(
        $params->email,
        $params->senha
    )) {
        throw new Exception('Verifique os dados preenchidos', 400);
    }

    $stmt = $oConexao->prepare(
        'SELECT id,idempresa,nome,email
		FROM usuario
		WHERE 
            email=upper(?) 
		AND 
			senha=?
		AND
			status=1'
    );
    $stmt->execute(array(
        $params->email,
        sha1(SALT.$params->senha)
    ));
    $results = $stmt->fetchObject();

    if($results){
        $_SESSION['eventos_uid'] = $results->id;
        $_SESSION['eventos_nome'] = $results->nome;
        $_SESSION['eventos_email'] = $results->email;
        $_SESSION['eventos_empresa'] = $results->idempresa;
    } 
    http_response_code(200);
    if (!$results) {
        throw new Exception('Dados de login incorretos. Tente novamente.', 404);
    }
    $response = array(
        'results' => $results
    );

} catch (PDOException $e) {
    echo $e->getMessage();
    http_response_code(500);
    $response->error = 'Desculpa. Tivemos um problema, tente novamente mais tarde';
} catch (Exception $e) {
    http_response_code($e->getCode());
    $response->error = $e->getMessage();
}

echo json_encode($response);
