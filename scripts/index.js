const temp = document.querySelector('.temp')
const location = document.querySelector('.location')
const date = document.querySelector('.time-date')

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

function getWeatherByLocation(lat, lon) {
    const API_KEY = "6fbeb34c010c544f6f33fa8071fc677a"
    return appFetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&cnt=${'5'}&units=${'metric'}`)
}

function getWeatherByMyLocation() {
    const onSuccessLocation = (position) => {
        getWeatherByLocation(position.coords.latitude, position.coords.longitude)
            .then(data => {
                console.log(data)
                console.log('Temp: ', data.list[0].main.temp, 'City: ', data.city.name)
                temp.innerHTML = data.list[0].main.temp
                location.innerHTML = data.city.name
        })
    }
    const onErrorLocation = (err) => {
        console.log(err)
    }
    navigator.geolocation.getCurrentPosition(onSuccessLocation, onErrorLocation)
}

// const getMoscowWeatherButton = document.querySelector('#get-moscow-weather')
// const showLocationButton = document.querySelector('#show-location')
// const getWeatherByMyLocationButton = document.querySelector('#get-weather-by-my-location')


// getMoscowWeatherButton.addEventListener('click', () => {
//     getWeather('Moscow')
//         .then(data => {
//             console.log(data)
//     })
// })

// showLocationButton.addEventListener('click', () => {
//     navigator.geolocation.getCurrentPosition(
//         position => {
//         console.log('Latitude: ', position.coords.latitude)
//         console.log('Longitude: ', position.coords.longitude)
//     }, (err) => {console.log(err)})
// })

// getWeatherByMyLocationButton.addEventListener('click', () => {
//     const onSuccessLocation = (position) => {
//         getWeatherByLocation(position.coords.latitude, position.coords.longitude)
//         .then(data => {
//             console.log(data)
//             console.log('Temp: ', data.list[0].main.temp, 'City: ', data.city.name)
//             console.log('First weather timestamp: ', new DataTransfer(data.list[0].dt))
//         })
//     }

//     const onErrorLocation = (err) => {
//         console.log(err)
//     }
//     navigator.geolocation.getCurrentPosition(onSuccessLocation, onErrorLocation)
// })
// function getWeather(city) {
//     const API_KEY = "6fbeb34c010c544f6f33fa8071fc677a"
//     return appFetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&cnt=${'5'}&units=${'metric'}`)
// }

// function appFetch(url, options) {
//     return fetch(url, options)
//     .then(resp => resp.json())
//     .catch(err => {
//         throw new Error(err)
//     })
// }