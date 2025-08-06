from django.test import TestCase
from django.urls import reverse
from unittest.mock import patch

class VotingTest(TestCase):
    def test_anon_vote_blocked(self):
        response = self.client.post(reverse('cast_vote', args=[1, 'for']))
        self.assertEqual(response.status_code, 403)

    def test_valid_vote_processing(self):
        self.client.login(wallet_address="0x123")
        with patch('tasks.voting.submit_vote.delay') as mock_task:
            response = self.client.post(reverse('cast_vote', args=[1, 'for']))
            mock_task.assert_called_once()
            self.assertContains(response, "Vote queued")
