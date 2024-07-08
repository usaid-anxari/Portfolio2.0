import app from './src/app.js'
import 'dotenv/config'
import connectedDb from './src/db/db.js';

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log(`Server Start On Port http://localhost:${PORT}`);
})

connectedDb()