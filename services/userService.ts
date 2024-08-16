import userRepository from "@/db/repositories/userRepository";

class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public async findUser(id: string) {
    return userRepository.findUser(id);
  }

  public async addUser(
    id: string,
    email: string,
    name: string,
    password?: string,
    photoUrl?: string
  ) {
    return userRepository.addUser(id, email, name, password, photoUrl);
  }
}

const userService = UserService.getInstance();
export default userService;
