const containerCountries = document.getElementById("container-countries");

const getCountries = async () => {
    const result = await fetch("https://restcountries.com/v3.1/all");
    const data = await result.json();

    console.log(data)
    return data;
}

const countries = await getCountries();

containerCountries.innerHTML = `Countries:`;
countries.forEach(country => {
    containerCountries.innerHTML += `<div id='${country.name.common}'>${country.flag}<a href='#'> ${country.name.common}</a></div>`;
});


