from sqlalchemy import Column, Integer, String, Boolean, Double, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from assets.api.db.database import Base
from typing import Optional
from assets.api.models.deviceModel import Device

class Schedule(Base):
    __tablename__ = "job_schedule"

    id : Optional[int] = Column(Integer, primary_key=True, autoincrement=True)
    device_id = Column(Integer, ForeignKey('device.id'))
    job = Column(String(45))
    model = Column(String(45))
    material = Column(String(45))
    target = Column(Double, nullable=False)
    prewarn = Column(Double, nullable=False)
    prescale = Column(Float, nullable=False)
    cycletime = Column(Integer, nullable=False)
    schedule_created = Column(DateTime)
    schedStart = Column(DateTime)
    schedEnd = Column(DateTime)
    autoEndStatus = Column(Boolean, default=False)
    jobInfo_startTime = Column(DateTime)
    jobInfo_endTime = Column(DateTime)
    operator = Column(String(45))
    jobSchedule_status = Column(Integer, default=False)
    isOngoing = Column(Boolean, default=False)
    isLocked = Column(Boolean, default=False)
    currentEditUser = Column(Integer)
    isArchived = Column(Boolean, default=False)
    wdtEnabled = Column(Boolean, default=True)

    device_relationship = relationship("Device", back_populates="schedules", overlaps="device")
