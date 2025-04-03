import pytest

URL_GET_USER = "/users/{id}"


@pytest.mark.usefixtures("create_user")
def test_get_user_for_not_superuser(user_client):
    response = user_client.get(URL_GET_USER.format(id=1))
    assert response.status_code == 401, (
        f"Проверьте, что доступ к {URL_GET_USER}"
        f"доступен только для суперпользователей"
    )
