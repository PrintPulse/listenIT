import scrapy


class ParserRadioItem(scrapy.Item):
    name = scrapy.Field()
    source = scrapy.Field()
