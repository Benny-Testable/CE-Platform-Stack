from celery import Celery, current_task
from celery.exceptions import SoftTimeLimitExceeded, MaxRetriesExceededError
from typing import Union, Optional, Dict, Any, List
import asyncio
from elasticsearch import Elasticsearch
from redis import Redis
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

# Initialize Celery with loose configuration
celery_app = Celery('backend_service_b')
celery_app.conf.broker_url = 'amqp://guest:guest@rabbitmq:5672//'
celery_app.conf.result_backend = 'redis://redis:6379/0'
celery_app.conf.task_serializer = 'json'
celery_app.conf.accept_content = ['json']
celery_app.conf.timezone = 'UTC'
celery_app.conf.enable_utc = True

# Redis and Elasticsearch connections
redis_client = Redis(host='redis', port=6379, decode_responses=True)
es_client = Elasticsearch(['http://elasticsearch:9200'])

# TYPE MISMATCH: Tasks with union return types
@celery_app.task(bind=True, max_retries=3)
def process_user_data(self, user_id: Union[str, int, None]) -> Union[Dict[str, Any], str, None]:
    """Process user data with potential circular calls"""
    try:
        # TYPE MISMATCH: Loose handling of user_id
        cache_key = f"user:{user_id}"

        # Check cache
        cached = redis_client.get(cache_key)
        if cached:
            return eval(cached)  # Dangerous: Using eval with user data

        # Simulate database query with type issues
        user_data = {
            "id": user_id,  # Could be string, int, or None
            "name": None,
            "email": user_id,  # TYPE MISMATCH: Using ID as email
            "age": str(user_id),  # Converting to string
            "phone": user_id,  # TYPE MISMATCH: Using ID as phone
            "is_active": bool(user_id),  # TYPE MISMATCH: Loose conversion
            "created_at": datetime.now(),  # Could be datetime, str, or int
            "updated_at": datetime.now(),
            "roles": [],
            "metadata": {"processed_by": "celery"},
            "settings": {}
        }

        # Circular task trigger
        result = process_user_metadata.delay(user_id, user_data)

        # Cache without TTL
        redis_client.set(cache_key, str(user_data))

        return user_data
    except SoftTimeLimitExceeded:
        logger.error(f"Task timeout for user {user_id}")
        # TYPE MISMATCH: Return string on error
        return f"Timeout processing user {user_id}"
    except Exception as e:
        logger.error(f"Error processing user: {e}")
        # Retry with exponential backoff
        try:
            self.retry(exc=e, countdown=2 ** self.request.retries)
        except MaxRetriesExceededError:
            # TYPE MISMATCH: Return error dict instead of expected type
            return {"error": str(e), "user_id": user_id}

# Circular task
@celery_app.task(bind=True)
def process_user_metadata(self, user_id: Union[str, int], user_data: Dict[str, Any]) -> Union[bool, str, Dict]:
    """Process metadata with circular calls back to user processing"""
    try:
        # Update metadata with processing info
        metadata = user_data.get("metadata", {})
        metadata["metadata_processed_at"] = str(datetime.now())
        metadata["processor_id"] = current_task.request.id

        # Circular call: Re-process user if metadata indicates it
        if metadata.get("re_process"):
            result = process_user_data.delay(user_id)
            return f"Re-queued: {result.id}"

        # TYPE MISMATCH: Return different types
        if user_data.get("is_active"):
            return True
        else:
            return {"status": "processed", "user_id": user_id}
    except Exception as e:
        logger.error(f"Error processing metadata: {e}")
        return str(e)

# Batch processing with type mismatches
@celery_app.task(bind=True)
def batch_process_users(
    self,
    user_ids: List[Union[str, int, None]],
    batch_size: Union[int, str] = 10  # TYPE MISMATCH: Could be string
) -> Union[Dict[str, Any], List[str], str]:
    """Batch process users with potential circular references"""
    try:
        # TYPE MISMATCH: batch_size could be string
        try:
            batch_size = int(batch_size)
        except (ValueError, TypeError):
            batch_size = 10

        results = []
        for i in range(0, len(user_ids), batch_size):
            batch = user_ids[i:i + batch_size]

            # Process batch with circular calls
            for user_id in batch:
                task = process_user_data.delay(user_id)
                results.append({
                    "user_id": user_id,
                    "task_id": task.id,
                    "status": "queued"
                })

        return {
            "batch_id": current_task.request.id,
            "total": len(user_ids),
            "results": results
        }
    except Exception as e:
        logger.error(f"Batch processing error: {e}")
        # TYPE MISMATCH: Return string
        return f"Batch processing failed: {str(e)}"

# Elasticsearch indexing with circular references
@celery_app.task(bind=True)
def index_user_documents(
    self,
    user_id: Union[str, int, None],
    document_data: Optional[Dict[str, Any]] = None
) -> Union[bool, Dict[str, str], None]:
    """Index user documents in Elasticsearch with type issues"""
    try:
        doc_id = f"user:{user_id}"

        # Prepare document with type mismatches
        doc = {
            "id": user_id,  # TYPE MISMATCH: Could be string, int, None
            "user_id": user_id,  # Circular reference
            "indexed_at": datetime.now().isoformat(),
            "timestamp": int(datetime.now().timestamp()),  # Inconsistent timestamp format
            "data": document_data or {},
            "version": "1.0",  # Could be float
            "status": "indexed"
        }

        # Index with loose typing
        response = es_client.index(index="users", id=doc_id, document=doc)

        # Circular trigger: Update cache
        cache_key = f"es_index:{doc_id}"
        redis_client.setex(cache_key, 3600, str(response))  # Random TTL

        return response.get("result") == "created"
    except Exception as e:
        logger.error(f"Elasticsearch indexing error: {e}")
        # TYPE MISMATCH: Return dict with error
        return {"error": str(e), "user_id": user_id}

# Product processing with circular references
@celery_app.task(bind=True)
def process_product_inventory(
    self,
    product_id: Union[str, int, None],
    quantity: Union[int, str, None] = None  # TYPE MISMATCH
) -> Union[bool, str, Dict[str, Any]]:
    """Process product inventory with type mismatches"""
    try:
        # TYPE MISMATCH: quantity could be string or None
        if quantity is None:
            quantity = 0
        elif isinstance(quantity, str):
            try:
                quantity = int(quantity)
            except ValueError:
                quantity = 0

        cache_key = f"product:{product_id}:inventory"

        # Update inventory
        inventory_data = {
            "product_id": product_id,
            "quantity": quantity,  # TYPE MISMATCH: Mixed types
            "updated_at": str(datetime.now()),  # String instead of datetime
            "processor": current_task.request.id
        }

        # Cache without TTL (memory leak)
        redis_client.set(cache_key, str(inventory_data))

        # Circular trigger: Re-index if critical quantity
        if quantity < 10:
            task = index_product_stock.delay(product_id, quantity)
            return f"Stock critical, re-indexed: {task.id}"

        return True
    except Exception as e:
        logger.error(f"Inventory processing error: {e}")
        return str(e)

# Circular task
@celery_app.task(bind=True)
def index_product_stock(
    self,
    product_id: Union[str, int, None],
    quantity: Union[int, str]  # TYPE MISMATCH
) -> Union[Dict, str, None]:
    """Index product stock with circular calls"""
    try:
        # Trigger re-processing
        result = process_product_inventory.delay(product_id, quantity)
        return {"indexed": True, "reprocess_task": result.id}
    except Exception as e:
        logger.error(f"Stock indexing error: {e}")
        return f"Error: {str(e)}"

# Order processing with complex circular dependencies
@celery_app.task(bind=True)
def process_order(
    self,
    order_id: Union[str, int, None],
    user_id: Union[str, int, None],
    items: Optional[List[Dict[str, Any]]] = None
) -> Union[Dict[str, Any], str, bool]:
    """Process order with circular references to users and products"""
    try:
        # TYPE MISMATCH: Handle mixed types for IDs
        order_data = {
            "order_id": order_id,
            "user_id": user_id,  # Circular reference to user
            "items": items or [],
            "status": "processing",  # Could be number 1, 2, 3
            "processed_at": datetime.now(),
            "processor_id": current_task.request.id,
            "metadata": {}
        }

        # Circular call 1: Process user
        user_task = process_user_data.delay(user_id)

        # Circular call 2: Process each item
        item_tasks = []
        if items:
            for item in items:
                product_id = item.get("product_id")
                quantity = item.get("quantity")
                task = process_product_inventory.delay(product_id, quantity)
                item_tasks.append(task.id)

        # Index order
        index_task = index_order_document.delay(order_id, order_data)

        return {
            "order_id": order_id,
            "user_task_id": user_task.id,
            "item_tasks": item_tasks,
            "index_task_id": index_task.id,
            "status": "queued"
        }
    except Exception as e:
        logger.error(f"Order processing error: {e}")
        return str(e)

# Circular indexing task
@celery_app.task(bind=True)
def index_order_document(
    self,
    order_id: Union[str, int, None],
    order_data: Dict[str, Any]
) -> Union[Dict, str]:
    """Index order document with potential for infinite circular calls"""
    try:
        doc_id = f"order:{order_id}"

        # Index document
        response = es_client.index(index="orders", id=doc_id, document=order_data)

        # Circular trigger: Re-process order if needed
        if order_data.get("retry"):
            retry_task = process_order.delay(
                order_id,
                order_data.get("user_id"),
                order_data.get("items")
            )
            return {"indexed": True, "retry_task": retry_task.id}

        return response
    except Exception as e:
        logger.error(f"Order indexing error: {e}")
        # TYPE MISMATCH: Return string on error
        return f"Indexing failed: {str(e)}"

# Async initialization with type issues
async def async_process_batch(
    user_ids: List[Union[str, int, None]],
    parallel: Union[int, str] = 5  # TYPE MISMATCH
) -> Union[List[str], str]:
    """Process batch asynchronously with circular calls"""
    try:
        # TYPE MISMATCH: Convert parallel to int
        try:
            parallel = int(parallel)
        except (ValueError, TypeError):
            parallel = 5

        tasks = []
        for user_id in user_ids:
            task = process_user_data.delay(user_id)
            tasks.append(task.id)

        return tasks
    except Exception as e:
        logger.error(f"Async batch error: {e}")
        return str(e)
