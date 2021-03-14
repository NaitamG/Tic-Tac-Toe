"""This models the table that the db access"""
from app import DB

class Leaderboard(DB.Model):
    """This setsup the table on the python side with two columns"""

    username = DB.Column(
        DB.String(80), unique=True, nullable=False, primary_key=True
    )
    score = DB.Column(DB.Integer, default=100, nullable=False)

    def __repr__(self):
        return '<Leaderboard %r>' % self.username
