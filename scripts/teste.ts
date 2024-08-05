import 'dotenv/config'
import data from '../python/estoque.json'
import { PythonShell } from 'python-shell'

const str = JSON.stringify(data)

PythonShell.run('optimization.py', {
  mode: 'text',
  pythonPath: process.env.PYTHON_PATH,
  pythonOptions: ['-u'], // get print results in real-time
  scriptPath: process.env.SCRIPT_PATH,
  args: [str, '1']
})
  .then(a => a.join('\n'))
  .then(a => JSON.parse(a))
  .then(a => console.log(a))
  .catch(console.log)
