import sqlite3

from core.base.model.Widget import Widget
from core.base.model.widgetSizes import WidgetSizes


class CurrentWeather(Widget):

	SIZE = WidgetSizes.w_small
	OPTIONS: dict = {'customLocation': ''}

	def __init__(self, data: sqlite3.Row):
		super().__init__(data)


	def baseData(self) -> dict:
		location = self.OPTIONS.get('customLocation') or self.skillInstance.getConfig('baseLocation').title()
		return {
			'location': location,
			'units': 'C' if self.skillInstance.getConfig('units') == 'metric' else 'F' if self.skillInstance.getConfig('units') == 'imperial' else 'K',
			'unitsName': self.skillInstance.getConfig('units'),
			'apiKey': self.skillInstance.getConfig('apiKey')
		}
