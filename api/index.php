<?php
date_default_timezone_set('America/Recife');

//CONSTANTES NOTAS
define('DOUTORADO', 15);
define('MESTRADO', 12);
define('POS_GRADUACAO', 7);
define('APERFEICOAMENTO', 2);
define('INSTITUICAO', 'EMPRESA');
define('LIMIT_PONTUACAO_1', 100.00);
define('LIMIT_PONTUACAO_2', 90.00);
define('LIMIT_PONTUACAO_3', 60.00);

//CONSTANTES EMAIL
define('EMAIL', '');
define('PASSEMAIL', '');
define('HOSTMAIL', '');
define('ASSUNTOPROTOCOLO', 'Seleção Simplificada ' . date('Y') . ' - Protocolo - N˚ ');
define('EMPRESA', '');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

require_once 'vendor/autoload.php';
require_once 'conection_server.php';

$verify = function (Request $request, Response $response, $next) {
	if ($request->hasHeader('Authorization')) {
		$headerValue = $request->getHeaderLine('Authorization');
		$sql = 'SELECT users.token FROM users WHERE users.token = :token';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('token', $headerValue, PDO::PARAM_STR);
			$stmt->execute();
			$resp = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			if ($resp) {
				$response = $next($request, $response);
			} else {
				$response = $response->withStatus(401);
				$erro['erro'] = 'Unauthorized';
				$response->getBody()->write(json_encode($erro));
			}
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	} else {
		$response = $response->withStatus(401);
		$erro['erro'] = 'Unauthorized';
		$response->getBody()->write(json_encode($erro));
	}
	return $response;
};

function setPontuacao($dados)
{
	$pontuacao = 0.00;
	$calculo = intval($dados['tempo_experiencia_avaliacao'] / 6);
	switch ($dados['avaliacao_cargo']) {
		case '1':
			$pontuacao = $calculo * 10;
			if ($pontuacao > LIMIT_PONTUACAO_1) {
				$pontuacao = LIMIT_PONTUACAO_1;
			} else {
				$pontuacao = $pontuacao;
			}
			break;
		case '2':
			$pontuacao = $calculo * 7.5;
			if ($pontuacao > LIMIT_PONTUACAO_2) {
				$pontuacao = LIMIT_PONTUACAO_2;
			} else {
				$pontuacao = $pontuacao;
			}
			break;
		default:
			$pontuacao = $calculo * 7.5;
			if ($pontuacao > LIMIT_PONTUACAO_3) {
				$pontuacao = LIMIT_PONTUACAO_3;
			} else {
				$pontuacao = $pontuacao;
			}
	}
	$pontuacao += ($dados['cursos_avaliacao'] * APERFEICOAMENTO);
	if ($dados['pos_avaliacao']) {
		$pontuacao += POS_GRADUACAO;
	}
	if ($dados['mestrado_avaliacao']) {
		$pontuacao += MESTRADO;
	}
	if ($dados['doutorado_avaliacao']) {
		$pontuacao += DOUTORADO;
	}
	return $pontuacao;
}

function EnviarMail($dados)
{
	$mail = new PHPMailer(true);
	try {
		//Server settings
		$mail->CharSet = 'UTF-8';
		$mail->isSMTP();
		$mail->Host = HOSTMAIL;
		$mail->SMTPAuth = true;
		$mail->Username = EMAIL;
		$mail->Password = PASSEMAIL;
		$mail->SMTPSecure = 'tls';
		$mail->Port = 587;
		//Mensagem
		$mensagem = "<h4>Olá, $dados[nome_candidato]</h4>
		<p>A " . EMPRESA . ", confirma a sua inscrição na Seleção Simplificada.</p>
		<p>O seu número de protocolo é: <strong>$dados[protocolo_candidato]</strong></p>";
		//Remetente
		$mail->setFrom(EMAIL, 'Seleção Simplificada');
		$mail->addReplyTo(EMAIL, 'Seleção Simplificada');
		//Content
		$mail->addAddress($dados['email_candidato'], $dados['nome_candidato']);
		$mail->isHTML(true);
		$mail->Subject = ASSUNTOPROTOCOLO . $dados['protocolo_candidato'];
		$mail->Body    = $mensagem;
		$enviado = $mail->send();
		$message = $mail->getSentMIMEMessage();
		$imapStream = imap_open(HOSTMAIL, EMAIL, PASSEMAIL);
		imap_append($imapStream, HOSTMAIL, $message);
		imap_close($imapStream);
		if (isset($enviado)) {
			return true;
		} else {
			return false;
		}
	} catch (Exception $e) {
		echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
	}
}

$app = new \Slim\App();
$app->group('/login', function () use ($app) {
	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'SELECT users.id, users.token, users.flag, users.type, users.status FROM users WHERE users.user = BINARY :usuario AND users.pass = BINARY PASSWORD(:password)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('usuario', $data['user'], PDO::PARAM_STR);
			$stmt->bindParam('password', $data['pass'], PDO::PARAM_STR);
			$stmt->execute();
			$resp = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->put('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'UPDATE users SET users.pass = PASSWORD(:novasenha), users.token = :token, users.flag = :flag WHERE users.id = :id';
		$data['token'] = md5($data['user'] . ':' . $data['novasenha'] . time());
		$data['flag'] = 1;
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('novasenha', $data['novasenha'], PDO::PARAM_STR);
			$stmt->bindParam('token', $data['token'], PDO::PARAM_STR);
			$stmt->bindParam('flag', $data['flag'], PDO::PARAM_INT);
			$stmt->bindParam('id', $data['id'], PDO::PARAM_INT);
			$stmt->execute();
			$resp = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
});

$app->group('/cargos', function () use ($app) {
	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'INSERT INTO cargos (cargos.nome_cargo, cargos.avaliacao_cargo) VALUES (:nome_cargo, :avaliacao_cargo)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('nome_cargo', $data['nome_cargo'], PDO::PARAM_STR);
			$stmt->bindParam('avaliacao_cargo', $data['avaliacao_cargo'], PDO::PARAM_STR);
			$stmt->execute();
			$data['id_cargo'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$erros['erro'] = $e->getMessage();
			$response->getBody()->write(json_encode($erros));
		}
	});

	$app->delete('/{id_cargo}', function (Request $request, Response $response, array $arguments) {
		$sql = 'DELETE FROM cargos WHERE cargos.id_cargo = :id_cargo';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_cargo', $arguments['id_cargo'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT * FROM cargos ORDER BY cargos.nome_cargo';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$resp = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->group('/candidatos', function () use ($app) {
	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'INSERT INTO candidatos (candidatos.protocolo_candidato, candidatos.id_cargo_candidato, candidatos.nome_candidato, candidatos.genero_candidato, candidatos.estado_civil_candidato, candidatos.data_nascimento_candidato, candidatos.rg_candidato, candidatos.emissor_rg_candidato, candidatos.cpf_candidato, candidatos.titulo_candidato, candidatos.zona_candidato, candidatos.secao_candidato, candidatos.telefone_um_candidato, candidatos.telefone_dois_candidato, candidatos.email_candidato, candidatos.cep_candidato, candidatos.cidade_candidato, candidatos.estado_candidato, candidatos.logradouro_candidato, candidatos.numero_candidato, candidatos.bairro_candidato, candidatos.complemento_candidato, candidatos.pai_candidato, candidatos.mae_candidato, candidatos.instrucao_candidato, candidatos.deficiente_candidato, candidatos.usuario_candidato) VALUES (:protocolo_candidato, :id_cargo_candidato, :nome_candidato, :genero_candidato, :estado_civil_candidato, :data_nascimento_candidato, :rg_candidato, :emissor_rg_candidato, :cpf_candidato, :titulo_candidato, :zona_candidato, :secao_candidato, :telefone_um_candidato, :telefone_dois_candidato, :email_candidato, :cep_candidato, :cidade_candidato, :estado_candidato, :logradouro_candidato, :numero_candidato, :bairro_candidato, :complemento_candidato, :pai_candidato, :mae_candidato, :instrucao_candidato, :deficiente_candidato, :usuario_candidato)';
		try {
			/*if (isset($data['email_candidato'])) {
			EnviarMail($data);
		}*/
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('protocolo_candidato', $data['protocolo_candidato'], PDO::PARAM_STR);
			$stmt->bindParam('id_cargo_candidato', $data['id_cargo_candidato'], PDO::PARAM_INT);
			$stmt->bindParam('nome_candidato', $data['nome_candidato'], PDO::PARAM_STR);
			$stmt->bindParam('genero_candidato', $data['genero_candidato'], PDO::PARAM_INT);
			$stmt->bindParam('estado_civil_candidato', $data['estado_civil_candidato'], PDO::PARAM_INT);
			$stmt->bindParam('data_nascimento_candidato', $data['data_nascimento_candidato']);
			$stmt->bindParam('rg_candidato', $data['rg_candidato'], PDO::PARAM_STR);
			$stmt->bindParam('emissor_rg_candidato', $data['emissor_rg_candidato'], PDO::PARAM_STR);
			$stmt->bindParam('cpf_candidato', $data['cpf_candidato'], PDO::PARAM_STR);
			$stmt->bindParam('titulo_candidato', $data['titulo_candidato'], PDO::PARAM_STR);
			$stmt->bindParam('zona_candidato', $data['zona_candidato'], PDO::PARAM_STR);
			$stmt->bindParam('secao_candidato', $data['secao_candidato'], PDO::PARAM_STR);
			$stmt->bindParam('telefone_um_candidato', $data['telefone_um_candidato'], PDO::PARAM_INT);
			$stmt->bindParam('telefone_dois_candidato', $data['telefone_dois_candidato'], PDO::PARAM_INT);
			$stmt->bindParam('email_candidato', $data['email_candidato'], PDO::PARAM_STR);
			$stmt->bindParam('cep_candidato', $data['cep_candidato'], PDO::PARAM_INT);
			$stmt->bindParam('cidade_candidato', $data['cidade_candidato'], PDO::PARAM_STR);
			$stmt->bindParam('estado_candidato', $data['estado_candidato'], PDO::PARAM_STR);
			$stmt->bindParam('logradouro_candidato', $data['logradouro_candidato'], PDO::PARAM_STR);
			$stmt->bindParam('numero_candidato', $data['numero_candidato'], PDO::PARAM_STR);
			$stmt->bindParam('bairro_candidato', $data['bairro_candidato'], PDO::PARAM_STR);
			$stmt->bindParam('complemento_candidato', $data['complemento_candidato'], PDO::PARAM_STR);
			$stmt->bindParam('pai_candidato', $data['pai_candidato'], PDO::PARAM_STR);
			$stmt->bindParam('mae_candidato', $data['mae_candidato'], PDO::PARAM_STR);
			$stmt->bindParam('instrucao_candidato', $data['instrucao_candidato'], PDO::PARAM_INT);
			$stmt->bindParam('deficiente_candidato', $data['deficiente_candidato'], PDO::PARAM_INT);
			$stmt->bindParam('usuario_candidato', $data['usuario_candidato'], PDO::PARAM_INT);
			$stmt->execute();
			$data['id_candidato'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$erros['erro'] = $e->getMessage();
			$response->getBody()->write(json_encode($erros));
		}
	});

	$app->get('', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT candidatos.id_candidato, candidatos.numero_inscricao_candidato, candidatos.cpf_candidato, candidatos.nome_candidato, candidatos.data_nascimento_candidato, cargos.nome_cargo, avaliacoes.status_avaliacao, recursos.id_candidato_recurso FROM candidatos INNER JOIN cargos ON candidatos.id_cargo_candidato = cargos.id_cargo LEFT JOIN avaliacoes ON candidatos.id_candidato = avaliacoes.id_candidato_avaliacao LEFT JOIN recursos ON recursos.id_candidato_recurso = candidatos.id_candidato';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$resp = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/consulta/{cpf_candidato}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT candidatos.id_candidato, candidatos.numero_inscricao_candidato, candidatos.protocolo_candidato, cargos.nome_cargo, cargos.avaliacao_cargo, candidatos.nome_candidato, candidatos.genero_candidato, candidatos.estado_civil_candidato, candidatos.data_nascimento_candidato, candidatos.rg_candidato, candidatos.emissor_rg_candidato, candidatos.cpf_candidato, candidatos.titulo_candidato, candidatos.zona_candidato, candidatos.secao_candidato, candidatos.telefone_um_candidato, candidatos.telefone_dois_candidato, candidatos.email_candidato, candidatos.cep_candidato, candidatos.logradouro_candidato, candidatos.numero_candidato, candidatos.cidade_candidato, candidatos.estado_candidato, candidatos.bairro_candidato, candidatos.complemento_candidato, candidatos.pai_candidato, candidatos.mae_candidato, candidatos.instrucao_candidato, candidatos.deficiente_candidato, candidatos.data_inscricao_candidato, avaliacoes.tempo_experiencia_avaliacao, avaliacoes.doutorado_avaliacao, avaliacoes.mestrado_avaliacao, avaliacoes.pos_avaliacao, avaliacoes.jurado_avaliacao, avaliacoes.cursos_avaliacao, avaliacoes.pontuacao_avaliacao, avaliacoes.status_avaliacao FROM candidatos INNER JOIN cargos ON candidatos.id_cargo_candidato = cargos.id_cargo LEFT JOIN avaliacoes ON candidatos.id_candidato = avaliacoes.id_candidato_avaliacao WHERE candidatos.cpf_candidato = :cpf_candidato';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('cpf_candidato', $arguments['cpf_candidato'], PDO::PARAM_STR);
			$stmt->execute();
			$resp = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->group('/avaliacoes', function () use ($app) {
	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$data['pontuacao_avaliacao'] = setPontuacao($data);
		$sql = 'INSERT INTO avaliacoes (avaliacoes.id_candidato_avaliacao, avaliacoes.tempo_experiencia_avaliacao, avaliacoes.doutorado_avaliacao, avaliacoes.mestrado_avaliacao, avaliacoes.pos_avaliacao, avaliacoes.jurado_avaliacao, avaliacoes.cursos_avaliacao, avaliacoes.pontuacao_avaliacao, avaliacoes.usuario_avaliacao, avaliacoes.status_avaliacao) VALUES (:id_candidato_avaliacao, :tempo_experiencia_avaliacao, :doutorado_avaliacao, :mestrado_avaliacao, :pos_avaliacao, :jurado_avaliacao, :cursos_avaliacao, :pontuacao_avaliacao, :usuario_avaliacao, :status_avaliacao)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_candidato_avaliacao', $data['id_candidato_avaliacao'], PDO::PARAM_INT);
			$stmt->bindParam('tempo_experiencia_avaliacao', $data['tempo_experiencia_avaliacao'], PDO::PARAM_INT);
			$stmt->bindParam('doutorado_avaliacao', $data['doutorado_avaliacao'], PDO::PARAM_STR);
			$stmt->bindParam('mestrado_avaliacao', $data['mestrado_avaliacao'], PDO::PARAM_STR);
			$stmt->bindParam('pos_avaliacao', $data['pos_avaliacao'], PDO::PARAM_STR);
			$stmt->bindParam('jurado_avaliacao', $data['jurado_avaliacao'], PDO::PARAM_STR);
			$stmt->bindParam('cursos_avaliacao', $data['cursos_avaliacao'], PDO::PARAM_INT);
			$stmt->bindParam('pontuacao_avaliacao', $data['pontuacao_avaliacao']);
			$stmt->bindParam('usuario_avaliacao', $data['usuario_avaliacao'], PDO::PARAM_INT);
			$stmt->bindParam('status_avaliacao', $data['status_avaliacao'], PDO::PARAM_INT);
			$stmt->execute();
			$data['fim_avaliacao'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->group('/recurso', function () use ($app) {
	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$sql = 'INSERT INTO recursos (recursos.id_candidato_recurso, recursos.status_recurso, recursos.resposta_recurso, recursos.usuario_recurso) VALUES (:id_candidato_recurso, :status_recurso, :resposta_recurso, :usuario_recurso)';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_candidato_recurso', $data['id_candidato_recurso'], PDO::PARAM_INT);
			$stmt->bindParam('status_recurso', $data['status_recurso'], PDO::PARAM_STR);
			$stmt->bindParam('resposta_recurso', $data['resposta_recurso'], PDO::PARAM_STR);
			$stmt->bindParam('usuario_recurso', $data['usuario_recurso'], PDO::PARAM_INT);
			$stmt->execute();
			$data['fim_recurso'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT candidatos.numero_inscricao_candidato, recursos.status_recurso, recursos.resposta_recurso FROM recursos INNER JOIN candidatos ON recursos.id_candidato_recurso = candidatos.id_candidato';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$resp = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->group('/resultado', function () use ($app) {
	$app->get('/preliminar/{deficiente_candidato}/{id_cargo}', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT candidatos.numero_inscricao_candidato, candidatos.nome_candidato, avaliacoes.pontuacao_avaliacao, avaliacoes.status_avaliacao FROM candidatos INNER JOIN avaliacoes ON candidatos.id_candidato = avaliacoes.id_candidato_avaliacao WHERE candidatos.id_cargo_candidato = :id_cargo AND candidatos.deficiente_candidato = :deficiente_candidato ORDER BY avaliacoes.status_avaliacao DESC';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id_cargo', $arguments['id_cargo'], PDO::PARAM_INT);
			$stmt->bindParam('deficiente_candidato', $arguments['deficiente_candidato'], PDO::PARAM_INT);
			$stmt->execute();
			$resp = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->get('/final/{deficiente_candidato}/{id_cargo}', function (Request $request, Response $response, array $arguments) {
		$sql = "SELECT candidatos.numero_inscricao_candidato, candidatos.nome_candidato, candidatos.data_nascimento_candidato, avaliacoes.status_avaliacao, avaliacoes.jurado_avaliacao, avaliacoes.pontuacao_avaliacao, CASE WHEN cargos.avaliacao_cargo = 1 THEN IF(avaliacoes.tempo_experiencia_avaliacao DIV 6 * 7.5 > " . LIMIT_PONTUACAO_1 . ", " . LIMIT_PONTUACAO_1 . ", avaliacoes.tempo_experiencia_avaliacao DIV 6 * 7.5) WHEN cargos.avaliacao_cargo = 2 THEN IF(avaliacoes.tempo_experiencia_avaliacao DIV 6 * 7.5 > " . LIMIT_PONTUACAO_2 . ", " . LIMIT_PONTUACAO_2 . ", avaliacoes.tempo_experiencia_avaliacao DIV 6 * 7.5) ELSE IF(avaliacoes.tempo_experiencia_avaliacao DIV 6 * 7.5 > " . LIMIT_PONTUACAO_3 . ", " . LIMIT_PONTUACAO_3 . ", avaliacoes.tempo_experiencia_avaliacao DIV 6 * 7.5) END AS tempo_experiencia_avaliacao, SUM(IF(avaliacoes.doutorado_avaliacao = '1', " . DOUTORADO . ", 0) + IF(avaliacoes.mestrado_avaliacao = '1', " . MESTRADO . ", 0) + IF(avaliacoes.pos_avaliacao = '1', " . POS_GRADUACAO . ", 0) + IF(avaliacoes.cursos_avaliacao >= 1, avaliacoes.cursos_avaliacao * " . APERFEICOAMENTO . ", 0)) AS titulos_avaliacao, TIMESTAMPDIFF(DAY, candidatos.data_nascimento_candidato, candidatos.data_inscricao_candidato) AS dias_candidato, TIMESTAMPDIFF(YEAR, candidatos.data_nascimento_candidato, candidatos.data_inscricao_candidato) AS idade_candidato FROM candidatos INNER JOIN avaliacoes ON avaliacoes.id_candidato_avaliacao = candidatos.id_candidato INNER JOIN cargos ON cargos.id_cargo = candidatos.id_cargo_candidato WHERE candidatos.id_cargo_candidato = :id_cargo AND candidatos.deficiente_candidato = :deficiente_candidato GROUP BY candidatos.id_candidato";
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('deficiente_candidato', $arguments['deficiente_candidato'], PDO::PARAM_INT);
			$stmt->bindParam('id_cargo', $arguments['id_cargo'], PDO::PARAM_INT);
			$stmt->execute();
			$resp = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->group('/dashboard', function () use ($app) {
	$app->get('/candidatos', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT COUNT(candidatos.id_candidato) AS total_cargo, cargos.nome_cargo FROM candidatos INNER JOIN cargos ON candidatos.id_cargo_candidato = cargos.id_cargo GROUP BY candidatos.id_cargo_candidato';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$resp = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->group('/usuarios', function () use ($app) {
	$app->post('', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$data['pass'] = 'mudar123';
		$sql = 'INSERT INTO users (users.name, users.user, users.type, users.pass) VALUES (:name, :user, :type, PASSWORD(:pass))';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('name', $data['name'], PDO::PARAM_STR);
			$stmt->bindParam('user', $data['user'], PDO::PARAM_STR);
			$stmt->bindParam('type', $data['type'], PDO::PARAM_INT);
			$stmt->bindParam('pass', $data['pass']);
			$stmt->execute();
			$data['id'] = $db->lastInsertId();
			$db = null;
			$response->getBody()->write(json_encode($data));
		} catch (PDOException $e) {
			$erros['erro'] = $e->getMessage();
			$response->getBody()->write(json_encode($erros));
		}
	});

	$app->get('', function (Request $request, Response $response, array $arguments) {
		$sql = 'SELECT users.name, users.user, users.type, users.id FROM users WHERE users.status = 1';
		try {
			$db = getConnection();
			$stmt = $db->query($sql);
			$resp = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->delete('/{id}', function (Request $request, Response $response, array $arguments) {
		$sql = 'UPDATE users SET users.status = 0 WHERE users.id = :id';
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('id', $arguments['id'], PDO::PARAM_INT);
			$stmt->execute();
			$dado = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($dado));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});

	$app->put('/{id}', function (Request $request, Response $response, array $arguments) {
		$data = $request->getParsedBody();
		$data['token'] = md5($data['user'] . ': mudar123' . time());
		$sql = "UPDATE users SET users.pass = PASSWORD('mudar123'), users.flag = 0, users.token = :token WHERE users.id = :id";
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam('token', $data['token'], PDO::PARAM_STR);
			$stmt->bindParam('id', $arguments['id'], PDO::PARAM_INT);
			$stmt->execute();
			$resp = $stmt->rowCount();
			$db = null;
			$response->getBody()->write(json_encode($resp));
		} catch (PDOException $e) {
			$response->getBody()->write(json_encode($e->getMessage()));
		}
	});
})->add($verify);

$app->run();
