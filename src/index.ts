import express, { Express, Request, Response } from 'express'
import { airdropRouter } from './handlers/airdrop'
import bodyParser from 'body-parser'
import { airdropRouterV2 } from './handlers/airdropV2'
import { connectMongoDB } from './database/mongodb'

const app: Express = express()
const port = process.env.PORT || '8888'

const main = async () => {
  await connectMongoDB()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.use('/api/airdrop', airdropRouter)
  app.use('/api/v2/airdrop', airdropRouterV2)

  app.get('/', (req: Request, res: Response) => {
    res.send('OK')
  })

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
  })
}

main()
