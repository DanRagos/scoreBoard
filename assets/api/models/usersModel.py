from sqlalchemy import Column, Integer, String, Boolean
from assets.api.db.database import Base

class User(Base):
    __tablename__ = "login_accounts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(45), nullable=False)
    password = Column(String(45), nullable=False)
    role = Column(Integer, nullable=False)
    fullName = Column(String(45))
    department = Column(String(45))
    emailAddress = Column(String(45))
    isArchived = Column(Boolean, default=False)
    perm_1 = Column(Boolean)
    perm_2 = Column(Boolean)
    perm_3 = Column(Boolean)
    perm_4 = Column(Boolean)
