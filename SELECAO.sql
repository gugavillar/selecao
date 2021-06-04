-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Tempo de geração: 03/06/2021 às 18:31
-- Versão do servidor: 10.3.29-MariaDB-0ubuntu0.20.04.1
-- Versão do PHP: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `SELECAO`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `avaliacoes`
--

CREATE TABLE `avaliacoes` (
  `id_candidato_avaliacao` int(11) NOT NULL,
  `tempo_experiencia_avaliacao` smallint(3) DEFAULT NULL,
  `doutorado_avaliacao` enum('0','1') DEFAULT NULL,
  `mestrado_avaliacao` enum('0','1') DEFAULT NULL,
  `pos_avaliacao` enum('0','1') DEFAULT NULL,
  `jurado_avaliacao` enum('0','1') DEFAULT NULL,
  `cursos_avaliacao` tinyint(1) DEFAULT NULL,
  `pontuacao_avaliacao` decimal(5,2) DEFAULT NULL,
  `usuario_avaliacao` int(11) NOT NULL,
  `status_avaliacao` enum('1','2') NOT NULL,
  `data_avaliacao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `candidatos`
--

CREATE TABLE `candidatos` (
  `id_candidato` int(11) NOT NULL,
  `numero_inscricao_candidato` int(6) UNSIGNED ZEROFILL NOT NULL,
  `protocolo_candidato` varchar(15) NOT NULL,
  `id_cargo_candidato` int(11) NOT NULL,
  `nome_candidato` varchar(300) NOT NULL,
  `genero_candidato` enum('1','2') NOT NULL,
  `estado_civil_candidato` enum('1','2','3','4','5') NOT NULL,
  `data_nascimento_candidato` date NOT NULL,
  `rg_candidato` varchar(11) NOT NULL,
  `emissor_rg_candidato` varchar(6) NOT NULL,
  `cpf_candidato` varchar(11) NOT NULL,
  `titulo_candidato` varchar(12) NOT NULL,
  `zona_candidato` varchar(4) NOT NULL,
  `secao_candidato` varchar(4) NOT NULL,
  `telefone_um_candidato` bigint(11) UNSIGNED NOT NULL,
  `telefone_dois_candidato` bigint(11) UNSIGNED DEFAULT NULL,
  `email_candidato` varchar(200) DEFAULT NULL,
  `cep_candidato` int(8) UNSIGNED ZEROFILL NOT NULL,
  `cidade_candidato` varchar(200) NOT NULL,
  `estado_candidato` varchar(2) NOT NULL,
  `logradouro_candidato` varchar(300) NOT NULL,
  `numero_candidato` varchar(9) NOT NULL,
  `bairro_candidato` varchar(200) NOT NULL,
  `complemento_candidato` varchar(200) DEFAULT NULL,
  `pai_candidato` varchar(300) NOT NULL,
  `mae_candidato` varchar(300) NOT NULL,
  `instrucao_candidato` enum('1','2','3','4','5','6','7','8','9','10','11') NOT NULL,
  `deficiente_candidato` enum('1','2') NOT NULL,
  `usuario_candidato` int(11) NOT NULL,
  `data_inscricao_candidato` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gatilhos `candidatos`
--
DELIMITER $$
CREATE TRIGGER `INSERT NUMERO INSCRICAO E PROTOCOLO CANDIDATO` BEFORE INSERT ON `candidatos` FOR EACH ROW IF EXISTS (
    SELECT candidatos.numero_inscricao_candidato
    FROM candidatos
  ) THEN
SET NEW.numero_inscricao_candidato = (
    SELECT MAX(candidatos.numero_inscricao_candidato)
    FROM candidatos
  ) + 1;
SET NEW.protocolo_candidato = (
    SELECT CONCAT(
        DATE_FORMAT(NOW(), '%Y%m%d'),
        SUBSTRING(UPPER(MD5(RAND())), 1, 7)
      )
  );
ELSE
SET NEW.numero_inscricao_candidato = 1;
SET NEW.protocolo_candidato = (
    SELECT CONCAT(
        DATE_FORMAT(NOW(), '%Y%m%d'),
        SUBSTRING(UPPER(MD5(RAND())), 1, 7)
      )
  );
END IF
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `cargos`
--

CREATE TABLE `cargos` (
  `id_cargo` int(11) NOT NULL,
  `nome_cargo` varchar(200) NOT NULL,
  `avaliacao_cargo` enum('1','2','3') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `recursos`
--

CREATE TABLE `recursos` (
  `id_candidato_recurso` int(11) NOT NULL,
  `status_recurso` enum('0','1') NOT NULL,
  `resposta_recurso` text NOT NULL,
  `data_recurso` timestamp NOT NULL DEFAULT current_timestamp(),
  `usuario_recurso` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gatilhos `recursos`
--
DELIMITER $$
CREATE TRIGGER `APAGAR AVALIACAO` AFTER INSERT ON `recursos` FOR EACH ROW IF (NEW.status_recurso = '1') THEN
DELETE FROM avaliacoes
WHERE avaliacoes.id_candidato_avaliacao = NEW.id_candidato_recurso;
END IF
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `user` varchar(10) NOT NULL,
  `pass` varchar(41) NOT NULL,
  `token` varchar(32) NOT NULL DEFAULT 'c2f0e5b876668fdf1bac14045ad9c727',
  `flag` tinyint(1) NOT NULL DEFAULT 0,
  `type` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Despejando dados para a tabela `users`
--

INSERT INTO `users` (`id`, `name`, `user`, `pass`, `token`, `flag`, `type`, `status`) VALUES
(1, 'ADMINISTRADOR', 'root', '*BD1E96A8FE3355B8952F1EF08B565FC63D715ADF', '1fe5313010c0e1728bde68145c420547', 1, 0, 1),
(2, 'AVALIADOR', 'avaliador', '*BD1E96A8FE3355B8952F1EF08B565FC63D715ADF', '8c6d77b26f091b7e17488f625c279faa', 1, 1, 1),
(3, 'DIGITADOR', 'digitador', '*BD1E96A8FE3355B8952F1EF08B565FC63D715ADF', '54153ba63b1513652a2a9c16bcce7b3b', 1, 2, 1);

--
-- Índices de tabelas apagadas
--

--
-- Índices de tabela `avaliacoes`
--
ALTER TABLE `avaliacoes`
  ADD UNIQUE KEY `ID CANDIDATO UNICO` (`id_candidato_avaliacao`),
  ADD KEY `ID DO CANDIDATO` (`id_candidato_avaliacao`),
  ADD KEY `ID DO USUARIO` (`usuario_avaliacao`);

--
-- Índices de tabela `candidatos`
--
ALTER TABLE `candidatos`
  ADD PRIMARY KEY (`id_candidato`),
  ADD UNIQUE KEY `UNICO RG CANDIDATO` (`rg_candidato`),
  ADD UNIQUE KEY `UNICO CPF CANDIDATO` (`cpf_candidato`),
  ADD UNIQUE KEY `UNICO TITULO CANDIDATO` (`titulo_candidato`),
  ADD UNIQUE KEY `UNICO PROTOCOLO` (`protocolo_candidato`),
  ADD KEY `ID DO CARGO` (`id_cargo_candidato`),
  ADD KEY `ID DO USUARIO` (`usuario_candidato`);

--
-- Índices de tabela `cargos`
--
ALTER TABLE `cargos`
  ADD PRIMARY KEY (`id_cargo`),
  ADD UNIQUE KEY `UNICO CARGO` (`nome_cargo`);

--
-- Índices de tabela `recursos`
--
ALTER TABLE `recursos`
  ADD UNIQUE KEY `ID DE CANDIDATO UNICO` (`id_candidato_recurso`),
  ADD KEY `ID CANDIDATO RECURSO` (`id_candidato_recurso`),
  ADD KEY `ID DO USUARIO RECURSO` (`usuario_recurso`);

--
-- Índices de tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `USER` (`user`);

--
-- AUTO_INCREMENT de tabelas apagadas
--

--
-- AUTO_INCREMENT de tabela `candidatos`
--
ALTER TABLE `candidatos`
  MODIFY `id_candidato` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `cargos`
--
ALTER TABLE `cargos`
  MODIFY `id_cargo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restrições para dumps de tabelas
--

--
-- Restrições para tabelas `avaliacoes`
--
ALTER TABLE `avaliacoes`
  ADD CONSTRAINT `avaliacoes_ibfk_1` FOREIGN KEY (`id_candidato_avaliacao`) REFERENCES `candidatos` (`id_candidato`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `avaliacoes_ibfk_2` FOREIGN KEY (`usuario_avaliacao`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Restrições para tabelas `candidatos`
--
ALTER TABLE `candidatos`
  ADD CONSTRAINT `candidatos_ibfk_1` FOREIGN KEY (`id_cargo_candidato`) REFERENCES `cargos` (`id_cargo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `candidatos_ibfk_2` FOREIGN KEY (`usuario_candidato`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Restrições para tabelas `recursos`
--
ALTER TABLE `recursos`
  ADD CONSTRAINT `recursos_ibfk_1` FOREIGN KEY (`id_candidato_recurso`) REFERENCES `candidatos` (`id_candidato`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `recursos_ibfk_2` FOREIGN KEY (`usuario_recurso`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
