import os
from django.conf import settings
from .models import Product, Order, Category

# Try to import the new Google Generative AI package
try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False
    print("Google Generative AI package not available")

# Configure Gemini
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

class AIService:
    """AI Service using Google Gemini for chatbot and recommendations"""
    
    def __init__(self):
        self.client = None
        if GEMINI_API_KEY and GEMINI_API_KEY != 'your_gemini_api_key_here' and GENAI_AVAILABLE:
            try:
                # Initialize the new client
                self.client = genai.Client(api_key=GEMINI_API_KEY)
                print("✓ Gemini client initialized successfully")
            except Exception as e:
                print(f"Error initializing Gemini: {e}")
    
    def get_chatbot_response(self, user_message, context=None, stream=False):
        """
        Get chatbot response for customer support
        """
        if not self.client:
            if stream:
                yield {
                    'response': 'AI service is not configured. Please add your Gemini API key to the .env file.',
                    'error': True,
                    'done': True
                }
            else:
                return {
                    'response': 'AI service is not configured. Please add your Gemini API key to the .env file.',
                    'error': True
                }
            return
        
        try:
            # Build context about the store
            store_context = """
            You are a helpful customer support assistant for Zymerce, an e-commerce platform.
            We sell electronics, headphones, furniture, and beauty products.
            All prices are in Indian Rupees (₹).
            
            Available product categories:
            - Electronics
            - Headphones
            - Furniture
            - Beauty Products
            
            You can help customers with:
            - Product information and recommendations
            - Order tracking and status
            - Return and refund policies
            - Shipping information
            - Payment methods
            
            Our policies:
            - Free delivery on all orders
            - 30-day return policy
            - Cash on Delivery (COD) available
            - Multiple payment options including UPI, Cards, Net Banking
            
            Be friendly, helpful, and concise in your responses.
            """
            
            # Add user context if available
            if context:
                store_context += f"\n\nUser context: {context}"
            
            # Generate response using new API
            prompt = f"{store_context}\n\nCustomer: {user_message}\n\nAssistant:"
            
            if stream:
                # Stream the response
                response_stream = self.client.models.generate_content_stream(
                    model='gemini-2.5-flash',
                    contents=prompt
                )
                
                for chunk in response_stream:
                    if chunk.text:
                        yield {
                            'response': chunk.text,
                            'error': False,
                            'done': False
                        }
                
                # Send done signal
                yield {
                    'response': '',
                    'error': False,
                    'done': True
                }
            else:
                response = self.client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt
                )
                
                return {
                    'response': response.text,
                    'error': False
                }
        except Exception as e:
            error_msg = f'Sorry, I encountered an error: {str(e)}'
            if stream:
                yield {
                    'response': error_msg,
                    'error': True,
                    'done': True
                }
            else:
                return {
                    'response': error_msg,
                    'error': True
                }
    
    def get_product_recommendations(self, product_id=None, user_id=None, limit=4):
        """
        Get AI-powered product recommendations
        """
        try:
            products = Product.objects.filter(is_available=True)
            
            if product_id:
                # Get similar products based on category
                try:
                    current_product = Product.objects.get(id=product_id)
                    similar_products = products.filter(
                        category=current_product.category
                    ).exclude(id=product_id)[:limit]
                    return list(similar_products)
                except Product.DoesNotExist:
                    pass
            
            # Return popular products (by review count and rating)
            popular_products = products.order_by('-created_at')[:limit]
            return list(popular_products)
            
        except Exception as e:
            print(f"Error getting recommendations: {e}")
            return []
    
    def generate_product_description(self, product_name, category):
        """
        Generate AI-powered product description
        """
        if not self.client:
            return "AI description generation not available. Please configure Gemini API key."
        
        try:
            prompt = f"""
            Generate a compelling, SEO-friendly product description for an e-commerce listing.
            
            Product Name: {product_name}
            Category: {category}
            
            Requirements:
            - 2-3 sentences
            - Highlight key features and benefits
            - Professional and engaging tone
            - Include relevant keywords
            """
            
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt
            )
            return response.text.strip()
        except Exception as e:
            return f"Error generating description: {str(e)}"
    
    def analyze_product_reviews(self, product_id):
        """
        Analyze product reviews and generate insights
        """
        if not self.client:
            return "Review analysis not available. Please configure Gemini API key."
        
        try:
            from .models import Review
            reviews = Review.objects.filter(product_id=product_id)
            
            if not reviews.exists():
                return "No reviews available for analysis."
            
            # Compile reviews
            review_text = "\n".join([
                f"Rating: {r.rating}/5 - {r.comment}" 
                for r in reviews[:10]  # Limit to 10 reviews
            ])
            
            prompt = f"""
            Analyze these product reviews and provide a brief summary:
            
            {review_text}
            
            Provide:
            1. Overall sentiment (positive/negative/mixed)
            2. Key strengths mentioned
            3. Common concerns (if any)
            
            Keep it concise (3-4 sentences).
            """
            
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt
            )
            return response.text.strip()
        except Exception as e:
            return f"Error analyzing reviews: {str(e)}"
    
    def smart_search(self, query):
        """
        AI-powered smart search with natural language understanding
        """
        try:
            # Simple keyword-based search for now
            products = Product.objects.filter(
                name__icontains=query
            ) | Product.objects.filter(
                description__icontains=query
            ) | Product.objects.filter(
                category__name__icontains=query
            )
            
            return products.distinct()[:10]
        except Exception as e:
            print(f"Error in smart search: {e}")
            return Product.objects.none()

# Singleton instance
ai_service = AIService()
