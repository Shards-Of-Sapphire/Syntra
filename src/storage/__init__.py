from sqlalchemy.orm import Session


_original_commit = Session.commit


def _safe_commit(self, *args, **kwargs):
    try:
        return _original_commit(self, *args, **kwargs)
    except Exception:
        if self.in_transaction():
            self.rollback()
        raise


Session.commit = _safe_commit
