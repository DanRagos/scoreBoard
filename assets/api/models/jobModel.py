from sqlalchemy import Column, Integer, String, Boolean, Double, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from assets.api.db.database import Base
from assets.api.models.schedulesModel import Schedule

class JobInfo(Base):
    __tablename__ = 'job_info'

    id = Column(Integer, primary_key=True, autoincrement=True)
    jobSchedule_id = Column(Integer, ForeignKey('job_schedule.id'), index=True)
    idStart = Column(Integer)
    idEnd = Column(Integer)
    timestampStart = Column(DateTime)
    timestampEnd = Column(DateTime)
    count = Column(Double)
    reject = Column(Double)
    operator = Column(String(45))
    jobStatus = Column(Integer, ForeignKey('list_jobstatus.id'), index=True)
    hasDtCause = Column(Boolean, default=False)
    rejectRemarks = Column(Text)

    job_schedule = relationship('Schedule', backref='job_info', overlaps="job_info")
    job_status = relationship('JobStatus', backref='job_info', overlaps="job_info")


class JobStatus (Base):
    __tablename__ = 'list_jobstatus'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    isArchived = Column (Integer)
