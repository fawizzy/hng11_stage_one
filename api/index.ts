require("dotenv").config();

const express = require("express");
const IPinfoWrapper = require("node-ipinfo").IPinfoWrapper;
//import IPinfoWrapper, { IPinfo, AsnResponse } from "node-ipinfo";

const app = express();
const ipinfoWrapper = new IPinfoWrapper(process.env.MY_TOKEN);

const bodyParser = require("body-parser");
const path = require("path");

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.send("hello world");
});

app.get("/hello", async (req, res) => {
  const { visitor_name } = req.query;
  let location_res = await ipinfoWrapper.lookupIp(req.ip);
  const weather_res = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${location_res.city}&aqi=no`
  );
  const weather_data = await weather_res.json();
  //let location_data = await location_res.json();

  if (location_res.bogon) {
    res.json({
      error: "your location cannot be found",
    });
    res.end();
  } else {
    const response = {
      client_ip: req.ip,
      location: location_res.city,
      greetings: `Hello ${visitor_name}!, the temperature is ${weather_data.current.temp_c} degrees Celcius in ${location_res.city}`,
    };
    res.send(response);
  }
});

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
