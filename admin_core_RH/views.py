from django.shortcuts import render

# Create your views here.
def Menu(request):
    return render(request, 'Menu.html')

def Dashboard(request):
    return render(request, 'Dashboard.html')

def Empleado(request):
    return render(request, 'Empleado.html')

def Asistencia(request):
    return render(request, 'Asistencia.html')

def Reportes(request):
    return render(request, 'Reportes.html')

def Horarios(request):
    return render(request, 'Horarios.html')

from django.shortcuts import render, redirect
from django.core.mail import EmailMessage
from .forms import ContactForm
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def contacto(request):
    enviado = False
    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            nombre = form.cleaned_data['nombre']
            correo = form.cleaned_data['correo']
            asunto = form.cleaned_data['asunto']
            mensaje = form.cleaned_data['mensaje']

            # Construir el cuerpo del correo
            cuerpo = f"Nombre: {nombre}\nCorreo: {correo}\n\nMensaje:\n{mensaje}"

            email = EmailMessage(
                subject=f"[Contacto] {asunto}",
                body=cuerpo,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[settings.EMAIL_HOST_USER],  # destinatario: cuenta del RH
                reply_to=[correo],
            )

            try:
                email.send(fail_silently=False)
                enviado = True
                # opcional: redirect('contacto_exito')
            except Exception as e:
                logger.exception("Error al enviar correo: %s", e)
                form.add_error(None, "Ocurrió un error al enviar el correo. Intenta de nuevo más tarde.")

    else:
        form = ContactForm()

    return render(request, 'contacto.html', {'form': form, 'enviado': enviado})


