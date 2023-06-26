from django.urls import path, re_path
from django.views.generic import TemplateView

from . import views

urlpatterns = [
    path("api/make_move/", views.make_move),
    re_path("^(?:.*)?$", TemplateView.as_view(template_name="base.html")),
]