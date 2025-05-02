import userRepository from "@/db/repositories/userRepository";
import Logger from "@/utils/logger";
import ResponseWrapper from "@/utils/responseWrapper";
import type { ServiceResponse } from "@/domain/returnTypes";

class UserService {
  private static instance: UserService;
  private responseWrapper: ResponseWrapper;
  private logger: Logger;

  private constructor() {
    this.responseWrapper = new ResponseWrapper();
    this.logger = new Logger();
  }

  public static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public async findUser(id: string): Promise<ServiceResponse> {
    try {
      const result = await userRepository.findUser(id);
      return this.responseWrapper.response(result.status, result.message, result.data);
    } catch (error) {
      this.logger.error(error, 'findUser', 'UserService');
      return this.responseWrapper.error();
    }
  }

  public async addUser(
    id: string,
    email: string,
    name: string,
    password?: string,
    photoUrl?: string
  ): Promise<ServiceResponse> {
    try {
      const result = await userRepository.addUser(id, email, name, password, photoUrl);
      return this.responseWrapper.response(result.status, result.message, result.data);
    } catch (error) {
      this.logger.error(error, 'addUser', 'UserService');
      return this.responseWrapper.error();
    }
  }
}

const userService = UserService.getInstance();
export default userService;
