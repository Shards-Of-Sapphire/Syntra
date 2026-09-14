"""Compatibility shim for Python 3.14+ where the stdlib imghdr module was removed.

This project depends on Tweepy, which still imports imghdr during image-related
checks. The shim provides the minimal API expected by older third-party libraries.
"""

from __future__ import annotations

import os
from typing import Optional


def what(file: str | os.PathLike[str], h: bytes | None = None) -> Optional[str]:
    """Return a simple image type string for a file or byte buffer.

    This is intentionally minimal, but enough to satisfy legacy Tweepy usage.
    """
    if h is None:
        path = os.fspath(file)
        try:
            with open(path, "rb") as f:
                h = f.read(32)
        except OSError:
            return None

    if len(h) >= 8 and h[:8] == b"\x89PNG\r\n\x1a\n":
        return "png"
    if len(h) >= 3 and h[:3] == b"GIF":
        return "gif"
    if len(h) >= 2 and h[:2] in (b"\xff\xd8",):
        return "jpeg"
    if len(h) >= 2 and h[:2] == b"BM":
        return "bmp"
    if len(h) >= 4 and h[:4] == b"II*\x00":
        return "tiff"
    if len(h) >= 4 and h[:4] == b"MM\x00*":
        return "tiff"
    return None


__all__ = ["what"]
