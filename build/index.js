"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_ipinfo_1 = __importDefault(require("node-ipinfo"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = express_1.default();
const port = 3000;
dotenv_1.default.config();
const ipinfoWrapper = new node_ipinfo_1.default(process.env.MY_TOKEN);
app.get("/api/hello", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { visitor_name } = req.query;
    let location_res = yield ipinfoWrapper.lookupIp(req.ip);
    const weather_res = yield fetch(`https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${location_res.city}&aqi=no`);
    const weather_data = yield weather_res.json();
    //let location_data = await location_res.json();
    if (location_res.bogon) {
        res.json({
            error: "your location cannot be found",
        });
        res.end();
    }
    else {
        const response = {
            client_ip: req.ip,
            location: location_res.city,
            greetings: `Hello ${visitor_name}!, the temperature is ${weather_data.current.temp_c} degrees Celcius in ${location_res.city}`,
        };
        res.send(response);
    }
}));
app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});
