install:
	pip install -r requirements.txt

run:
	python webapp/app.py

run-backend:
	python webapp/app.py

run-frontend:
	cd webapp && npm run dev

collect-twitter:
	python scripts/collect_twitter.py

collect-telegram:
	python scripts/collect_telegram.py

test:
	python -m unittest discover tests

.PHONY: install run run-backend run-frontend collect-twitter collect-telegram test