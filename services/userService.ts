import userRepository from "@/db/repositories/userRepository";
import ResponseWrapper from "@/utils/responseWrapper";

class UserService {
  private static instance: UserService;
  private responseWrapper: ResponseWrapper;

  private constructor() {
    this.responseWrapper = new ResponseWrapper();
  }

  public static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public async findUser(id: string) {
    try {
      const result = await userRepository.findUser(id);
      return this.responseWrapper.response(result.status, result.message, result.data);
    } catch (error) {
      console.error('Error in findUser service -> ', error);
      return this.responseWrapper.error();
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
      const result = await userRepository.addUser(id, email, name, password, photoUrl);
      return this.responseWrapper.response(result.status, result.message, result.data);
    } catch (error) {
      console.error('Error in addUser service -> ', error);
      return this.responseWrapper.error();
    }
  }
}

const userService = UserService.getInstance();
export default userService;
