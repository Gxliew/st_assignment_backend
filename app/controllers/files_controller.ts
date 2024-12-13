/* eslint-disable @unicorn/prefer-node-protocol */
/* eslint-disable prettier/prettier */
import type { HttpContext } from '@adonisjs/core/http'
import csvParser from 'csv-parser'
import fs from 'fs'
import app from '@adonisjs/core/services/app'

export default class FilesController {
  public async upload({ request, response }: HttpContext) {
    const file = request.file('file', {
      extnames: ['csv']
    })

    if(!file || file.subtype !== 'csv') {
      return response.status(400).send({
         error: 'Please upload a valid CSV file.'
      })
    }

    await file.move(app.makePath('uploads'))
  
    return response.send({
      success: true
    })
  }

  public async readFile({request, response}: HttpContext) {
    const fileName = request.input('file_name')
    if(!fileName) {
      return response.status(400).send({
        error: 'Invalid file name'
      })
    }
    const results: any[] = []
    const path = `uploads/${fileName}`
    let fileContents = await fs.promises.readFile(path, 'utf-8');

    fileContents = fileContents.replace(/^\uFEFF/, '');

    await fs.promises.writeFile(path, fileContents, 'utf-8');
    await new Promise<void>((resolve) => {
    fs.createReadStream(path)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve()
      })
    })

    return response.send(results)
  }
}
