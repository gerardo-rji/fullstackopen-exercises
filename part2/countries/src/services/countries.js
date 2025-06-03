import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/'
const api_key = import.meta.env.VITE_SOME_KEY

const getAll = () => {
  const request = axios.get(`${baseUrl}all`)
  return request.then(response => response.data)
}

const getOne = (country) => {
  const request = axios.get(`${baseUrl}name/${country}`)
  return request.then(response => response.data)
}

const getWeather = (capital, cca2) => {
  const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital},${cca2}&units=metric&APPID=${api_key}`)
  return request.then(response => response.data)
}

export default { getAll, getOne, getWeather }