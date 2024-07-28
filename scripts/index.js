const getMoscowWeatherButton = document.querySelector('#get-moscow-weather')

getMoscowWeatherButton.addEventListener('click', () => {
    console.log('clicked')
})

function getWeather(city) {
    const API_KEY = '6fbeb34c010c544f6f33fa8071fc677a'
    return appFetch('api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}')
}

function appFetch(url,options) {
    return fetch(url, options)
    .then(resp => resp.json())
    .catch(err => {
        throw new Error(err)
    })
}