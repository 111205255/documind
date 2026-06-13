import jwt
from fastapi import HTTPException
from jwt import PyJWKClient

# Supabase migrated to asymmetric JWT signing keys (ES256/RS256). Access tokens
# are now signed with a project key pair and must be verified against the
# project's public JWKS, not the legacy HS256 shared secret. We keep HS256
# support as a fallback for projects still issuing symmetric tokens.
_ASYMMETRIC_ALGORITHMS = ("ES256", "RS256", "ES384", "RS384", "ES512", "RS512", "EdDSA")

# PyJWKClient caches fetched keys; reuse one client per JWKS URL.
_jwks_clients: dict[str, PyJWKClient] = {}


def _get_jwks_client(jwks_url: str) -> PyJWKClient:
    client = _jwks_clients.get(jwks_url)
    if client is None:
        client = PyJWKClient(jwks_url, cache_keys=True)
        _jwks_clients[jwks_url] = client
    return client


def decode_supabase_jwt(
    token: str,
    secret: str = "",
    issuer: str | None = None,
    jwks_url: str | None = None,
) -> str:
    """Validate a Supabase access token and return the user id (sub).

    Supports asymmetric (ES256/RS256) tokens via the project JWKS as well as
    legacy HS256 tokens signed with the shared secret.
    """
    common_kwargs: dict = {"audience": "authenticated"}
    if issuer:
        common_kwargs["issuer"] = issuer

    try:
        header = jwt.get_unverified_header(token)
        alg = header.get("alg")

        if alg in _ASYMMETRIC_ALGORITHMS:
            if not jwks_url:
                raise HTTPException(
                    status_code=503,
                    detail="Supabase JWKS URL is not configured.",
                )
            signing_key = _get_jwks_client(jwks_url).get_signing_key_from_jwt(token)
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=list(_ASYMMETRIC_ALGORITHMS),
                **common_kwargs,
            )
        elif alg == "HS256":
            if not secret:
                raise HTTPException(
                    status_code=503,
                    detail="Supabase JWT secret is not configured.",
                )
            payload = jwt.decode(token, secret, algorithms=["HS256"], **common_kwargs)
        else:
            raise HTTPException(status_code=401, detail="Unsupported sign-in token algorithm.")
    except HTTPException:
        raise
    except jwt.PyJWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid or expired sign-in token.") from exc

    user_id = payload.get("sub")
    if not user_id or not isinstance(user_id, str):
        raise HTTPException(status_code=401, detail="Invalid sign-in token.")
    return user_id
