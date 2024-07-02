const dotenv = require("dotenv");

const express = require("express");
const { IPinfoWrapper } = require("node-ipinfo");
const app = express();
const port = 3000;
dotenv.config();

const ipinfoWrapper = new IPinfoWrapper(process.env.MY_TOKEN);

app.get("/api/hello", async (req, res) => {
  const { visitor_name } = req.query;
  let location_res = await ipinfoWrapper.lookupIp(req.ip);
  const weather_res = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${location_res.city}&aqi=no`
  );
  const weather_data = await weather_res.json();
  //let location_data = await location_res.json();

  if (!visitor_name) {
    return res.json({
      error: "visitor name not available",
    });
  }
  if (location_res.bogon) {
    return res.json({
      error: "your location cannot be found",
    });
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
