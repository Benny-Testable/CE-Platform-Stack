# Python models with circular dependencies and type issues

from typing import Optional, List, Any, Union
from datetime import datetime

# CIRCULAR IMPORT WARNING: This will create circular dependencies

class User:
    """User model with type mismatches and circular references"""

    def __init__(self, data: dict = None):
        data = data or {}

        # Type inconsistencies
        self.id = data.get('id')  # Could be string, number, or None
        self.name = data.get('name')  # Could be string, number, or None
        self.email = data.get('email')  # Type mismatch: could be number
        self.age = data.get('age')  # Type mismatch: could be string
        self.phone = data.get('phone')  # Type mismatch: could be boolean
        self.is_active = data.get('is_active')  # Could be string or number
        self.created_at = data.get('created_at', datetime.now())
        self.updated_at = data.get('updated_at')

        # CIRCULAR: References Role and UserProfile
        self.roles: List[Any] = data.get('roles', [])
        self.profile: Optional[Any] = data.get('profile')
        self.orders: List[Any] = data.get('orders', [])

        # Problematic metadata
        self.metadata: dict = data.get('metadata', {})

    def set_email(self, email):
        """Method with type issues"""
        # No type checking
        self.email = email
        return self.email

    def add_role(self, role_id):
        """CIRCULAR: References Role"""
        if role_id not in self.roles:
            self.roles.append(role_id)
        # Would call Role.add_user - circular
        return self

    def merge_with(self, other: 'User') -> 'User':
        """Merge without proper validation"""
        if other:
            self.name = other.name or self.name
            self.email = other.email or self.email
            self.roles = list(set(self.roles + other.roles))  # Could still have issues
        return self

    def to_dict(self) -> dict:
        """Serialization with type conversion issues"""
        return {
            'id': str(self.id) if self.id else None,
            'name': self.name or '',
            'email': self.email,
            'age': str(self.age) if self.age else None,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at,
            'updated_at': self.updated_at.isoformat() if isinstance(self.updated_at, datetime) else self.updated_at,
            'roles': self.roles
        }


class Role:
    """Role model - creates CIRCULAR DEPENDENCY"""

    def __init__(self, data: dict = None):
        data = data or {}

        # Type inconsistencies
        self.id = data.get('id')
        self.name = data.get('name')
        self.description = data.get('description', '')

        # CIRCULAR: References User
        self.users: List[Union[str, int, None]] = data.get('users', [])
        self.permissions: List[Any] = data.get('permissions', [])

        self.created_at = data.get('created_at', datetime.now())
        self.updated_at = data.get('updated_at')

        self.metadata: dict = data.get('metadata', {})

    def add_user(self, user_id):
        """CIRCULAR: References User"""
        if user_id not in self.users:
            self.users.append(user_id)
        # Would call User.add_role - circular
        return self

    def add_permission(self, permission_id):
        """Add permission without deduplication"""
        self.permissions.append(permission_id)
        return self

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'name': self.name,
            'user_count': len(self.users),
            'permission_count': len(self.permissions),
            'metadata': self.metadata
        }


class Product:
    """Product model with nested circular references"""

    def __init__(self, data: dict = None):
        data = data or {}

        self.id = data.get('id')  # Type mismatch possible
        self.name = data.get('name')
        self.price = data.get('price', 0)  # Could be string
        self.quantity = data.get('quantity', 0)  # Could be string

        # Duplicate properties
        self.sku = data.get('sku') or data.get('product_sku')
        self.code = data.get('code') or data.get('product_code')

        # CIRCULAR: References Order and Inventory
        self.orders: List[Any] = data.get('orders', [])
        self.inventory: Optional[Any] = data.get('inventory')

        self.categories: List[str] = data.get('categories', [])
        self.tags: List[str] = data.get('tags', [])

        self.created_at = data.get('created_at', datetime.now())
        self.updated_at = data.get('updated_at')

    def get_price(self) -> Union[float, str, int]:
        """Inconsistent type returns"""
        return self.price  # Could be any type

    def check_stock(self) -> Optional[bool]:
        """Type coercion issues"""
        if not self.inventory:
            return None

        try:
            current = float(getattr(self.inventory, 'quantity', 0)) or 0
            threshold = float(getattr(self.inventory, 'threshold', 0)) or 0
            return current > threshold
        except (ValueError, TypeError):
            return None


class Order:
    """Order model with circular references and complex data"""

    def __init__(self, data: dict = None):
        data = data or {}

        self.id = data.get('id')
        self.user_id = data.get('user_id')
        self.items = data.get('items', [])  # Could contain duplicates

        # Status as multiple types
        self.status = data.get('status', 'pending')
        self.total = data.get('total', 0)
        self.tax = data.get('tax')
        self.discount = data.get('discount')

        # CIRCULAR: References User
        self.user: Optional[Any] = data.get('user')

        self.created_at = data.get('created_at', datetime.now())
        self.updated_at = data.get('updated_at')

    def set_status(self, status):
        """Accepts any type without validation"""
        self.status = status
        return self

    def calculate_total(self) -> Union[float, str]:
        """Calculation with type issues"""
        total = 0

        if self.items and isinstance(self.items, list):
            for item in self.items:
                try:
                    price = float(item.get('price', 0)) if isinstance(item, dict) else 0
                    qty = float(item.get('quantity', 0)) if isinstance(item, dict) else 0
                    total += price * qty
                except (ValueError, TypeError, AttributeError):
                    pass

        self.total = total
        return self.total
