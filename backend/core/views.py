from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token # Used internally for DRF
from .serializers import RegisterSerializer, LoginSerializer

# 1. Registration View
class RegisterView(APIView):
    # These override global settings so you inherently don't need a token to sign up
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            # Fires `.create()` on the ModelSerializer ensuring secure DB commit
            serializer.save()
            return Response({"success": "User registered successfully."}, status=status.HTTP_201_CREATED)
        
        # This will natively bubble up the validation errors (e.g., if phone isn't unique) in JSON
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 2. Login View
class LoginView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            # Provision or retrieve their token
            token, created = Token.objects.get_or_create(user=user)
            
            # Return token mapped natively for frontend consumption!
            return Response({
                "token": token.key,
                "role": user.role,
                "name": user.name
            }, status=status.HTTP_200_OK)
            
        # Error handling gracefully outputs custom validation raises configured in serialize.py
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.permissions import IsAuthenticated
from .utils import validate_fayda_id
from .serializers import MaidProfileSerializer

# 3. Maid Profile View
class MaidProfileView(APIView):
    # This requires Token validation via DRF Token header payload
    permission_classes = [IsAuthenticated]

    def post(self, request):
        fayda_id = request.data.get('fayda_id', '')
        
        # Immediate requirement mapping: 
        # Validate through strict Verhoeff algorithm returning custom isolated error immediately upon fail
        if not validate_fayda_id(fayda_id):
            return Response({"error": "Invalid Fayda ID"}, status=status.HTTP_400_BAD_REQUEST)
            
        serializer = MaidProfileSerializer(data=request.data)
        if serializer.is_valid():
            # Inject relation object directly passing token identity to Maid relation
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
