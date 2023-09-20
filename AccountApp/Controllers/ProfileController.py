from ..models import UserProfile, Ledger
from ..BaseApp.Profiles import Investor


activeUsers = []

def createProfile(name_entry, rate_entry):
    newUser = Investor(name_entry, rate_entry)
    inst_Ledger = Ledger()
    inst_Ledger.save()
    result = UserProfile.objects.create(name=name_entry, rate=rate_entry, ledger=inst_Ledger)
    activeUsers.append(newUser)
    return result

def LedgerBalance():
    pass

    


def loadProfile(name_query):
    pass




def updateProfile():
    pass


def deleteProfile():
    pass
