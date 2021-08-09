import { PassportSerializer } from '@nestjs/passport';

export class SessionSerializer extends PassportSerializer {
  // constructor(private readonly userService: UserService){
  //     super()
  // }

  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    // {username: user.userName}
    done(null, user);
  }

  deserializeUser(payload: any, done: (err: Error, payload: any) => void) {
    // const user = this.userService.getUserByName(payload.username)
    done(null, payload);
  }
}
