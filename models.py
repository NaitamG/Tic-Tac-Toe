from app import db

class Leaderboard(db.Model):
    username = db.Column(
        db.String(80),
        unique=True,
        nullable=False,
        primary_key=True
    )
    score = db.Column(
        db.Integer, 
        default=100,
        nullable=False
    )
    def __repr__(self):
        return '<Leaderboard %r>' % self.username