from django.contrib import admin

from .models import (Ledger
                    ,userLedger1
                    ,userLedger2
                    ,userLedger3
                    ,UserProfile
                    )                                   



admin.site.register(Ledger )     
admin.site.register(userLedger1)     
admin.site.register(userLedger2)     
admin.site.register(userLedger3)     
admin.site.register(UserProfile)     
 
# Register your models here.
