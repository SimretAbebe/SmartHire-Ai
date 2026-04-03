from django.urls import path
from .views import (
    RegisterView, LoginView, MaidProfileView, 
    JobPostingView, JobPostingDetailView, 
    MatchMaidsView, GenerateContractView
)

urlpatterns = [
    # Mapped natively to /api/register due to backend urls binding
    path('register', RegisterView.as_view(), name='register'),
    # Mapped natively to /api/login
    path('login', LoginView.as_view(), name='login'),
    
    # POST /api/maid-profile
    path('maid-profile', MaidProfileView.as_view(), name='maid-profile'),
    
    # POST /api/job
    path('job', JobPostingView.as_view(), name='job'),
    # GET /api/job/<id>
    path('job/<int:pk>', JobPostingDetailView.as_view(), name='job-detail'),
    
    # AI Endpoints
    # GET /api/matches?job_id=x
    path('matches', MatchMaidsView.as_view(), name='matches'),
    # POST /api/contract
    path('contract', GenerateContractView.as_view(), name='contract'),
]
