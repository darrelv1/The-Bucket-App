from django.urls import path, include
from .views import index

urlpatterns = [
   
    path('', index), 
    path('join/', index),
    path('modify/', index),
    path('create/', index),
    path('profile/',index),
    path('AllUsers/', index),
    path('bills/',index)
]

 