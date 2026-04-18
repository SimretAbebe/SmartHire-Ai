from django.urls import path
from .views import (
    RegisterView, LoginView, MaidProfileView, 
    JobPostingView, JobPostingDetailView, 
    MatchMaidsView, GenerateContractView,
    health_check
)

urlpatterns = [
    path('health/', health_check, name='health-check'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('maid-profile/', MaidProfileView.as_view(), name='maid-profile'),
    path('job/', JobPostingView.as_view(), name='job'),
    path('job/<int:pk>/', JobPostingDetailView.as_view(), name='job-detail'),
    path('matches/', MatchMaidsView.as_view(), name='matches'),
    path('contract/', GenerateContractView.as_view(), name='contract'),
]
