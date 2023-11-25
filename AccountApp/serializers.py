from datetime import datetime

from rest_framework import serializers
from .models import Ledger, userLedger1, userLedger2, userLedger3, UserProfile, Expenses
#CRUD plugins:
#Object Plugins:
from .TheBucketObject.bucket import Buckets
"""
********************************
ALL LEDGER SERIALIZERS
********************************
"""

"""RESPONSE SERIALIZERS"""

class Ledger_Serializer(serializers.ModelSerializer):
    
    class Meta:
        model = Ledger
        fields = '__all__'


class Bills_Serializer(serializers.ModelSerializer):
    class Meta: 
        model = Expenses
        fields = '__all__'


    def make_a_bucket(self):
        all_expenses = Expenses.objects.all()
        fixed_bucket = Buckets("Fixed", "Fixed")

        field_list = Expenses._meta.get_fields()
        output = []
        # make a simple iteration:
        # for exp in all_expenses:
        #     obj = {}
        #     for index,field in enumerate(field_list[1:]):
        #         detail = {}
        #         print(f"index {index}")
        #         obj[field.name] = getattr(exp, field.name)
        #     output = [*output, obj]

        def validate_date(self, value):
            # Assuming the date is in 'day-month-year' format
            try:
                return datetime.strptime(value, '%d-%m-%Y').date()
            except ValueError:
                raise serializers.ValidationError("Date format is incorrect. Expected format: 'DD-MM-YYYY'.")

        for exp in all_expenses:
            obj = {}
            obj['expense'] = getattr(exp, 'expense')
            obj['details'] = {}
            obj['details']['amount'] = getattr(exp, 'amount')
            obj['details']['due_date'] = getattr(exp, 'date').month
            obj['details']['frequency'] = "biweekly"
            output = [*output, obj]

        fixed_bucket.expenses = output
        return fixed_bucket
        # return output
        
    def validated_amount(self, amount):
        try:
            return float(amount)
        except ValueError:
            raise serializers.ValidationError("Amount must be a float")


    def create(self, validated_data):
        instance = Expenses.objects.create(**validated_data)
        return instance

    

class testing(serializers.ModelSerializer):
    userName =serializers.SerializerMethodField('get_username')


    class Meta:
        model = Ledger
        fields = ('id', 'date', 'debit', 'credit',
                'balance', 'description', 'userName')

    def get_username(self, obj):
        userID = self.fields("user")
        print(f"userID {userID}")

        return UserProfile.get(id=userID).name
    


#To serialize request incoming - only necessary fields 
class CreateLedgerSerializer(serializers.ModelSerializer):
    #Entry Form
    amount = serializers.IntegerField()
    
    class Meta:
        model = Ledger
        fields = ('date', 'description', 'amount')
    
    def create(self, validated_data):
      
        instance = Ledger.objects.create(
            date = validated_data['date'],
            description = validated_data['description'], 
            debit = validated_data['amount'] if validated_data['amount'] > 0  else 0,
            credit = validated_data['amount'] if validated_data['amount'] < 0 else 0
        )
        instance.set_balance_Instance()
    
        return instance


class userLedgers_Serializer(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    date = serializers.DateField(required=False)
    debit =serializers.IntegerField(required=False)
    credit = serializers.IntegerField(required=False)
    amount = serializers.IntegerField(required=False)
    balance = serializers.IntegerField(required=False)
    description = serializers.CharField(required=False, max_length=150)
    # user_id = serializers.IntegerField(required=False)
    # ledger_id = serializers.IntegerField(required=False)
    user_id = serializers.PrimaryKeyRelatedField(required=False, queryset=UserProfile.objects.all())
    ledger_id = serializers.PrimaryKeyRelatedField(required=False, queryset=Ledger.objects.all())

    def __init__(self, *args, **kwargs):
        
        # for key in kwargs.keys():
        #     print(f"key:{key}")
        # print("IN the the _INIT__ ")
        self.model_class = kwargs.pop('model_class', None)
        
        try:
            self.split = kwargs.pop('split', None)
        except:
            print("no split")

        try:
            #external fields, notice there is no self reference
            fields = kwargs.pop('fields', None)
        except: 
            print("no field items found")
        
        try:
                
                self.request = kwargs.get('context').get('request')
                
                
                self.HTTPMETHOD = self.request.method
                print(f"HTTP METHOD : {self.HTTPMETHOD}")
                if self.HTTPMETHOD == 'POST':
                    self.fields.pop("balance")
                    #self.fields.pop("user")
                    self.fields.pop("ledger")
                    self.fields.pop("credit")
                    self.fields.pop("debit")
                if self.HTTPMETHOD == 'GET':
                    self.fields.pop("amount")
                if self.HTTPMETHOD == 'PUT':
                    print("PUT METHOD")
                    self.fields.pop("balance")
                    self.fields.pop("user")
                    self.fields.pop("ledger")
                    self.fields.pop("credit")
                    self.fields.pop("debit")
        except:
            a = 1*1

        super().__init__(*args, **kwargs)
        
        # if fields is not None:
        #     #Drop any fields that are not specified in the 'fields' arguement
        #     allowed = set(fields)
        #     existing = set(self.fields)
        #     for field_name in existing - allowed:
        #         self.fields.pop(field_name)

    def create(self, validated_data):

        

        # def getuserId_byUserName(nameINPUT):
        #     print(f'nameInput {nameINPUT}')
        #     profile = UserProfile.objects.filter(name=nameINPUT).first()
        #     print(f"profile.id{profile.id}")
        #     return profile.id
            
       

        ledger = self.model_class(
            date = validated_data.get('date'),
            debit = validated_data['amount'] if validated_data['amount'] > 0  else 0,
            credit = validated_data['amount'] if validated_data['amount'] < 0 else 0,
            description = validated_data.get('description'),
            user = validated_data.get('user_id'),
            ledger = Ledger.objects.create(
                                                date=validated_data.get('date'),
                                                debit = validated_data['amount'] if validated_data['amount'] > 0  else 0,
                                                credit = validated_data['amount'] if validated_data['amount'] < 0 else 0,
                                                description = validated_data.get('description'),
                                                )
        )

        ledger.save()
        return ledger

    def update(self, instance, validated_data):
      
        instance.date = validated_data.get('date', instance.date)
        debit = validated_data.get('amount', instance.debit) if validated_data.get('amount') > 0 else 0
        credit = validated_data.get('amount', instance.credit) if validated_data.get('amount') < 0 else 0
        instance.description = validated_data.get('description', instance.description)
      
        try:
            user_Per = instance.user.rate
        except:
            user_Per = 0
            
        instance.debit = user_Per * debit if self.split else debit
        instance.credit = user_Per * credit if self.split else credit

        instance.save()
        return instance



class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ledger
        fields = ('id', 'date', 'debit', 'credit',
                'balance', 'description')

#To serialize request incoming - only necessary fields 
class CreateAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ledger
        fields = ('date', 'debit', 'description')


#To delete from Ledger
class DeleteAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ledger
        fields = ['id',]

class DeleteUserLedSerializer(serializers.ModelSerializer):
    class Meta:
        model = userLedger1
        fields = ['id',]

class CreateUserLedgerSerializer(serializers.Serializer):
    date = serializers.DateField(required=True)
    amount = serializers.IntegerField(required=True)
    description = serializers.CharField(max_length = 150, required=True)
    userName = serializers.CharField(required=True)
    rate = serializers.FloatField(required=True)

class CreateUserLedgerSerializer2 (serializers.Serializer):
    date = serializers.DateField(required=True)
    amount = serializers.IntegerField(required=True)
    description = serializers.CharField(max_length = 150, required=True)

class splitSerializer(serializers.Serializer):
    date = serializers.DateField(required=True)
    amount = serializers.IntegerField(required=True)
    description = serializers.CharField(max_length = 150, required=True)
    
    # class Meta:
    #   fields = ['data', 'amount', 'description', 'userName', 'rate']

class UserLedgerSerializer(serializers.ModelSerializer):
    class Meta:
        model = userLedger1
        fields = '__all__'
