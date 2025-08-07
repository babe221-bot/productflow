from web3 import Web3
from eth_account import Account

def connect_wallet(request, signature):
    wallet = Account.recover_message(signature)
    request.session['wallet'] = wallet
    return get_ens_name(wallet)  # Optional ENS lookup
