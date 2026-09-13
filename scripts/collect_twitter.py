# scripts/collect_twitter.py

import argparse
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.collectors.twitter_collector import TwitterStreamCollector


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Stream live tweets into the Syntra database.")
    parser.add_argument(
        "--keywords",
        nargs="+",
        default=["#AI", "#python", "#datascience"],
        help="Keywords or hashtags to track in the Twitter stream.",
    )
    parser.add_argument(
        "--timeout",
        type=float,
        default=None,
        help="Optional timeout in seconds for the stream. Leave unset for a continuous stream.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    token = os.getenv("TWITTER_BEARER_TOKEN") or os.getenv("TWITTER_BEARER")
    if not token:
        raise RuntimeError("TWITTER_BEARER_TOKEN or TWITTER_BEARER must be set before starting the stream.")

    collector = TwitterStreamCollector(bearer_token=token)
    collector.add_keywords(args.keywords)
    print(f"Starting Twitter stream for: {', '.join(collector.keywords)}")
    collector.stream(keywords=collector.keywords, timeout=args.timeout)


if __name__ == "__main__":
    main()
