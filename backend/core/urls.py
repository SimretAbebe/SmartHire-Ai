from django.urls import path
from .views import RegisterView, LoginView, MaidProfileView

urlpatterns = [
    # Mapped natively to /api/register due to backend urls binding
    path('register', RegisterView.as_view(), name='register'),
    # Mapped natively to /api/login
    path('login', LoginView.as_view(), name='login'),
    # Maid Endpoint processing POST
    path('maid-profile', MaidProfileView.as_view(), name='maid-profile'),
]
