from .models import Ledger
def add():
    come = Ledger(date="2022-12-22", debit=150, credit=105, balance=1200, description="dummy")
    come.save()
    Ledger.objects.create(date="2022-12-22", debit=150, credit=105, balance=1200, description="dummy")
    print("hello")



