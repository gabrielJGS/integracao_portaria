\c integracao_portaria;

CREATE TABLE lotes (
	id INT NOT NULL,
	nome VARCHAR(100),
	ativo BOOLEAN,
	criado_em TIMESTAMP,
    CONSTRAINT "PK_Lotes" PRIMARY KEY ("id")
);

CREATE TABLE boletos (
	id INT NOT NULL,
	nome_sacado VARCHAR(255),
	id_lote INT NOT NULL,
	valor DECIMAL,
	linha_digitavel VARCHAR(255),
	ativo BOOLEAN,
	criado_em TIMESTAMP,
    CONSTRAINT "PK_Boletos" PRIMARY KEY ("id"),
    CONSTRAINT "FK_boletos_lotes" FOREIGN KEY ("id_lote") REFERENCES "lotes" ("id")
);

CREATE TABLE depara_lotes (
	id INT NOT NULL,
	nome_lote INT NOT NULL,
    CONSTRAINT "PK_depara_lotes" PRIMARY KEY ("id"),
    CONSTRAINT "FK_depara_lotes_lotes" FOREIGN KEY ("id") REFERENCES "lotes" ("id")
);