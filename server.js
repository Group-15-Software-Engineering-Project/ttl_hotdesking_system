const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//API calls
app.get("/api/hello", (req, res) => {
  res.send({ express: "Hello From Express" });
});

app.post("/api/world", (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`
  );
  console.log(req.body.post);
});
app.post("/api/desks", (req, res) => {
  console.log(req.body.chosenDate);
  res.send(
    `Your booking on the ${req.body.chosenDate} for ${req.body.chosenDesk} in ${req.body.chosenArea} has been successful.`
  );
  
});

app.post("/api/email", (req, res) => {
  //console.log(req.body);
  var validUser=false;
  const fs = require("fs");
  let rawdata = fs.readFileSync('MOCK_DATA.json')
  let data =JSON.parse(rawdata);
  	// Do something with your data
    
for(var i =0;i<data.length;i++){
  let x =JSON.stringify(data[i].email);
  console.log(x);
  if(x.charAt(0)==='"'){
  x = x.slice(1, -1);
  }
  if(req.body.email=== x){
    validUser=true; 
    break;
  }
}  

  res.send(
    validUser
  );
  console.log(req.body.email);

});

//Environment

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));

  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
