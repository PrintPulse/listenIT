import pytest

URL_FAVORITE = "/favorite/"


@pytest.mark.usefixtures("create_favorite")
def test_get_favorite(user_client):
    response = user_client.get(URL_FAVORITE)
    assert response.status_code == 200, (
        "Проверьте, может ли пользователь "
        "получить список своих добавленных радио"
    )
    data = response.json()
    expected_data = {"id", "name", "source"}
    missing_keys = expected_data - set(data[0].keys())
    assert not missing_keys, (
        f"В ответе на корректный GET-запрос к эндпоинту `{URL_FAVORITE}` не "
        f"хватает следующих ключей: `{'`, `'.join(missing_keys)}`"
    )


def test_get_favorite_for_anonym(anonym_client):
    response = anonym_client.get(URL_FAVORITE)
    assert response.status_code == 401, (
        f"Анонимный пользователь не должен иметь прав на доступ к {URL_FAVORITE}"
    )
    data = response.json()
    assert data == {"detail": "Пользователь не авторизован!"}, (
        "Структура ответа отличается от ожидаемой "
        "при запросе от неавторизованного пользователя"
    )


@pytest.mark.usefixtures("create_user", "create_radio")
def test_create_favorite(user_client):
    radio_data = {"name": "fm-test"}
    response = user_client.post(URL_FAVORITE, json=radio_data)
    assert response.status_code == 200, (
        "Авторизованному пользователю должна быть доступна "
        "функция добавления радио в избранное"
    )
    data = response.json()
    expected_data = {"id", "name", "source"}
    missing_keys = expected_data - set(data.keys())
    assert not missing_keys, (
        f"В ответе на корректный POST-запрос к эндпоинту `{URL_FAVORITE}` не "
        f"хватает следующих ключей: `{'`, `'.join(missing_keys)}`"
    )


@pytest.mark.usefixtures("create_favorite")
def test_delete_favorite(user_client):
    data_delete = {"name": "fm-test"}
    response = user_client.request(
        method="delete", url=URL_FAVORITE, json=data_delete
    )
    assert response.status_code == 200, (
        "Авторизованный пользователь должен уметь удалять радио в избранном"
    )
    data = response.json()
    expected_data = {"id", "name", "source"}
    missing_keys = expected_data - set(data.keys())
    assert not missing_keys, (
        f"В ответе на корректный DELETE-запрос к эндпоинту `{URL_FAVORITE}` не "
        f"хватает следующих ключей: `{'`, `'.join(missing_keys)}`"
    )


@pytest.mark.usefixtures("create_favorite")
@pytest.mark.parametrize("http_method", ["post", "delete"])
def test_not_found_radio(http_method, user_client):
    data_body = {"name": "not_found_name"}
    response = user_client.request(
        method=http_method, url=URL_FAVORITE, json=data_body
    )
    assert response.status_code == 404, (
        f"Работа с радио, имя которого не существует должна возвращать 404 ошибку."
        f"На запрос {http_method} - {URL_FAVORITE} возвращается {response.status_code}"
    )


@pytest.mark.usefixtures("create_favorite")
@pytest.mark.parametrize(
    "http_method, expect_data, send_data",
    [
        (
            "post",
            {"detail": "Радио fm-test уже добавлено в избранное!"},
            {"name": "fm-test"},
        ),
        (
            "delete",
            {"detail": "Радио fm-example не было добавлено в избранное!"},
            {"name": "fm-example"},
        ),
    ],
)
def test_radio_exist(user_client, http_method, expect_data, send_data):
    response = user_client.request(
        method=http_method, url=URL_FAVORITE, json=send_data
    )
    assert response.status_code == 400, (
        f"На запрос {http_method} - {URL_FAVORITE} возвращается {response.status_code}"
    )
    data = response.json()
    assert data == expect_data, (
        f"На запрос {http_method} - {URL_FAVORITE} возвращаются отличные от ожидаемой структуры данные"
    )
