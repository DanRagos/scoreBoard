from pydantic import BaseModel

class UserSchema(BaseModel):
    id: int
    username: str
    password: str
    role: int
    fullName: str = None
    department: str = None
    emailAddress: str = None
    isArchived: bool
    perm_1: bool = None
    perm_2: bool = None
    perm_3: bool = None
    perm_4: bool = None
    
    class Config:
        orm_mode = True

class UserLoginSchema(BaseModel):
    username: str
    password: str
    
    
    class Config:
        orm_mode = True