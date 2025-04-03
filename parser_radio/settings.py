BOT_NAME = "parser_radio"

SPIDER_MODULES = ["parser_radio.spiders"]
NEWSPIDER_MODULE = "parser_radio.spiders"

ROBOTSTXT_OBEY = True

TWISTED_REACTOR = "twisted.internet.asyncioreactor.AsyncioSelectorReactor"
FEED_EXPORT_ENCODING = "utf-8"

ITEM_PIPELINES = {
    "parser_radio.pipelines.ParserRadioPipeline": 300,
}

FEEDS = {"parse_radios.csv": {"format": "csv", "overwrite": True}}
