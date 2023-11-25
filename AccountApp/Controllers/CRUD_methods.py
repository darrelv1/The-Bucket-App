from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.db.models import ManyToOneRel
import re

from ..models import Ledger, userLedger1, userLedger2, userLedger3, AppLedger, UserProfile
# Custome Built Serializers
from ..serializers import (AccountSerializer
, CreateAccountSerializer
, DeleteAccountSerializer
, UserLedgerSerializer
, userLedgers_Serializer
, CreateUserLedgerSerializer
, CreateUserLedgerSerializer2
, DeleteUserLedSerializer
, splitSerializer
, Ledger_Serializer
                           )
# Django provide serializers
from django.core.serializers import serialize

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
import json

"""GENERIC HELPERS"""


# plug-in pass through mutiple params
def call_function(func, *args, ):
    return func(*args)


# dynamic func to get target object by name or id
def get_SpecificLedgerID_by(MDL, field, value):
    letter_pattern = re.compile(r"[A-Za-z]+")
    number_pattern = re.compile(r"[0-9]+")
    # first entry in the model
    default = MDL.objects.order_by('id').first().id

    switcher = {
        "id": MDL.objects.get(id=(
            int(value) if
            number_pattern.search(value) else
            default
        )),
        "name": UserProfile.objects.get(name=(
            str(value) if
            letter_pattern.search(value) and field == "name" else
            "Darrel"
        ))
    }

    product = switcher.get(field)
    return product


# mini-func get target object
def get_SpecificLedgerID(MDL, id):
    return MDL.objects.get(id=id)


# Get Related_Names from the Many to One - (optional)
def get_relatedNames_Many2One(MDL):
    # Gather a collection of the model's field
    ledger_fields = MDL._meta.get_fields()
    related_names = []
    # iterate through to validate if it's one to many field
    for field in ledger_fields:
        if isinstance(field, ManyToOneRel):
            related_names.append(field.related_name)
    return related_names


# get all AppLedgers    
def getAppLedgers():
    subclasses = AppLedger.__subclasses__()
    container = [miniledger for miniledger in subclasses]
    return container


# applying function to each subclass of AppLedger
def getAppLedgersF(func):
    subclasses = AppLedger.__subclasses__()
    container = [func(miniledger) for miniledger in subclasses]
    return container


# applying function to each subclass of AppLedger and the main Ledger
def getLedgersF(func):
    subclasses = AppLedger.__subclasses__()
    allLedgers = [ele for ele in subclasses]
    allLedgers.append(Ledger)
    container = [func(ledger) for ledger in allLedgers]
    return container


# UserID matchup with ledger and subledger model
def getledger_byUserid(userID):
    def innerFunction(ledger):
        try:

            complete = True if ledger.objects.filter(user_id=userID).first() != None else False
            # print(ledger.objects.filter(user_id=userID).first())
            # print(complete)
            return ledger if complete else None
        except:
            print(f"didn't work for {ledger}")

    listing = getLedgersF(innerFunction)
    targetLedger = list(filter(lambda x: x is not None, listing))
    # print(targetLedger[0])
    return targetLedger[0]


# WHERE YOU LEFT OFF APRIL23 *****************************************
# ************************
# get UserId by UserName
def getuserId_byUserName(nameINPUT):
    profile = UserProfile.objects.filter(name=nameINPUT).first()

    return profile.id


# All data deleted
def genericDeleteAll(MDL):
    desc = MDL.__str__()
    MDL.objects.all().delete()
    return HttpResponse(f"<h1>DELETED {desc}</h1>")


# With a target ID
def genericDelete(MDL, id):
    targetLedger = get_SpecificLedgerID(MDL, id)
    desc = targetLedger.__str__()
    targetLedger.delete()
    return HttpResponse(f"<h1>ledger {desc} delete</h1>")


# error handling decorator
def delete_Error_Decorator(func):
    def wrapper(request, *args, **kwargs):
        try:
            result = func(request, *args, **kwargs)
            reBalance()
        except Exception as e:
            result = HttpResponse("Deletion Error: " + str(e), status=500)
        return result

    return wrapper


# Generic Error Decorator
def Error_Decorator(func):
    def wrapper(request, *args, **kwargs):
        try:
            result = func(request, *args, **kwargs)
            reBalance()
        except Exception as e:
            result = HttpResponse("General Error: " + str(e), status=500)
        return result

    return wrapper


def NameQuery_Decorator(func):
    def wrapper(request, *args, **kwargs):
        string = func(request, *args, **kwargs)
        User = get_SpecificLedgerID_by(UserProfile, "name", string)
        UserID = User.id
        userActivityList = []
        userActivityList += Ledger.objects.filter(userledger1__user_id=UserID)
        userActivityList += Ledger.objects.filter(userledger2__user_id=UserID)
        userActivityList += Ledger.objects.filter(userledger3__user_id=UserID)
        return Response(Ledger_Serializer(userActivityList, many=True).data, status=status.HTTP_200_OK)

    return wrapper


def NameQuery_Decorator_SubLedger(func):
    def wrapper(request, *args, **kwargs):
        string = func(request, *args, **kwargs)
        User = get_SpecificLedgerID_by(UserProfile, "name", string)
        UserID = User.id
        userActivityList = []
        userActivityList += userLedger1.objects.filter(user_id=UserID)
        userActivityList += userLedger2.objects.filter(user_id=UserID)
        userActivityList += userLedger3.objects.filter(user_id=UserID)
        return Response(userLedgers_Serializer(userActivityList, many=True, fields=(
        'id', 'balance', 'debit', 'credit', 'ledger_id', 'user_id', 'description', 'date')).data,
                        status=status.HTTP_200_OK)

    return wrapper


# Rebalance's Target Model
def modifyBalance(MDLobj):
    currentID = MDLobj.id
    try:
        arrayPrevs = MDLobj.__class__.objects.filter(id__lt=currentID)
        prevObj = arrayPrevs.last()
        prevBalance = prevObj.balance

    except:
        prevBalance = 0
        MDLobj.balance = prevBalance

    netAmount = MDLobj.debit + MDLobj.credit
    MDLobj.balance = prevBalance + netAmount
    MDLobj.save()
    return MDLobj.balance


# Works with modifyBalance and reBalance
def balance(MDL):
    allEntries = MDL.objects.all()
    new_Balances = []
    for item in allEntries:
        new_Balances.append(modifyBalance(item))
    return new_Balances


# reBalances all Ledger Models
def reBalance():
    getLedgersF(balance)


# Serialization and creation of any model with error handler
def RESTcreateLedger(serializer_class, Requestdata):
    message = ""
    try:
        serializer = serializer_class(data=Requestdata)
        if serializer.is_valid():
            serializer.save()
            message = f"Serializer was validated for {Requestdata}"
            print(message)
        else:
            message = f"Serializer did not validated {Requestdata}, the error is {serializer.errors}"


    except Exception as e:
        message = f"{serializer_class.__class__} as failed to complete the serialzation due to {e}"

    print(message)
    return message


"""
the split will be able to handle any entry regardless if it was included 
in a entry split or just a single entry on it's own
"""


# Split decorator
@delete_Error_Decorator
def split_Decorator(func):
    def wrapper(MDL, id):
        try:
            refLedger = MDL.objects.get(id=id)
            ledger_ID = refLedger.ledger_id
            userLedgers = getAppLedgers()
            func(Ledger, ledger_ID)
            for userLedger in userLedgers:
                # utilizing the ledger id of the intial query to collect each userledger's corresponding related obj
                if userLedger.objects.get(ledger_id=ledger_ID) != None:
                    userLedger_line = userLedger.objects.get(ledger_id=ledger_ID)
                    id = userLedger_line.id
                    func(userLedger, id)
                else:
                    pass

            return "split success"
        except Exception as e:
            print(e)
            return "split failed"

    reBalance()
    return wrapper


# Converts column-oriented structure to a row oriented structure
def to_row_oriented(data):
    row_oriented_data = []
    for value in data.values():
        for value_index in range(len(value)):
            blank = {key.lower(): data[key][value_index] for key in data}
            row_oriented_data = [*row_oriented_data, blank]

    return row_oriented_data


def csv_handler1(csvfile):
    pre_postdata = {}
    for row_ind, row in enumerate(csvfile):
        if row_ind == 0:
            headers = [x for x in row.keys()]
            # print(f"{row_ind}  headers:{headers}")
            # print(row)

        for key, value in row.items():
            if row_ind == 0:
                pre_postdata[key] = value
            else:
                present_value = pre_postdata[key]
                pre_postdata[key] = [present_value, value]
    return pre_postdata
