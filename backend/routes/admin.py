from fastapi import APIRouter, Depends, HTTPException
from database import places_collection, users_collection, reviews_collection, ratings_collection, behavior_collection
from routes.auth import get_admin_user
from bson import ObjectId
from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def place_to_dict(p):
    p["id"] = str(p["_id"])
    del p["_id"]
    return p

class PlaceModel(BaseModel):
    name: str
    state: str
    city: str
    category: str
    description: str
    tags: List[str] = []
    budget: str = "medium"
    best_season: str = "winter"
    lat: float = 0.0
    lng: float = 0.0
    image: str = ""

@router.get("/stats")
def get_stats(admin = Depends(get_admin_user)):
    total_users = users_collection.count_documents({})
    total_places = places_collection.count_documents({})
    total_reviews = reviews_collection.count_documents({})
    total_behaviors = behavior_collection.count_documents({})
    
    recent_users = list(users_collection.find({}, {"password": 0}).sort("created_at", -1).limit(5))
    for u in recent_users:
        u["id"] = str(u["_id"])
        del u["_id"]
    
    category_stats = {}
    for cat in ["heritage", "beach", "nature", "wildlife", "hill", "adventure", "religious"]:
        category_stats[cat] = places_collection.count_documents({"category": cat})
    
    return {
        "total_users": total_users,
        "total_places": total_places,
        "total_reviews": total_reviews,
        "total_behaviors": total_behaviors,
        "recent_users": recent_users,
        "category_stats": category_stats
    }

@router.get("/users")
def get_all_users(admin = Depends(get_admin_user)):
    users = list(users_collection.find({}, {"password": 0}).sort("created_at", -1))
    for u in users:
        u["id"] = str(u["_id"])
        del u["_id"]
    return users

@router.delete("/users/{user_id}")
def delete_user(user_id: str, admin = Depends(get_admin_user)):
    result = users_collection.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}

@router.get("/places")
def get_all_places(admin = Depends(get_admin_user)):
    places = list(places_collection.find({}).sort("name", 1))
    return [place_to_dict(p) for p in places]

@router.post("/places")
def add_place(data: PlaceModel, admin = Depends(get_admin_user)):
    place = data.dict()
    place["avg_rating"] = 0.0
    place["rating_count"] = 0
    place["created_at"] = datetime.utcnow()
    if not place["image"]:
        place["image"] = "/places/taj-mahal.jpg"
    place["images"] = [place["image"]]
    result = places_collection.insert_one(place)
    return {"message": "Place added", "id": str(result.inserted_id)}

@router.delete("/places/{place_id}")
def delete_place(place_id: str, admin = Depends(get_admin_user)):
    result = places_collection.delete_one({"_id": ObjectId(place_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Place not found")
    reviews_collection.delete_many({"place_id": place_id})
    ratings_collection.delete_many({"place_id": place_id})
    return {"message": "Place deleted"}

@router.get("/reviews")
def get_all_reviews(admin = Depends(get_admin_user)):
    reviews = list(reviews_collection.find({}).sort("created_at", -1))
    for r in reviews:
        r["id"] = str(r["_id"])
        del r["_id"]
    return reviews

@router.delete("/reviews/{review_id}")
def delete_review(review_id: str, admin = Depends(get_admin_user)):
    review = reviews_collection.find_one({"_id": ObjectId(review_id)})
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    reviews_collection.delete_one({"_id": ObjectId(review_id)})
    all_ratings = list(ratings_collection.find({"place_id": review["place_id"]}))
    if all_ratings:
        avg = sum(r["rating"] for r in all_ratings) / len(all_ratings)
        places_collection.update_one(
            {"_id": ObjectId(review["place_id"])},
            {"$set": {"avg_rating": round(avg, 2), "rating_count": len(all_ratings)}}
        )
    return {"message": "Review deleted"}