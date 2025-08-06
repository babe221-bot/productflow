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
