import prisma from "../prismaClient";
import Logger from "@/utils/logger";

class UserRepository {
  public static instance: UserRepository;
  private dbClient: typeof prisma;
  private logger: Logger;

  private constructor(dbClient: typeof prisma) {
    this.dbClient = dbClient;
    this.logger = new Logger();
  }

  public static getInstance(dbClient: typeof prisma) {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository(dbClient);
    }
    return UserRepository.instance;
  }

  public async findUser(id: string) {
    try {
      const existingUser = await this.dbClient.user.findUnique({
        where: {
          id: id
        }
      });
      if(!existingUser) {
        return {status: 404, message: 'User not found'};
      }
      return {status: 200, data: existingUser};
    } catch (error) {
      this.logger.error(error, 'findUser', 'UserRepository');
      return {status: 500}
    }
  }

  public async addUser(
    id: string,
    email: string,
    name: string,
    password?: string,
    photoUrl?: string
  ) {
    try {
      const result = await this.findUser(id);
      if(result.data) return {status: 200, message: 'User fetched successfully.', data: result.data};
      
      if(!result.data && result.status === 404){
        const newUser = await this.dbClient.user.create({
          data: {
            id,
            email,
            name,
            password: password || '',
            img: photoUrl || '',
          }
        });
    
        return {status: 201, message: 'User added successfully.', data: newUser};
      } 
      return {status: 500}
    } catch (error) {
      this.logger.error(error, 'addUser', 'UserRepository');
      return {status: 500}
    }
  }
}

const userRepository = UserRepository.getInstance(prisma);
export default userRepository;