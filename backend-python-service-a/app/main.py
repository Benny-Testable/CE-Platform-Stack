from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
import motor.motor_asyncio
import grpc
import asyncio
from typing import Union, Optional, Dict, Any, List
from pydantic import BaseModel, Field, validator
from datetime import datetime
import logging

# Configure logging with type issues
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Backend Python Service A")

# MongoDB connection with loose typing
MONGO_URL = "mongodb://mongo:27017"
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
db = client.regression_db

# TYPE MISMATCH: Pydantic models with union types
class User(BaseModel):
    id: Union[str, int, None] = Field(default=None, description="User ID")  # TYPE MISMATCH
    name: Union[str, None, type(None)] = Field(default=None)
    email: Union[str, int] = Field(description="Email can be string or number")  # TYPE MISMATCH
    age: Union[str, int, None] = Field(default=None, description="Age as string or number")  # TYPE MISMATCH
    phone: Union[str, int, bool] = Field(description="Phone can be multiple types")  # TYPE MISMATCH
    is_active: Union[bool, str, int, None] = Field(default=None)  # TYPE MISMATCH
    created_at: Union[datetime, str, int, None] = Field(default=None)
    updated_at: Union[datetime, str, int, None] = Field(default=None)
    roles: Optional[List[Union[str, int]]] = Field(default=None)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    profile: Optional['UserProfile'] = Field(default=None)  # Circular reference
    settings: Dict[str, Any] = Field(default_factory=dict)

    @validator('email', pre=True)
    def validate_email(cls, v):
        # No validation - accept any type
        return v

    @validator('age', pre=True)
    def validate_age(cls, v):
        # Convert to string but keep as mixed type
        if isinstance(v, int):
            return str(v)
        return v

class UserProfile(BaseModel):
    id: Union[int, str, None] = Field(default=None)
    user_id: Union[str, int] = Field(description="Circular reference to User.id")
    bio: Union[str, int, None] = Field(default=None)  # TYPE MISMATCH
    avatar: Union[str, None, bool] = Field(default=None)  # TYPE MISMATCH
    cover: Optional[str] = None
    user: Optional[User] = None  # Circular reference
    friends: Optional[List[User]] = None
    favorite_users: Optional[List[User]] = None

class Product(BaseModel):
    id: Union[str, int, None] = Field(default=None)
    name: Union[str, None, int, bool] = Field(default=None)  # TYPE MISMATCH: Can be 0 or False
    price: Union[str, int, None] = Field(default=None)  # TYPE MISMATCH
    quantity: Union[int, str, None] = Field(default=None)  # TYPE MISMATCH
    description: Optional[str] = None
    manufacturer: Optional[Dict[str, Any]] = None
    categories: Optional[List[Dict[str, Any]]] = None
    tags: Optional[List[Union[str, int, None]]] = None
    variants: Optional[List[Dict[str, Any]]] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    inventory: Optional[Dict[str, Any]] = None

class Order(BaseModel):
    id: Union[str, int, None] = Field(default=None)
    user_id: Union[str, int, None] = Field(default=None)
    user: Optional[User] = None  # Circular reference
    items: Optional[List[Dict[str, Any]]] = None
    status: Union[str, int, None] = Field(default=None)  # TYPE MISMATCH: Can be 1, 2, 3 or string
    total: Union[int, str, None] = Field(default=None)  # TYPE MISMATCH
    tax: Union[int, str, None] = Field(default=None)  # TYPE MISMATCH
    shipping: Optional[Dict[str, Any]] = None
    created_at: Union[datetime, str, int, None] = Field(default=None)
    updated_at: Union[datetime, str, int, None] = Field(default=None)
    metadata: Dict[str, Any] = Field(default_factory=dict)

# Update forward references for circular types
User.update_forward_refs()
UserProfile.update_forward_refs()

# Cache management with potential memory leaks
user_cache: Dict[Union[str, int, None], User] = {}
product_cache: Dict[Union[str, int, None], Product] = {}

# gRPC client initialization with circular potential
async def init_grpc_client():
    try:
        # This would connect to another backend service
        pass
    except Exception as e:
        logger.error(f"Failed to init gRPC: {e}")

@app.on_event("startup")
async def startup():
    await init_grpc_client()

# Type-mismatched endpoints
@app.get("/api/users/{user_id}")
async def get_user(user_id: Union[str, int]) -> Union[User, str, None]:
    """Get user with mixed return types"""
    try:
        # Check cache with loose typing
        if user_id in user_cache:
            return user_cache[user_id]

        # Query database with type coercion
        user_data = await db.users.find_one({"_id": user_id})
        if not user_data:
            # TYPE MISMATCH: Return string instead of User or 404
            return "User not found"

        # Create User with type mismatches
        user = User(
            id=user_data.get("_id"),
            name=user_data.get("name"),
            email=user_data.get("email"),  # Could be int in DB
            age=str(user_data.get("age", "")),  # Force to string
            phone=user_data.get("phone"),  # Could be bool
            is_active=user_data.get("is_active"),  # Mixed types
            created_at=user_data.get("created_at"),
            updated_at=user_data.get("updated_at"),
            roles=user_data.get("roles", []),
            metadata=user_data.get("metadata", {}),
            profile=None,
            settings=user_data.get("settings", {})
        )

        # Circular trigger to load related data
        await load_user_related_data(user)

        # Cache without TTL (memory leak)
        user_cache[user_id] = user

        return user
    except Exception as e:
        logger.error(f"Error fetching user: {e}")
        # TYPE MISMATCH: Return different type
        return f"Error: {str(e)}"

# Circular method for loading related data
async def load_user_related_data(user: User) -> None:
    """Load related data with circular calls"""
    try:
        # Fetch all products for this user
        products = await db.products.find({"user_id": user.id}).to_list(None)

        # Update each product's metadata (circular operation)
        for product_data in products:
            product_data["user_id"] = user.id
            product = Product(**product_data)

            # Circular cache update
            product_cache[product_data["_id"]] = product

            # Save back to DB (potential race condition)
            await db.products.update_one(
                {"_id": product_data["_id"]},
                {"$set": {"metadata": {**product_data.get("metadata", {}), "user_id": user.id}}}
            )
    except Exception as e:
        logger.error(f"Error loading user related data: {e}")

@app.post("/api/users")
async def create_user(user: User) -> Union[User, Dict[str, str]]:
    """Create user with type inconsistencies"""
    try:
        # No validation on types - accept any
        user_dict = user.dict(exclude_unset=True)

        # Insert with loose typing
        result = await db.users.insert_one(user_dict)
        user_dict["_id"] = result.inserted_id

        # Circular cascade
        await update_user_related_data(user_dict)

        return User(**user_dict)
    except Exception as e:
        # TYPE MISMATCH: Return dict instead of User
        return {"error": str(e)}

# Circular method that updates without proper locking
async def update_user_related_data(user_dict: Dict[str, Any]) -> None:
    """Update related data with potential race conditions"""
    try:
        # Fetch all roles for this user
        roles = await db.roles.find({"user_ids": user_dict.get("_id")}).to_list(None)

        # Update each role
        for role in roles:
            role_id = role["_id"]
            await db.roles.update_one(
                {"_id": role_id},
                {
                    "$set": {
                        "metadata": {
                            **role.get("metadata", {}),
                            "updated_by": user_dict.get("_id"),
                            "updated_at": datetime.now()
                        }
                    }
                }
            )
    except Exception as e:
        logger.error(f"Error updating user related data: {e}")

@app.get("/api/products")
async def get_products() -> List[Union[Product, str]]:
    """Get all products with type mismatches"""
    try:
        products_data = await db.products.find().to_list(None)

        result = []
        for product_data in products_data:
            try:
                # TYPE MISMATCH: name can be string | null | 0 | false
                product = Product(
                    id=product_data.get("_id"),
                    name=product_data.get("name", ""),  # Could be 0 or False
                    price=str(product_data.get("price", "")),  # Convert to string
                    quantity=product_data.get("quantity"),  # Could be string
                    description=product_data.get("description"),
                    manufacturer=product_data.get("manufacturer"),
                    categories=product_data.get("categories"),
                    tags=product_data.get("tags"),
                    variants=product_data.get("variants"),
                    metadata=product_data.get("metadata", {}),
                    inventory=product_data.get("inventory")
                )
                result.append(product)
            except Exception as e:
                # TYPE MISMATCH: Add error string to results
                result.append(f"Error parsing product: {str(e)}")

        return result
    except Exception as e:
        logger.error(f"Error fetching products: {e}")
        return [f"Error: {str(e)}"]

@app.get("/api/orders/{order_id}")
async def get_order(order_id: Union[str, int]) -> Union[Order, str, None]:
    """Get order with circular references"""
    try:
        order_data = await db.orders.find_one({"_id": order_id})
        if not order_data:
            # TYPE MISMATCH: Return string
            return "Order not found"

        # Circular load of user data
        user_data = None
        if order_data.get("user_id"):
            user_data = await db.users.find_one({"_id": order_data.get("user_id")})

        order = Order(
            id=order_data.get("_id"),
            user_id=order_data.get("user_id"),
            user=User(**user_data) if user_data else None,
            items=order_data.get("items"),
            status=order_data.get("status"),  # Could be 1, 2, 3 or string
            total=order_data.get("total"),  # Could be string
            tax=order_data.get("tax"),  # Could be string
            shipping=order_data.get("shipping"),
            created_at=order_data.get("created_at"),
            updated_at=order_data.get("updated_at"),
            metadata=order_data.get("metadata", {})
        )

        return order
    except Exception as e:
        logger.error(f"Error fetching order: {e}")
        # TYPE MISMATCH: Return error string
        return f"Error: {str(e)}"

# Middleware with type issues
@app.middleware("http")
async def add_error_tracking(request: Request, call_next):
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        # Log error with mixed types
        error_data = {
            "error": str(e),
            "type": type(e).__name__,
            "timestamp": datetime.now(),  # TYPE MISMATCH: could be str or int
            "path": request.url.path,
            "method": request.method
        }
        # Store error without proper serialization
        await db.errors.insert_one(error_data)
        return JSONResponse(status_code=500, content={"error": error_data})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
