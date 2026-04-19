import hashlib
import secrets


def hash_password(password: str, salt: str | None = None) -> str:
    salt_value = salt or secrets.token_hex(16)
    digest = hashlib.sha256(f"{salt_value}:{password}".encode("utf-8")).hexdigest()
    return f"{salt_value}${digest}"


def verify_password(password: str, hashed_password: str) -> bool:
    salt_value, _ = hashed_password.split("$", maxsplit=1)
    return hash_password(password, salt_value) == hashed_password
