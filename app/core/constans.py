ERROR_404 = {
    404: {
        "description": "Радиостанция не найдена",
        "content": {
            "application/json": {
                "example": {"detail": "Радио example не существует!"}
            }
        },
    }
}

ERRORS_ADD = {
    400: {
        "description": "Радиостанция уже добавлена",
        "content": {
            "application/json": {
                "example": {
                    "detail": "Радио example уже добавлено в избранное!"
                }
            }
        },
    }
}

ERRORS_DELETE = {
    400: {
        "description": "Радиостанция не была добавлена",
        "content": {
            "application/json": {
                "example": {
                    "detail": "Радио example не было добавлено в избранное!"
                }
            }
        },
    }
}

ERRORS_ADD.update(ERROR_404)
ERRORS_DELETE.update(ERROR_404)

ACOUST_URL = "https://api.acoustid.org/v2/lookup"
