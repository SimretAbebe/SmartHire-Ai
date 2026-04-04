import logging
import json
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny

from .serializers import RegisterSerializer, LoginSerializer, MaidProfileSerializer, JobPostingSerializer
from .utils import validate_fayda_id, generate_ai_response
from .models import JobPosting, MaidProfile

# Initialize explicit logging to safely catch errors instead of crashing natively
logger = logging.getLogger(__name__)
User = get_user_model()

# ==========================================
# 1. Registration View
# ==========================================
class RegisterView(APIView):
    """
    Handles user signup securely bypassing token requirements globally.
    """
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        try:
            logger.info("Incoming registration request.")
            serializer = RegisterSerializer(data=request.data)
            
            if serializer.is_valid():
                serializer.save()
                logger.info("Registration successful.")
                # Consistent JSON formatting targeting UI consumption
                return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)
            
            logger.warning(f"Registration validation failed: {serializer.errors}")
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"RegisterView Exception: {e}", exc_info=True)
            return Response({"error": "An internal server error occurred during registration."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ==========================================
# 2. Login View
# ==========================================
class LoginView(APIView):
    """
    Generates and returns stateless API tokens seamlessly for authentication.
    """
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        try:
            logger.info("Incoming login request.")
            serializer = LoginSerializer(data=request.data, context={'request': request})
            
            if serializer.is_valid():
                user = serializer.validated_data['user']
                # Create or fetch existing auth token tied to User securely
                token, created = Token.objects.get_or_create(user=user)
                
                logger.info(f"User {user.phone} logged in consistently.")
                return Response({
                    "token": token.key,
                    "role": user.role,
                    "name": user.name
                }, status=status.HTTP_200_OK)
                
            logger.warning(f"Login failure constraints: {serializer.errors}")
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"LoginView Exception: {e}", exc_info=True)
            return Response({"error": "An internal error occurred while logging in."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ==========================================
# 3. Maid Profile View
# ==========================================
class MaidProfileView(APIView):
    """
    Allows tracking Maid profiles gracefully. Binds the creator mapping correctly!
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            fayda_id = request.data.get('fayda_id', '')
            
            # Verhoeff mathematical checksum isolation
            if not validate_fayda_id(fayda_id):
                logger.warning("Fayda ID algorithm failed validation.")
                return Response({"error": "Invalid Fayda ID"}, status=status.HTTP_400_BAD_REQUEST)
                
            serializer = MaidProfileSerializer(data=request.data)
            if serializer.is_valid():
                # Conditionally bind logic mapping agents if applied loosely
                if request.user.role == 'agent':
                    serializer.save(created_by=request.user)
                else:
                    serializer.save()
                
                logger.info("Maid Profile successfully compiled.")
                return Response({"message": "Profile created successfully.", "data": serializer.data}, status=status.HTTP_201_CREATED)
                
            logger.warning(f"MaidProfile schema errors: {serializer.errors}")
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"MaidProfileView Exception: {e}", exc_info=True)
            return Response({"error": "Failed to create maid profile due to internal error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ==========================================
# 4. Job Posting Views
# ==========================================
class JobPostingView(APIView):
    """
    Manages job posting lifecycle cleanly.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            serializer = JobPostingSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                logger.info("Job successfully listed.")
                return Response(
                    {"message": "Job posting saved successfully", "job": serializer.data}, 
                    status=status.HTTP_201_CREATED
                )
                
            logger.warning(f"Job creation invalid payloads: {serializer.errors}")
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
             logger.error(f"JobPostingView Exception: {e}", exc_info=True)
             return Response({"error": "Internal error occurred generating job."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class JobPostingDetailView(APIView):
    """
    Fetches job details explicitly natively ignoring permissions.
    """
    permission_classes = [] 

    def get(self, request, pk):
        try:
            # Handles Native DB Mapping securely bypassing boilerplate 404 setup
            job = get_object_or_404(JobPosting, pk=pk)
            serializer = JobPostingSerializer(job)
            return Response({"data": serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
             logger.error(f"Job Fetch Failure: {e}", exc_info=True)
             # NOTE: 404 from get_object_or_404 is natively managed by Django, this catches larger DB corruptions
             return Response({"error": "Job fetch crashed unpredictably"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ==========================================
# 5. AI Engine Endpoints
# ==========================================

class MatchMaidsView(APIView):
    """
    Uses Gemini AI to evaluate array mappings based on strict structural inputs securely.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            job_id = request.query_params.get('job_id')
            if not job_id:
                logger.warning("MatchMaidsView missing job_id parameter")
                return Response({"error": "Must provide job_id as a query parameter"}, status=status.HTTP_400_BAD_REQUEST)
                
            job = get_object_or_404(JobPosting, pk=job_id)
            
            # Fetch maids context natively
            maids = MaidProfile.objects.all()
            if not maids.exists():
                 logger.info("Match request triggered but no maids exist natively.")
                 return Response({"matches": []}, status=status.HTTP_200_OK)

            maid_data = []
            for m in maids:
                maid_data.append(f"ID {m.id}: Skills {m.skills}, Salary {m.salary}, Location {m.location}")
                
            maid_list_str = "\n".join(maid_data)
            
            prompt = f"""
            You are an AI that ranks domestic workers based on employer requirements. 
            Return JSON array [{{"maid_id": id, "score": score}}], sorted descending.
            
            Job Requirement: Skills: {job.required_skills}, Salary: {job.salary}, Location: {job.location}
            
            Available Maids:
            {maid_list_str}
            
            Evaluate the available maids against the job constraints based on exact skill matches, salary feasibility, and location proximity.
            Output exclusively valid JSON. Do not write text outside of the JSON array.
            """
            
            logger.info("Sending Job string arrays to Gemini securely")
            response_text = generate_ai_response(prompt)
            
            try:
                # String substitution strips markdown format boundaries generated globally
                clean_json = response_text.replace('```json', '').replace('```', '').strip()
                matches = json.loads(clean_json)
                return Response({"matches": matches}, status=status.HTTP_200_OK)
            except json.JSONDecodeError:
                logger.error(f"Gemini returned non-JSON native block: {response_text}")
                return Response({"error": "AI failed to format JSON", "response_raw": response_text}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            logger.error(f"MatchMaidsView engine error securely caught: {e}", exc_info=True)
            return Response({"error": "AI Match execution disrupted natively."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GenerateContractView(APIView):
    """
    Merges employer constraints and maid stats cleanly into string prompts for Gemini payload routing.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            job_id = request.data.get('job_id')
            maid_id = request.data.get('maid_id')
            employer_id = request.data.get('employer_id')
            extra_fields = request.data.get('extra_fields', '')
            
            # Explicit constraint checks dynamically
            if not all([job_id, maid_id, employer_id]):
                 logger.warning("GenerateContract missing necessary keys dynamically")
                 return Response({"error": "job_id, maid_id, and employer_id are rigorously required keys."}, status=status.HTTP_400_BAD_REQUEST)
                 
            job = get_object_or_404(JobPosting, pk=job_id)
            maid = get_object_or_404(MaidProfile, pk=maid_id)
            employer = get_object_or_404(User, pk=employer_id)
            
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
            
            logger.info("Executing Contract Draft ping payload")
            response_text = generate_ai_response(prompt)
            
            try:
                # Bypass text decoding strings cleanly isolating JSON mappings
                clean_json = response_text.replace('```json', '').replace('```', '').strip()
                contract_json = json.loads(clean_json)
                return Response(contract_json, status=status.HTTP_200_OK)
            except json.JSONDecodeError:
                logger.error(f"Gemini output invalid JSON dictionary map: {response_text}")
                return Response({"error": "AI response was not proper JSON", "raw_payload": response_text}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            logger.error(f"GenerateContractView failed fatally: {e}", exc_info=True)
            return Response({"error": "Contract formatting generation crashed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
