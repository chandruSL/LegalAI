import models
import database
import security
from sqlalchemy.orm import Session

# Initialize Database
models.Base.metadata.create_all(bind=database.engine)
db = database.SessionLocal()

def seed_data():
    print("re-creating database tables...")
    models.Base.metadata.drop_all(bind=database.engine)
    models.Base.metadata.create_all(bind=database.engine)
    
    print("Seeding data...")

    # Create Lawyers
    lawyer1 = models.User(
        email="lawyer1@example.com",
        full_name="Advocate A. Murugan",
        hashed_password=security.get_password_hash("password123"),
        role=models.UserRole.LAWYER.value
    )
    lawyer2 = models.User(
        email="lawyer2@example.com",
        full_name="Advocate B. Verma",
        hashed_password=security.get_password_hash("password123"),
        role=models.UserRole.LAWYER.value
    )
    
    db.add(lawyer1)
    db.add(lawyer2)
    db.commit()
    db.refresh(lawyer1)
    db.refresh(lawyer2)

    # Create Clients
    client1 = models.User(
        email="client1@example.com",
        full_name="Rahul Kumar",
        hashed_password=security.get_password_hash("password123"),
        role=models.UserRole.CLIENT.value,
        linked_lawyer_id=lawyer1.id
    )
    client2 = models.User(
        email="client2@example.com",
        full_name="Priya Singh",
        hashed_password=security.get_password_hash("password123"),
        role=models.UserRole.CLIENT.value
    ) # Not linked

    db.add(client1)
    db.add(client2)
    db.commit()
    db.refresh(client1)

    # Create Cases
    case1 = models.Case(
        title="Property Dispute in Delhi",
        description="Legal dispute regarding ancestral property partition in South Delhi.",
        client_id=client1.id,
        lawyer_id=lawyer1.id,
        status=models.CaseStatus.OPEN.value
    )
    
    case2 = models.Case(
        title="Defamation Notice",
        description="Notice received from former employer regarding social media post.",
        client_id=client1.id,
        lawyer_id=lawyer1.id,
        status=models.CaseStatus.PENDING.value
    )

    db.add(case1)
    db.add(case2)
    db.commit()

    print("Seeding Complete!")
    print("Users Created:")
    print(" - Lawyer: lawyer1@example.com / password123")
    print(" - Lawyer: lawyer2@example.com / password123")
    print(" - Client: client1@example.com / password123 (Linked to Lawyer 1)")
    print(" - Client: client2@example.com / password123")

if __name__ == "__main__":
    try:
        seed_data()
    except Exception as e:
        print(f"Error seeding data: {e}")
    finally:
        db.close()
