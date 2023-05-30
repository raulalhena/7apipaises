import express from "express";
import cors from "cors";

const app = express();


app.use(cors({ origin: true }));
app.options('*', cors())

app.get("/", async (req, res) => {
    const key = req.query.key;
    const countryCode = req.query.country_code;
    let url = `https://api.geodatasource.com/neighboring-countries?key=${key}&format=json&country_code=${countryCode}`;
    try {
        const response = await fetch(url, {
            method: 'GET',


        });

        // const neighborCountries = await result.json();
        // return neighborCountries;
        // console.log("result raw => ", await response)
        // console.log("result -=> ", await response.json())
        //return response.json();
        res.send(await response.json())
    } catch (e) {
        console.log(`Error getting neighborg countries ${e}`);
    }
});

app.listen(3000, () => {
    console.log("server running on 3000...");
})