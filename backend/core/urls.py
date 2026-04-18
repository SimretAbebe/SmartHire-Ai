from django.urls import path
from .views import (
    RegisterView, LoginView, MaidProfileView, 
    JobPostingView, JobPostingDetailView, 
    MatchMaidsView, GenerateContractView
)

urlpatterns = [
    # Mapped natively to /api/register due to backend urls binding
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('maid-profile/', MaidProfileView.as_view(), name='maid-profile'),
    path('job/', JobPostingView.as_view(), name='job'),
    path('job/<int:pk>/', JobPostingDetailView.as_view(), name='job-detail'),
    path('matches/', MatchMaidsView.as_view(), name='matches'),
    path('contract/', GenerateContractView.as_view(), name='contract'),
]
