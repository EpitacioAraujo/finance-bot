import { ulid } from 'ulid';

export class User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  isActive: boolean;
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    role?: string;
    isActive?: boolean;
    tokenVersion?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id || ulid();
    this.name = props.name;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.role = props.role ?? 'user';
    this.isActive = props.isActive ?? true;
    this.tokenVersion = props.tokenVersion ?? 1;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }
}
