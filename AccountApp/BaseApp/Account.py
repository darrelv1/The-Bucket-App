import pandas as pd

#from IPython.core.display import display

import functools
import itertools


class Account:
    def __init__(self):
        self._table = pd.DataFrame({
            "Date": ""
            , "Debit": 0.00
            , "Credit": 0.00
            , "Balance": 0.00
            , "Description": ""
        }, index=[0])
        self.tableLength = len(self._table.index)
        self._balance = 0.00

    @property
    def table(self):
        return self._table

    @property
    def balance(self):
        return self._balance

    @table.setter
    def table(self, row):

        # try:
        if len(row) == (len(self._table.columns) - 2):
            """
            Adjusting the row
            """
            prevBal = self._table.loc[len(self._table.index) - 1, "Balance"] if len(self._table.index) != 0 else 0.00
            futureBal = prevBal + row[1]
            row.insert(2, 0.00) if row[1] > 0.00 else row.insert(1, 0.00)
            row.insert(3, futureBal)

            """
            Adding the row
            """
            self._table.loc[len(self._table.index)] = row
            self._balance = self.table.loc[self.tableLength, "balance"]
        else:
            print("Array must have 5 items, Date, Debit, Credit, Balance and a Description!")
        # except TypeError:
        #     print("Must be an List or Array type")
        # except:
        #     print("Something else went wrong please review the Call Stack")

    @table.deleter
    def table(self):
        del self._table

    def deleteRow(self, index):
        self._table.drop(index)


class InvestorAccount(Account):
    def __init__(self, name, rate):
        self.investor = name
        self.ownership = rate
        super().__init__()




"""
All Transactions will be posted here
This obj will action the transacton split
"""

# class Transactions:
#     @classmethod
#     def monthlyMortgage(cls, gl):
#         gl.postSplit(DATA.PAYMENT["Monthly"])
#     @classmethod
#     def monthlyPersonal(cls, account):
#         pass



class GeneralLedger(Account):
    def __init__(self):
        super().__init__()
        self.identity = "General Ledger Account for all Inventory"
        self.investors = []

    def addInvestors(self, *args):
        for investor in args:
            self.investors.append(investor)

    def postEntry(self, entry):
        self.table = entry

    # for the use to assign values to properties of table

    @classmethod
    def assignment(cls, obj, value):
        obj.account.table = value
        print(value)

    def postSplit(self, entry):
        # modify the amount to match the split and give everyone their share
        split_amount = lambda amount, rate: amount * rate

        result = list(map(lambda inv: GeneralLedger.assignment(inv,
                                         [entry[0], split_amount(entry[1],
                                          inv.account.ownership),
                                          entry[2]]), self.investors))
        return result

    def displayInvestors(self):
        InvestorTables = list(map(lambda i: display(i.account.table), self.investors))
        return InvestorTables