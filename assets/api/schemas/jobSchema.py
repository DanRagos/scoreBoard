from pydantic import BaseModel
from datetime import datetime

class JobInfoSchema (BaseModel):
    id: int
    jobSchedule: int
    idStart : int
    idEnd : int
    timestampStart : datetime
    timestampEnd : datetime
    count : float
    reject : float
    operator : str
    jobStatus : int
    hasDtCause : int
    rejectRemarks : str


class JobStatusSchema (BaseModel):
    id : int
    name : str
    isArchived : int



