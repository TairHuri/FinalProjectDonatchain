import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 8890;
const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.post('/api/charge', (req, res) => {
    const {amount, currency} = req.body;
    let charge = +amount;
    if(currency == 'USD'){
        charge *= 3.5;
    }else if(currency == 'EU'){
        charge *= 4.2;
    }
    res.send({message:'ok', charge});
})

app.listen(PORT, () => {
    console.log('Credit Server ready');
    
})