from abc import abstractmethod, ABC

#from IPython.core.display import display

from .Account import InvestorAccount


class Profile(ABC):

    def __init__(self):
        pass

    @abstractmethod
    def showAccount(self):
        pass


class BarberOwner(Profile):
    def __init__(self, name):
        super().__init__()
        self.name = name


class Investor(Profile):
    def __init__(self, name, rate):
        super().__init__()
        self.name = name
        self.rate = rate
        self.account = InvestorAccount(name, rate)
        self._balance = 0.00

    @property
    def balance(self):
        return self.account.balance

class UserInvestor(Profile):
    def __init__(self, name, rate, account):
        super().__init__()
        self.name = name
        self.rate = rate
        self.account = account
        self._balance = 0.00

    @property
    def balance(self):
        return self.account.balance

    # def showAccount(self):
    #     display(self.account.table)

# class Personal(Profile):
#     def __init__(self, name):
#         super().__init__()
#         self.name = name
#         #Barbering TrailBalance profit or loss
#         self.BarberAccount = Account()
#         #TD Credit Account
#         self.CreditAccount = Account()
#         #TD Chequing Account
#         self.DebitAccount = Account()
#         #investorAccount
#         self.affilatedInvestorProfile = Investor(name, 0.28)


