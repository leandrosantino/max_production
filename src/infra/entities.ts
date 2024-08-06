import { DateTransformer } from '@/transformers/DateTransformer';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, Unique, ManyToMany, JoinTable } from 'typeorm';

// Machine Entity
@Entity()
export class Machine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('nchar', { name: 'slug', unique: true })
  slug: string;

  @Column('nchar', { name: 'ute' })
  ute: string;

  @Column('int', { name: 'processId', nullable: true })
  processId: number;

  @ManyToMany(() => Product, (product) => product.productionMachine)
  acceptedProducts: Product[];

  @ManyToOne(() => Process, (process) => process.machines)
  @JoinColumn({ name: "processId" })
  process: Process;
}

// Product Entity
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('nchar', { name: 'description' })
  description: string;

  @Column('int', { name: 'cicleTime' })
  cicleTime: number;

  @Column('nchar', { name: 'sapCode', unique: true })
  sapCode: string;

  @Column('nchar', { name: 'partNumber', nullable: true, unique: true })
  partNumber: string;

  @Column('nchar', { name: 'type' })
  type: string;

  @Column('nchar', { name: 'project' })
  project: string;

  @Column('int', { name: 'multiple' })
  multiple: number;

  @Column('int', { name: 'setupDurationInMinutes' })
  setupDurationInMinutes: number;

  @Column('int', { name: 'quantityPerPackage' })
  quantityPerPackage: number;

  @Column('nchar', { name: 'line' })
  line: string;

  @Column('nchar', { name: 'wipSapCode', nullable: true })
  wipSapCode: string;

  @ManyToOne(() => Product, (product) => product.finisheds)
  @JoinColumn({ name: "wipSapCode", referencedColumnName: "sapCode" })
  wip: Product;

  @OneToMany(() => Product, (product) => product.wip)
  finisheds: Product[];

  @Column('int', { name: 'processId', nullable: true })
  processId: number;

  @ManyToOne(() => Process, (process) => process.products)
  @JoinColumn({ name: "processId" })
  process: Process;

  @ManyToMany(() => Machine, (machine) => machine.acceptedProducts)
  @JoinTable({ name: "machine_to_product" })
  productionMachine: Machine[];
}

// Process Entity
@Entity()
export class Process {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('nchar', { name: 'description' })
  description: string;

  @Column('nchar', { name: 'type' })
  type: string;

  @Column('nchar', { name: 'ute' })
  ute: string;

  @OneToMany(() => Product, (product) => product.process)
  products: Product[];

  @OneToMany(() => Machine, (machine) => machine.process)
  machines: Machine[];

  @ManyToOne(() => Process, (process) => process.childrens)
  @JoinColumn({ name: "parentId" })
  parent: Process;

  @OneToMany(() => Process, (process) => process.parent)
  childrens: Process[];

  @Column('int', { name: 'parentId', nullable: true, unique: true })
  parentId: number;
}

// Production Entity
@Entity()
export class Production {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('datetime', { name: 'date', transformer: new DateTransformer() })
  date: Date;

  @Column('nchar', { name: 'sapcode' })
  sapcode: string;

  @Column('nchar', { name: 'description' })
  description: string;

  @Column('nchar', { name: 'packcode' })
  packcode: string;

  @Column('int', { name: 'quantity' })
  quantity: number;
}
