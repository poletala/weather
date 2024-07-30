const getMoscowWeatherButton = document.querySelector('#get-moscow-weather')
const showLocationButton = document.querySelector('#show-location')
const getWeatherByMyLocationButton = document.querySelector('#get-weather-by-my-location')


getMoscowWeatherButton.addEventListener('click', () => {
    getWeather('Moscow')
        .then(data => {
            console.log(data)
    })
})

showLocationButton.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(
        position => {
        console.log('Latitude: ', position.coords.latitude)
        console.log('Longitude: ', position.coords.longitude)
    }, (err) => {console.log(err)})
})

getWeatherByMyLocationButton.addEventListener('click', () => {
    const onSuccessLocation = (position) => {
        getWeatherByLocation(position.coords.latitude, position.coords.longitude)
        .then(data => {
            console.log(data)
            console.log('Temp: ', data.list[0].main.temp, 'City: ', data.city.name)
            console.log('First weather timestamp: ', new DataTransfer(data.list[0].dt))
        })
    }

    const onErrorLocation = (err) => {
        console.log(err)
    }
    navigator.geolocation.getCurrentPosition(onSuccessLocation, onErrorLocation)
})
function getWeather(city) {
    const API_KEY = "6fbeb34c010c544f6f33fa8071fc677a"
    return appFetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&cnt=${'5'}&units=${'metric'}`)
}

function getWeatherByLocation(lat, lon) {
    const API_KEY = "6fbeb34c010c544f6f33fa8071fc677a"
    return appFetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&cnt=${'5'}&units=${'metric'}`)
}


function appFetch(url, options) {
    return fetch(url, options)
    .then(resp => resp.json())
    .catch(err => {
        throw new Error(err)
    })
}