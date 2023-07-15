\c integracao_portaria;

CREATE TABLE lotes (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(100),
	ativo BOOLEAN,
	criado_em TIMESTAMP
	DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE boletos (
	id SERIAL PRIMARY KEY,
	nome_sacado VARCHAR(255),
	id_lote INT NOT NULL,
	valor DECIMAL,
	linha_digitavel VARCHAR(255),
	ativo BOOLEAN,
	criado_em TIMESTAMP
	DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FK_boletos_lotes" FOREIGN KEY ("id_lote") REFERENCES "lotes" ("id")
);

CREATE TABLE depara_lotes (
	id INT NOT NULL,
	nome_lote INT NOT NULL,
    CONSTRAINT "PK_depara_lotes" PRIMARY KEY ("id")
);

INSERT INTO depara_lotes(id, nome_lote) values (3, 0017);
INSERT INTO depara_lotes(id, nome_lote) values(6, 0018);
INSERT INTO depara_lotes(id, nome_lote) values(7, 0019);