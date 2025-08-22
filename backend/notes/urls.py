from . import views, utils
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, NoteViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'notes', NoteViewSet)

urlpatterns = [
    path("", include(router.urls)),
    # path("", views.index, name="index"),  
    path('', utils.getNotesList, name="notes-list"),
    path('notes/<str:pk>/', utils.getNoteDetail, name='note')
]