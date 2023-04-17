import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Get App!'
  }

  postHello(): string {
    return 'Hello Post App!'
  }
}
