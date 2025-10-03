import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 8890;
const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.post('/api/charge', (req, res) => {
    res.send({message:'ok'});
})

app.listen(PORT, () => {
    console.log('Credit Server ready');
    
})