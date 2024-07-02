const dotenv = require("dotenv");
const express = require("express");
const { IPinfoWrapper } = require("node-ipinfo");
const requestIp = require("request-ip");

const app = express();
app.set("trust proxy", true);
const port = 3000;
dotenv.config();

const ipinfoWrapper = new IPinfoWrapper(process.env.MY_TOKEN);

app.get("/api/hello", async (req, res) => {
  const { visitor_name } = req.query;
  const ipdata = request.headers["x-forwarded-for"] || req.ip;

  let location_res = await ipinfoWrapper.lookupIp(ipdata);
  if (!visitor_name) {
    return res.json({
      error: "visitor name not available",
    });
  }

  let weather_res = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${location_res.city}&aqi=no`
  );
  const weather_data = await weather_res.json();

  if (weather_data.error) {
    location_res = await ipinfoWrapper.lookupIp([]);
    weather_res = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${location_res.city}&aqi=no`
    );
    const response = {
      client_ip: req.ip,
      location: location_res.city,
      greetings: `Hello ${visitor_name}!, the temperature is ${weather_data?.current?.temp_c} degrees Celcius in ${location_res?.city}`,
    };
    return res.json(response);
  } else {
    const response = {
      client_ip: req.ip,
      location: location_res.city,
      greetings: `Hello ${visitor_name}!, the temperature is ${weather_data.current.temp_c} degrees Celcius in ${location_res.city}`,
    };
    return res.json(response);
  }
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
