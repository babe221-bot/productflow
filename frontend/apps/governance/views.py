from django.shortcuts import render, redirect
from .models import Proposal
from django.contrib.auth.models import User
from datetime import datetime, timedelta

def create_proposal(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('description')

        # For now, we'll use the first user as the creator
        creator = User.objects.first()

        # Set a deadline for 7 days from now
        deadline = datetime.now() + timedelta(days=7)

        Proposal.objects.create(
            title=title,
            description=description,
            creator=creator,
            status='active',
            deadline=deadline
        )

        return redirect('proposal_list')

    return render(request, 'governance/create_proposal.html')

def proposal_list(request):
    proposals = Proposal.objects.filter(status='active').order_by('-deadline')
    return render(request, 'governance/proposal_list.html', {'proposals': proposals})

from tasks.voting import submit_vote

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def cast_vote(request, proposal_id, vote_direction):
    if request.method == 'POST':
        proposal = Proposal.objects.get(id=proposal_id)
        if vote_direction == 'for':
            proposal.votes_for += 1
        else:
            proposal.votes_against += 1
        proposal.save()

        # For now, we'll just simulate a signed transaction
        signed_tx = "0x1234567890"
        submit_vote.delay(proposal_id, vote_direction, signed_tx)

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'proposals',
            {
                'type': 'proposal_update',
                'proposal_id': proposal_id
            }
        )

        return render(request, 'components/_proposal_card.html', {'proposal': proposal})

    return redirect('proposal_list')

def get_proposal_card(request, proposal_id):
    proposal = Proposal.objects.get(id=proposal_id)
    return render(request, 'components/_proposal_card.html', {'proposal': proposal})
