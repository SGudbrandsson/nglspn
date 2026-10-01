import time

from django.core.cache import cache
from django.http import HttpRequest, JsonResponse


def check_rate_limit(
    request: HttpRequest, action: str, rate: str, *, key: str | None = None
) -> JsonResponse | None:
    """Check rate limit for a request. Returns a 429 JsonResponse if limited, else None.

    Args:
        request: The Django HTTP request.
        action: A unique name for this action (e.g. "login", "register").
        rate: Rate string like "5/m" (5 per minute) or "10/h" (10 per hour).
        key: Identity to rate-limit by instead of the client IP, e.g. a user id.
    """
    count_str, period_str = rate.split("/")
    max_requests = int(count_str)
    period_seconds = {"s": 1, "m": 60, "h": 3600}[period_str]

    if key is None:
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            client_ip = x_forwarded_for.split(",")[-1].strip()
        else:
            client_ip = request.META.get("REMOTE_ADDR", "")

    identity = key if key is not None else client_ip
    cache_key = f"rate_limit:{action}:{identity}"
    now = time.time()
    requests = cache.get(cache_key, [])
    requests = [t for t in requests if t > now - period_seconds]

    if len(requests) >= max_requests:
        return JsonResponse(
            {"detail": "Too many requests. Please try again later."},
            status=429,
        )

    requests.append(now)
    cache.set(cache_key, requests, timeout=period_seconds)
    return None
