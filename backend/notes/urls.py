from django.urls import path, include
from .views import RegisterView, LoginView, NoteListCreateView, NoteDetailView

# router = DefaultRouter()
# router.register(r'users', UserViewSet)
# router.register(r'notes', NoteListCreateView)

urlpatterns = [
    path('signup/', RegisterView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('notes/', NoteListCreateView.as_view(), name='note-list'),
    path('notes/<uuid:pk>/', NoteDetailView.as_view(), name='note-detail'),
]
