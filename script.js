document.getElementById("search-btn").addEventListener("click", fetchCountryData);

async function fetchCountryData() {
    const countryName = document.getElementById("country-input").value.trim();
    const countryInfo = document.getElementById("country-info");
    const borderingCountries = document.getElementById("bordering-countries");

    countryInfo.innerHTML = "";
    borderingCountries.innerHTML = "";

    if (!countryName) {
        countryInfo.innerHTML = "<p>Please enter a country name.</p>";
        return;
    }

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
        if (!response.ok) throw new Error("Country not found");

        const data = await response.json();
        const country = data[0];

        // Display country info
        countryInfo.innerHTML = `
            <article>
                <h2>${country.name.common}</h2>
                <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Region:</strong> ${country.region}</p>
                <img src="${country.flags.svg}" alt="Flag of ${country.name.common}">
            </article>
        `;

        // Fetch and display bordering countries
        if (country.borders) {
            borderingCountries.innerHTML = "<h3>Bordering Countries:</h3>";
            const borderPromises = country.borders.map(async (border) => {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${border}`);
                const borderData = await borderResponse.json();
                return `
                    <article>
                        <p>${borderData[0].name.common}</p>
                        <img src="${borderData[0].flags.svg}" alt="Flag of ${borderData[0].name.common}">
                    </article>
                `;
            });

            const borderCountries = await Promise.all(borderPromises);
            borderingCountries.innerHTML += borderCountries.join("");
        } else {
            borderingCountries.innerHTML = "<p>No bordering countries.</p>";
        }
    } catch (error) {
        countryInfo.innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
}
