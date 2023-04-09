import * as path from 'path'
import * as fs from 'fs'
import * as YAML from 'yaml'
import { Logger, Inject, Injectable } from '@nestjs/common'
import { mergeWith, isArray } from 'lodash'
import { ConfigOptions } from './config.interface'
import { CONFIG_OPTIONS } from './config.constants'

@Injectable()
export class ConfigLoader {
  private readonly files: string[]
  private readonly logger = new Logger(ConfigLoader.name)

  constructor(@Inject(CONFIG_OPTIONS) private readonly options: ConfigOptions) {
    this.files = this.getFilesPath()
  }

  public load(): any {
    this.checkFileExists()

    const configs = []
    this.files.forEach((file) => {
      configs.push(this.loadFile(file))
    })

    return mergeWith({}, ...configs, (objValue, srcValue) => {
      if (isArray(objValue)) {
        return srcValue
      }
    })
  }

  private checkFileExists() {
    if (this.files.length === 0) {
      this.logger.warn(`file path was not found`)
    }

    let existFiles = 0
    for (let i = 0; i < this.files.length; i++) {
      if (fs.existsSync(this.files[i])) {
        existFiles++
      }
    }
    if (existFiles === 0) {
      this.logger.warn(`file path was not found`)
    }
  }

  public loadFile(path: string): any {
    let config = {}
    if (!fs.existsSync(path)) {
      return config
    }
    this.logger.log(`load config ${path}`)
    const configStr = fs.readFileSync(path).toString()
    try {
      config = YAML.parse(configStr)
    } catch (e) {
      try {
        config = JSON.parse(configStr)
      } catch (e) {
        this.logger.warn(`file ${path} parse error`)
      }
    }
    return config
  }

  private getFilesPath(): string[] {
    const filenames: string[] = []
    const env = process.env.NODE_ENV || 'development'
    const dir = this.options.dir || process.cwd()
    const extension = this.options.extension || 'yaml'

    filenames.push(path.resolve(dir, `config.${extension}`))
    filenames.push(path.resolve(dir, `config.local.${extension}`))
    filenames.push(path.resolve(dir, `config.${env}.${extension}`))
    filenames.push(path.resolve(dir, `config.${env}.local.${extension}`))

    return filenames
  }
}
