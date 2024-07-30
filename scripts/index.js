const getMoscowWeatherButton = document.querySelector('#get-moscow-weather')
const showLocationButton = document.querySelector('#show-location')



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

function getWeather(city) {
    const API_KEY = "6fbeb34c010c544f6f33fa8071fc677a"
    return appFetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&cnt=${'5'}&units=${'metric'}`)
}

function appFetch(url, options) {
    return fetch(url, options)
    .then(resp => resp.json())
    .catch(err => {
        throw new Error(err)
    })
}