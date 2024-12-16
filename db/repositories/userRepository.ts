import prisma from "../prismaClient";

class UserRepository {
  public static instance: UserRepository;
  private dbClient: typeof prisma;

  private constructor(dbClient: typeof prisma) {
    this.dbClient = dbClient;
  }

  public static getInstance(dbClient: typeof prisma) {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository(dbClient);
    }
    return UserRepository.instance;
  }

  public async findUser(id: string) {
    const existingUser = await this.dbClient.user.findUnique({
      where: {
        id: id
      }
    });
    if(existingUser) return existingUser;
  }

  public async addUser(
    id: string,
    email: string,
    name: string,
    password?: string,
    photoUrl?: string
  ) {
    
    const existingUser = await this.findUser(id);
    if(existingUser) return existingUser;
    const newUser = await this.dbClient.user.create({
      data: {
        id,
        email,
        name,
        password: password || '',
        img: photoUrl || '',
      }
    });

    return newUser;
  }
}

const userRepository = UserRepository.getInstance(prisma);
export default userRepository;