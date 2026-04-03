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
from django.shortcuts import get_object_or_404
from .utils import validate_fayda_id
from .serializers import MaidProfileSerializer, JobPostingSerializer
from .models import JobPosting

# 3. Maid Profile View
class MaidProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        fayda_id = request.data.get('fayda_id', '')
        
        # Validates Fayda ID using Verhoeff algorithm we safely built earlier
        if not validate_fayda_id(fayda_id):
            return Response({"error": "Invalid Fayda ID"}, status=status.HTTP_400_BAD_REQUEST)
            
        serializer = MaidProfileSerializer(data=request.data)
        if serializer.is_valid():
            # Support 'created_by' for Agent usage natively!
            # If the person sending this token is an agent, attribute them as the creator
            if request.user.role == 'agent':
                serializer.save(created_by=request.user)
            else:
                serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 4. Job Posting Views
class JobPostingView(APIView):
    # Assuming job creation requires a token
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = JobPostingSerializer(data=request.data)
        if serializer.is_valid():
            # Save job posting to DB cleanly
            serializer.save()
            return Response(
                {"message": "Job posting saved successfully", "job": serializer.data}, 
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class JobPostingDetailView(APIView):
    # Unlocked so jobs can be fetched universally
    permission_classes = [] 

    def get(self, request, pk):
        # Gracefully handle 404s cleanly via Django native mapping
        job = get_object_or_404(JobPosting, pk=pk)
        serializer = JobPostingSerializer(job)
        return Response(serializer.data, status=status.HTTP_200_OK)


from .utils import generate_ai_response
import json
from .models import MaidProfile

# 5. AI Engine Endpoints

class MatchMaidsView(APIView):
    """
    Uses Gemini AI to contextually match available maids to a specific job requirement.
    Changed to GET to appropriately represent fetching data without mutation. 
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Extract ID from the URL Query params gracefully (e.g. ?job_id=1)
        job_id = request.query_params.get('job_id')
        if not job_id:
            return Response({"error": "Must provide job_id as a query parameter"}, status=status.HTTP_400_BAD_REQUEST)
            
        job = get_object_or_404(JobPosting, pk=job_id)
        
        # Load maids from the DB. 
        # (Optional production upgrade: pre-filter `maids.filter(location=job.location)` to conserve AI token limits)
        maids = MaidProfile.objects.all()
        if not maids.exists():
             return Response({"matches": []}, status=status.HTTP_200_OK)

        maid_data = []
        for m in maids:
            maid_data.append(f"ID {m.id}: Skills {m.skills}, Salary {m.salary}, Location {m.location}")
            
        maid_list_str = "\n".join(maid_data)
        
        # Explicit Prompting structure strictly requested by cursor prompt criteria
        prompt = f"""
        You are an AI that ranks domestic workers based on employer requirements. 
        Return JSON array [{{ "maid_id": id, "score": score }}], sorted descending.
        
        Job Requirement: Skills: {job.required_skills}, Salary: {job.salary}, Location: {job.location}
        
        Available Maids:
        {maid_list_str}
        
        Evaluate the available maids against the job constraints based on exact skill matches, salary feasibility, and location proximity.
        Output exclusively valid JSON. Do not write text outside of the JSON array.
        """
        
        response_text = generate_ai_response(prompt)
        
        try:
            # Clean markdown artifacts securely
            clean_json = response_text.replace('```json', '').replace('```', '').strip()
            matches = json.loads(clean_json)
            return Response(matches, status=status.HTTP_200_OK)
        except json.JSONDecodeError:
             # Fall back to raw text payload if AI diverges into string dialogue
            return Response({"response_raw": response_text}, status=status.HTTP_200_OK)


class GenerateContractView(APIView):
    """
    Auto-generates a robust legal draft contract instantly merging AI formatting with db constants.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # 1. Capture dynamic inputs safely
        job_id = request.data.get('job_id')
        maid_id = request.data.get('maid_id')
        employer_id = request.data.get('employer_id')
        extra_fields = request.data.get('extra_fields', '')
        
        if not all([job_id, maid_id, employer_id]):
             return Response({"error": "job_id, maid_id, and employer_id require explicit mapping."}, status=status.HTTP_400_BAD_REQUEST)
             
        # 2. Fetch required nodes from database safely returning 404 cleanly on miss
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        job = get_object_or_404(JobPosting, pk=job_id)
        maid = get_object_or_404(MaidProfile, pk=maid_id)
        employer = get_object_or_404(User, pk=employer_id)
        
        # 3. Construct the bilingual prompt requested natively for Gemini
        prompt = f"""
        Generate bilingual contract (Amharic + English) based on maid, employer, and job info.
        
        Information:
        Employer Name: {employer.name}
        Maid Name: {maid.user.name} (Fayda ID: {maid.fayda_id})
        Job Duties: {job.required_skills}
        Monthly Salary: {job.salary} birr
        Working Location: {job.location}
        Special Conditions: {extra_fields}
        
        Ensure the contract is incredibly professional, strictly highlights duties, covers liability concisely, 
        and concludes with signature lines for exactly these two named parties. Output strictly valid JSON with 
        NO surrounding markdown like ```json.
        
        Output Structure:
        {{
            "contract_am": "Amharic version of the contract string...",
            "contract_en": "English version of the contract string..."
        }}
        """
        
        response_text = generate_ai_response(prompt)
        
        try:
            # Clean markdown artifacts securely ensuring valid JSON serialization natively
            clean_json = response_text.replace('```json', '').replace('```', '').strip()
            contract_json = json.loads(clean_json)
            return Response(contract_json, status=status.HTTP_200_OK)
        except json.JSONDecodeError:
            # Fall back to raw text payload if AI diverges into string dialogue
            return Response({"error": "AI response was not proper JSON", "raw_payload": response_text}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
