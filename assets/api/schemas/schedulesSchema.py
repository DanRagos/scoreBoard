from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ScheduleSchema(BaseModel):
    id: int
    device_id: int
    job: str
    model: str
    material: str
    target: float
    prewarn: float
    prescale: float
    cycletime: int
    schedule_created: datetime
    schedStart: datetime
    schedEnd: Optional[datetime]
    autoEndStatus: bool
    jobInfo_startTime: Optional[datetime]
    jobInfo_endTime: Optional[datetime]
    operator: str
    jobSchedule_status: int
    isOngoing: bool
    isLocked: bool
    currentEditUser: Optional[int]
    isArchived: bool
    wdtEnabled: bool
    
    class Config:
        orm_mode = True


class UpdateScheduleSchema(BaseModel):
    job: Optional[str]
    model: Optional[str]
    material: Optional[str]
    target: Optional[float]
    prewarn: Optional[float]
    prescale: Optional[float]
    cycletime: Optional[int]
    schedule_created: Optional[datetime]
    schedStart: Optional[datetime]
    schedEnd: Optional[datetime]
    autoEndStatus: Optional[bool]
    jobInfo_startTime: Optional[datetime]
    jobInfo_endTime: Optional[datetime]
    operator: Optional[str]
    jobSchedule_status: Optional[int]
    isOngoing: Optional[bool]
    isLocked: Optional[bool]
    currentEditUser: Optional[int]
    isArchived: Optional[bool]
    wdtEnabled: Optional[bool]
    
    class Config:
        orm_mode = True
        allow_population_by_field_name = True
