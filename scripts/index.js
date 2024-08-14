const temp = document.querySelector('.temp')
const mylocation = document.querySelector('.location')
const date = document.querySelector('.time-date')
const tempMax = document.querySelector('.temp-max')
const tempMin = document.querySelector('.temp-min')
const humidity = document.querySelector('.humidity')
const cloudy = document.querySelector('.cloudy')
const wind = document.querySelector('.wind')
const searchLocationInput = document.querySelector('.search-by-city')

function deleteElement(elem) {
    elem.closest('.city-saved-container').remove()
    console.log(elem.closest('.city-saved-name').children[0].innerHTML)
    let citiesSavedInLS = JSON.parse(localStorage.getItem('Cities'))
    for (var i in citiesSavedInLS) {
        if (elem.closest('.city-saved-name').children[0].innerHTML === citiesSavedInLS[i]) {
            citiesSavedInLS.splice(i, 1);
            localStorage.setItem('Cities', JSON.stringify(citiesSavedInLS));
        }
    }
}

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
        })
    }
    const onErrorLocation = (err) => {
        console.log(err)
    }
    navigator.geolocation.getCurrentPosition(onSuccessLocation, onErrorLocation)
}
window.onload = getWeatherByMyLocation

function cityNameCorrectView(string) { //корректное написание городов
    let correctArrayOfCityName = []
    let cityName = string.split(' ')
    for (let i=0;i<cityName.length;i++) {
        correctArrayOfCityName.push(cityName[i].trim().toLowerCase().charAt(0).toUpperCase() + cityName[i].slice(1))
    }
    return correctArrayOfCityName.join(' ')
}

function savedWeather() { //отображение погоды для городов из хранилища
    let citiesSavedInLS = JSON.parse(localStorage.getItem('Cities'))
    let citiesOnPage = document.querySelector('.cities-saved')
    if (citiesSavedInLS.length >= 8) {
        document.querySelector('.main-information').style = 'order: 0'
        citiesOnPage.style = 'flex-direction: unset; height: unset'
    }
    console.log(citiesSavedInLS)
    if(citiesSavedInLS) {
        for (let i=0;i<citiesSavedInLS.length;i++) {
            console.log(citiesSavedInLS[i])
            getWeatherByCity(citiesSavedInLS[i])  
                .then(data => {
                    console.log(data)
                    console.log(data.weather[0].main === 'Clear')
                    console.log(`${citiesSavedInLS[i]} temp ${Math.round(data.main.temp)}° wind ${data.wind.speed} weather${data.weather[0].main}`)
                    let weatherIcon = (data.weather[0].main === 'Snow') ? 'snow' :
                        (data.weather[0].main === 'Rain') ? 'rain' :
                        (data.weather[0].main === 'Clouds') ? 'cloud' :
                        (data.weather[0].main === 'Clear') ? 'sun' : 'cloud';
                    let htmlSavedCityBox = `<div class="city-saved-container">
                            <div class="weather-icon ${weatherIcon}"></div>
                            <div class="cities-saved-weather-box">
                                <div class="city-saved-name">
                                    <p>${data.name}</p>
                                    <div class="delete" onClick=deleteElement(this)>-</div>
                                </div>
                                <div class="city-saved-inf">
                                    <p>temp ${Math.round(data.main.temp)}°</p>
                                    <p>wind ${data.wind.speed}km/h</p>
                                </div>
                            </div>
                        </div>`
                    citiesOnPage.insertAdjacentHTML('beforeend', htmlSavedCityBox)
            })
            const onErrorCityName = (err) => {
            console.log(err)
            }
        }   
    }
}
savedWeather()

function getWeatherByCity(city) {
    const API_KEY = "6fbeb34c010c544f6f33fa8071fc677a"
    return appFetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${'metric'}`)
}

function checkInput() {
    let citiesSavedInLS = JSON.parse(localStorage.getItem('Cities'))
    let cityName = cityNameCorrectView(searchLocationInput.value)
    if (!searchLocationInput.value) {
        alert('Field is empty.')
        return false
    }
    if (citiesSavedInLS.includes(cityName)) { //если введенный город есть на странице
        alert(`${cityName} weather is on page.`)
        return false
    }
    else return true
}

searchLocationInput.addEventListener('change', event => {
    let citiesSavedInLS = JSON.parse(localStorage.getItem('Cities'))
    let citiesOnPage = document.querySelector('.cities-saved')
    if (checkInput()) {
    let cityName = cityNameCorrectView(searchLocationInput.value)
    document.querySelector('.weather-by-searching').innerHTML = `Weather in ${cityName}`//////
    console.log(`Search weather in ${cityName}`)
    getWeatherByCity(cityName)
        .then(data => {
            console.log(data)
            tempMax.innerHTML = `${Math.round(data.main.temp_max)}°`
            tempMin.innerHTML = `${Math.round(data.main.temp_min)}°`
            humidity.innerHTML = `${data.main.humidity}%`
            cloudy.innerHTML = `${data.clouds.all}%`
            wind.innerHTML = `${data.wind.speed}km/h`   
            let weatherIcon = (data.weather[0].main === 'Snow') ? 'snow' :
                             (data.weather[0].main === 'Rain') ? 'rain' :
                              (data.weather[0].main === 'Clouds') ? 'cloud' :
                              (data.weather[0].main === 'Clear') ? 'sun' : 'cloud';
                        let htmlSavedCityBox = `<div class="city-saved-container">
                             <div class="weather-icon ${weatherIcon}"></div>
                             <div class="cities-saved-weather-box">
                                 <div class="city-saved-name">
                                      <p>${data.name}</p>
                                      <div class="delete">-</div>
                                </div>
                                <div class="city-saved-inf">
                                    <p>temp ${Math.round(data.main.temp)}°</p>
                                    <p>wind ${data.wind.speed}km/h</p>
                                </div>
                            </div>
                            </div>`
                        citiesOnPage.insertAdjacentHTML('beforeend', htmlSavedCityBox)
            if (!citiesSavedInLS) {
                citiesSavedInLS = [cityName]
                localStorage.setItem('Cities', JSON.stringify(citiesSavedInLS)) 
            }
            if (citiesSavedInLS) {
                citiesSavedInLS.push(cityName)
                let uniqCitiesSavedInLS = [ ...new Set(citiesSavedInLS) ]
                localStorage.setItem('Cities', JSON.stringify(uniqCitiesSavedInLS))
            }
            if (citiesSavedInLS.length === 8) {
                document.querySelector('.main-information').style = 'order: 0'
            }
        })
        const onErrorCityName = (err) => {
        console.log(err)
        }
       
        searchLocationInput.value = ''    
    }})

