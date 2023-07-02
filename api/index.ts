import express from 'express'
import cors from 'cors'
import mysql, { Connection } from 'mysql2/promise'

const app = express()

app.use(express.json())

app.use(cors())

const getQuery = async (query: string) => {
  let connection: Connection | null = null
  try {
    connection = await mysql.createConnection({
      host: 'db',
      user: 'userQi',
      password: 'passwordQi',
      database: 'qi',
    });  
    const result = await connection.execute(query);
    return result
  } catch (e) {
    console.log({ e })
    return undefined
  } finally {
    connection?.end()
  }
}  

app.get('/tasks', async (req, res) => {
  try {
    const [rows]: any = await getQuery('SELECT * FROM Tasks')
    console.log({ rows })
    res.status(200).json(rows)
  } catch (e) {
    console.log({ e })
    res.status(500).send('Internal server error')
  }
})

app.get('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result: any = await getQuery(`SELECT * FROM Tasks WHERE id = ${id}`)
    console.log({ result })
    res.status(200).json(result[0]?.rows || [])
  } catch (e) {
    console.log({ e })
    res.status(500).send('Internal server error')
  }
})

app.post('/tasks', async (req, res) => {
  try {
    const { description } = req.body
    const result: any = await getQuery(`INSERT INTO Tasks (description) VALUES ('${description}')`)
    console.log({ result })
    res.status(201).json(result[0]?.rows || [])
  } catch (e) {
    console.log({ e })
    res.status(500).send('Internal server error')
  }
})

app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params
    const bodyLenght = Object.keys(req.body).length
    if (bodyLenght === 0) {
      return res.status(400).send('Campo de descrição ou status da tarefa são obrigatórios')
    }
    let query = 'UPDATE Tasks SET '
    Object.entries(req.body).forEach(([key, value], index) => {
      query += `${key} = '${value}'`
      if (index !== bodyLenght - 1) {
        query += ', '
      }
    })
    query += ` WHERE id = ${id}`
    const result: any = await getQuery(query)
    console.log({ result })
    res.status(200).json(result[0] || {})
  } catch (e) {
    console.log({ e })
    res.status(500).send('Internal server error')
  }
})

app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result: any = await getQuery(`DELETE from Tasks WHERE id = ${id}`)
    console.log({ result })
    res.status(200).json(result[0] || {})
  } catch (e) {
    console.log({ e })
    res.status(500).send('Internal server error')
  }
})

app.listen(8000, () => {
  console.log('Server started!')
})