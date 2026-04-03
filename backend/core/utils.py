"""
Verhoeff algorithm implementation for validating Fayda IDs.
"""

# The multiplication table D
# Determines the result of applying the mathematical operation between two numbers.
D = (
    (0, 1, 2, 3, 4, 5, 6, 7, 8, 9),
    (1, 2, 3, 4, 0, 6, 7, 8, 9, 5),
    (2, 3, 4, 0, 1, 7, 8, 9, 5, 6),
    (3, 4, 0, 1, 2, 8, 9, 5, 6, 7),
    (4, 0, 1, 2, 3, 9, 5, 6, 7, 8),
    (5, 9, 8, 7, 6, 0, 4, 3, 2, 1),
    (6, 5, 9, 8, 7, 1, 0, 4, 3, 2),
    (7, 6, 5, 9, 8, 2, 1, 0, 4, 3),
    (8, 7, 6, 5, 9, 3, 2, 1, 0, 4),
    (9, 8, 7, 6, 5, 4, 3, 2, 1, 0),
)

# The permutation table P
# Apples a permutation to a digit based on its position in the number (right-to-left).
P = (
    (0, 1, 2, 3, 4, 5, 6, 7, 8, 9),
    (1, 5, 7, 6, 2, 8, 3, 0, 9, 4),
    (5, 8, 0, 3, 7, 9, 6, 1, 4, 2),
    (8, 9, 1, 6, 0, 4, 3, 5, 2, 7),
    (9, 4, 5, 3, 1, 2, 6, 8, 7, 0),
    (4, 2, 8, 6, 5, 7, 3, 9, 0, 1),
    (2, 7, 9, 3, 8, 0, 6, 4, 1, 5),
    (7, 0, 4, 6, 9, 1, 3, 2, 5, 8),
)

# The inverse table INV
# Used when generating a Verhoeff checksum. Maps numbers to their inverse values.
INV = (0, 4, 3, 2, 1, 5, 6, 7, 8, 9)

def validate_fayda_id(fayda_id: str) -> bool:
    """
    Validates a Fayda ID using the Verhoeff algorithm.
    Requirements: Must be exactly 12 digits and successfully satisfy the Verhoeff checksum.
    """
    if not isinstance(fayda_id, str):
        return False
    
    # Validation constraint: Fayda ID must be exactly 12 digits
    if len(fayda_id) != 12 or not fayda_id.isdigit():
        return False
    
    c = 0
    # Verhoeff algorithm operates dynamically from right to left
    reversed_id = list(map(int, reversed(fayda_id)))
    
    # Process check logic combining our permutation and multiplication dictionaries
    for i, n in enumerate(reversed_id):
        # Apply multiplication using the permutated digit
        c = D[c][P[i % 8][n]]
        
    return c == 0

import google.generativeai as genai
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def generate_ai_response(prompt: str) -> str:
    """
    Generates an AI response using Google's generative models.
    Specifically configured to use gemini-1.5-flash for rapid reasoning tasks 
    like AI matching algorithms and Contract generation.
    """
    # 1. Load the GEMINI_API_KEY implicitly from the securely loaded settings variables 
    # (populated earlier via .env)
    api_key = settings.GEMINI_API_KEY
    if not api_key or api_key == 'your-gemini-api-key-here':
        logger.error("Gemini API Key is missing or invalid.")
        return "Error: Gemini API setup is incomplete."
    
    # 2. Configure the google-generativeai module with the recovered key
    genai.configure(api_key=api_key)
    
    # 3. Instantiate the specifically requested 'gemini-1.5-flash' lightning-fast model
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # 4. Execute the generation utilizing the user prompts synchronously
        response = model.generate_content(prompt)
        
        # 5. Native returns to the caller as raw string text
        return response.text
    except Exception as e:
        logger.error(f"Failed to generate response: {e}")
        return f"Warning: AI service communication failure - {str(e)}"
