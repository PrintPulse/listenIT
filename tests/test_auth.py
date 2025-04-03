URL_REGISTER = "/auth/register"


def test_register(anonym_client):
    user_data = {
        "email": "dead@pool.com",
        "password": "chimichangas4life",
    }
    response = anonym_client.post(URL_REGISTER, json=user_data)
    assert response.status_code == 201, (
        "Проверьте статус ответа API: при регистрации пользователя "
        f"корректный POST-запрос к эндпоинту {URL_REGISTER} "
        "должен вернуть ответ со статусом 201."
    )
    data = response.json()
    expected_keys = {"id", "email", "is_active", "is_superuser", "is_verified"}
    missing_keys = expected_keys - set(data.keys())
    assert not missing_keys, (
        f"В ответе на корректный POST-запрос к эндпоинту `{URL_REGISTER}` не "
        f"хватает следующих ключей: `{'`, `'.join(missing_keys)}`"
    )
    data.pop("id")
    assert data == {
        "email": user_data["email"],
        "is_active": True,
        "is_superuser": False,
        "is_verified": False,
    }, "При регистрации пользователя тело ответа API отличается от ожидаемого."


def test_register_invalid_pass(anonym_client):
    response = anonym_client.post(
        URL_REGISTER,
        json={
            "email": "dead@pool.com",
            "password": "$",
        },
    )
    assert response.status_code == 400, (
        "Проверьте статус ответа API: "
        "при регистрации пользователя некорректный POST-запрос "
        f"к эндпоинту`{URL_REGISTER}` должен вернуть ответ со статусом 400."
    )
    data = response.json()
    assert list(data.keys()) == ["detail"], (
        "Убедитесь, что в ответе на некорректный POST-запрос "
        f"к эндпоинту `{URL_REGISTER}` есть ключ `detail`."
    )
