import express, { Request, Response, Express } from "express";
import IPinfoWrapper, { IPinfo, AsnResponse } from "node-ipinfo";
import dotenv from "dotenv";

const app: Express = express();
const port = 3000;
dotenv.config();

const ipinfoWrapper = new IPinfoWrapper(process.env.MY_TOKEN as string);

app.get("/api/hello", async (req: Request, res: Response) => {
  const { visitor_name } = req.query;
  let location_res = await ipinfoWrapper.lookupIp(req.ip as string);
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

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
