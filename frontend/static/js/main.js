document.addEventListener('DOMContentLoaded', () => {
 feat/backend-improvements
    const themeSwitcher = document.getElementById('theme-switcher');
    const themeIconLight = document.getElementById('theme-icon-light');
    const themeIconDark = document.getElementById('theme-icon-dark');

    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark-mode');
        themeIconLight.classList.add('hidden');
        themeIconDark.classList.remove('hidden');
    }

    themeSwitcher.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark-mode');
        themeIconLight.classList.toggle('hidden');
        themeIconDark.classList.toggle('hidden');

        if (document.documentElement.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });


 main
    const connectWalletBtn = document.getElementById('connect-wallet-btn');
    const disconnectWalletBtn = document.getElementById('disconnect-wallet-btn');
    const walletInfo = document.getElementById('wallet-info');
    const walletAddress = document.getElementById('wallet-address');

    connectWalletBtn.addEventListener('click', async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                const account = accounts[0];
                const message = "Please sign this message to connect your wallet.";

                const signature = await web3.eth.personal.sign(message, account, '');

                const formData = new FormData();
                formData.append('signature', signature);
                formData.append('csrfmiddlewaretoken', '{{ csrf_token }}');

                const response = await fetch('/users/connect_wallet/', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.status === 'success') {
                    walletAddress.textContent = data.wallet_address;
                    walletInfo.classList.remove('hidden');
                    connectWalletBtn.classList.add('hidden');
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error(error);
                alert('An error occurred while connecting your wallet.');
            }
        } else {
            alert('Please install MetaMask to use this feature.');
        }
    });

    disconnectWalletBtn.addEventListener('click', async () => {
        const response = await fetch('/users/disconnect_wallet/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': '{{ csrf_token }}'
            }
        });

        const data = await response.json();

        if (data.status === 'success') {
            walletInfo.classList.add('hidden');
            connectWalletBtn.classList.remove('hidden');
        } else {
            alert(data.message);
        }
    });
});
