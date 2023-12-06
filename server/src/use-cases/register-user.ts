import { User } from '@prisma/client'
import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'
import { formatName } from './utils/formatName'
import { LoginAlreadyExistsError } from './errors/login-already-exists-error'

interface RegisterUserUseCaseRequest {
  name: string
  login: string
  email: string
  password: string
  startAt: Date
}

interface RegisterUserUseCaseResponse {
  user: User
}

export class RegisterUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    login,
    email,
    password,
    startAt,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const formattedName = formatName(name)

    const password_hash = await hash(password, 6)

    const userWithSameLogin = await this.usersRepository.findByLogin(login)

    if (userWithSameLogin) {
      throw new LoginAlreadyExistsError()
    }

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new EmailAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name: formattedName,
      login,
      email,
      password_hash,
      start_at: startAt,
    })

    return {
      user,
    }
  }
}
