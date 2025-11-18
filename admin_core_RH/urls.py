from django.urls import path
from .views import *
from . import views


urlpatterns = [
    path('Menu/', Menu, name='Menu'),
    path('Empleado/', Empleado, name='Empleado'),
    path('Asistencia/', Asistencia, name='Asistencia'),
    path('Reportes/', Reportes, name='Reportes'),
    path('Horarios/', Horarios, name='Horarios'),
    path('Contacto/', Contacto, name='Contacto'),
    path('Permisos/', Permisos, name='Permisos'),
]
