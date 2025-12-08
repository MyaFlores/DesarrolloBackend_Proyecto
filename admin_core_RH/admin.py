from django.contrib import admin
from .models import Empleado, Registro, Departamento, Usuario, Asistencia, Horario, Permiso, Notificacion

admin.site.register(Empleado)
admin.site.register(Registro)
admin.site.register(Departamento)
admin.site.register(Usuario)
admin.site.register(Asistencia)
admin.site.register(Horario)
admin.site.register(Permiso)
admin.site.register(Notificacion)
