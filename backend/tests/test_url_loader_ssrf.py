import pytest

from app.services.rag.url_loader import _validate_url_target


def test_blocks_localhost(monkeypatch):
    def fake_getaddrinfo(host, port, *args, **kwargs):
        if host == "localhost":
            return [(2, 1, 6, "", ("127.0.0.1", port))]
        raise OSError("unknown host")

    monkeypatch.setattr("app.services.rag.url_loader.socket.getaddrinfo", fake_getaddrinfo)

    with pytest.raises(ValueError, match="disallowed"):
        _validate_url_target("http://localhost/page")


def test_blocks_private_ip(monkeypatch):
    def fake_getaddrinfo(host, port, *args, **kwargs):
        return [(2, 1, 6, "", ("192.168.1.1", port))]

    monkeypatch.setattr("app.services.rag.url_loader.socket.getaddrinfo", fake_getaddrinfo)

    with pytest.raises(ValueError, match="disallowed"):
        _validate_url_target("http://example.com/page")


def test_allows_public_ip(monkeypatch):
    def fake_getaddrinfo(host, port, *args, **kwargs):
        return [(2, 1, 6, "", ("93.184.216.34", port))]

    monkeypatch.setattr("app.services.rag.url_loader.socket.getaddrinfo", fake_getaddrinfo)

    _validate_url_target("https://example.com/page")
