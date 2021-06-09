class OpenWeatherMap_CurrentWeather {
	constructor(uid, widgetId, widget) {
		this.uid = uid
		this.widgetId = widgetId
		this.myDiv = document.querySelector(`[data-ref="CurrentWeather_body_${this.uid}"]`)
		this.location = ''
		this.apiKey = ''
		this.units = ''
		this.unitsName = ''
		this.aliceSettings = JSON.parse(window.sessionStorage.aliceSettings);
		this.widget = widget
		this.getBaseData()
	}

	getBaseData() {
		const self = this
		fetch(`http://${this.aliceSettings['aliceIp']}:${this.aliceSettings['apiPort']}/api/v1.0.1/widgets/${this.widgetId}/function/baseData/`, {
			method: 'POST',
			body: '{}',
			headers: {
				'auth': localStorage.getItem('apiToken'),
				'content-type': 'application/json'
			}
		})
			.then((r) => r.json())
			.then((data) => {
				self.apiKey = data.data.apiKey
				self.location = data.data.location
				self.units = data.data.units
				self.unitsName = data.data.unitsName
			})
			.then(() => this.refresh())
	}

	refresh() {
		let icon = ''
		const self = this
		let location = this.widget['configs']['customLocation'] || this.location
		fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${this.apiKey}&units=${this.unitsName}`)
			.then((r) => r.json())
			.then((data) => {
				self.myDiv.querySelector('#temperature').innerHTML = `${data['main']['temp']}° ${self.units}`
				self.myDiv.querySelector('#location').innerHTML = location

				icon = document.createElement('img')
				icon.src = `http://openweathermap.org/img/wn/${data['weather'][0]['icon']}.png`
				icon.alt = 'icon'
				icon.id = 'myWeatherIcon'
				setTimeout(this.refresh.bind(this), 5 * 60 * 1000)
			})
			.catch((e) => {
				console.warn('Failed fetching OWM data')
				icon = document.createElement('i')
				icon.className = 'fas fa-exclamation-triangle weather-fetch-failed'
				icon.id = 'myWeatherIcon'
				setTimeout(this.refresh.bind(this), 60*1000)
			}).finally(() => {
				const elem = self.myDiv.querySelector('#myWeatherIcon')
				elem.parentNode.append(icon)
				elem.parentNode.removeChild(elem)
			})
	}
}
