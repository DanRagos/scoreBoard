from pydantic import BaseModel
from typing import Optional


class DeviceSchema(BaseModel):
    id: int
    node_id: str
    user_id: int
    devicename: str
    description: str
    devicetype: str
    node_reference_code: str
    isprivate: bool
    issearchable: bool
    state: bool
    inUse: bool
    deviceCluster_id: int
    isArchived: bool
    onBacklog: bool
    hasSchedule: bool
    deviceOrder: int
    
    class Config:
        orm_mode = True