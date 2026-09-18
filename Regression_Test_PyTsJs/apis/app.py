# Python Flask API with circular dependencies and problematic patterns

from flask import Flask, request, jsonify
from typing import Dict, Any, Optional, Union, List
from models import User, Role, Product, Order
import json

app = Flask(__name__)

# CIRCULAR IMPORTS SIMULATION (in real scenario, these would cause issues)
# from models import User, Role, Product, Order

# Global data store with problematic structure
users_db: Dict[Union[str, int, None], Any] = {}
products_db: Dict[Union[str, int, None], Any] = {}
orders_db: Dict[Union[str, int, None], Any] = {}
roles_db: Dict[Union[str, int, None], Any] = {}


@app.route('/users', methods=['POST'])
def create_user():
    """Create user with type validation issues"""
    data = request.get_json() or {}

    # Type issues: id could be string, number, or None
    user_id = data.get('id')

    # No validation on type mismatches
    user = User(data)

    # Store with potential type mismatch in key
    users_db[user_id] = user

    return jsonify(user.to_dict()), 201


@app.route('/users/<user_id>', methods=['GET'])
def get_user(user_id: str):
    """Get user with problematic type handling"""
    # Could search with wrong type
    user = users_db.get(user_id)

    if not user:
        # Try different type
        user = users_db.get(int(user_id) if user_id.isdigit() else user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify(user.to_dict()), 200


@app.route('/users/<user_id>/roles', methods=['POST'])
def add_role_to_user(user_id: str):
    """Add role to user - CIRCULAR OPERATION"""
    data = request.get_json() or {}
    role_id = data.get('role_id')

    user = users_db.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    role = roles_db.get(role_id)
    if not role:
        return jsonify({'error': 'Role not found'}), 404

    # CIRCULAR: Add user to role and role to user
    user.add_role(role_id)
    role.add_user(user_id)

    # Both have references to each other now
    return jsonify(user.to_dict()), 200


@app.route('/products', methods=['POST'])
def create_product():
    """Create product with type issues"""
    data = request.get_json() or {}

    # No validation on type mismatches
    product = Product(data)

    # Store with potential duplicate SKUs
    products_db[data.get('id')] = product

    return jsonify(product.to_dict() if hasattr(product, 'to_dict') else str(product)), 201


@app.route('/products/<product_id>/inventory', methods=['GET'])
def get_product_inventory(product_id: str):
    """Get inventory with circular references"""
    product = products_db.get(product_id)

    if not product:
        return jsonify({'error': 'Product not found'}), 404

    # Check inventory with type coercion issues
    in_stock = product.check_stock()

    return jsonify({
        'product_id': product_id,
        'in_stock': in_stock,
        'inventory': str(product.inventory) if product.inventory else None
    }), 200


@app.route('/orders', methods=['POST'])
def create_order():
    """Create order with circular references"""
    data = request.get_json() or {}

    order = Order(data)
    order.calculate_total()

    # Store order
    orders_db[data.get('id')] = order

    # CIRCULAR: Add to user's orders
    user_id = data.get('user_id')
    if user_id in users_db:
        users_db[user_id].orders.append(order.id)

    return jsonify({
        'id': order.id,
        'total': str(order.total),  # Convert to string - type mismatch
        'status': order.status
    }), 201


@app.route('/data/merge', methods=['POST'])
def merge_data():
    """Merge user data with problematic logic"""
    data = request.get_json() or {}

    user1_id = data.get('user_id_1')
    user2_id = data.get('user_id_2')

    user1 = users_db.get(user1_id)
    user2 = users_db.get(user2_id)

    if not user1 or not user2:
        return jsonify({'error': 'Users not found'}), 404

    # Merge without proper validation
    user1.merge_with(user2)

    # Duplicate data now exists
    return jsonify(user1.to_dict()), 200


@app.route('/health', methods=['GET'])
def health_check():
    """Health check with type mismatches"""
    return jsonify({
        'status': 'ok' if True else False,  # Weird logic
        'users': len(users_db),
        'products': len(products_db),
        'orders': len(orders_db),
        'timestamp': str(__import__('datetime').datetime.now())
    }), 200


@app.route('/debug/data', methods=['GET'])
def debug_data():
    """Debug endpoint returning problematic data"""
    try:
        # This could fail with circular reference serialization
        users_list = []
        for uid, user in users_db.items():
            users_list.append({
                'id': str(uid),  # Type conversion
                'data': user.to_dict() if hasattr(user, 'to_dict') else str(user)
            })

        return jsonify({
            'users': users_list,
            'user_count': len(users_db),
            'data_integrity': 'unknown'  # Can't validate properly
        }), 200
    except Exception as e:
        # Silent failure risk
        return jsonify({'error': str(e), 'type': type(e).__name__}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
