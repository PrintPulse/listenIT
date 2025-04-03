import pytest

from app.models import Radio, User, UserRadio


@pytest.fixture
def create_user(mixer):
    return mixer.blend(User, id=1)


@pytest.fixture
def create_radio(mixer):
    radio1 = mixer.blend(Radio, id=1, name="fm-test")
    mixer.blend(Radio, id=2, name="fm-example")
    return radio1


@pytest.fixture
def create_favorite(mixer, create_user, create_radio):
    return mixer.blend(
        UserRadio, user_id=create_user.id, radio_id=create_radio.id
    )
