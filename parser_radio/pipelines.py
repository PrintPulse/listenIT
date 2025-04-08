import sqlite3


class ParserRadioPipeline:
    def open_spider(self, spider):
        self.radios = []
        self.conn = sqlite3.connect("data_base.db")

    def process_item(self, item, spider):
        self.radios.append((item["name"], item["source"]))
        return item

    def close_spider(self, spider):
        try:
            cursor = self.conn.cursor()
            query = "INSERT OR IGNORE INTO radio (name, source) VALUES (?, ?)"
            cursor.executemany(query, self.radios)
            self.conn.commit()
        finally:
            self.conn.close()
