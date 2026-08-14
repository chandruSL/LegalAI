import os
import google.generativeai as genai
from pypdf import PdfReader
from dotenv import load_dotenv

load_dotenv()

# Configure API Key
API_KEY = os.getenv("GOOGLE_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)

model_name = os.getenv("GEMINI_MODEL", "gemini-pro")
model = genai.GenerativeModel(model_name)

def get_legal_chat_response(prompt: str) -> str:
    if not API_KEY:
        return "Error: GOOGLE_API_KEY not found."
    
    # System prompt to restrict domain
    system_instruction = (
        "You are a helpful Legal Assistant for Indian Law. "
        "You must ONLY answer binding questions related to Indian Law. "
        "If a user asks about anything else (cooking, sports, general coding), politely decline. "
        "Do not provide binding legal advice, only informational guidance. "
        "Always add a disclaimer that this is not legal advice. "
        "IMPORTANT: Do not quote long legal statutes or acts verbatim as it may trigger copyright filters. "
        "Instead, summarize the law and explain the concepts in your own words."
    )
    
    full_prompt = f"{system_instruction}\n\nUser Query: {prompt}\nAnswer:"
    
    try:
        response = model.generate_content(full_prompt)
        # Check if the response was blocked
        if response.candidates and response.candidates[0].finish_reason == 4: # RECITATION
            return "I cannot provide a direct quote of this law due to copyright restrictions. Please ask me to summarize or explain the law instead."
        
        return response.text
    except Exception as e:
        # Fallback for other safety filters
        if "response.text" in str(e):
             return "I cannot answer this query due to safety or copyright filters. Please rephrase your question."
        return f"AI Error: {str(e)}"

def extract_text_from_pdf(pdf_path: str) -> str:
    try:
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        return ""

def predict_case_outcome(pdf_path: str) -> str:
    if not API_KEY:
        return "Error: GOOGLE_API_KEY not found."
    
    case_text = extract_text_from_pdf(pdf_path)
    if not case_text:
        return "Error: Could not extract text from document."
    
    # Truncate text if too long (simple approach for prototype)
    # Gemini Pro has ~30k token limit, so ~100k chars is usually fine.
    if len(case_text) > 100000:
        case_text = case_text[:100000]
    
    prompt = (
        "Analyze the following legal case document text. "
        "Based on the facts, precedents, and arguments present (or implied), "
        "predict the likely outcome (Win Probability) for the relevant party. "
        "Provide a summary of the case and the reasoning for your prediction. "
        "Strictly state this is an AI-generated advisory opinion.\n\n"
        f"Case Text:\n{case_text}"
    )
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"AI Error: {str(e)}"
