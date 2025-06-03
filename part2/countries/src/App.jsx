import {useEffect, useState} from 'react'
import UserInterface from './components/UserInterface'
import countryService from './services/countries'

function App() {
  const [allCountries, setAllCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])
  const [countryDetails, setCountryDetails] = useState(null)
  const [weatherDetails, setWeatherDetails] = useState(null)

  useEffect(() => {
    countryService
      .getAll()
      .then(initialCountries => {
        console.log(initialCountries.map(country => country.name.common))
        setAllCountries(initialCountries.map(country => country.name.common))
      })
  }, []);

  useEffect(() => {
    if (filteredCountries.length === 1) {
      countryService
        .getOne(filteredCountries[0])
        .then(countryData => {
          setCountryDetails(countryData)
          console.log(countryDetails)
        })
  } else {
      setCountryDetails(null)
    }
  }, [filteredCountries])

  useEffect(() => {
    if (countryDetails) {
      countryService
        .getWeather(countryDetails.capital, countryDetails.cca2)
        .then(weatherData => {
          console.log(weatherData)
          setWeatherDetails(weatherData)
        })
    }
  },[countryDetails])

  const handleFilter = (event) => {
    // console.log(event.target)
    const value = event.target.value
    setFilter(value)
    setFilteredCountries(allCountries.filter(country => country.toLowerCase().includes(value.toLowerCase())))
    console.log(filteredCountries)
  }

  const handleShow = (id) => {
    console.log(`showing ${filteredCountries[id]}, id: ${id}`)
    setFilteredCountries([filteredCountries[id]])
  }

  return(
    <UserInterface
      filter={filter}
      handleFilter={handleFilter}
      filteredCountries={filteredCountries}
      countryDetails={countryDetails}
      weatherDetails={weatherDetails}
      handleShow={handleShow}
    />
  )
}

export default App