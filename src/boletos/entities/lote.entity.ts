import { Table, Column, Model } from 'sequelize-typescript';

@Table({ tableName: 'lotes', timestamps: false })
export class Lote extends Model {
  @Column({ primaryKey: true, autoIncrement: true  })
  id: number;

  @Column
  nome: string;

  @Column
  ativo: boolean;

  @Column
  criado_em: string;
}
