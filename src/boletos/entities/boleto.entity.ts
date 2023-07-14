import { Table, Column, Model } from 'sequelize-typescript';

@Table({ tableName: 'boletos', timestamps: false })
export class Boleto extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  nome_sacado: string;

  @Column
  id_lote: number;

  @Column
  valor: number;

  @Column
  linha_digitavel: string;

  @Column
  ativo: boolean;

  @Column
  criado_em: string;
}
