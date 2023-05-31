const getCountries = async () => {
    try {
        const result = await fetch("https://restcountries.com/v3.1/all");
        const data = await result.json();

        console.log(data)
        return data;
    } catch (e) {
        console.log(`Error getting countries ${e}`);
    }
}

const getNeighborCountries = async (countryCode) => {
    let key = `OWXE6CFBZWHH7XWDAEBYGCUSNEY21T7K`;
    let url = `https://api.geodatasource.com/neighboring-countries?key=${key}&format=json&country_code=${countryCode}`;

    try {
        const response = await fetch(url, {
            method: 'GET'
        });
        return await response.json();
    } catch (e) {
        console.log(`Error getting neighborg countries ${e}`);
    }
}

const createMap = (country) => {
    const latitudeLongitude = country.latlng;
    let map = L.map('map').setView(latitudeLongitude, 5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    L.marker(latitudeLongitude).addTo(map);
}

const createDialog = async (dialog, country) => {
    const neighbors = document.getElementById("neighbors");
    const title = document.getElementById("country-title");
    const neightborCountries = await getNeighborCountries(country.altSpellings[0]);

    title.innerText += ` ${country.name.common}`;
    neightborCountries.forEach(country => {
        neighbors.innerHTML += `<p>${country.country_name}</p>`;
    });
    createMap(country);
    dialog.showModal();
}

const setCountryClick = (countries, containerCountries) => {
    for (let i = 0; i < countries.length; i++) {
        const countryButtons = Array.from(containerCountries.children);

        countryButtons[i].addEventListener('click', async (e) => {
            const countryNeighborgsDialog = document.getElementById("neighboring-countries");
            e.preventDefault();
            await createDialog(countryNeighborgsDialog, countries[i]);
        });
    };
}

const main = async () => {
    const containerCountries = document.getElementById("container-countries");
    const countries = await getCountries();

    containerCountries.innerHTML = `Countries: `;
    countries.forEach(country => {
        containerCountries.innerHTML += `<div id = '${country.altSpellings[0]}'> ${country.flag} <a href = '#'> ${country.name.common}</a></div>`;
    });
    setCountryClick(countries, containerCountries);
}

window.addEventListener('load', (e) => {
    e.preventDefault();
    main();
});




