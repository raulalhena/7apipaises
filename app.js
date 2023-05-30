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

const getNeighborgCountries = async (countryCode) => {
    let key = `OWXE6CFBZWHH7XWDAEBYGCUSNEY21T7K`;
    let url = `http://localhost:3000?key=${key}&format=json&country_code=${countryCode}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors'
        });

        return response.json();
    } catch (e) {
        console.log(`Error getting neighborg countries ${e}`);
    }
}

const createDialog = async (dialog, countryCode) => {
    const section = document.getElementById("neighbors");
    console.log(section.parentElement)
    const neightborgCountries = await getNeighborgCountries(countryCode);


    neightborgCountries.forEach(country => {
        console.log("neighb countr ", country.country_name)
        section.innerHTML += `<p>${country.country_name}</p>`;
    });
    dialog.showModal();
}

const setCountryClick = (countries, containerCountries) => {
    for (let i = 0; i < countries.length; i++) {
        const countryButtons = Array.from(containerCountries.children);

        countryButtons[i].addEventListener('click', async (e) => {
            const countryNeighborgsDialog = document.getElementById("neighboring-countries");
            e.preventDefault();
            await createDialog(countryNeighborgsDialog, countries[i].altSpellings[0]);
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




