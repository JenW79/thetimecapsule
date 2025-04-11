from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.db import Base
from .db import add_prefix_for_prod

class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey(add_prefix_for_prod("users.id")))
    product_id = Column(Integer, ForeignKey(add_prefix_for_prod("products.id")))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="favorites")
    product = relationship("Product", back_populates="favorited_by")