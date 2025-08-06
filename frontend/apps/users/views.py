from django.http import JsonResponse
from web3 import Web3
from eth_account import Account

def connect_wallet(request):
    if request.method == 'POST':
        signature = request.POST.get('signature')
        message = "Please sign this message to connect your wallet."

        try:
            wallet_address = Account.recover_message(message, signature=signature)
            request.session['wallet_address'] = wallet_address
            return JsonResponse({'status': 'success', 'wallet_address': wallet_address})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

def disconnect_wallet(request):
    if request.method == 'POST':
        try:
            del request.session['wallet_address']
            return JsonResponse({'status': 'success'})
        except KeyError:
            return JsonResponse({'status': 'error', 'message': 'Wallet not connected'})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})
