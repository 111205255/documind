import jwt
from fastapi import HTTPException


def decode_supabase_jwt(token: str, secret: str, issuer: str | None = None) -> str:
    """Validate a Supabase access token and return the user id (sub)."""
    decode_kwargs: dict = {
        "algorithms": ["HS256"],
        "audience": "authenticated",
    }
    if issuer:
        decode_kwargs["issuer"] = issuer

    try:
        payload = jwt.decode(token, secret, **decode_kwargs)
    except jwt.PyJWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid or expired sign-in token.") from exc

    user_id = payload.get("sub")
    if not user_id or not isinstance(user_id, str):
        raise HTTPException(status_code=401, detail="Invalid sign-in token.")
    return user_id
