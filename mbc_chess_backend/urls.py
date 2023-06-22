from django.urls import path, re_path
from django.views.generic import TemplateView

from . import views

urlpatterns = [
    path("test_play/", views.make_move),
    path("quit/", views.kill_engine),
    path("start_engine", views.start_engine),
    re_path("^(?:.*)?$", TemplateView.as_view(template_name="base.html")),
]