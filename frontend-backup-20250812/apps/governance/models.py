from django.db import models
from django.contrib.auth.models import User

class Proposal(models.Model):
    STATUS_CHOICES = [('active','Active'), ('passed','Passed'), ('rejected','Rejected')]

    title = models.CharField(max_length=255)
    description = models.TextField()
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    votes_for = models.IntegerField(default=0)
    votes_against = models.IntegerField(default=0)
    deadline = models.DateTimeField()
