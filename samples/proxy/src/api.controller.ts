import { All, Controller, Param, Req, Res } from '@nestjs/common'
import { Proxy } from '@nest-micro/proxy'

@Controller('/api/:id/**')
export class ApiController {
  constructor(private readonly proxy: Proxy) {}

  @All()
  async do(@Req() req, @Res() res, @Param('id') id) {
    await this.proxy.forward(req, res, id)
  }
}
