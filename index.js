var express = require("express");
var app = express();

app.use(express.static(__dirname + "public"));

app.set("view engine","ejs");
app.set("views","./views");
app.listen(3000,function(){
	console.log("Listed on port 3000");
});

app.get("/",function(req,res){
	res.render("index");
});
