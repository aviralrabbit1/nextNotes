from django.urls import path, include
from .views import NoteListCreateView, NoteDetailView

# router = DefaultRouter()
# router.register(r'users', UserViewSet)
# router.register(r'notes', NoteListCreateView)

urlpatterns = [
    # path("", include(router.urls)),
    # path("", views.index, name="index"),  
    path('notes/', NoteListCreateView.as_view(), name='note-list-create'),
    path('notes/<uuid:note_id>/', NoteDetailView.as_view(), name='note-detail'),
]