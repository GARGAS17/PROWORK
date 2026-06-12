import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../repositories/UserRepository';
import { User, UserRole } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'super-secreto-para-desarrollo-prowork';
const JWT_EXPIRES_IN = '1d';
const SALT_ROUNDS = 10;

export class AuthService {
  constructor(private readonly userRepository: IUserRepository) {}

  async registrarUsuario(email: string, passwordPlain: string, role: UserRole): Promise<{ user: Omit<User, 'password_hash'>, token: string }> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('El usuario ya existe con este correo.');
    }

    const password_hash = await bcrypt.hash(passwordPlain, SALT_ROUNDS);

    const newUser: User = {
      email,
      password_hash,
      role,
    };

    const savedUser = await this.userRepository.create(newUser);

    const token = this.generateToken(savedUser);
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash: _, ...userWithoutPassword } = savedUser;

    return { user: userWithoutPassword, token };
  }

  async iniciarSesion(email: string, passwordPlain: string): Promise<{ user: Omit<User, 'password_hash'>, token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas.');
    }

    const isPasswordValid = await bcrypt.compare(passwordPlain, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas.');
    }

    const token = this.generateToken(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  private generateToken(user: User): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }
}
