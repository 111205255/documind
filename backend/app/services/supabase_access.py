import httpx
from fastapi import HTTPException


def assert_document_owner(
    supabase_url: str,
    service_role_key: str,
    document_id: str,
    user_id: str,
) -> None:
    """Ensure the document row belongs to the authenticated user."""
    base = supabase_url.rstrip("/")
    headers = {
        "apikey": service_role_key,
        "Authorization": f"Bearer {service_role_key}",
    }
    params = {
        "id": f"eq.{document_id}",
        "user_id": f"eq.{user_id}",
        "select": "id",
    }

    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.get(f"{base}/rest/v1/documents", headers=headers, params=params)
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=503, detail="Could not verify document access.") from exc

    if response.status_code != 200:
        raise HTTPException(status_code=503, detail="Document access check failed.")

    rows = response.json()
    if not rows:
        raise HTTPException(status_code=403, detail="Document not found or access denied.")
