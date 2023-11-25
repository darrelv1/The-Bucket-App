import pandas as pd
from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from .Controllers import ProfileController
from django.db.models import ForeignKey
from django.db.models import ManyToOneRel
from django.apps import apps
from functools import reduce
import csv
# Models
from .models import (Ledger, userLedger1, userLedger2, userLedger3, AppLedger,
                     UserProfile, Expenses)
# Custome Built Serializers
import io
from .serializers import (
    AccountSerializer
, CreateAccountSerializer
, DeleteAccountSerializer
, UserLedgerSerializer
, CreateUserLedgerSerializer
, CreateUserLedgerSerializer2
, DeleteUserLedSerializer
, splitSerializer
, CreateLedgerSerializer
, Ledger_Serializer
, userLedgers_Serializer
, Bills_Serializer
, testing
    # ,FullLedgerSerializer
)

# CRUD plugins:
from .Controllers.CRUD_methods import (
    call_function
, get_SpecificLedgerID
, get_SpecificLedgerID_by
, getAppLedgers
, getAppLedgersF
, getledger_byUserid
, getuserId_byUserName
, get_relatedNames_Many2One
, genericDelete
, genericDeleteAll
, delete_Error_Decorator
, Error_Decorator
, split_Decorator
, reBalance
, NameQuery_Decorator
, NameQuery_Decorator_SubLedger
, RESTcreateLedger
)
# Django provide serializers
from django.core.serializers import serialize
from rest_framework import generics, status
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .TheBucketObject.bucket import Buckets
from datetime import datetime
import json

"""
********************************
ALL GET REQUESTS
********************************
"""

"""ALL LEDGERS"""


# Get all userLedger objects
class getAll_userLedgers(APIView):
    def get(self, request, format=None):
        allLedgers = getAppLedgers()
        allLedger = list(map(lambda curr_ledger: list(curr_ledger.objects.all()), allLedgers))
        merge = reduce(lambda accum, iterable: accum + iterable, allLedger)
        serializer = userLedgers_Serializer(merge, many=True,
                                            fields=('date', 'debit', 'credit', 'balance', 'user', 'ledger', 'userName'))
        return Response(serializer.data, status=status.HTTP_200_OK)


"""LEDGER"""


# get Main Ledger by id
class getLedgerby_id(APIView):
    def get(self, request, id, format=None):
        data = get_SpecificLedgerID_by(MDL=Ledger, field="id", value=id)
        serializer = Ledger_Serializer(data)
        return Response(serializer.data)


# Get Ledger Objs by User Name
class getLedgersby_Name(APIView):
    @NameQuery_Decorator
    def get(self, request, string, format=None):
        return string


class getLedgerAll(APIView):
    def get(self, request):
        data = Ledger.objects.all()

        Ledger_All = Ledger_Serializer(data, many=True)
        return Response(Ledger_All.data, status=status.HTTP_200_OK)


"""SUBCLASS LEDGERS"""


# get through a search of subLedgers by id
class getUserLedgersby_id(APIView):
    serializer_class = userLedgers_Serializer

    def get(self, request):
        userLedger1.objects.get(id=22)
        serializer = self.serializer_class(model_class=userLedger1, data=request.data,
                                           fields=('amount', 'description', 'date'))
        if serializer.is_valid():
            serializer.save()
            print("it did save")
        else:
            print("not Valid")
        return Response(status=status.HTTP_202_ACCEPTED)


# UserLedger by Name
class getUserLedgerby_name(APIView):
    @NameQuery_Decorator_SubLedger
    def get(self, request, string, format=None):
        return string


"""USERPROFILES"""


# Provides list of all the UserProfiles
class getUserProfilesby_Name(APIView):
    def get(self, request, ):
        usersNames = UserProfile.objects.values_list("name", flat=True)
        print(usersNames)
        return Response(list(usersNames), status=200)


# Create a Ledger Object
class createLedger(APIView):
    serializer_class = CreateLedgerSerializer

    @Error_Decorator
    def post(self, request, format=None):
        RESTcreateLedger(self.serializer_class, request.data)
        # serializer = self.serializer_class(data=request.data)
        # if serializer.is_valid():
        #     serializer.save()
        return Response(Ledger_Serializer(Ledger.objects.all(), many=True).data, status=status.HTTP_202_ACCEPTED)


# in progress for a post
class inProgress(APIView):
    serializer_class = userLedgers_Serializer

    def post(self, request):
        userLedger1.objects.get(id=22)
        serializer = self.serializer_class(model_class=userLedger1, data=request.data,
                                           fields=('amount', 'description', 'date'))
        if serializer.is_valid():
            serializer.save()
            print("it did save")
        else:
            print("not Valid")
        return Response(status=status.HTTP_202_ACCEPTED)


# Gets all appledger
class getAllsubledger(APIView):
    def get(self, request, format=None):
        appledgers = getAppLedgers()
        # filters to allow include empty ledgers
        appledgers = [ledger for ledger in appledgers if ledger.objects.all().count() == 0]
        strLedgers = [str(ledger._meta) for ledger in appledgers]
        # print(strLedgers[0])
        print(strLedgers)
        return Response(strLedgers, status=status.HTTP_202_ACCEPTED)


"""
********************************
    ALL DELETE REQUESTS
********************************
"""

"""LEDGER"""


# deletes all main LedgerEntries
@delete_Error_Decorator
def deleteALLledger(request):
    genericDeleteAll(Ledger)
    return HttpResponse("<h1>All Deleted</h1>")


# delete specific LedgerEntry
@delete_Error_Decorator
def deleteLedger(request, id):
    return genericDelete(Ledger, id)


"""ALL APPLEDGER SUBCLASSES"""


# deletes all Entries from AppLedger subclasses
@delete_Error_Decorator
def deleteALLsubclasses(request):
    getAppLedgersF(genericDeleteAll)
    return HttpResponse("<h1>All Deleted</h1>")


# deletes entry by the id of entry itself and also the subledger it's in

class dynamic_Delete(APIView):
    def get(self, request, id, userid, format=None):
        if userid != 1000:
            targetLedger = getledger_byUserid(userid)
        else:
            targetLedger = Ledger
        targetLedger.objects.filter(id=id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


"""USERLEDGER1"""


# deletes all Entries from AppLedger subclasses
@delete_Error_Decorator
def deleteALL_userledger1(request):
    return genericDeleteAll(userLedger1)


# delete specific LedgerEntry
@delete_Error_Decorator
def delete_userledger1(request, id):
    return genericDelete(userLedger1, id)


"""USERLEDGER2"""


# deletes all Entries from AppLedger subclasses
@delete_Error_Decorator
def deleteALL_userledger2(request):
    return genericDeleteAll(userLedger2)


# delete specific LedgerEntry
@delete_Error_Decorator
def delete_userledger2(request, id):
    return genericDelete(userLedger2, id)


"""USERLEDGER3"""


# deletes all Entries from AppLedger subclasses
@delete_Error_Decorator
def deleteALL_userledger3(request):
    return genericDeleteAll(userLedger3)


# delete specific LedgerEntry
@delete_Error_Decorator
def delete_userledger3(request, id):
    return genericDelete(userLedger3, id)


# ***SPLIT***

# subledger delete all affiliated entries from all ledgers
# alternative generic delete method
@split_Decorator
def genericDelete_alt(MDL, id):
    targetLedger = get_SpecificLedgerID(MDL, id)
    desc = targetLedger.__str__()
    targetLedger.delete()


def delete_split1(request, id):
    genericDelete_alt(userLedger1, id)
    return HttpResponse(f"<h1>deleted {id} </h1>")


def delete_split2(request, id):
    genericDelete_alt(userLedger2, id)
    return HttpResponse(f"<h1>deleted {id} </h1>")


def delete_split3(request, id):
    genericDelete_alt(userLedger3, id)
    return HttpResponse(f"<h1>deleted {id} </h1>")


"""
********************************
ALL CREATE REQUESTS
********************************
"""


# Creates a new instance for the Ledger DB
class createEntry_Ledger(APIView):
    serializer_class = CreateLedgerSerializer

    @Error_Decorator
    def post(self, request, format=None):
        RESTcreateLedger(self.serializer_class, request.data)
        return Response(Ledger_Serializer(Ledger.objects.all(), many=True).data, status=status.HTTP_202_ACCEPTED)

    # WHERE YOU LEFT OFF APRIL23 *****************************************


# ************************
# Creates a new instance of a userLedger DB
class createEntry_userLedgers(APIView):
    serializer_class = userLedgers_Serializer

    def post(self, request):
        print(request.data.keys())
        try:
            print(f"request.data['MDL'] {request.data['MDL']}")
        except:
            print("no MDL here")

        print(f"request user => {request.data['user']}")
        try:
            targetID = getuserId_byUserName(request.data['user'])
            print(f"The Target ID is {targetID}")
            targetLedger = getledger_byUserid(targetID)
        except:
            mdl_array = request.data['MDL'].split(".")
            targetLedger = apps.get_model(app_label=mdl_array[0], model_name=mdl_array[1])
        print(f"currentResult {targetLedger}")
        request.data['user_id'] = getuserId_byUserName(request.data['user'])
        serializer = self.serializer_class(model_class=targetLedger, data=request.data,
                                           fields=('amount', 'description', 'date', 'user_id'))
        if serializer.is_valid():
            serializer.save()
            print("it did save")
        else:
            print("not Valid")
        reBalance()
        return Response(status=status.HTTP_202_ACCEPTED)

    # Modifies entry
    def put(self, request, pk):
        print(pk)
        user = request.data['user']
        ledger = getledger_byUserid(getuserId_byUserName(user)) if user != "All Users" else Ledger
        print(f"TARGET ID IS {ledger}")
        try:
            model_instance = ledger.objects.get(id=pk)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        print(f"model_instance: {model_instance}")

        serializer = userLedgers_Serializer(model_instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            reBalance()
            if ledger == Ledger:
                mdl_array = get_relatedNames_Many2One(ledger)
                applabel = ledger._meta.app_label
                # create a iteration of the related mdls of the ledger
                mdl_array = list(map(lambda x: apps.get_model(app_label=applabel, model_name=x), mdl_array))
                for i in mdl_array:
                    # dir(i)
                    print(f"acutal instance {i.objects.filter(ledger_id=pk)}")
                    instance1 = dir(i.objects)
                    # print(f"instance 1{instance1}")
                    try:
                        instance = i.objects.filter(ledger_id=pk)
                        print(instance)
                        subSerializer = userLedgers_Serializer(instance[0], data=request.data, split=True)
                        if subSerializer.is_valid():
                            subSerializer.save()
                            reBalance()
                            print(f"this SUB-MODEL did save , {i}")
                    except:
                        print(f"this model, {i},  didn't have a match")
                # mdl = apps.get_model(app_label = applabel, model_name = a[0])
                print(f"what is a {mdl_array}")
            else:
                # from the userLedger to baseLedger
                legID = model_instance.ledger_id
                baseLedger = Ledger.objects.get(id=legID)
                ledger = baseLedger
                serializer_ledger = userLedgers_Serializer(ledger, data=request.data)
                if serializer_ledger.is_valid():
                    serializer_ledger.save()
                    reBalance()
                # Repeating the ledger
                mdl_array = get_relatedNames_Many2One(ledger)
                print(f"mdl_array {mdl_array}")
                applabel = ledger._meta.app_label
                # create a iteration of the related mdls of the ledger
                mdl_array = list(map(lambda x: apps.get_model(app_label=applabel, model_name=x), mdl_array))
                for i in mdl_array:
                    # dir(i)
                    print(f"acutal instance {i.objects.filter(ledger_id=legID)}")
                    instance1 = dir(i.objects)
                    # print(f"instance 1{instance1}")
                    try:
                        instance = i.objects.filter(ledger_id=legID)
                        print(instance)
                        subSerializer = userLedgers_Serializer(instance[0], data=request.data, split=True)
                        if subSerializer.is_valid():
                            subSerializer.save()
                            reBalance()
                            print(f"this SUB-MODEL did save , {i} FOR THE USERLEDGER")
                    except:
                        print(f"this model, {i},  didn't have a match FOR THE USERLEDGER")
                # mdl = apps.get_model(app_label = applabel, model_name = a[0])
                print(f"what is a {mdl_array}")

            return Response(status=status.HTTP_202_ACCEPTED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


"""
********************************
ALL UPDATE REQUESTS
********************************
"""


def delALLappledger(request):
    AppLedger.__subclasses__()
    a = [e.objects.all().delete() for e in AppLedger.__subclasses__()]
    return HttpResponse("<h1>All Deleted</h1>")


def delALLusers(request):
    UserProfile.objects.all().delete()
    return HttpResponse("<h1>All Deleted</h1>")


def getLastItem():
    lastitem = Ledger.objects.order_by('id').last()
    return lastitem


class LedgerView(generics.CreateAPIView):
    queryset = Ledger.objects.all()
    serializer_class = AccountSerializer


# Handles a Post Request to General Ledger
class CreateAccountView(APIView):
    serializer_class = CreateAccountSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        # serialize to python primitive type and see if the data sent was valid
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():

            date = serializer.data.get('date')
            amount = serializer.data.get('debit')
            description = serializer.data.get('description')

            queryset = Ledger.objects.filter(description="THis aa is the last item in the ledger")
            # queryset = Ledger.objects.filter(self.request.session.session_key)
            # Modifies if previous record exists
            if queryset.exists():
                ledger = queryset[0]
                ledger.date = date

                ledger.debit = (amount if amount > 0 else 0)
                ledger.credit = (amount if amount < 0 else 0)
                ledger.description = description
                ledger.save(update_fields=['date', 'debit', 'description'])
            # Creates new record
            else:

                ledger = Ledger(date=date, debit=amount, description=description) if amount > 0 else Ledger(date=date,
                                                                                                            credit=amount,
                                                                                                            description=description)
                ledger.save()

            return Response(AccountSerializer(ledger).data, status=status.HTTP_202_ACCEPTED)


class DeleteAccountView(APIView):
    serializer_class = DeleteAccountSerializer

    def delete(self, request, id, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            print("Serializer is valid")
        print(id)
        # Will Get the item and then delete it
        ledger = Ledger.objects.get(id=id)
        ledger.delete()

        # Pulling a query of all the items in the ledger
        all_ledger = Ledger.objects.all()
        return Response(AccountSerializer(all_ledger, many=True).data, status=status.HTTP_201_CREATED)


class DeleteUserView(APIView):
    serializer_class = DeleteUserLedSerializer

    def delete(self, request, id, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            print("Serializer is valid")
        print(id)
        # Will Get the item and then delete it
        ledger = userLedger1.objects.all().delete()
        # ledger.delete()

        # Pulling a query of all the items in the ledger
        all_ledger = userLedger1.objects.all()
        return HttpResponse('<h1>All Deleted</h1>')
        # return Response(UserLedgerSerializer(all_ledger, many=True).data,status=status.HTTP_201_CREATED)


class UserLedgerPOST(APIView):
    serializer_class = CreateUserLedgerSerializer2 if userLedger1.objects.all().count() > 0 else CreateUserLedgerSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            print("Serializer is valid")

        date = serializer.data.get('date')
        amount = serializer.data.get('amount')
        description = serializer.data.get('description')
        user = serializer.data.get('userName')
        rate = serializer.data.get('rate')

        # Main Ledger Instance
        tempLedger = Ledger(date=date, debit=amount, description=description) if amount > 0 else Ledger(date=date,
                                                                                                        credit=amount,
                                                                                                        description=description)
        tempLedger.save()

        if not userLedger1.objects.exists():
            instUserPro = UserProfile(name=user, rate=rate)
            instUserPro.save()

        tempLine = userLedger1(date=date,
                               debit=amount if amount > 0 else 0,
                               credit=amount if amount < 0 else 0,
                               description=description,
                               ledger=tempLedger,
                               user=None if userLedger1.objects.exists() else instUserPro)

        tempLine.save()

        allItems = userLedger1.objects.all()

        return Response(UserLedgerSerializer(allItems, many=True).data, status=status.HTTP_201_CREATED)


class UserLedgerPOST2(APIView):
    serializer_class = CreateUserLedgerSerializer2 if userLedger2.objects.all().count() > 0 else CreateUserLedgerSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            print("Serializer is valid")

        date = serializer.data.get('date')
        amount = serializer.data.get('amount')
        description = serializer.data.get('description')
        user = serializer.data.get('userName')
        rate = serializer.data.get('rate')

        # Main Ledger Instance
        tempLedger = Ledger(date=date, debit=amount, description=description) if amount > 0 else Ledger(date=date,
                                                                                                        credit=amount,
                                                                                                        description=description)
        tempLedger.save()

        if not userLedger2.objects.exists():
            instUserPro = UserProfile(name=user, rate=rate)
            instUserPro.save()

        tempLine = userLedger2(date=date,
                               debit=amount if amount > 0 else 0,
                               credit=amount if amount < 0 else 0,
                               description=description,
                               ledger=tempLedger,
                               user=None if userLedger2.objects.exists() else instUserPro)

        tempLine.save()

        allItems = userLedger2.objects.all()

        return Response(UserLedgerSerializer(allItems, many=True).data, status=status.HTTP_201_CREATED)


class UserLedgerPOST3(APIView):
    serializer_class = CreateUserLedgerSerializer2 if userLedger3.objects.all().count() > 0 else CreateUserLedgerSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            print("Serializer is valid")

        date = serializer.data.get('date')
        amount = serializer.data.get('amount')
        description = serializer.data.get('description')
        user = serializer.data.get('userName')
        rate = serializer.data.get('rate')

        # Main Ledger Instance
        tempLedger = Ledger(date=date, debit=amount, description=description) if amount > 0 else Ledger(date=date,
                                                                                                        credit=amount,
                                                                                                        description=description)
        tempLedger.save()

        if not userLedger3.objects.exists():
            instUserPro = UserProfile(name=user, rate=rate)
            instUserPro.save()

        tempLine = userLedger3(
            date=date,
            debit=amount if amount > 0 else 0,
            credit=amount if amount < 0 else 0,
            description=description,
            ledger=tempLedger,
            user=None if userLedger3.objects.exists() else instUserPro
        )

        tempLine.save()

        allItems = userLedger3.objects.all()
        return Response(UserLedgerSerializer(allItems, many=True).data, status=status.HTTP_201_CREATED)


# Split the amount
class entrySplit(APIView):
    serialize_class = splitSerializer

    def post(self, request, format=None):

        serializer = self.serialize_class(data=request.data)

        if serializer.is_valid():
            date = serializer.data.get('date')
            amount = serializer.data.get('amount')
            description = serializer.data.get('description')
            print("Serializer is valid! in the split class")

            subclasses = AppLedger.__subclasses__()
            output = subclasses[0].objects.first()
            mainledger = Ledger.objects.create(
                date=date,
                debit=amount if amount > 0 else 0,
                credit=amount if amount < 0 else 0,
                description=description
            )
            appLedgers = [ele for ele in subclasses]

            def rateExtractor(ele):
                try:
                    userid = ele.objects.first().user.id
                    userobj = UserProfile.objects.get(id=userid)
                    # print(f"userobj: {userobj}\n userobj-type: {type(userobj)}")

                    rateamount = amount * userobj.rate
                    # print(f"rateamount: {rateamount}\n rateamount-type: {type(rateamount)}")

                    currLedger = ele.objects.create(
                        date=date
                        , debit=rateamount if rateamount > 0 else 0
                        , credit=rateamount if rateamount < 0 else 0
                        , description=description
                        , ledger=mainledger
                    )

                    currLedger.save()

                    return currLedger
                except:
                    print("no ID")

            list(map(lambda eleLedger: rateExtractor(eleLedger), appLedgers))
        # instead of using rebalance try using balance() and pass through the objs you want to rebalance OR rebuild the save()
        reBalance()

        return Response(status=status.HTTP_201_CREATED)


"""
********************************
MOCK VIEWS FOR DEBUGGING
********************************
"""


def index(request):
    # result = ProfileController.createProfile("Darrel Valdivieso", 0.45)
    # lastitem = getLastItem()
    # print(lastitem.balance)
    # print(type(lastitem))
    # print("THIS IS WORKING")
    result = "The index page"
    # cal = lastitem.balance + 100
    # print (cal)
    Ledger.objects.create(date="2008-04-30", credit=0, debit=350, description="THis is the last item in the ledger")
    return HttpResponse(f"<h1>{result}</h1>")


def entryPOST(request):
    if request.method == 'POST':
        amount = request.POST.get('amount')
        description = request.POST.get('description')
        # Do something with the data
        print("WORKIINNGGGGGGG!")
        data = {'key': 'value'}
        response = JsonResponse(data)
        response['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        return response
    else:
        print(request.method)
        return JsonResponse({'status': 'error'})


# Debug & playaround
def tester2(request):
    subclasses = AppLedger.__subclasses__()
    output = subclasses[0].objects.first()
    amount = 1200
    mainledger = Ledger.objects.create(date="2008-08-29", debit=amount, description='Split Amount Testing')
    appLedgers = [ele for ele in subclasses]

    def rateExtractor(ele):
        userid = ele.objects.first().user.id
        userobj = UserProfile.objects.get(id=userid)
        # print(f"userobj: {userobj}\n userobj-type: {type(userobj)}")

        rateamount = amount * userobj.rate
        # print(f"rateamount: {rateamount}\n rateamount-type: {type(rateamount)}")
        return ele.objects.create(date="2008-08-29", debit=rateamount, description="Split Amount Testing",
                                  ledger=mainledger)

    list(map(lambda eleLedger: rateExtractor(eleLedger), appLedgers))
    # print(f"output: {appLedgers[0]}\n output-type: {type(appLedgers[0])}")
    subclasses_list = [str(sc.user) for sc in subclasses]
    return JsonResponse(subclasses_list, safe=False)


def tester(request):
    ledger = Ledger.objects.get(id=109)
    # print(ledger._meta.related_objects)
    INSuserledger1 = ledger.userledger1.all()
    INSuserledger2 = ledger.userledger2.all()
    INSuserledger3 = ledger.userledger3.all()
    # print(f'userledger1: {userLedger1}')
    # print(f'userledger2: {userLedger2}')
    # print(f'userledger3: {userLedger3}')

    return JsonResponse({"Hello": "hello"}, safe=False)


"""
************************************************
********                                ********
        ********************************
                   BUCKET API
         *******************************
********                                ********
************************************************
"""

"""
********************************
ALL UPDATE REQUESTS
********************************
"""


class billClass(APIView):
    serializer_class = Bills_Serializer

    def get(self, request):
        all_expenses = Expenses.objects.all()
        bucket = self.serializer_class()
        bucket_data = bucket.make_a_bucket()

        bucket_response = {
            "all_expenses": [{"expenseName": expense.expense_name,
                              "installmentDetails": expense.installment,
                              "expenseAmount": expense.amount,
                              "expense_contributed_amount": expense.contributed_amount,
                              "expected_floating_balance": expense.expected_floating_balance
                              } for expense in bucket_data.expenses],
            "balance": bucket_data.balance,
            "balanceContrib": bucket_data.balance_contrib,
            "balancePostContrib": bucket_data.balance_post_contrib,
            "currentFloatingBalance": bucket_data.current_floating_balance,
            "floatingBalance": bucket_data.floating_balance
        }

        return Response(bucket_response, status=status.HTTP_202_ACCEPTED)

    # def post(self, request):
    #     RESTcreateLedger(self.serializer_class, request.data)
    #     return Response(Bills_Serializer(Expenses.objects.all(), many=True).data,status=status.HTTP_202_ACCEPTED)

    def post(self, request):

        uploaded_files = request.data['files[]']
        uploaded_files.seek(0)

        in_memoryfile = uploaded_files.read().decode('utf-8-sig')
        temp_csv = io.StringIO(in_memoryfile)
        csvfile = csv.DictReader(temp_csv)

        try:
            list_of_objects = []
            for row_ind, row in enumerate(csvfile):
                row = {eachKey.lower(): row[eachKey] for eachKey in row}
                list_of_objects = [*list_of_objects, row]

            print(list_of_objects)
            for each in list_of_objects:
                RESTcreateLedger(Bills_Serializer, each)

            return Response(Bills_Serializer([each for each in list_of_objects], many=True).data,
                            status=status.HTTP_202_ACCEPTED)

        except Exception as e :

            return Response(e, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
