const temp = document.querySelector('.temp')
const mylocation = document.querySelector('.location')
const date = document.querySelector('.time-date')
const tempMax = document.querySelector('.temp-max')
const tempMin = document.querySelector('.temp-min')
const humidity = document.querySelector('.humidity')
const cloudy = document.querySelector('.cloudy')
const wind = document.querySelector('.wind')
const searchLocationInput = document.querySelector('.search-by-city')

const getCurrentTimeDate = () => {
    let currentTimeDate = new Date();
    let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    let hours = currentTimeDate.getHours();
    let minutes = currentTimeDate.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let currentTime = `${hours}:${minutes}`;
    let currentDate = currentTimeDate.getDate();
    let currentMonth = month[currentTimeDate.getMonth()];
    let CurrentYear = currentTimeDate.getFullYear();
    let fullDate = `${currentDate} ${currentMonth}, ${CurrentYear}`;
    document.querySelector(".time-date").innerHTML = `${currentTime} - ${fullDate}`;
    setTimeout(getCurrentTimeDate, 500);
}
getCurrentTimeDate()

function appFetch(url, options) {
    return fetch(url, options)
    .then(resp => resp.json())
    .catch(err => {
        throw new Error(err)
    })
}
function getWeatherByLocation(lat, lon) {
    const API_KEY = "6fbeb34c010c544f6f33fa8071fc677a"
    return appFetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&cnt=${'1'}&units=${'metric'}`)
}

function savedWeather() {
    let citiesSavedInLS = JSON.parse(localStorage.getItem('Cities'))
    console.log(citiesSavedInLS)
    if(citiesSavedInLS) {
        for (let i=0;i<citiesSavedInLS.length;i++) {
            console.log(citiesSavedInLS[i])
            getWeatherByCity(citiesSavedInLS[i])  
                .then(data => {
                    console.log(`${citiesSavedInLS[i]} ${Math.round(data.main.temp)}°`)
                    let weatherSavedDiv = document.createElement('div')
                    weatherSavedDiv.classList.add('cities-saved-weather-box')
                    document.querySelector('.cities-saved').append(weatherSavedDiv)
                    let citySavedP = document.createElement('p')
                    let weatherSavedP = document.createElement('p')
                    document.weatherSavedDiv.append(citySavedP)
                    document.weatherSavedDiv.append(weatherSavedP)
                    citySavedP.innerHTML = `${citiesSavedInLS[i]}`
                    weatherSavedP.innerHTML = `$${Math.round(data.main.temp)}°`   
            })
            const onErrorCityName = (err) => {
            console.log(err)
            }
        }   
    }
}
savedWeather()

function getWeatherByMyLocation() {
    const onSuccessLocation = (position) => {
        getWeatherByLocation(position.coords.latitude, position.coords.longitude)
            .then(data => {
                console.log(data)
                console.log('Temp: ', data.list[0].main.temp, 'City: ', data.city.name)
                temp.innerHTML = `${Math.round(data.list[0].main.temp)}°`
                mylocation.innerHTML = data.city.name
                tempMax.innerHTML = `${Math.round(data.list[0].main.temp_max)}°`
                tempMin.innerHTML = `${Math.round(data.list[0].main.temp_min)}°`
                humidity.innerHTML = `${data.list[0].main.humidity}%`
                cloudy.innerHTML = `${data.list[0].clouds.all}%`
                wind.innerHTML = `${data.list[0].wind.speed}km/h`
                if (!JSON.parse(localStorage.getItem('Cities'))) {
                    let citiesSaved = [data.city.name]
                    localStorage.setItem('Cities', JSON.stringify(citiesSaved))
                }      
        })
    }
    const onErrorLocation = (err) => {
        console.log(err)
    }
    navigator.geolocation.getCurrentPosition(onSuccessLocation, onErrorLocation)
}
window.onload = getWeatherByMyLocation

function getWeatherByCity(city) {
    const API_KEY = "6fbeb34c010c544f6f33fa8071fc677a"
    return appFetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${'metric'}`)
}

function checkInput() {
    if (!searchLocationInput.value) {
        alert('Field is empty.')
        return false
    }
    else return true
}

searchLocationInput.addEventListener('change', event => {
    let citiesSavedInLS = JSON.parse(localStorage.getItem('Cities'))
    if (checkInput()) {
    let cityName = searchLocationInput.value.trim().toLowerCase()
    cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1)
    document.querySelector('.weather-by-searching').innerHTML = `Weather in ${cityName}`
    console.log(`Weather in ${cityName}`)
    
    getWeatherByCity(cityName)
        .then(data => {
            console.log(data)
            tempMax.innerHTML = `${Math.round(data.main.temp_max)}°`
            tempMin.innerHTML = `${Math.round(data.main.temp_min)}°`
            humidity.innerHTML = `${data.main.humidity}%`
            cloudy.innerHTML = `${data.clouds.all}%`
            wind.innerHTML = `${data.wind.speed}km/h`   
            if (citiesSavedInLS.length < 7) {
                citiesSavedInLS.push(cityName)
                localStorage.setItem('Cities', JSON.stringify(citiesSavedInLS))
            }
            if (citiesSavedInLS.length > 6) {
                let usersAnswer = confirm(`You can only keep six cities' weather information. Do you want to delete first?`)
                if(usersAnswer) {
                    citiesSavedInLS.shift()
                    citiesSavedInLS.push(cityName)
                    localStorage.setItem('Cities', JSON.stringify(citiesSavedInLS))
                } else {
                    alert(`${cityName}' weather will not be saved.`)
                }
            }
        })
        const onErrorCityName = (err) => {
        console.log(err)
        alert('Wrong city name.')
        }
}})


function mainInfStyle() {
    let citiesSavedInLS = JSON.parse(localStorage.getItem('Cities'))
    if (citiesSavedInLS.length < 4) {
        document.querySelector('.main-information').style.bottom = '200px'
    }
}
mainInfStyle()