from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from assets.api.db.database import Base
from typing import Optional

class Device(Base):
    __tablename__ = 'device'

    id = Column(Integer, primary_key=True)
    node_id = Column(String(45), index=True)
    user_id = Column(Integer)
    devicename = Column(String(45))
    description = Column(String(45))
    devicetype = Column(String(45))
    node_reference_code = Column(String(45))
    isprivate = Column(Boolean)
    issearchable = Column(Boolean)
    state = Column(Boolean, default=False)
    inUse = Column(Boolean, default=False)
    deviceCluster_id = Column(Integer, index=True, default=0)
    isArchived = Column(Boolean)
    onBacklog = Column(Boolean)
    hasSchedule = Column(Boolean)
    deviceOrder = Column(Integer)

    schedules = relationship('Schedule', backref='device', overlaps="device")
