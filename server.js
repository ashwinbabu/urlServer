const express = require('express');
const app = express();
const cors = require('cors');
const MongoClient = require('mongodb');
app.use(cors());
app.use(express.json());

const url = "mongodb+srv://ashwinbob:ashwin@cluster0-b0g3p.gcp.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "urlServer";

app.get('/:shortUrl',(req,res)=>{
    MongoClient.connect(url,(err,client)=>{
        if (err) throw err;
        db = client.db(dbName);
        const collection = db.collection("url");
        let shortUrl = parseInt(req.params.shortUrl);
        collection.findOne({"shortUrl" : shortUrl})
        .then((x)=>{
            res.redirect("http://"+x.longUrl);
        }).catch((err)=>{
            client.close();
            throw err;
        })
    })
})

app.post('/',(req,res)=>{
    MongoClient.connect(url,(err,client)=>{
        if (err) throw err;
        db = client.db(dbName);
        const collection = db.collection("url");
        let urls = {"shortUrl" : req.body.shortUrl, "longUrl" : req.body.longUrl}
        collection.insertOne(urls)
        .then(()=>{
            res.send(urls);
            client.close();     
        })
        .catch((err)=>{
            client.close();
            throw err;
        })
    })    
})

app.listen(process.env.PORT);