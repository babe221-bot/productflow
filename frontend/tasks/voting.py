from celery import shared_task
from web3 import Web3

@shared_task
def submit_vote(proposal_id, vote_direction, signed_tx):
    try:
        w3 = Web3()
        w3.eth.send_raw_transaction(signed_tx)
        # Update proposal state asynchronously
    except Exception as e:
        print(f"Vote failed: {e}")
