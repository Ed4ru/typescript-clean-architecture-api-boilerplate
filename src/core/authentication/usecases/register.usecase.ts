import { User, IUserFull, IUserFullPayload } from '@/core/user/user.entity';
import { UserRepository } from '@/core/user/user.repository';
import { ICryptoService } from '@/core/services/crypto.service.interface';

interface RegisterUsecaseDependencies {
  userDatabase: UserRepository;
  cryptoService: ICryptoService;
}

interface RegisterUsecaseInput {
  firstname: IUserFull['firstname'];
  lastname: IUserFull['lastname'];
  nickname: IUserFull['nickname'];
  email: IUserFull['email'];
  password: IUserFull['password'];
}

interface RegisterUsecaseOutput {
  registeredUser: IUserFullPayload;
}

export const registerUsecase = async (
  { userDatabase, cryptoService }: RegisterUsecaseDependencies,
  { firstname, lastname, nickname, email, password }: RegisterUsecaseInput
): Promise<RegisterUsecaseOutput> => {
  const hashedPassword = await cryptoService.hash(password);
  const user = new User({
    firstname,
    lastname,
    nickname,
    email,
    password: hashedPassword,
  });

  const registeredUser = await userDatabase.create(user);
  return { registeredUser };
};
