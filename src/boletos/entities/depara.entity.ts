import { Table, Column, Model } from 'sequelize-typescript';

@Table({ tableName: 'depara_lotes', timestamps: false })
export class DePara extends Model {
  @Column({ primaryKey: true })
  id: number;

  @Column
  nome_lote: string;
}
