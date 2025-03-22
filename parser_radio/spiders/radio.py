import scrapy

from parser_radio.items import ParserRadioItem


class RadioSpider(scrapy.Spider):
    name = "radio"
    allowed_domains = ["docs.juniper.bot"]
    start_urls = ["https://docs.juniper.bot/misc/radio-stations/"]

    def parse(self, response):
        self.radios = []
        strings = response.css("#radio-record+p+* tbody tr")
        for string in strings:
            data = {
                "name": string.css("td::text").get(),
                "source": string.css("td a::text").get(),
            }
            yield ParserRadioItem(data)
