const todayWeather = {
    "coord": {
        "lon": -74.3899,
        "lat": 40.6554
    },
    "weather": [
        {
            "id": 800,
            "main": "Clear",
            "description": "clear sky",
            "icon": "01n"
        }
    ],
    "base": "stations",
    "main": {
        "temp": 37.47,
        "feels_like": 29.41,
        "temp_min": 32.41,
        "temp_max": 42.22,
        "pressure": 1031,
        "humidity": 46
    },
    "visibility": 10000,
    "wind": {
        "speed": 12.66,
        "deg": 20
    },
    "clouds": {
        "all": 0
    },
    "dt": 1700533430,
    "sys": {
        "type": 2,
        "id": 2020071,
        "country": "US",
        "sunrise": 1700480995,
        "sunset": 1700516201
    },
    "timezone": -18000,
    "id": 5104473,
    "name": "Scotch Plains",
    "cod": 200
}


const todayForecast = [
    {
        "dt": 1700524800,
        "main": {
            "temp": 38.08,
            "feels_like": 32.7,
            "temp_min": 38.08,
            "temp_max": 41.27,
            "pressure": 1032,
            "sea_level": 1032,
            "grnd_level": 1025,
            "humidity": 48,
            "temp_kf": -1.77
        },
        "weather": [
            {
                "id": 800,
                "main": "Clear",
                "description": "clear sky",
                "icon": "01n"
            }
        ],
        "clouds": {
            "all": 0
        },
        "wind": {
            "speed": 7.2,
            "deg": 58,
            "gust": 11.77
        },
        "visibility": 10000,
        "pop": 0,
        "sys": {
            "pod": "n"
        },
        "dt_txt": "2023-11-21 00:00:00"
    },
    {
        "dt": 1700528400,
        "main": {
            "temp": 38.57,
            "feels_like": 32.65,
            "temp_min": 38.57,
            "temp_max": 40.48,
            "pressure": 1032,
            "sea_level": 1032,
            "grnd_level": 1026,
            "humidity": 45,
            "temp_kf": -1.06
        },
        "weather": [
            {
                "id": 801,
                "main": "Clouds",
                "description": "few clouds",
                "icon": "02n"
            }
        ],
        "clouds": {
            "all": 20
        },
        "wind": {
            "speed": 8.39,
            "deg": 51,
            "gust": 14.16
        },
        "visibility": 10000,
        "pop": 0,
        "sys": {
            "pod": "n"
        },
        "dt_txt": "2023-11-21 01:00:00"
    },
    {
        "dt": 1700532000,
        "main": {
            "temp": 38.73,
            "feels_like": 33.17,
            "temp_min": 38.73,
            "temp_max": 39.69,
            "pressure": 1032,
            "sea_level": 1032,
            "grnd_level": 1026,
            "humidity": 42,
            "temp_kf": -0.53
        },
        "weather": [
            {
                "id": 802,
                "main": "Clouds",
                "description": "scattered clouds",
                "icon": "03n"
            }
        ],
        "clouds": {
            "all": 40
        },
        "wind": {
            "speed": 7.76,
            "deg": 44,
            "gust": 13.69
        },
        "visibility": 10000,
        "pop": 0,
        "sys": {
            "pod": "n"
        },
        "dt_txt": "2023-11-21 02:00:00"
    },
    {
        "dt": 1700535600,
        "main": {
            "temp": 38.77,
            "feels_like": 33.39,
            "temp_min": 38.77,
            "temp_max": 39.24,
            "pressure": 1033,
            "sea_level": 1033,
            "grnd_level": 1027,
            "humidity": 39,
            "temp_kf": -0.26
        },
        "weather": [
            {
                "id": 803,
                "main": "Clouds",
                "description": "broken clouds",
                "icon": "04n"
            }
        ],
        "clouds": {
            "all": 60
        },
        "wind": {
            "speed": 7.45,
            "deg": 50,
            "gust": 13.85
        },
        "visibility": 10000,
        "pop": 0,
        "sys": {
            "pod": "n"
        },
        "dt_txt": "2023-11-21 03:00:00"
    },
    {
        "dt": 1700539200,
        "main": {
            "temp": 38.91,
            "feels_like": 33.51,
            "temp_min": 38.91,
            "temp_max": 39.11,
            "pressure": 1033,
            "sea_level": 1033,
            "grnd_level": 1026,
            "humidity": 38,
            "temp_kf": -0.11
        },
        "weather": [
            {
                "id": 803,
                "main": "Clouds",
                "description": "broken clouds",
                "icon": "04n"
            }
        ],
        "clouds": {
            "all": 80
        },
        "wind": {
            "speed": 7.54,
            "deg": 58,
            "gust": 13.38
        },
        "visibility": 10000,
        "pop": 0,
        "sys": {
            "pod": "n"
        },
        "dt_txt": "2023-11-21 04:00:00"
    },
    {
        "dt": 1700542800,
        "main": {
            "temp": 39.09,
            "feels_like": 34.92,
            "temp_min": 39.09,
            "temp_max": 39.09,
            "pressure": 1033,
            "sea_level": 1033,
            "grnd_level": 1027,
            "humidity": 41,
            "temp_kf": 0
        },
        "weather": [
            {
                "id": 804,
                "main": "Clouds",
                "description": "overcast clouds",
                "icon": "04n"
            }
        ],
        "clouds": {
            "all": 100
        },
        "wind": {
            "speed": 5.66,
            "deg": 54,
            "gust": 10.78
        },
        "visibility": 10000,
        "pop": 0,
        "sys": {
            "pod": "n"
        },
        "dt_txt": "2023-11-21 05:00:00"
    },
    {
        "dt": 1700546400,
        "main": {
            "temp": 38.93,
            "feels_like": 34.47,
            "temp_min": 38.93,
            "temp_max": 38.93,
            "pressure": 1034,
            "sea_level": 1034,
            "grnd_level": 1027,
            "humidity": 44,
            "temp_kf": 0
        },
        "weather": [
            {
                "id": 804,
                "main": "Clouds",
                "description": "overcast clouds",
                "icon": "04n"
            }
        ],
        "clouds": {
            "all": 100
        },
        "wind": {
            "speed": 6.02,
            "deg": 50,
            "gust": 11.41
        },
        "visibility": 10000,
        "pop": 0,
        "sys": {
            "pod": "n"
        },
        "dt_txt": "2023-11-21 06:00:00"
    }
];

const weekForecast = [
    {
        "dt": 1700496000,
        "sunrise": 1700480995,
        "sunset": 1700516201,
        "temp": {
            "day": 41.92,
            "min": 33.17,
            "max": 45.12,
            "night": 37.47,
            "eve": 39.92,
            "morn": 34.29
        },
        "feels_like": {
            "day": 37.58,
            "night": 32.25,
            "eve": 36.97,
            "morn": 28.27
        },
        "pressure": 1028,
        "humidity": 31,
        "weather": [
            {
                "id": 800,
                "main": "Clear",
                "description": "sky is clear",
                "icon": "01d"
            }
        ],
        "speed": 9.42,
        "deg": 354,
        "gust": 21.74,
        "clouds": 1,
        "pop": 0
    },
    {
        "dt": 1700582400,
        "sunrise": 1700567464,
        "sunset": 1700602562,
        "temp": {
            "day": 41.65,
            "min": 34.43,
            "max": 48.7,
            "night": 48.7,
            "eve": 44.64,
            "morn": 34.92
        },
        "feels_like": {
            "day": 35.91,
            "night": 43.88,
            "eve": 38.73,
            "morn": 29.64
        },
        "pressure": 1032,
        "humidity": 52,
        "weather": [
            {
                "id": 502,
                "main": "Rain",
                "description": "heavy intensity rain",
                "icon": "10d"
            }
        ],
        "speed": 13.56,
        "deg": 115,
        "gust": 33.11,
        "clouds": 100,
        "pop": 1,
        "rain": 18.2
    },
    {
        "dt": 1700668800,
        "sunrise": 1700653933,
        "sunset": 1700688925,
        "temp": {
            "day": 54.75,
            "min": 49.1,
            "max": 55.56,
            "night": 49.1,
            "eve": 51.62,
            "morn": 53.11
        },
        "feels_like": {
            "day": 54.07,
            "night": 45.45,
            "eve": 50.49,
            "morn": 52.77
        },
        "pressure": 1008,
        "humidity": 88,
        "weather": [
            {
                "id": 502,
                "main": "Rain",
                "description": "heavy intensity rain",
                "icon": "10d"
            }
        ],
        "speed": 13.67,
        "deg": 113,
        "gust": 31.76,
        "clouds": 100,
        "pop": 1,
        "rain": 18.96
    },
    {
        "dt": 1700755200,
        "sunrise": 1700740401,
        "sunset": 1700775290,
        "temp": {
            "day": 46.2,
            "min": 42.67,
            "max": 50.09,
            "night": 42.67,
            "eve": 48.88,
            "morn": 44.56
        },
        "feels_like": {
            "day": 40.66,
            "night": 39.02,
            "eve": 45.07,
            "morn": 38.26
        },
        "pressure": 1009,
        "humidity": 64,
        "weather": [
            {
                "id": 802,
                "main": "Clouds",
                "description": "scattered clouds",
                "icon": "03d"
            }
        ],
        "speed": 13,
        "deg": 331,
        "gust": 31.32,
        "clouds": 40,
        "pop": 0
    },
    {
        "dt": 1700841600,
        "sunrise": 1700826868,
        "sunset": 1700861657,
        "temp": {
            "day": 42.62,
            "min": 34.56,
            "max": 45.61,
            "night": 34.56,
            "eve": 42.39,
            "morn": 39.47
        },
        "feels_like": {
            "day": 37.96,
            "night": 28.2,
            "eve": 37.53,
            "morn": 36.16
        },
        "pressure": 1022,
        "humidity": 62,
        "weather": [
            {
                "id": 804,
                "main": "Clouds",
                "description": "overcast clouds",
                "icon": "04d"
            }
        ],
        "speed": 7.94,
        "deg": 334,
        "gust": 22.19,
        "clouds": 100,
        "pop": 0
    },
    {
        "dt": 1700928000,
        "sunrise": 1700913335,
        "sunset": 1700948026,
        "temp": {
            "day": 35.62,
            "min": 30.65,
            "max": 39.47,
            "night": 35.89,
            "eve": 38.37,
            "morn": 31.19
        },
        "feels_like": {
            "day": 30.74,
            "night": 33.28,
            "eve": 35.53,
            "morn": 25.5
        },
        "pressure": 1031,
        "humidity": 35,
        "weather": [
            {
                "id": 804,
                "main": "Clouds",
                "description": "overcast clouds",
                "icon": "04d"
            }
        ],
        "speed": 6.91,
        "deg": 356,
        "gust": 16.11,
        "clouds": 88,
        "pop": 0
    },
    {
        "dt": 1701014400,
        "sunrise": 1700999802,
        "sunset": 1701034397,
        "temp": {
            "day": 38.86,
            "min": 35.08,
            "max": 42.67,
            "night": 40.32,
            "eve": 42.31,
            "morn": 35.69
        },
        "feels_like": {
            "day": 36.03,
            "night": 36.34,
            "eve": 38.12,
            "morn": 32.11
        },
        "pressure": 1021,
        "humidity": 93,
        "weather": [
            {
                "id": 501,
                "main": "Rain",
                "description": "moderate rain",
                "icon": "10d"
            }
        ],
        "speed": 6.64,
        "deg": 355,
        "gust": 20.36,
        "clouds": 100,
        "pop": 1,
        "rain": 20.07
    }
];

export { todayWeather, todayForecast, weekForecast } ; 