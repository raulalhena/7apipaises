let map = undefined;

const getCountries = async () => {
    let url = "https://restcountries.com/v3.1/all";
    try {
        const result = await fetch(url);
        const data = await result.json();
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

const removeMap = () => {
    map.off();
    map.remove();
}

const createMap = (country) => {
    const latitudeLongitude = country.latlng;
    const mapContainer = document.getElementById('map-container');

    mapContainer.innerHTML = '';
    mapContainer.innerHTML += `<div id="map"></div>`;
    mapContainer.firstChild.classList.add("map");

    map = new L.Map('map').setView(latitudeLongitude, 5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);
    L.marker(latitudeLongitude).addTo(map);
    setTimeout(function () {
        window.dispatchEvent(new Event("resize"));
    }, 200);

    return map;
}

const createDialog = async (country) => {
    const neighbors = document.getElementById("neighbors");
    const title = document.getElementById("country-title");
    const closeButton = document.getElementById("close-dialog");
    const countryNeighborgsDialog = document.getElementById("neighboring-countries");

    try {
        const neightborCountries = await getNeighborCountries(country.altSpellings[0]);
        if (neightborCountries.length === 0) {
            neighbors.innerHTML = '<h3>There is no neighbors</h3>';
        } else {
            title.innerText = `Neighbors Countries Of ${country.name.common}`;
            neighbors.innerHTML = '';

            if (neightborCountries[0].country_name === "") {
                neighbors.innerHTML = `There is no neighbors countries of ${country.name.common}`;
            } else {
                neightborCountries.forEach(ncountry => {
                    neighbors.innerHTML += `<li>${ncountry.country_name}</li>`;
                });
            }

            if (map !== undefined) {
                removeMap();
            }
            createMap(country);
        }
        closeButton.addEventListener("click", (e) => {
            e.preventDefault();
            countryNeighborgsDialog.close();
        });
        countryNeighborgsDialog.show();
    } catch (e) {
        console.log(`Error creating dialog ${e}`);
    }
}

const setCountryClick = (countries, containerCountries) => {
    const countryButtons = Array.from(containerCountries.children);
    for (let i = 0; i < countries.length; i++) {
        countryButtons[i + 1].addEventListener('click', async (e) => {
            e.preventDefault();
            await createDialog(countries[i]);
        });
    };
}

const main = async () => {
    const containerCountries = document.getElementById("container-countries");
    const countries = await getCountries();

    countries.forEach(country => {
        containerCountries.innerHTML += `<div id = '${country.altSpellings[0]}'> ${country.flag} <a href = '#'> ${country.name.common}</a></div>`;
    });

    setCountryClick(countries, containerCountries);
}

window.addEventListener('load', (e) => {
    e.preventDefault();
    main();
});




