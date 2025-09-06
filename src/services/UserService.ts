import { User, IUserDocument } from '../models/User';
import { 
  ICreateUserRequest, 
  IUpdateUserRequest, 
  IUserResponse, 
  ILoginRequest,
  ILoginResponse,
  UserRole 
} from '../types/user.types';
import { generateToken } from '../utils/jwt';
import { IPaginationResult } from '../types/common.types';

export class UserService {
  async createUser(userData: ICreateUserRequest): Promise<IUserResponse> {
    try {
      // Verificar se email já existe
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('Email já está em uso');
      }

      const user = new User(userData);
      await user.save();

      return this.formatUserResponse(user);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao criar usuário');
    }
  }

  async getAllUsers(page: number = 1, limit: number = 10): Promise<IPaginationResult<IUserResponse>> {
    try {
      const skip = (page - 1) * limit;
      
      const [users, total] = await Promise.all([
        User.find({ isActive: true })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        User.countDocuments({ isActive: true })
      ]);

      const formattedUsers = users.map(user => this.formatUserResponse(user));

      return {
        data: formattedUsers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error('Erro ao buscar usuários');
    }
  }

  async getUserById(id: string): Promise<IUserResponse> {
    try {
      const user = await User.findById(id);
      
      if (!user || !user.isActive) {
        throw new Error('Usuário não encontrado');
      }

      return this.formatUserResponse(user);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao buscar usuário');
    }
  }

  async updateUser(id: string, updateData: IUpdateUserRequest): Promise<IUserResponse> {
    try {
      // Se email está sendo atualizado, verificar se já existe
      if (updateData.email) {
        const existingUser = await User.findOne({ 
          email: updateData.email, 
          _id: { $ne: id } 
        });
        if (existingUser) {
          throw new Error('Email já está em uso');
        }
      }

      const user = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return this.formatUserResponse(user);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao atualizar usuário');
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const user = await User.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!user) {
        throw new Error('Usuário não encontrado');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao deletar usuário');
    }
  }

  async login(loginData: ILoginRequest): Promise<ILoginResponse> {
    try {
      const user = await User.findOne({ email: loginData.email }).select('+password');
      
      if (!user || !user.isActive) {
        throw new Error('Credenciais inválidas');
      }

      const isPasswordValid = await user.comparePassword(loginData.password);
      
      if (!isPasswordValid) {
        throw new Error('Credenciais inválidas');
      }

      const userResponse = this.formatUserResponse(user);
      const token = generateToken(userResponse);

      return {
        user: userResponse,
        token
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao fazer login');
    }
  }

  async createAdminUser(adminData: { name: string; email: string; password: string }): Promise<IUserResponse | null> {
    try {
      // Verificar se já existe um admin
      const existingAdmin = await User.findOne({ role: UserRole.ADMIN });
      if (existingAdmin) {
        return null; // Admin já existe
      }

      const adminUser = new User({
        ...adminData,
        role: UserRole.ADMIN
      });

      await adminUser.save();
      return this.formatUserResponse(adminUser);
    } catch (error) {
      console.error('Erro ao criar usuário admin:', error);
      return null;
    }
  }

  private formatUserResponse(user: IUserDocument): IUserResponse {
    return {
      _id: user._id?.toString() || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt!,
      updatedAt: user.updatedAt!
    };
  }
}
