const express = require('express');
const app = express();

app.use("/public", express.static('./public/'));
app.use((req, res, next) => {
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    next();
});

app.listen(8080, function(){
    console.log("listening on 8080");
});

app.get('', function(req, res){
    res.sendFile(__dirname + "/public/index.html");
});
