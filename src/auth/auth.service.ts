import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { MailerService } from 'src/mail/mail.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    public configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    console.log('🚀 ~ AuthService ~ validateUser ~ user:', user);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    console.log('🚀 ~ AuthService ~ login ~ email, password:', email, password);
    const user = await this.validateUser(email, password);
    console.log('🚀 ~ AuthService ~ login ~ user:', user);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: user.email,
      id: user.id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async resetPasswordRequest(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const resetToken = uuidv4();
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

    await this.userRepository.update(user.id, {
      resetToken,
      resetTokenExpiry,
    });

    const resetLink = `${this.configService.get('APP_URL')}/reset-password/${resetToken}`;

    await this.sendPasswordResetEmail(email, resetLink);

    return { message: 'Password reset instructions sent to email' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userRepository.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.userRepository.update(user.id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });

    return { message: 'Password successfully reset' };
  }

  async sendPasswordResetEmail(userEmail: string, resetLink: string) {
    const subject = 'Password Reset Request for QC Controller';
    const text = `Hello! We received a request to reset your password. Please use the following link to reset your password: ${resetLink}`;

    // Load the HTML template and replace placeholders
    const templatePath = path.join(
      __dirname,
      '..',
      '..',
      'src',
      'email-templates',
      'password-reset-template.html',
    );

    let html = fs.readFileSync(templatePath, 'utf8');
    html = html.replace('{{resetLink}}', resetLink);
    html = html.replace('{{currentYear}}', new Date().getFullYear().toString());

    let response = await this.mailerService.sendMail(
      userEmail,
      subject,
      text,
      html,
    );
    return response;
  }
}
