import ipaddress
import re
import socket
from urllib.parse import urlparse

import httpx
from html.parser import HTMLParser

MAX_RESPONSE_BYTES = 10 * 1024 * 1024
ALLOWED_PORTS = {80, 443}


class _TextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self._parts: list[str] = []
        self._skip = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in {"script", "style", "noscript"}:
            self._skip = True

    def handle_endtag(self, tag: str) -> None:
        if tag in {"script", "style", "noscript"}:
            self._skip = False
        if tag in {"p", "div", "br", "li", "h1", "h2", "h3", "h4", "h5", "h6"}:
            self._parts.append("\n")

    def handle_data(self, data: str) -> None:
        if not self._skip:
            self._parts.append(data)

    def text(self) -> str:
        raw = "".join(self._parts)
        raw = re.sub(r"[ \t]+", " ", raw)
        raw = re.sub(r"\n{3,}", "\n\n", raw)
        return raw.strip()


def _is_blocked_ip(ip: ipaddress.IPv4Address | ipaddress.IPv6Address) -> bool:
    return (
        ip.is_private
        or ip.is_loopback
        or ip.is_link_local
        or ip.is_reserved
        or ip.is_multicast
        or ip.is_unspecified
    )


def _validate_url_target(url: str) -> None:
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"}:
        raise ValueError("Only http and https URLs are allowed.")
    if not parsed.hostname:
        raise ValueError("Invalid URL.")
    if parsed.username or parsed.password:
        raise ValueError("URLs with embedded credentials are not allowed.")

    port = parsed.port or (443 if parsed.scheme == "https" else 80)
    if port not in ALLOWED_PORTS:
        raise ValueError("Only ports 80 and 443 are allowed.")

    try:
        addr_infos = socket.getaddrinfo(parsed.hostname, port, type=socket.SOCK_STREAM)
    except socket.gaierror as exc:
        raise ValueError("Could not resolve URL hostname.") from exc

    if not addr_infos:
        raise ValueError("Could not resolve URL hostname.")

    for info in addr_infos:
        ip = ipaddress.ip_address(info[4][0])
        if _is_blocked_ip(ip):
            raise ValueError("URL points to a disallowed address.")


def _fetch_with_redirects(client: httpx.Client, url: str, max_hops: int = 5) -> httpx.Response:
    current = url
    for _ in range(max_hops):
        _validate_url_target(current)
        response = client.get(
            current,
            headers={"User-Agent": "DocuMind/1.0 (+https://documind-beige.vercel.app)"},
        )
        if response.status_code not in {301, 302, 303, 307, 308}:
            return response
        location = response.headers.get("location")
        if not location:
            return response
        current = str(response.url.join(location))
    raise ValueError("Too many redirects.")


def _read_limited_body(response: httpx.Response) -> str:
    chunks: list[bytes] = []
    total = 0
    for chunk in response.iter_bytes():
        total += len(chunk)
        if total > MAX_RESPONSE_BYTES:
            raise ValueError("URL response is too large.")
        chunks.append(chunk)
    return b"".join(chunks).decode(response.encoding or "utf-8", errors="replace")


def fetch_url_text(url: str, timeout: float = 30.0) -> str:
    """Download a public page and return plain text."""
    _validate_url_target(url)

    with httpx.Client(follow_redirects=False, timeout=timeout) as client:
        response = _fetch_with_redirects(client, url)
        response.raise_for_status()

    content_type = response.headers.get("content-type", "")
    body = _read_limited_body(response)

    if "html" in content_type or body.lstrip().startswith("<"):
        parser = _TextExtractor()
        parser.feed(body)
        text = parser.text()
    else:
        text = body.strip()

    if len(text) < 80:
        raise ValueError("Could not extract enough text from this URL.")

    return text[:500_000]
