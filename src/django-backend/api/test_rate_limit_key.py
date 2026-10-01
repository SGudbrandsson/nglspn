from django.test import RequestFactory

from api.rate_limit import check_rate_limit


def test_key_replaces_ip() -> None:
    rf = RequestFactory()
    a = rf.get("/", REMOTE_ADDR="1.1.1.1")
    b = rf.get("/", REMOTE_ADDR="2.2.2.2")
    assert check_rate_limit(a, "t", "1/m", key="user-1") is None
    assert check_rate_limit(b, "t", "1/m", key="user-1").status_code == 429
    assert check_rate_limit(b, "t", "1/m", key="user-2") is None


def test_default_still_ip() -> None:
    rf = RequestFactory()
    assert check_rate_limit(rf.get("/", REMOTE_ADDR="3.3.3.3"), "u", "1/m") is None
    assert check_rate_limit(rf.get("/", REMOTE_ADDR="4.4.4.4"), "u", "1/m") is None
