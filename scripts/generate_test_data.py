#!/usr/bin/env python3
"""
Generate test data with intentional type mismatches, circular references, and data integrity issues
for regression testing
"""

import json
import random
import string
from datetime import datetime, timedelta
from typing import Dict, Any, List, Union
import pymongo
from elasticsearch import Elasticsearch
import argparse
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RegressionTestDataGenerator:
    def __init__(self, mongo_uri: str, es_host: str):
        self.mongo_client = pymongo.MongoClient(mongo_uri)
        self.db = self.mongo_client.regression_db
        self.es_client = Elasticsearch([es_host])

    def generate_user_data(self, count: int = 100) -> List[Dict[str, Any]]:
        """Generate users with intentional type mismatches"""
        users = []
        for i in range(count):
            # TYPE MISMATCH: id can be string, int, or null
            user_id_options = [str(i), i, None]
            user_id = random.choice(user_id_options)

            user = {
                "_id": user_id or f"user_{i}",
                "id": user_id,  # TYPE MISMATCH
                "name": f"User {i}" if random.random() > 0.2 else None,
                "email": random.choice([f"user{i}@example.com", i, f"user{i}", None]),  # TYPE MISMATCH
                "age": random.choice([random.randint(18, 80), str(random.randint(18, 80)), None]),  # TYPE MISMATCH
                "phone": random.choice([f"555-{random.randint(1000, 9999)}", random.randint(5551000, 5559999), random.choice([True, False]), None]),  # TYPE MISMATCH
                "is_active": random.choice([True, "true", "false", 1, 0, None]),  # TYPE MISMATCH
                "created_at": random.choice([
                    datetime.now() - timedelta(days=random.randint(1, 365)),
                    str(datetime.now() - timedelta(days=random.randint(1, 365))),
                    int((datetime.now() - timedelta(days=random.randint(1, 365))).timestamp() * 1000),
                    None
                ]),  # TYPE MISMATCH
                "updated_at": datetime.now(),
                "roles": [random.choice(["admin", "user", 1, 2, None]) for _ in range(random.randint(1, 3))],
                "metadata": {
                    "source": random.choice(["api", "import", "sync", None]),
                    "version": random.choice([1, "1", 1.0, None]),
                    "tags": [f"tag_{random.randint(1, 10)}" for _ in range(random.randint(0, 3))],
                    "nested": {"level": random.choice([1, "1", None])}
                },
                "profile_id": f"profile_{i}" if random.random() > 0.5 else None,  # Circular reference
                "settings": {
                    k: random.choice(["yes", "no", 1, 0, None])
                    for k in [f"setting_{j}" for j in range(random.randint(1, 3))]
                }
            }
            users.append(user)

        return users

    def generate_product_data(self, count: int = 200) -> List[Dict[str, Any]]:
        """Generate products with type mismatches"""
        products = []
        categories = [f"cat_{i}" for i in range(1, 11)]

        for i in range(count):
            # TYPE MISMATCH: name can be string, 0, or false
            name_options = [f"Product {i}", 0, False, None]
            name = random.choice(name_options)

            product = {
                "_id": f"product_{i}",
                "id": random.choice([str(i), i, None]),  # TYPE MISMATCH
                "name": name,  # TYPE MISMATCH
                "price": random.choice([
                    f"{random.uniform(10, 1000):.2f}",  # String
                    random.uniform(10, 1000),  # Float
                    random.randint(10, 1000),  # Int
                    None
                ]),  # TYPE MISMATCH
                "quantity": random.choice([
                    random.randint(0, 1000),  # Int
                    str(random.randint(0, 1000)),  # String
                    None
                ]),  # TYPE MISMATCH
                "description": f"Description for product {i}" if random.random() > 0.3 else None,
                "manufacturer_id": f"mfg_{random.randint(1, 20)}" if random.random() > 0.3 else None,
                "categories": random.sample(categories, random.randint(1, 3)),
                "tags": [f"tag_{random.randint(1, 20)}" for _ in range(random.randint(0, 5))],
                "variants": [
                    {
                        "sku": f"SKU-{i}-{j}",
                        "size": random.choice(["S", "M", "L", "XL", 1, 2, 3, None]),  # TYPE MISMATCH
                        "color": random.choice(["Red", "Blue", "Green", None]),
                        "weight": random.choice([random.uniform(0.1, 100), str(random.uniform(0.1, 100)), None]),  # TYPE MISMATCH
                        "price": random.choice([random.uniform(10, 1000), str(random.uniform(10, 1000)), None]),
                        "stock": random.choice([random.randint(0, 1000), str(random.randint(0, 1000)), None])
                    }
                    for j in range(random.randint(1, 3))
                ],
                "metadata": {
                    "supplier": f"supplier_{random.randint(1, 50)}",
                    "batch": random.choice([random.randint(1, 1000), str(random.randint(1, 1000)), None]),
                    "cost": random.choice([random.uniform(1, 100), str(random.uniform(1, 100)), None]),
                    "margin": random.choice([0.2, "0.2", None])
                },
                "inventory_id": f"inv_{i}" if random.random() > 0.5 else None,  # Circular reference
                "user_id": random.choice([f"user_{random.randint(0, 99)}", None])
            }
            products.append(product)

        return products

    def generate_order_data(self, count: int = 150) -> List[Dict[str, Any]]:
        """Generate orders with circular references and type mismatches"""
        orders = []

        for i in range(count):
            # TYPE MISMATCH: status can be string or number
            status_options = ["pending", "confirmed", "shipped", "delivered", 1, 2, 3, None]
            status = random.choice(status_options)

            user_id = f"user_{random.randint(0, 99)}"

            order = {
                "_id": f"order_{i}",
                "id": random.choice([str(i), i, None]),  # TYPE MISMATCH
                "user_id": random.choice([user_id, random.randint(0, 99), None]),  # TYPE MISMATCH
                "items": [
                    {
                        "product_id": f"product_{random.randint(0, 199)}",
                        "quantity": random.choice([
                            random.randint(1, 10),
                            str(random.randint(1, 10)),
                            None
                        ]),  # TYPE MISMATCH
                        "price": random.choice([
                            random.uniform(10, 1000),
                            str(random.uniform(10, 1000)),
                            None
                        ]),  # TYPE MISMATCH
                        "discount": random.choice([
                            random.uniform(0, 100),
                            str(random.uniform(0, 100)),
                            None
                        ])  # TYPE MISMATCH
                    }
                    for _ in range(random.randint(1, 5))
                ],
                "status": status,  # TYPE MISMATCH
                "total": random.choice([
                    random.uniform(100, 10000),
                    str(random.uniform(100, 10000)),
                    None
                ]),  # TYPE MISMATCH
                "tax": random.choice([
                    random.uniform(10, 1000),
                    str(random.uniform(10, 1000)),
                    None
                ]),  # TYPE MISMATCH
                "shipping": {
                    "address": random.choice([f"{random.randint(1, 9999)} Main St", random.randint(1, 99999), None]),  # TYPE MISMATCH
                    "city": f"City_{random.randint(1, 50)}",
                    "state": random.choice([random.choice(["CA", "NY", "TX", None]), random.randint(1, 50)]),  # TYPE MISMATCH
                    "zip": random.choice([f"{random.randint(10000, 99999)}", random.randint(10000, 99999), None]),  # TYPE MISMATCH
                    "country": "USA",
                    "tracking_number": random.choice([f"TRACK-{random.randint(100000, 999999)}", random.randint(100000, 999999), None]),  # TYPE MISMATCH
                    "carrier": random.choice(["UPS", "FedEx", "DHL", None]),
                    "estimated_delivery": (datetime.now() + timedelta(days=random.randint(1, 14))).isoformat(),
                    "actual_delivery": (datetime.now() + timedelta(days=random.randint(1, 30))).isoformat() if random.random() > 0.5 else None
                },
                "created_at": random.choice([
                    datetime.now() - timedelta(days=random.randint(1, 90)),
                    str(datetime.now() - timedelta(days=random.randint(1, 90))),
                    None
                ]),  # TYPE MISMATCH
                "updated_at": datetime.now(),
                "metadata": {
                    "source": random.choice(["web", "mobile", "api", None]),
                    "payment_method": random.choice(["credit_card", "paypal", "bank", None]),
                    "notes": f"Order notes {i}" if random.random() > 0.7 else None
                }
            }
            orders.append(order)

        return orders

    def generate_duplicates_and_conflicts(self) -> Dict[str, List[Dict[str, Any]]]:
        """Generate data with duplicates and conflicts for testing"""
        conflicts = {
            "duplicate_users": [
                {
                    "_id": "dup_user_1",
                    "email": "duplicate@example.com",
                    "name": "User A"
                },
                {
                    "_id": "dup_user_1_alt",
                    "email": "duplicate@example.com",  # Duplicate email
                    "name": "User B"
                }
            ],
            "conflicting_products": [
                {
                    "_id": "conflict_prod_1",
                    "sku": "SKU-SAME",
                    "quantity": 100,
                    "price": "99.99"
                },
                {
                    "_id": "conflict_prod_1_alt",
                    "sku": "SKU-SAME",  # Duplicate SKU
                    "quantity": "50",  # Different type
                    "price": 99.99  # Different type
                }
            ],
            "invalid_references": [
                {
                    "_id": "invalid_order_1",
                    "user_id": "nonexistent_user_12345",  # Reference to non-existent user
                    "product_ids": ["nonexistent_prod_1", "nonexistent_prod_2"]
                }
            ]
        }
        return conflicts

    def insert_data(self, users: List[Dict], products: List[Dict], orders: List[Dict]):
        """Insert data into MongoDB"""
        try:
            logger.info("Inserting user data...")
            self.db.users.insert_many(users)
            logger.info(f"Inserted {len(users)} users")

            logger.info("Inserting product data...")
            self.db.products.insert_many(products)
            logger.info(f"Inserted {len(products)} products")

            logger.info("Inserting order data...")
            self.db.orders.insert_many(orders)
            logger.info(f"Inserted {len(orders)} orders")

            # Insert conflicts
            logger.info("Inserting conflict data...")
            conflicts = self.generate_duplicates_and_conflicts()
            self.db.duplicate_users.insert_many(conflicts["duplicate_users"])
            self.db.conflicting_products.insert_many(conflicts["conflicting_products"])
            self.db.invalid_references.insert_many(conflicts["invalid_references"])
            logger.info("Inserted conflict data")
        except Exception as e:
            logger.error(f"Error inserting data: {e}")

    def index_data(self, users: List[Dict], products: List[Dict], orders: List[Dict]):
        """Index data into Elasticsearch"""
        try:
            logger.info("Indexing user data...")
            for user in users:
                self.es_client.index(index="users", id=str(user.get("_id")), document=user)
            logger.info(f"Indexed {len(users)} users")

            logger.info("Indexing product data...")
            for product in products:
                self.es_client.index(index="products", id=product.get("_id"), document=product)
            logger.info(f"Indexed {len(products)} products")

            logger.info("Indexing order data...")
            for order in orders:
                self.es_client.index(index="orders", id=order.get("_id"), document=order)
            logger.info(f"Indexed {len(orders)} orders")
        except Exception as e:
            logger.error(f"Error indexing data: {e}")

    def run(self, user_count: int = 100, product_count: int = 200, order_count: int = 150):
        """Run the data generation"""
        logger.info("Starting regression test data generation...")

        users = self.generate_user_data(user_count)
        products = self.generate_product_data(product_count)
        orders = self.generate_order_data(order_count)

        self.insert_data(users, products, orders)
        self.index_data(users, products, orders)

        logger.info("Data generation complete!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate regression test data")
    parser.add_argument("--mongo-uri", default="mongodb://localhost:27017", help="MongoDB URI")
    parser.add_argument("--es-host", default="http://localhost:9200", help="Elasticsearch host")
    parser.add_argument("--users", type=int, default=100, help="Number of users to generate")
    parser.add_argument("--products", type=int, default=200, help="Number of products to generate")
    parser.add_argument("--orders", type=int, default=150, help="Number of orders to generate")

    args = parser.parse_args()

    generator = RegressionTestDataGenerator(args.mongo_uri, args.es_host)
    generator.run(args.users, args.products, args.orders)
