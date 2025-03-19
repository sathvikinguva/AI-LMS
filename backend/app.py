from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import logging
import traceback
import requests

# Import aixplain SDK
from aixplain.factories import PipelineFactory

# Configure logging
logging.basicConfig(level=logging.DEBUG, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {
    "origins": "*",
    "methods": ["GET", "POST", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"],
    "expose_headers": ["Content-Type", "Content-Length"]
}})

# Get environment variables
ACCESS_KEY = os.getenv('AIXPLAIN_ACCESS_KEY')
PIPELINE_ID = "67d8f0fa8e9326b58bc21c3c"  # The pipeline ID from your code snippet

# Initialize the pipeline object
try:
    # Set the access key for aixplain SDK
    os.environ["AIXPLAIN_API_KEY"] = ACCESS_KEY
    
    # Get the pipeline
    pipeline = PipelineFactory.get(PIPELINE_ID)
    logger.info(f"Successfully loaded pipeline: {pipeline.name}")
    
    # Log available methods for debugging
    logger.info(f"Available pipeline methods: {[method for method in dir(pipeline) if not method.startswith('_')]}")
except Exception as e:
    logger.error(f"Failed to initialize pipeline: {str(e)}")
    pipeline = None

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        # Check if pipeline was initialized
        if pipeline is None:
            logger.error("Pipeline not initialized")
            return jsonify({
                "response": "Sorry, the AI service is not configured properly. Please try again later."
            }), 500
            
        # Get request data
        data = request.json
        if not data or 'text' not in data:
            logger.warning("Missing 'text' in request body")
            return jsonify({"error": "Missing 'text' in request body"}), 400
        
        user_query = data['text']
        logger.info(f"Processing query: {user_query}")
        
        # Test endpoint for quick debugging
        if user_query.lower() == "test":
            logger.info("Test query detected, returning hardcoded response")
            return jsonify({"response": "This is a test response from the backend."})

        # Process the query using the aixplain pipeline
        try:
            logger.info(f"Running pipeline for query: {user_query}")
            
            # Use the correct format for the pipeline input - "Input 1" instead of "text"
            result = pipeline.run({"Input 1": user_query})
            
            logger.info(f"Pipeline execution completed. Result type: {type(result)}")
            logger.info(f"Result: {result}")
            
            # Extract the text response from the URL
            if isinstance(result, dict) and "data" in result:
                try:
                    data_items = result.get("data", [])
                    if data_items and isinstance(data_items, list) and len(data_items) > 0:
                        data_item = data_items[0]
                        segments = data_item.get("segments", [])
                        if segments and isinstance(segments, list) and len(segments) > 0:
                            segment = segments[0]
                            if "response" in segment and segment.get("is_url"):
                                text_url = segment["response"]
                                logger.info(f"Fetching text from URL: {text_url}")
                                
                                # Fetch the text content from the URL
                                text_response = requests.get(text_url)
                                if text_response.ok:
                                    return jsonify({"response": text_response.text})
                                else:
                                    logger.error(f"Failed to fetch text from URL: {text_response.status_code}")
                                    return jsonify({"response": "Failed to fetch the response text."})
                except Exception as extract_error:
                    logger.error(f"Error extracting text response: {str(extract_error)}")
                    logger.error(traceback.format_exc())
            
            # If no URL found, process as text response
            if isinstance(result, str):
                ai_response = result
            elif isinstance(result, dict):
                # Try to find the text response in common fields
                ai_response = None
                for key in ['response', 'output', 'result', 'text', 'content', 'generated_text']:
                    if key in result and isinstance(result[key], str):
                        ai_response = result[key]
                        break
                
                # If still no response found, use the whole result
                if not ai_response:
                    ai_response = str(result)
            else:
                # For any other type, convert to string
                ai_response = str(result)
                
            logger.info(f"Final text response: {ai_response[:100]}...")
            return jsonify({"response": ai_response})
            
        except Exception as e:
            logger.error(f"Error during pipeline execution: {str(e)}")
            logger.error(traceback.format_exc())
            
            # Fall back to direct API approach
            logger.info("Falling back to direct API approach after SDK error")
            return use_direct_api(user_query)
            
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            "response": "An unexpected error occurred on the server. Please try again later."
        }), 500

def use_direct_api(query):
    """Fallback function that uses direct API calls instead of the SDK"""
    import requests
    import json
    
    try:
        api_url = f"https://platform-api.aixplain.com/assets/pipeline/execution/run/{PIPELINE_ID}"
        logger.info(f"Making direct API call to: {api_url}")
        
        # Use the correct input format - "Input 1" instead of "text"
        response = requests.post(
            api_url,
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {ACCESS_KEY}'
            },
            json={"Input 1": query}
        )
        
        if not response.ok:
            logger.error(f"Direct API error: {response.status_code}")
            return jsonify({
                "response": "Sorry, I couldn't process your request. There was an API error."
            })
        
        # Handle async responses
        result = response.json()
        logger.info(f"Initial API response: {json.dumps(result, indent=2)[:500]}...")
        
        if "url" in result and "status" in result and result["status"] == "IN_PROGRESS":
            status_url = result["url"]
            logger.info(f"Processing asynchronously. Polling URL: {status_url}")
            
            # Poll for completion (up to 20 seconds)
            max_attempts = 10
            for attempt in range(max_attempts):
                logger.info(f"Polling attempt {attempt+1}/{max_attempts}")
                
                time.sleep(2)  # Wait 2 seconds between polls
                
                poll_response = requests.get(
                    status_url,
                    headers={'Authorization': f'Bearer {ACCESS_KEY}'}
                )
                
                if not poll_response.ok:
                    logger.error(f"Polling error: {poll_response.status_code}")
                    continue
                    
                poll_result = poll_response.json()
                logger.info(f"Poll result: {json.dumps(poll_result, indent=2)[:500]}...")
                
                if "status" in poll_result and poll_result["status"] == "SUCCESS":
                    logger.info("Processing completed")
                    
                    # Extract the text response from the completed response
                    try:
                        # Navigate the complex response structure
                        if "data" in poll_result and isinstance(poll_result["data"], list) and len(poll_result["data"]) > 0:
                            data_item = poll_result["data"][0]
                            if "segments" in data_item and isinstance(data_item["segments"], list) and len(data_item["segments"]) > 0:
                                segment = data_item["segments"][0]
                                if "response" in segment and isinstance(segment["response"], str):
                                    # Found a text response
                                    text_response = segment["response"]
                                    logger.info(f"Found text response: {text_response[:100]}...")
                                    return jsonify({
                                        "response": text_response
                                    })
                    except Exception as extract_error:
                        logger.error(f"Error extracting text response: {str(extract_error)}")
                    
                    # If we can't find a specific text response, return a generic response
                    return jsonify({
                        "response": "I processed your request, but couldn't extract the text response."
                    })
                
                elif "status" in poll_result and poll_result["status"] != "IN_PROGRESS":
                    # Some other status (ERROR, etc.)
                    logger.error(f"Processing failed with status: {poll_result.get('status')}")
                    break
            
            # If we exit the loop, polling timed out
            return jsonify({
                "response": "Your request is taking longer than expected. Please try again later."
            })
            
        # For immediate responses (unlikely with this API)
        logger.info("Got immediate response (unusual)")
        return jsonify({
            "response": "I received a response from the AI service, but it wasn't in the expected format."
        })
        
    except Exception as e:
        logger.error(f"Error in direct API approach: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            "response": "Sorry, I encountered an error while processing your request."
        })

@app.route('/api/ping', methods=['GET'])
def ping():
    """Simple endpoint to check if the service is running"""
    return jsonify({
        "status": "ok", 
        "pipeline_initialized": pipeline is not None,
        "pipeline_name": pipeline.name if pipeline else "Not initialized",
        "methods": [m for m in dir(pipeline) if not m.startswith('_')] if pipeline else []
    })

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(debug=True, host='0.0.0.0', port=port)