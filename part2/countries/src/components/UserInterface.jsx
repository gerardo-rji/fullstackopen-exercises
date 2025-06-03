const UserInterface = ({filter, handleFilter, filteredCountries, countryDetails, weatherDetails, handleShow}) => {
  return (
    <>
      <div>Find countries <input value={filter} onChange={handleFilter}/></div>

      {filteredCountries.length === 1
        ? (countryDetails && weatherDetails) && (
            <div>
              <h1>{countryDetails.name.common}</h1>
              <p>Capital {countryDetails.capital}<br/>
                Area {countryDetails.area}</p>
              <h2>Languages</h2>
              <ul>
                {Object.values(countryDetails.languages).map((language,i) => (
                  <li key={i}>{language}</li>
                ))}
              </ul>
              <img src={countryDetails.flags.svg} alt={`Flag of ${countryDetails.name.common}`} width={250}/>
              <h2>Weather in {countryDetails.capital}</h2>
              <p>Temperature {weatherDetails.main.temp} Celsius</p>
              <img src={`https://openweathermap.org/img/wn/${weatherDetails.weather[0].icon}@2x.png`} alt={`Weather icon for ${weatherDetails.weather[0].description}`}/>
              <p>Wind {weatherDetails.wind.speed} m/s</p>
            </div>
          )
        : filter === '' || filteredCountries.length > 10
          ? <p>too many matches, specify another filter</p>
          : <ul style={{listStyleType: 'none'}}>
              {filteredCountries.map((country,i) => <li key={i}>{country}
              <button onClick={()=> handleShow(i)}>Show</button></li>)}
            </ul>
      }
    </>
  )
}

export default UserInterface